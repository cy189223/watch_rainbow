<template>
    <view class="scope-container" :style="'min-height: 100vh; background: url(' + bgImage + '); background-size: 100% 100%; background-position: center center;'">
        <TextNavBar :title="info.title"></TextNavBar>
        <template v-if="isNotFound">
            <view class="not-found-c">活动不见了哦~</view>
        </template>
        <template v-else-if="isInit">
            <view class="content">
                <image :src="titleImage" mode="widthFix" class="title-image"></image>
            </view>

            <view class="text-bg">
                {{ info.sub_title || '未填写副标题' }}
            </view>

            <!-- 商品区 -->
            <view class="prize-c">
                <StackSwiper @skuChange="skuChange" v-if="skus.length" :skus="skus" />
            </view>

            <view class="btn-c">
                <!-- 兑换按钮 -->
                <image class="pick-btn" mode="widthFix" :src="pickBtnImage" @tap="pickSku"></image>
                <!-- 抽卡按钮 -->
                <image class="random-btn" mode="widthFix" :src="randomBtnImage" @tap="randomCard"></image>
            </view>

            <!-- 剩余次数 -->
            <view class="remain-times">剩余次数: {{ info.remain_times }}次</view>

            <!-- 卡片区 -->
            <view class="card-list-c">
                <view class="top">
                    <image mode="widthFix" src="https://cdn2.hquesoft.com/box/jika/card-text.png" class="card-title"></image>
                </view>
                <view class="list">
                    <view class="item" :class="{ disabled: item.my_stock < item.need_total }" v-for="(item, index) in displayCardList">
                        <image :src="item.thumb" class="thumb" mode="aspectFit"></image>
                        <view class="title">{{ item.title }}</view>
                        <view class="total">{{ item.my_stock }}/{{ item.need_total }}</view>
                    </view>
                </view>
            </view>
        </template>

        <OpenBoxPopup v-if="isOpenPopup" style="z-index: 10000" :list="luckyCardList" @close="hideOpenBox"></OpenBoxPopup>

        <navigator url="/pages/rule/index?type=jika">
            <image mode="widthFix" src="https://cdn2.hquesoft.com/box/jika/rule-btn.png" class="rule-btn"></image>
        </navigator>
    </view>
</template>

<script>
import StackSwiper from './components/StackSwiper.vue';
import OpenBoxPopup from './components/OpenBoxPopup.vue';

