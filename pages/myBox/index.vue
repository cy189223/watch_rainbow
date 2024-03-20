<template>
    <view class="container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <Navbar title="盒柜仓库"></Navbar>
        <view class="header-tabs" :style="'top:' + customBar + 'px;'">
            <view class="tab-item" v-for="(item, index) in typeTextList" :class="{ active: current == index }" :data-current="index" @tap="currentChange" :key="index">
                <text class="text">
                    {{ item }}
                    <template v-if="statusTotal[types[index]]">({{ statusTotal[types[index]] }})</template>
                </text>
            </view>
        </view>

        <view class="swiper-wrapper" :style="'top:' + customBar + 'px;'">
            <swiper :current="current" @change="currentChange2">
                <swiper-item v-for="(item, index) in types" :key="index">
                    <scroll-view scroll-y @scrolltolower="scrolltolower">
                        <view class="order-list" v-if="dataList && dataList != ''">
                            <PackageSku
                                @check="checkItem(order)"
                                :selectType="selectType"
                                :isSelectMode="isSelectMode"
                                :isSelected="selectedIds.indexOf(order.id) > -1"
                                v-for="order in dataList[index].list"
                                :order="order"
                                :key="order.uuid"
                                @action="actions"
                                @locked="locked"
                            ></PackageSku>
                            <view class="load-more margin-v" v-if="dataList[index].list.length < dataList[index].total">加载中...</view>
                            <NoData v-if="dataList[index].init && !dataList[index].list.length" tips="无订单"></NoData>
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>

        <view class="footer-c" v-if="current == 0 && !orderConfig.is_hide_deliver_btn">
            <template v-if="!isSelectMode">
                <button class="select-box-btn enter-btn bg-orange" hover-class="hover" @tap="enterSelectMode('deliver')" v-if="!orderConfig.is_hide_deliver_btn">选择发货</button>

                <button
                    class="select-box-btn enter-btn bg-cancel"
                    style="margin-right: 50rpx"
                    hover-class="hover"
                    @tap="enterSelectMode('return_sale')"
                    v-if="orderConfig.is_return_sale_enable"
                >
                    选择云发货
                </button>

                <button
                    class="select-box-btn enter-btn bg-cancel"
                    style="margin-right: 50rpx"
                    hover-class="hover"
                    @tap="enterSelectMode('exchange')"
                    v-if="exchangeConfig.is_enabled"
                >
                    选择置换
                </button>

                <button class="select-box-btn enter-btn bg-orange" hover-class="hover" @tap="enterSelectMode('resale')" v-if="marketConfig.is_enabled">批量挂售</button>
            </template>
            <template v-else>
                <button class="select-all bg-cancel" hover-class="hover" @tap="selectAll">全选</button>
                <button class="cancel-btn bg-cancel" hover-class="hover" @tap="cancelSelect">取消</button>

                <button class="select-box-btn bg-orange" hover-class="hover" @tap="selectOrSubmit" v-if="selectType === 'deliver'">
                    提交发货 (已选{{ selectedIds.length }}件)
                </button>
                <button class="select-box-btn bg-orange" hover-class="hover" @tap="batchReturnSale" v-if="selectType === 'return_sale'">
                    确认云发货 (已选{{ selectedIds.length }}件)
                </button>
                <button class="select-box-btn bg-orange" hover-class="hover" @tap="batchResale" v-if="selectType === 'resale'">确认挂售 (已选{{ selectedIds.length }}件)</button>
                <button class="select-box-btn bg-orange" hover-class="hover" @tap="batchExchange" v-if="selectType === 'exchange'">
                    选择置换 (已选{{ selectedIds.length }}件)
                </button>
            </template>
        </view>

        <PayCard v-if="isShowPay" :selectedId="selectedIds" @success="successDeliver" @cancel="isShowPay = false"></PayCard>

        <ReturnSalePopup @cancel="isShowReturnSalePopup = false" @refresh="refresh" :packageSku="currentItem" :uuid="currentUuid" v-if="isShowReturnSalePopup"></ReturnSalePopup>

        <ResalePopup @cancel="hideResalePopup" @refresh="refresh" :packageSku="currentItem" :uuid="currentUuid" v-if="isShowResalePopup"></ResalePopup>

        <view class="mask" @tap="closepopup()" @touchmove.stop v-if="isReturnSaleSuccess">
            <view class="mask-content" @tap.stop>
                <text class="new-iconfont icon-close close-btn" @tap.stop="closepopup()"></text>
                <view class="title">
                    <text class="new-iconfont icon-check"></text>
                    {{ selectType === 'return_sale' ? '云发货' : '返售' }}成功
                </view>

                <view class="btn-c">
                    <button class="btn cancel bg-purple" @tap="toPage('/pages/myRedpack/index')">{{ $money() }}数量</button>
                    <button class="btn submit bg-yellow" @tap="toPage('/pages/myScore/index')">{{ scoreAlias }}数</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import PackageSku from './components/PackageSku.vue';
