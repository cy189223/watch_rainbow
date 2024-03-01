<template>
    <view class="order-item" @tap="handleClick" hover-class="hover">
        <view class="order-item-header">
            <text class="time">{{ order.sid }} / {{ this.$tool.formatDate(order.created_at, 'MM-dd hh:mm') }}</text>
            <view class="node-type">{{ order.node_type_text }}</view>
            <view class="node-type" v-if="order.options && order.options.is_hidden_sku">隐藏款</view>
            <view class="shang-title" :class="{ strong: order.options.shang_type === 1 }" v-if="order.options && order.options.shang_title">{{ order.options.shang_title }}</view>

            <view style="flex-grow: 1"></view>
            <view class="status" :class="order.union_status">
                {{ order.union_status_text }}
            </view>
        </view>
        <view class="products">
            <SkuInfo class="sku" :info="order" :disableClick="true"></SkuInfo>
        </view>
        <view class="bottom-actions" @tap.stop>
            <view class="check-box" @tap="handleCheck" v-if="isSelectMode && isSelectable">
                <icon :type="isSelected ? 'success' : 'circle'" size="20" color="#6938b6"></icon>
                <text>选择</text>
            </view>
            <view v-if="info.is_presell" class="presell-c">
                <text class="tag">预售</text>
                <text class="date">{{ info.presell_date }}后可发货</text>
            </view>

            <view style="flex-grow: 1"></view>

            <template v-if="order.union_status == 'pending'">
                <button class="bg-orange" hover-class="hover" v-if="isVirtualAsset" @tap="handleVirtualAssetPick">领取</button>
                <!-- <button class="bg-orange" hover-class="hover" v-if="order.is_chip_cover" data-type="兑换碎片" @tap="handleCoverChip">兑换碎片</button> -->
                <button class="bg-cancel" hover-class="hover" v-if="isReturnSaleable" data-type="返售" @tap="handleClick2">回收</button>
                <button class="bg-cancel" hover-class="hover" v-if="marketConfig.is_enabled" data-type="转售" @tap="handleClick2">挂售</button>
                <button class="bg-cancel" hover-class="hover" v-if="marketConfig.is_enabled || isReturnSaleable" data-type="转售" @tap="locked">存入保险柜</button>
            </template>
            <template v-if="order.union_status == 'locked'">
                <button class="bg-cancel" hover-class="hover" v-if="marketConfig.is_enabled || isReturnSaleable" data-type="转售" @tap="unlocked">移出保险柜</button>
                <strong></strong>
            </template>
            <template v-if="order.union_status == 'resale_pending'">
                <button class="bg-orange" hover-class="hover" data-type="查看转售" @tap="checkResaleDetail">查看转售</button>
            </template>
            <template v-if="order.union_status == 'picked'">
                <button class="bg-yellow" hover-class="hover" v-if="order.pick_order" data-type="查看订单" @tap="handleClick2">查看订单</button>
            </template>
        </view>
    </view>
</template>

<script>
import mixin from '../../../utils/mixin.js';
import SkuInfo from './SkuInfo.vue';
export default {
    mixins: [mixin],
    props: {
        order: {
            type: Object
        },
        isSelected: {
            type: Boolean
        },
        isSelectMode: {
            type: Boolean
        },
        selectType: {
            type: String
        }
    },
    components: {
        SkuInfo
    },
    data() {
        return {
            hours: '',
            minutes: '',
            seconds: '',
            closeTimeVisible: false,
            timer: null
        };
    },
    computed: {
        info() {
            return this.order;
        },
        orderConfig() {
            return this.$store.getters.setting.order || {};
        },
        marketConfig() {
            return this.$store.getters.setting.market || {};
        },
        isSelectable() {
            if (this.info.union_status !== 'pending') {
                return false;
            }
            if (this.selectType === 'deliver') {
                return this.info.sku_type_text !== 'virtual_asset' && !this.info.is_presell;
            } else if (this.selectType === 'return_sale') {
                return this.isReturnSaleable;
            }
        },
        isVirtualAsset() {
            return this.info.sku_type_text === 'virtual_asset';
        },
        isReturnSaleable() {
            return this.orderConfig.is_return_sale_enable && !this.isVirtualAsset && this.info.is_return_saleable;
        },
        isResaleable() {
            return !this.isVirtualAsset && this.info.is_resaleable;
        }
    },
    filters: {
        dateformat(value) {
            return this.$tool.formatDate(value, 'MM-dd hh:mm');
        }
    },
    created() {},
    destroyed() {},
    methods: {
        handleVirtualAssetPick() {
            uni.showModal({
                title: '确认领取此奖品吗?',
                success: (res) => {
                    if (res.confirm) {
                        this.$http(`/package-skus/${this.info.uuid}/virtual-asset/pick`, 'POST').then((res) => {
                            uni.showToast({
                                title: '领取成功，即将跳转~',
                                icon: 'none'
                            });

                            setTimeout(() => {
                                uni.navigateTo({
                                    url: '/pages/myBox/detail?uuid=' + this.order.uuid
                                });
                            }, 1500);
                        });
                    }
                }
            });
        },
        checkResaleDetail() {
            uni.navigateTo({
                url: '/pages/resale/detail?uuid=' + this.order.resale.uuid
            });
        },
        fillNumber(num) {
            if (num < 10) {
                return '0' + num;
            } else {
                return num;
            }
        },
        handleClick() {
            if (this.isSelectMode) {
                if (this.order.sku_type_text === 'virtual_asset') {
                    return false;
                }

                if (!this.isSelectable) {
                    return false;
                }

                this.$emit('check');
                return false;
            }
            uni.navigateTo({
                url: '/pages/myBox/detail?uuid=' + this.order.uuid
            });
        },
        //转入保险柜
        locked() {
            this.$http(`/asset/package-skus-lock/${this.order.uuid}`).then((res) => {
                if (res.code == 0) {
                    uni.showToast({
                        title: '加入保险柜成功',
                        icon: 'none'
                    });
                    this.$emit('locked');
                }
            });
        },
        //移出保险柜
        unlocked() {
            this.$http(`/asset/package-skus-unlock/${this.order.uuid}`).then((res) => {
                if (res.code == 0) {
                    uni.showToast({
                        title: '移出保险柜成功',
                        icon: 'none'
                    });
                    this.$emit('locked');
                }
            });
        },
        handleClick2(e) {
            this.$emit('action', {
                order: this.order,
                action: e.currentTarget.dataset.type
            });
        },
        handleCheck() {
            this.$emit('check');
        },
        handleCoverChip() {
            uni.navigateTo({
                url: '/pages/coverChip/index?sku_id=' + this.order.skus[0].sku_id
            });
        }
    }
};
</script>