import { mapGetters } from 'vuex';
export default {
    components: {
        StackSwiper,
        OpenBoxPopup
    },
    data() {
        return {
            uuid: '',
            isInit: false,
            info: {},
            cardList: [],
            skus: [],
            isOpenPopup: false,
            luckyCardList: [],
            currentSku: {},
            isNotFound: false
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        bgImage() {
            return 'https://cdn2.hquesoft.com/box/jika/bg.png';
        },
        titleImage() {
            return 'https://cdn2.hquesoft.com/box/jika/title.png';
        },
        pickBtnImage() {
            return 'https://cdn2.hquesoft.com/box/jika/pick-btn.png';
        },
        randomBtnImage() {
            return 'https://cdn2.hquesoft.com/box/jika/random-btn.png';
        },
        payInfo() {
            if (!this.info || !this.info.room) {
                return {};
            }

            return {
                room_id: this.info.room.id,
                pay_total: this.payTotal,
                title: this.info.title,
                money_price: this.info.money_price,
                score_price: this.info.score_price
            };
        },
        displayCardList() {
            let needCards = this.currentSku.need_cards || {};

            let res = [];

            for (let key in needCards) {
                let card = this.cardList.find((item) => {
                    return item.id == key;
                });

                if (card && needCards[key]) {
                    card.need_total = needCards[key];
                    res.push(card);
                }
            }

            return res;
        }
    },
    watch: {},
    filters: {},
    onLoad(e) {
        this.uuid = e.uuid;
    },
    onUnload() {},
    onPullDownRefresh() {
        this.$showPullRefresh();
        this.initData();
    },
    onShow() {
        uni.showLoading({
            title: '加载中'
        });
        this.initData()
            .then((res) => {
                this.isInit = true;
                uni.hideLoading();
            })
            .catch((res) => {
                this.isNotFound = true;
            });
    },
    onReachBottom() {},
    methods: {
        skuChange(sku) {
            this.currentSku = sku;
            // console.log('sku change ===>', sku.title)
        },
        hideOpenBox() {
            this.isOpenPopup = false;
            this.initData();
        },
        randomCard() {
            if (this.info.remain_times === 0) {
                uni.showToast({
                    title: '抽卡次数不足哦~',
                    icon: 'none'
                });
                return false;
            }

            let times = this.info.remain_times > 9 ? 9 : this.info.remain_times;
            uni.showModal({
                title: '本次将消耗' + times + '次抽卡机会',
                // content: '是否使用' + res.data.score_price + '积分兑换一次抽卡?',
                success: (r) => {
                    if (r.confirm) {
                        return this.$http(`/jika/random-card`, 'POST', {
                            total: times,
                            activity_id: this.info.id
                        }).then((res) => {
                            this.luckyCardList = res.data.list;
                            this.isOpenPopup = true;
                        });
                    }
                }
            });
        },
        pickSku() {
            uni.showModal({
                title: '确认兑换',
                content: '兑换"' + this.currentSku.title + '"将消耗对应的卡片，是否兑换？',
                confirmText: '确认兑换',
                cancelText: '再看看',
                success: (r) => {
                    if (r.confirm) {
                        uni.showLoading({
                            title: '兑换中...'
                        });
                        return this.$http('/jika/pick-sku', 'POST', {
                            sku_id: this.currentSku.id
                        }).then((res) => {
                            uni.hideLoading();
                            uni.showToast({
                                title: '兑换成功，即将跳转~',
                                icon: 'none'
                            });

                            setTimeout(() => {
                                uni.navigateTo({
                                    url: '/pages/orderDetail/index?uuid=' + res.data.order.uuid
                                });
                            }, 1500);
                        });
                    }
                }
            });
        },
        initData() {
            return this.$http(`/jikas/${this.uuid}`, 'GET', {}).then((res) => {
                this.info = res.data.info;
                this.cardList = res.data.info.cards;
                this.skus = res.data.info.skus;
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.not-found-c {
    font-size: 36rpx;
    text-align: center;
    color: white;
    line-height: 500rpx;
}
.scope-container {
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 180rpx;
    padding-bottom: 80rpx;
}
.content {
}
.title-image {
    width: 600rpx;
    display: block;
    margin: 0rpx auto;
}

.rule-btn {
    position: absolute;
    right: 0rpx;
    top: 380rpx;
    width: 100rpx;
}

.text-bg {
    background: url('https://cdn2.hquesoft.com/box/jika/text-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // min-height: 68rpx;
    text-align: center;
    font-size: 28rpx;
    font-family: PingFang;
    font-weight: 500;
    color: #ffffff;
    width: 570rpx;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    margin: 38rpx auto;
}

.invite-total {
    width: 260rpx;
    text-align: center;
    margin: 0rpx auto;
    font-size: 28rpx;
    font-family: PingFang;
    font-weight: 500;
    color: #ffffff;
    border-bottom: 1rpx solid rgba(255, 255, 255, 0.4);

    .number {
        color: #fff710;
        margin: 0rpx 10rpx;
    }
}

.btn-c {
    display: flex;
    align-items: center;
    justify-content: center;
    .pick-btn {
        width: 250rpx;
        // margin: 20rpx auto;
    }

    .random-btn {
        width: 250rpx;
        margin-left: 40rpx;
    }
}

.remain-times {
    font-size: 28rpx;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    width: 300rpx;
    margin: 26rpx auto 0rpx auto;
    padding: 6rpx 0rpx;
}

.card-list-c {
    width: 710rpx;
    margin: 30rpx auto;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 1px solid #01f8ff;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 30rpx;
    position: relative;

    .scroll-view {
        width: 630rpx;
        position: absolute;
        bottom: 36rpx;
        left: 20rpx;
    }

    .top {
        margin: 50rpx 30rpx 50rpx 30rpx;
        display: flex;
        align-items: center;
        .card-title {
            width: 300rpx;
        }
    }

    .item {
        background: url('https://cdn2.hquesoft.com/box/jika/item-bg.png');
        background-size: 100% auto;
        background-repeat: no-repeat;
        display: inline-block;
        width: 190rpx;
        height: 302rpx;
        text-align: center;
        margin-left: 34rpx;
        position: relative;
        margin-bottom: 20rpx;

        .thumb {
            margin-top: 30rpx;
            width: 130rpx;
            height: 130rpx;
        }

        .total {
            font-size: 26rpx;
            font-weight: bold;
            color: #ffffff;
        }

        .title {
            font-size: 26rpx;
            font-weight: bold;
            color: #3876fe;
            position: absolute;
            top: 224rpx;
            width: 100%;
        }
    }
}
</style>