import PayCard from './components/PayCard.vue';
import Navbar from '@/components/Navbar/index.vue';
export default {
    components: {
        PackageSku,
        Navbar,
        PayCard
    },
    data() {
        return {
            disabled: false,
            order: {},
            reasons: [],
            visible: false,
            dataList: [],
            current: 0,
            currentUuid: '6056e83ef3251',
            currentItem: {},
            types: ['pending', 'resale_pending', 'picked', 'locked', 'all'],
            typeTextList: ['待处理', '转让中', '已提货', '保险柜', '全部'],
            isSelectMode: false,
            selectType: 'deliver',
            selectedIds: [],
            isShowPay: false,
            isShowReturnSalePopup: false,
            isShowResalePopup: false,
            statusTotal: {},
            isReturnSaleSuccess: false,
            isbatchReturnSale: false
        };
    },
    computed: {
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        },
        orderConfig() {
            return this.$store.getters.setting.order || {};
        },
        marketConfig() {
            return this.$store.getters.setting.market || {};
        },
        exchangeConfig() {
            return this.$store.getters.setting.exchange || {};
        }
    },
    onLoad(e) {
        this.current = this.types.indexOf(e.status || 'pending');
        this.initData();
    },
    onShow() {
        this.refresh();
    },
    methods: {
        closepopup() {
            this.isReturnSaleSuccess = false;
            this.isbatchReturnSale = false;
        },
        hideResalePopup() {
            this.isShowResalePopup = false;
        },
        toPage(url) {
            this.isbatchReturnSale = false;
            uni.navigateTo({
                url: url
            });
        },
        successDeliver() {
            this.cancelSelect();
            this.current = 2;
            this.refresh();
            this.isShowPay = false;
            uni.showModal({
                title: '发货成功',
                content: '已成功提交发货请求，请注意查收快递哦~'
            });
        },
        selectAll() {
            if (this.isbatchReturnSale) {
                return;
            }
            if (this.selectedIds.length >= 50) {
                uni.showToast({
                    title: '单次最多选择50件',
                    icon: 'none'
                });
                return;
            }
            if (!this.dataList[0]) {
                return false;
            }
            this.selectedIds = [];
            for (let i = 0; i < this.dataList[0].list.length; i++) {
                let item = this.dataList[0].list[i];

                if (this.selectType === 'deliver') {
                    if (item.sku_type_text !== 'virtual_asset' && !item.is_presell) {
                        if (this.selectedIds.length < 50) {
                            this.selectedIds.push(item.id);
                        }
                    }
                } else if (this.selectType === 'return_sale') {
                    if (!this.orderConfig.is_ban_return_sale && item.sku_type_text != 'virtual_asset' && item.is_return_saleable) {
                        if (this.selectedIds.length < 50) {
                            this.selectedIds.push(item.id);
                        }
                    }
                } else if (this.selectType === 'resale') {
                    if (item.sku_type_text != 'virtual_asset') {
                        if (this.selectedIds.length < 50) {
                            this.selectedIds.push(item.id);
                        }
                    }
                } else if (this.selectType === 'exchange') {
                    if (item.sku_type_text != 'virtual_asset') {
                        if (this.selectedIds.length < 50) {
                            this.selectedIds.push(item.id);
                        }
                    }
                }
            }
        },
        cancelSelect() {
            if (this.isbatchReturnSale) {
                return;
            }
            this.isSelectMode = false;
            this.selectedIds = [];
        },
        selectOrSubmit() {
            if (!this.isSelectMode) {
                this.isSelectMode = true;
            } else {
                if (this.selectedIds.length == 0) {
                    uni.showModal({
                        title: '请选择物品',
                        content: '选择一件或多件物品后才能提交发货哦~'
                    });
                    return false;
                }

                this.isShowPay = true;
            }
        },
        // 批量云发货
        batchReturnSale() {
            if (this.isbatchReturnSale) {
                return;
            }
            this.isbatchReturnSale = true;
            if (this.selectedIds.length == 0) {
                uni.showModal({
                    title: '请选择物品',
                    content: '选择一件或多件物品后才能云发货哦~'
                });
                this.isbatchReturnSale = false;
                return false;
            }

            uni.showModal({
                title: '确认云发货',
                content: '确认要批量云发货吗?',
                success: (res) => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '云发货中...'
                        });
                        this.$http(`/asset/return-sale/confirm`, 'post', {
                            ids: this.selectedIds
                        }).then((res) => {
                            this.isReturnSaleSuccess = 1;
                            uni.hideLoading();
                            this.refresh();
                            this.isSelectMode = false;
                            // this.$emit('refresh')
                        });
                    } else if (res.cancel) {
                        this.isbatchReturnSale = false;
                    }
                }
            });
        },
        // 批量转售
        batchResale() {
            if (this.selectedIds.length == 0) {
                uni.showModal({
                    title: '请选择物品',
                    content: '选择一件或多件物品后才能挂售哦~'
                });
                return false;
            }

            uni.showModal({
                title: '确认挂售到交易市场',
                content: '统一以建议挂售价挂售到交易市场',
                success: (res) => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '挂售中...'
                        });
                        this.$http(`/market/resale/batch/confirm`, 'post', {
                            ids: this.selectedIds
                        }).then((res) => {
                            // this.isReturnSaleSuccess = 1
                            uni.hideLoading();
                            this.refresh();
                            this.isSelectMode = false;

                            uni.showToast({
                                title: '转售成功，即将跳转~',
                                icon: 'none'
                            });

                            setTimeout((res) => {
                                uni.navigateTo({
                                    url: '/pages/resale/index'
                                });
                            }, 1500);
                            // this.$emit('refresh')
                        });
                    }
                }
            });
        },
        // 进入置换模式
        batchExchange() {
            if (this.selectedIds.length == 0) {
                uni.showModal({
                    title: '请选择物品',
                    content: '选择一件或多件物品后才能置换哦~'
                });
                return false;
            }

            if (this.selectedIds.length >= 10) {
                uni.showModal({
                    title: '超出限制了',
                    content: '单次置换限制在10件以内~'
                });
                return false;
            }

            this.setStorage('exchange_package_sku_ids', this.selectedIds);

            uni.navigateTo({
                url: '/pages/exchange/productList'
            });
        },
        enterSelectMode(type) {
            this.selectedIds = [];
            this.isSelectMode = true;
            this.selectType = type;
        },
        checkItem(order) {
            if (this.selectedIds.length >= 50) {
                uni.showToast({
                    title: '单次最多选择50件',
                    icon: 'none'
                });
                return;
            }
            // console.log(order)
            let index = this.selectedIds.indexOf(order.id);
            if (index > -1) {
                this.selectedIds.splice(index, 1);
            } else {
                this.selectedIds.push(order.id);
            }
        },
        refresh() {
            this.cleanData();
            this.getOrderList();

            this.initBoxTotalData();
        },
        scrolltolower() {
            this.dataList[this.current].page++;
            this.getOrderList();
        },
        initData() {
            let dataList = [];
            this.types.forEach((item) => {
                dataList.push({
                    list: [],
                    type: item,
                    page: 1,
                    per_page: 50,
                    total: 0,
                    init: false,
                    loading: false
                });
            });
            this.dataList = dataList;
        },
        cleanData() {
            this.dataList.forEach((item) => {
                item.page = 1;
                item.init = false;
            });
        },
        initBoxTotalData() {
            this.$http('/status-total/package-sku').then((res) => {
                this.statusTotal = res.data.info;
            });
        },
        visibleChange() {
            this.visible = !this.visible;
        },
        actions(e) {
            switch (e.action) {
                case '返售':
                    this.currentUuid = e.order.uuid;
                    this.currentItem = e.order;
                    this.isShowReturnSalePopup = true;
                    this.cancelSelect();
                    break;
                case '核销码':
                    uni.navigateTo({
                        url: '/pages/orderCode/index?uuid=' + e.order.uuid
                    });
                    break;
                case '查看订单':
                    uni.navigateTo({
                        url: '/pages/orderDetail/index?uuid=' + e.order.pick_order.uuid
                    });
                    break;
                case '转售':
                    this.currentUuid = e.order.uuid;
                    this.currentItem = e.order;
                    this.isShowResalePopup = true;
                    break;
                default:
                    break;
            }
        },
        //加入保险柜
        locked() {
            this.refresh();
        },
        currentChange(e) {
            let index = e.currentTarget.dataset.current;
            if (index !== this.current) {
                this.current = index;
                let itemList = this.dataList[this.current];
                if (!itemList.init) {
                    this.getOrderList();
                }
            }
        },
        currentChange2(e) {
            if (this.disabled) return;
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, 0);
            let index = e.detail.current;
            if (index !== this.current) {
                this.current = index;
                let itemList = this.dataList[this.current];
                if (!itemList.init) {
                    this.getOrderList();
                }
            }
        },
        getOrderList() {
            let itemList = this.dataList[this.current];
            if (itemList.loading) return;
            itemList.loading = true;
            this.$http('/asset/package-skus', 'GET', {
                status: itemList.type,
                page: itemList.page,
                per_page: itemList.per_page
            }).then((res) => {
                // uni.hideLoading()
                itemList.loading = false;

                if (res.data.current_page === 1) {
                    itemList.list = res.data.list;
                } else {
                    itemList.list.push(...res.data.list);
                }

                itemList.total = res.data.item_total;
                itemList.init = true;
            });
        }
    }
};
</script>