<style lang="scss">
.border-bottom-2 {
    border-bottom: 1px dashed #f1f1f1;
}

.order-item {
    background-color: #fff;
    margin: 30upx 0;

    box-shadow: 0px 6rpx 30rpx 0px rgba(226, 222, 204, 0.5);
    border-radius: 20rpx;

    .order-item-header {
        height: 70upx;
        padding-left: 24rpx;
        display: flex;
        align-items: center;
        position: relative;
        font-size: 24upx;

        .time {
            font-size: 26rpx;
            font-weight: bold;
            color: #000000;
            line-height: 40rpx;
        }

        .node-type {
            background: #efddff;
            color: #9643dd;
            padding: 4rpx 10rpx;
            font-size: 24rpx;
            border-radius: 6rpx;
            margin-left: 10rpx;
        }

        .shang-title {
            background: #efddff;
            color: #9643dd;
            padding: 4rpx 10rpx;
            font-size: 24rpx;
            border-radius: 6rpx;
            margin-left: 10rpx;
        }

        .status {
            height: 100%;
            padding: 0rpx 26rpx 0rpx 44rpx;
            line-height: 50rpx;
            box-sizing: border-box;
            background-image: url('https://api.caihongbox.com.cn/image/topright.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position-x: right;
            color: white;

            &.working,
            &.pending {
                background-image: url('https://api.caihongbox.com.cn/image/topright.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position-x: right;
                color: white;
            }
            &.completed,
            &.resaled,
            &.exchanged,
            &.comment_pending,
            &.picked {
                background: url('@/static/dayTask/down.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position-x: right;
                color: white;
            }
            &.expired,
            &.closed,
            &.return_saled {
                color: rgba(153, 153, 153, 1);
                background: url(../../../static/activity/status-bg-expired.png);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position-x: right;
            }
        }
    }

    .total-price {
        margin: 0rpx 24rpx;
        padding: 0 0upx;
        height: 66upx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .remark {
            font-size: 26upx;
        }

        .price-number {
            display: flex;
            align-items: center;
            font-size: 24upx;
        }

        .price-key {
            color: #999;
            font-weight: 500;
        }

        .price {
            margin-left: 8upx;

            font-size: 30rpx;
            font-weight: bold;
            color: #ff5555;
            line-height: 26rpx;
        }
    }

    .close-time {
        font-weight: 500;
        padding: 0 24upx;
        font-size: 26upx;
        text-align: right;
        margin-bottom: 10upx;
    }

    .presell-c {
        .tag {
            background: #fcf6d8;
            color: #6938b6;
            padding: 4rpx 10rpx;
            font-size: 24rpx;
            border-radius: 6rpx;
            // margin-left: 10rpx;
        }
        .date {
            font-size: 26rpx;
            margin-left: 6rpx;
        }
    }

    .bottom-actions {
        padding: 10upx 24upx 18upx 24upx;
        display: flex;
        align-items: center;

        .check-box {
            flex-grow: 1;
            display: flex;
            align-content: center;
            text {
                font-size: 28rpx;
                margin-left: 2rpx;
            }
        }

        button {
            padding: 0;
            margin: 0;
            margin-left: 20upx;
            width: 150upx;
            height: 50upx;
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
    }
}
</style>
