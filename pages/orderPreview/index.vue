<template>
    <view class="container">
        <template v-if="init">
            <view class="address padding" v-if="isNeedAddress">
                <SelectAddress v-model="address" :isShowPhone="true"></SelectAddress>
            </view>
            <SplitLine></SplitLine>
            <view class="products">
                <SkuItem class="sku" :info="item" v-for="(item, index) in products"></SkuItem>
            </view>
            <SplitLine></SplitLine>
            <view class="list padding">
                <view class="list-item">
                    <view class="body">商品总价</view>
                    <view class="arrow-right bold">
                        <view>
                            <PriceDisplay :info="order" prefix="product_"></PriceDisplay>
                        </view>
                    </view>
                </view>
                <view class="list-item">
                    <view class="body">优惠券</view>
                    <view class="arrow-right bold" v-if="currentCoupon.id" @tap="couponsVisible = true">
                        <text class="meta red">- ¥{{ order.coupon_discount | priceToFixed }}</text>
                        <text class="new-iconfont icon-arrow-right"></text>
                    </view>
                    <view class="arrow-right" v-else @tap="couponsVisible = true">
                        <text class="meta" v-if="usableCoupons.length">{{ usableCoupons.length }}张可用</text>
                        <text class="meta" v-else>无可用</text>
                        <text class="new-iconfont icon-arrow-right"></text>
                    </view>
                </view>

                <view class="list-item" v-if="order.cover_type">
                    <view class="body">兑换类型</view>
                    <view class="arrow-right bold">
                        <text class="meta" v-if="order.cover_type === 'chip'">碎片兑换</text>
                        <text class="meta" v-else-if="order.cover_type === 'score'">{{ scoreAlias }}兑换</text>
                    </view>
                </view>

                <view class="list-item" v-if="order.cover_discount">
                    <view class="body">兑换优惠</view>
                    <view class="arrow-right bold">
                        <text class="meta red">- ¥{{ order.cover_discount | priceToFixed }}</text>
                    </view>
                </view>

                <view class="list-item">
                    <view class="body">{{ $money() }}抵扣</view>
                    <view class="arrow-right bold">
                        <text class="meta red">
                            <template v-if="order.redpack">-</template>
                            ¥{{ order.redpack | priceToFixed }}
                        </text>
                        <switch v-if="order.redpack" class="redpack-switch" :checked="order.is_use_redpack" @change="redpackSwitchChange" />
                    </view>
                </view>
                <view class="list-item" v-if="order.max_useable_score">
                    <view class="body">{{ scoreAlias }}抵扣</view>
                    <view class="arrow-right bold">
                        <text class="meta">{{ order.max_useable_score }}{{ scoreAlias }}</text>
                        <text class="meta red" style="margin-left: 10rpx" v-if="order.score_discount">-¥{{ order.score_discount | priceToFixed }}</text>
                        <switch v-if="order.max_useable_score" class="redpack-switch" :checked="order.is_use_score" @change="scoreSwitchChange" />
                    </view>
                </view>
                <view class="list-item">
                    <view class="body">运费</view>
                    <view class="arrow-right bold" v-if="order.carriage_type === 2">
                        <text class="meta red">到付</text>
                    </view>
                    <view class="arrow-right bold" v-else>
                        <text class="meta red">+ ¥{{ order.carriage | priceToFixed }}</text>
                    </view>
                </view>
                <view class="list-item">
                    <view class="body">实付</view>
                    <view class="arrow-right bold">
                        <text class="meta">¥{{ order.price | priceToFixed }}</text>
                    </view>
                </view>
                <view class="list-item">
                    <view class="body">备注</view>
                    <view class="arrow-right remark">
                        <input type="text" v-model="remark" placeholder="请输入您对商家说的话" placeholder-class="placeholder" />
                    </view>
                </view>
            </view>
            <view style="height: 160upx"></view>
            <view class="footer-actions safe-area-bottom">
                <view class="price-c">
                    <PriceDisplay :info="order" prefix="pay_"></PriceDisplay>
                </view>
                <IButton round size="small" @click="disableMultiClick(payOrder)">
                    <text>确认订单</text>
                </IButton>
            </view>
            <UsableCouponPopup
                v-if="couponsVisible"
                :unusableCoupons="unusableCoupons"
                :usableCoupons="usableCoupons"
                @change="couponChange"
                @close="couponsVisible = false"
            ></UsableCouponPopup>
        </template>
        <NoData v-else></NoData>
    </view>
</template>