<style lang="scss">
.container {
    padding-top: 1rpx;
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/65dea2a339eab7782bf47e83.gif');
    background-position: top;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);
}

button {
    padding: 0;
    margin: 0;
    line-height: 50upx;
    font-size: 24upx;
    border-radius: 1000px;
    position: relative;

    &.bg-white {
        box-shadow: 0 2upx 8upx #cfcfcf;
    }

    &:after {
        border: none;
    }
}

.footer-c {
    position: fixed;
    bottom: 30rpx;
    width: 100%;
    left: 0rpx;
    padding: 0rpx 30rpx;
    display: flex;
    box-sizing: border-box;
}

.select-box-btn {
    font-size: 28rpx;
    flex-grow: 1;
    padding: 16rpx 0rpx;
    text-align: center;
}

.select-box-btn:last-child {
    margin-right: 0 !important;
}

.enter-btn {
    &:nth-child(2) {
        margin-left: 60rpx;
    }
}

.cancel-btn {
    width: 150rpx;
    flex: 0 0 150rpx;
    margin-right: 20rpx;
    padding: 16rpx 0rpx;
    text-align: center;
}

.select-all {
    width: 150rpx;
    flex: 0 0 150rpx;
    margin-right: 20rpx;
    padding: 16rpx 0rpx;
    text-align: center;
}

