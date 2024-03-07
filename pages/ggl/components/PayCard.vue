<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content animated bounceInUp" @tap.stop>
            <text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
            <view class="title">
                {{ info.title }}
            </view>

            <view class="numberChange">
                <view class="button" @click="changeNumber(-1)">-</view>
                <view>{{ payTotal }}</view>
                <view class="button" @click="changeNumber(1)">+</view>
            </view>
            <view class="block">
                <view class="total-list-new">
                    <view class="item" v-for="(item, index) in info.total_list" :class="{ actived: payTotal === item.total }" @tap="changepay(item.total)">
                        <view class="total-text">
                            开{{ item.total }}个
                            <text class="discount-text" v-if="item.is_discount">(惠)</text>
                        </view>
                        <PriceDisplay :info="item"></PriceDisplay>
                    </view>
                </view>
            </view>

            <view class="block">
                <view class="item-title">可用优惠券:</view>
                <view class="arrow-right bold" @tap="isCouponPopup = true">
                    <text class="meta" v-if="order.coupon_discount">- ¥{{ $tool.formatPrice(order.coupon_discount) }}</text>
                    <template v-else>
                        <text class="meta" style="color: #ff1a1a" v-if="usableCoupons.length">{{ usableCoupons.length }}张可用</text>
                        <text class="meta gray-text" v-else>暂无可用优惠券</text>
                    </template>
                    <text class="new-iconfont icon-arrow-right"></text>
                </view>
            </view>
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

            <!-- 用户协议 -->
            <UserStatement v-model="isCheckUserStatement"></UserStatement>

            <view class="button" @tap="disableMultiClick(submit)" v-if="isInit && !isSubmiting">
                <text>确认购买</text>
            </view>
            <view class="button disabled" v-else>
                <text>确认购买</text>
            </view>
        </view>

        <UsableCouponPopup
            v-if="isCouponPopup"
            :unusableCoupons="unusableCoupons"
            :usableCoupons="usableCoupons"
            @change="couponChange"
            @close="isCouponPopup = false"
        ></UsableCouponPopup>
    </view>
</template>

<script>
import payment from '@/utils/payment.js';
export default {
    components: {},
    data() {
        return {
            payTotal: '',
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
            isInit: false,
            isCheckUserStatement: true,
            isSubmiting: false
        };
    },
    props: {
        info: {
            type: Object
        },
        Total: {
            type: Number
        }
    },
    computed: {},
    created() {
        this.payTotal = this.Total;
        this.initOrder();
    },
    methods: {
        changeNumber(num) {
            this.payTotal = this.payTotal + num;
            if (this.payTotal < 1) {
                this.payTotal = 1;
                return;
            }
            if (this.payTotal > 50) {
                this.payTotal = 50;
                return;
            }
            this.initOrder();
        },
        changepay(type) {
            if (this.payTotal == type) return;
            this.currentCoupon = {};
            this.initOrder(type);
        },
        couponChange(e) {
            if (e.id === this.currentCoupon.id) {
                // 再次点击取消使用优惠券  // 暂时关闭此功能
                // this.currentCoupon = {}
            } else {
                this.currentCoupon = e;
                this.initOrder();
            }
        },
        initOrder(type) {
            uni.showLoading();
            this.$http('/fudai/order/preview', 'POST', {
                page_uuid: this.info.page_uuid,
                total: type == undefined ? this.payTotal : type,
                coupon_id: this.currentCoupon.id,
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
                .catch((err) => {
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
            this.$emit('close');
        },
        createOrder() {
            if (this.isSubmiting) {
                return false;
            }

            uni.showLoading({
                title: '提交中',
                icon: 'none'
            });

            this.isSubmiting = true;
            setTimeout(() => {
                this.isSubmiting = false;
            }, 1500);

            this.$http('/fudai/order/confirm', 'POST', {
                page_uuid: this.info.page_uuid,
                total: this.payTotal,
                coupon_id: this.currentCoupon.id,
                ...this.form
            }).then((res) => {
                uni.hideLoading();

                let info = res.data;
                if (info.is_need_pay) {
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
            if (!this.isCheckUserStatement) {
                uni.showToast({
                    title: '请先勾选《用户使用协议》',
                    icon: 'none'
                });
                return false;
            }

            // 微信小程序请求订阅消息
            // #ifdef MP-WEIXIN
            uni.requestSubscribeMessage({
                tmplIds: [
                    this.miniappSubscribeIds.order_delivered, // 发货提醒
                    this.miniappSubscribeIds.order_paid // 支付成功通知
                ],
                complete: (res) => {
                    this.createOrder();
                }
            });
            // #endif
            // #ifndef MP-WEIXIN
            this.createOrder();
            // #endif
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.small-text {
    // font-size: 80%;
}

.mask-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #ededed;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;
    padding: 50rpx 40rpx;
    box-sizing: border-box;

    .numberChange {
        line-height: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .button {
            width: 50rpx;
            height: 50rpx;
            margin: 0;
            line-height: 50rpx;
        }
    }

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

    .gray-text {
        font-size: 28rpx;
        color: gray;
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

    .button {
        padding: 0;
        margin: 50rpx auto 0rpx auto;
        width: 100%;
        border-radius: 50rpx;
        height: 86rpx;
        line-height: 86rpx;
        text-align: center;
        font-size: 30rpx;
        font-weight: bold;
        background-color: #6938b6;
        color: white;
        box-shadow: 0 0 20rpx rgba(105, 56, 182, 0.6);

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
</style>