<script>
import mixin from '@/utils/mixin.js';
import SplitLine from '@/components/SplitLine/index.vue';
import IButton from '@/components/Button/index.vue';
import payment from '@/utils/payment.js';
import { mapGetters } from 'vuex';
export default {
    mixins: [mixin],
    components: {
        SplitLine,
        IButton
    },
    data() {
        return {
            address: {},
            order: {},
            isNeedAddress: 0,
            skus: [],
            seckillId: '',
            groupPriceUuid: '',
            products: [],
            remark: '',
            init: false,
            couponsVisible: false,
            unusableCoupons: [],
            usableCoupons: [],
            currentCoupon: {},
            current: 0,
            animationData: {},
            animationData2: {},
            coverType: '',
            _source: ''
        };
    },
    computed: {
        ...mapGetters(['token']),
        totalPrice() {
            let total = this.order.price;
            return total;
        }
    },
    onLoad(e) {
        this.seckillId = e.seckillId;
        this.groupPriceUuid = e.groupPriceUuid;
        this.coverType = e.coverType;
        this.skus = JSON.parse(e.skus);
        this._source = e._source;

        uni.$on('selectAddress', (res) => {
            this.address = res;
            this.getOrderInfo();
        });
    },
    onUnload() {
        uni.$off('selectAddress', (data) => {
            console.log('移除 selectAddress 自定义事件');
        });
    },
    onShow() {
        if (this.token && !this.address.id) {
            this.getOrderInfo();
        }
    },
    methods: {
        redpackSwitchChange(e) {
            this.order.is_use_redpack = e.detail.value ? 1 : 0;
            this.getOrderInfo();
        },
        scoreSwitchChange(e) {
            this.order.is_use_score = e.detail.value ? 1 : 0;
            this.getOrderInfo();
        },
        couponChange(e) {
            if (e.id === this.currentCoupon.id) {
            } else {
                this.currentCoupon = e;
                this.getOrderInfo();
            }
        },
        createOrder() {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.$api
                .emit('order.store', {
                    payment: 'miniapp',
                    skus: this.skus,
                    coupon_id: this.currentCoupon && this.currentCoupon.id,
                    seckill_id: this.seckillId,
                    group_price_uuid: this.groupPriceUuid,
                    address_id: this.address && this.address.id,
                    remark: this.remark,
                    cover_type: this.coverType,
                    is_use_redpack: this.order.is_use_redpack,
                    is_use_score: this.order.is_use_score,
                    _source: this._source
                })
                .then((res) => {
                    let info = res.data;
                    let order = res.data.order;
                    if (!info.is_need_pay) {
                        uni.showToast({
                            title: '支付成功，正在跳转~',
                            icon: 'none'
                        });

                        setTimeout(() => {
                            uni.redirectTo({
                                url: '/pages/orderDetail/index?uuid=' + order.uuid
                            });
                        }, 1500);

                        return false;
                    }

                    // 进行支付
                    payment.pay({
                        pay_config: info.pay_config,
                        pay_type: info.pay_type,
                        success: () => {
                            uni.showToast({
                                title: '支付成功',
                                icon: 'none'
                            });
                            setTimeout(() => {
                                uni.redirectTo({
                                    url: '/pages/orderList/index?status=deliver_pending'
                                });
                            }, 1500);
                        },
                        fail: () => {
                            uni.showToast({
                                title: '支付失败',
                                icon: 'none'
                            });
                            uni.redirectTo({
                                url: '/pages/orderDetail/index?uuid=' + order.uuid
                            });
                        }
                    });

                    uni.hideLoading();
                })
                .catch((err) => {
                    uni.hideLoading();
                });
        },
        payOrder() {
            if (this.isNeedAddress && !this.address.id) {
                uni.showToast({
                    title: '未添加收货地址',
                    icon: 'none'
                });
                return;
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
        },
        getOrderInfo() {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            this.$api
                .emit('order.preview.store', {
                    skus: this.skus,
                    address_id: this.address && this.address.id,
                    seckill_id: this.seckillId,
                    group_price_uuid: this.groupPriceUuid,
                    coupon_id: this.currentCoupon.id,
                    cover_type: this.coverType,
                    is_use_redpack: this.order.is_use_redpack ? 1 : 0,
                    is_use_score: this.order.is_use_score ? 1 : 0
                })
                .then((res) => {
                    uni.hideLoading();
                    this.init = true;
                    this.order = res.data.order;
                    this.products = res.data.order.skus;
                    this.unusableCoupons = res.data.order.coupons.unusable;
                    this.usableCoupons = res.data.order.coupons.usable;
                    this.address = res.data.address;

                    this.isNeedAddress = res.data.is_need_address;

                    // 提示一些信息： 如活动库存不足够，将按原价结算
                    if (res.data.tips) {
                        uni.showModal({
                            content: res.data.tips,
                            title: '温馨提示'
                        });
                    }
                });
        }
    }
};
</script>

<style lang="scss">
.list-item {
    display: flex;
    align-items: center;
    position: relative;
}

.list-item .body {
    flex: 1;
    display: flex;
    align-items: center;
}

.list-item-title {
    flex: 1;
}

.redpack-switch {
    margin-left: 20rpx;
    position: relative;
    left: 10rpx;
}

.address {
    flex: 1;
}

.products {
}

.list-item {
    height: 80upx;

    .body {
        font-size: 28upx;
    }

    .arrow-right {
        display: flex;
        align-items: center;

        &.bold {
            font-weight: bold;
        }

        .icon-arrow-right {
            font-size: 42rpx;
            margin-right: -14rpx;
        }
    }

    .meta {
        font-size: 26upx;
    }

    .remark {
        input {
            height: 100%;
            text-align: right;
            color: #999;
            font-size: 28upx;
            width: 600upx;
        }
    }
}

.footer-actions {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    box-shadow: 0 -6upx 8upx rgba(206, 206, 206, 0.3);
    padding: 0 24upx;
    box-sizing: border-box;

    .price-c {
        height: 114upx;
        display: flex;
        align-items: center;
        font-size: 46upx;
        color: #e63111;
    }
}
</style>