.header-tabs {
    width: 100%;
    height: 90rpx;
    display: flex;
    position: fixed;
    left: 0;
    z-index: 10;
    padding: 0 20rpx;
    box-sizing: border-box;
    overflow-x: auto;

    .tab-item {
        flex: 1;
        line-height: 90rpx;
        text-align: center;
        font-size: 28rpx;
        color: rgba(198, 198, 198, 1);
        font-weight: 500;

        &.active {
            color: #8352c4;
            position: relative;
            font-weight: 500;

            .text {
                border-bottom: 6rpx solid #8352c4;
                padding: 0rpx 0rpx 4rpx 0rpx;
            }
        }
    }
}

.swiper-wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    box-sizing: border-box;
    padding-top: 90rpx;
    // background-color: white;

    swiper,
    scroll-view {
        width: 100%;
        height: 100%;

        .order-list {
            overflow: hidden;
            padding: 0rpx 30rpx 160rpx 30rpx;

            .load-more {
                height: 100rpx;
                text-align: center;
                line-height: 100rpx;
                font-size: 32rpx;
                color: #888;
            }
        }
    }
}

.mask {
    display: flex;
    align-items: center;
    justify-content: center;

    .mask-content {
        width: 660rpx;
        background-color: #ededed;
        background-color: white;
        border-radius: 20rpx;
        padding: 60rpx 60rpx 50rpx 60rpx;
        box-sizing: border-box;
        position: relative;

        .close-btn {
            position: absolute;
            right: 26rpx;
            top: 26rpx;

            color: #999;
        }

        .title {
            text-align: center;
            font-size: 36rpx;
            font-weight: 500;
        }

        .icon-check {
            color: #2ba246;
            font-size: 46rpx;
            position: relative;
            top: 4rpx;
            margin-right: 10rpx;
        }

        .btn-c {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .btn {
                padding: 0;
                margin: 50rpx 0rpx 0rpx 0rpx;
                width: 46%;
                border-radius: 20rpx;
                height: 86rpx;
                line-height: 86rpx;
                text-align: center;
                font-size: 30rpx;
                font-weight: bold;
                background-color: #6938b6;
                color: white;

                &:after {
                    border: none;
                }

                &.submit {
                }
            }
        }
    }
}
</style>
