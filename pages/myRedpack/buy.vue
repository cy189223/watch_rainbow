<template>
    <view class="container">
        <view class="title">请选择套餐</view>
        <view class="list">
            <view class="item" v-for="(item, index) in list" @tap="submitBuy(item)" hover-class="hover">
                <view class="score">
                    {{ item.redpack / 100 }}
                    <span class="score-text">元</span>
                </view>
                <view class="money">
                    售价: {{ item.money_price / 100 }}
                    <span class="money-text">元</span>
                </view>
            </view>
        </view>

        <template v-if="setting.rule">
            <view class="title">充值说明</view>
            <view class="rule-list">
                <view class="item" v-for="(item, index) in setting.rule">{{ index + 1 }}、{{ item }}</view>
            </view>
        </template>

        <NoData v-if="!list.length && isInit"></NoData>
    </view>
</template>

<script>
import payment from '@/utils/payment.js';
export default {
    components: {},
    data() {
        return {
            isInit: false,
            list: [],
            setting: {}
        };
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo;
        }
    },
    async onLoad() {
        this.$store.dispatch('getUserInfo');

        uni.showLoading({
            title: '加载中'
        });

        this.$http('/asset/redpack-skus').then((res) => {
            this.list = res.data.list;
            this.setting = res.data.setting;
            this.isInit = true;
            uni.hideLoading();
        });
    },
    methods: {
        submitBuy(item) {
            uni.showLoading({
                title: '请求中'
            });

            this.$http('/asset/redpack-order/confirm', 'POST', {
                sku_id: item.id
            }).then((res) => {
                uni.hideLoading();

                let info = res.data;
                if (info.is_need_pay) {
                    payment.pay({
                        pay_config: info.pay_config,
                        success: () => {
                            uni.showToast({
                                title: '充值成功，即将跳转~',
                                icon: 'none'
                            });
                            setTimeout((res) => {
                                uni.redirectTo({
                                    url: '/pages/myRedpack/index'
                                });
                            }, 1500);
                        },
                        fail: () => {
                            uni.showToast({
                                title: '支付失败',
                                icon: 'none'
                            });

                            // 关闭订单
                            this.$http(`/orders/${info.order.uuid}`, 'PUT', {
                                type: 'close_and_delete'
                            });
                        }
                    });
                } else {
                    uni.showToast({
                        title: '充值成功，即将跳转~',
                        icon: 'none'
                    });
                    setTimeout((res) => {
                        uni.navigateTo({
                            url: '/pages/myRedpack/index'
                        });
                    }, 1500);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 0rpx 30rpx;
}

.title {
    margin: 60rpx 0rpx 30rpx 0rpx;
}

.rule-list {
    .item {
        font-size: 24rpx;
        margin-bottom: 10rpx;
        color: #222;
    }
}

.list {
    display: flex;
    flex-wrap: wrap;
    position: relative;

    .item {
        width: 32%;
        flex: 0 0 31%;
        text-align: center;
        border: 2rpx solid #87bc99;
        border-radius: 10rpx;
        padding: 30rpx 0rpx;
        margin-top: 20rpx;
        margin-right: 2%;
        box-sizing: border-box;
        &:nth-child(3n) {
            margin-right: 0rpx;
        }

        .score {
            font-size: 32rpx;
            font-weight: 500;
            color: #87bc99;
        }

        .money {
            font-weight: 500;
            font-size: 26rpx;
            margin-top: 6rpx;
            color: gray;
            color: #87bc99;
        }
    }
}
</style>
