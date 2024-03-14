<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content animated bounceInUp" @tap.stop>
            <text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
            <view v-if="pktype == 'ydd'" class="title">加入阵营{{ paytype }}</view>
            <view v-else class="title">加入全局赏</view>

            <view class="block">
                <view class="item-title">可用{{ $money() }}:</view>
                <view class="arrow-right bold">
                    <template v-if="order.redpack">
                        <text class="meta">¥{{ $tool.formatPrice(order.redpack) }}</text>
                        <switch class="redpack-switch" :checked="order.is_use_redpack" @change="switchChange" />
                    </template>
                    <text class="meta" v-else>¥0</text>
                </view>
            </view>

            <view class="block" v-if="order.max_useable_score">
                <view class="item-title">{{ scoreAlias }}抵扣</view>
                <view class="arrow-right bold">
                    <text class="meta">{{ order.max_useable_score }}{{ scoreAlias }}</text>
                    <text class="meta red" style="margin-left: 10rpx" v-if="order.score_discount">-¥{{ order.score_discount | priceToFixed }}</text>
                    <switch v-if="order.max_useable_score" class="redpack-switch" :checked="order.is_use_score" @change="scoreSwitchChange" />
                </view>
            </view>

            <view class="total">
                小计：
                <PriceDisplay :info="order" prefix="pay_"></PriceDisplay>
            </view>

            <UserStatement v-model="isCheckUserStatement"></UserStatement>

            <view class="button-c">
                <view class="button" @tap="disableMultiClick(submit)" v-if="isInit && isCheckUserStatement">
                    <text>确认购买</text>
                </view>
                <view class="button disabled" v-else>
                    <text>确认购买</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import payment from '@/utils/payment.js';
export default {
    components: {},
    data() {
        return {
            payTotal: 1,
            order: {},
            price: 0,
            form: {
                is_use_redpack: 0,
                is_use_score: 0
            },
            currentCoupon: {},
            isCouponPopup: false,
            unusableCoupons: [],
            usableCoupons: [],
            isCheckUserStatement: true,
            isInit: false
        };
    },
    props: {
        pkskus: {
            type: Object
        },
        paytype: {
            type: String
        },
        payuuid: {
            type: String
        },
        payseat_uuid: {
            type: String
        },
        payjoin_type: {
            type: Number
        },
        pktype: {
            type: String
        }
    },
    computed: {},
    created() {
        this.initOrder();
    },
    methods: {
        initOrder(type) {
            uni.showLoading();
            this.$http('/pk/preview-orders', 'POST', {
                type: this.paytype,
                uuid: this.payuuid,
                join_type: this.payjoin_type,
                seat_uuid: this.payseat_uuid,
                ...this.form
            })
                .then((res) => {
                    this.isInit = true;
                    (this.order = res.data.order), (this.unusableCoupons = res.data.order.coupons.unusable);
                    this.usableCoupons = res.data.order.coupons.usable;
                    uni.hideLoading();
                    if (type != undefined) {
                        this.payTotal = type;
                    }
                    if (this.form.is_use_redpack == 1 && !this.order.max_useable_score) {
                        this.form.is_use_score = 0;
                    }
                })
                .catch((e) => {
                    this.isInit = false;
                    this.cancel();
                });
        },
        switchChange(e) {
            this.form.is_use_redpack = e.detail.value ? 1 : 0;
            this.initOrder();
        },
        scoreSwitchChange(e) {
            this.form.is_use_score = e.detail.value ? 1 : 0;
            this.initOrder();
        },
        cancel() {
            this.$emit('cancel');
        },
        createOrder() {
            uni.showLoading({
                title: '提交中',
                icon: 'none'
            });
            this.$http(`/pk/order/confirm`, 'POST', {
                type: this.paytype,
                uuid: this.payuuid,
                join_type: this.payjoin_type,
                seat_uuid: this.payseat_uuid,
                ...this.form
            }).then((res) => {
                uni.hideLoading();
                let info = res.data;
                if (info.is_need_pay) {
                    // 进行支付
                    payment.pay({
                        pay_config: info.pay_config,
                        success: () => {
                            this.$emit('success', info.order);
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
                    this.$emit('success', info.order);
                }
            });
        },
        submit() {
            this.createOrder();
        }
    }
};
</script>

<style lang="scss" scoped>
.mask-content {
    position: absolute;
    bottom: 0rpx;
    width: 100%;
    background-color: #ededed;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;
    padding: 50rpx 30rpx 60rpx 30rpx;
    box-sizing: border-box;
    color: #333;

    .close-btn {
        position: absolute;
        right: 20rpx;
        top: 20rpx;
    }

    .title {
        text-align: center;
        font-size: 36rpx;
        font-weight: 500;
    }

    .total {
        margin-top: 20rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 0 0rpx;
        text-align: right;
        color: red;
        font-size: 28rpx;
        margin-bottom: 50rpx;
    }

    .button-c {
        display: flex;

        .button {
            padding: 0;
            margin: 20rpx auto 0rpx auto;
            width: 100%;
            border-radius: 50rpx;
            height: 86rpx;
            line-height: 86rpx;
            text-align: center;
            font-size: 30rpx;
            font-weight: bold;
            background-color: #6938b6;
            box-shadow: 0 0 20rpx rgba(105, 56, 182, 0.6);
            color: #fff;

            &:after {
                border: none;
            }

            &.disabled {
                background-color: #ddd;
                color: black;
                box-shadow: 0 0 20rpx #ddd;
            }
        }
    }
    .block {
        display: flex;
        align-items: center;
        padding: 16rpx 0rpx;

        .item-title {
            font-size: 28rpx;
            flex-grow: 1;
            font-weight: 500;
        }

        .total-list-new {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            position: relative;
            .item {
                text-align: center;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-weight: 500;
                border-radius: 10rpx;
                border: 2rpx solid #e1e1e1;
                padding: 20rpx 0rpx;
                flex: 0 0 30%;
                width: 30%;
                font-size: 24rpx;
                position: relative;

                .discount-text {
                    display: inline;
                    color: red;
                    border-radius: 50%;
                    margin-left: 10rpx;
                    right: 10rpx;
                    top: -30rpx;
                }

                .total-text {
                    font-size: 30rpx;
                    font-weight: 500;
                }

                &.actived {
                    background: #6938b6;
                    border: 2rpx solid #6938b6;
                    color: white;
                    .discount-text {
                        color: white;
                    }
                }
            }
        }

        .redpack-switch {
            margin-left: 10rpx;
            position: relative;
            left: 10rpx;
            transform: scale(0.8);
        }
    }
}
</style>
