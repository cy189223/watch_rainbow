<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <block v-if="cardtype == 1">
            <view class="mask-content" @tap.stop>
                <text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
                <view class="title">领取奖品</view>
                <view style="height: 30rpx"></view>
                <SelectAddress class="address-c" v-model="address"></SelectAddress>

                <view class="tips">{{ deliverTips }}</view>
                <view class="button" @click="submit">
                    <text>确认领取奖品</text>
                </view>
            </view>
        </block>
        <block v-if="cardtype == 2">
            <view class="mask-content" @tap.stop>
                <text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
                <view class="title">物流详情</view>
                <view class="block">
                    <view class="item-title">姓名:</view>
                    <view class="item-value">{{ prizelist.real_name }}</view>
                </view>
                <view class="block">
                    <view class="item-title">收货地址:</view>
                    <view class="item-value">{{ prizelist.address }}</view>
                </view>
                <view class="block">
                    <view class="item-title">快递公司:</view>
                    <view class="item-value">{{ prizelist.express_name && prizelist.express_name != '' ? prizelist.express_name : '暂无' }}</view>
                </view>
                <view class="block">
                    <view class="item-title">快递单号:</view>
                    <view class="item-value">{{ prizelist.express_num && prizelist.express_num != '' ? prizelist.express_num : '暂无' }}</view>
                </view>
                <view class="block">
                    <view class="item-title">物流状态:</view>
                    <view class="item-value">{{ prizelist.union_status_text }}</view>
                </view>
            </view>
        </block>
    </view>
</template>

<script>
import payment from '@/utils/payment.js';
export default {
    components: {},
    data() {
        return {
            address: {},
            order: {}
            // carriage: 0,
            // unusableCoupons: [],
            // usableCoupons: [],
            // isCouponPopup: false,
            // currentCoupon: {}
        };
    },
    props: {
        selectedId: {
            type: String
        },
        cardtype: {
            type: String
        },
        prizelist: {
            type: Object
        }
    },
    computed: {
        orderConfig() {
            return this.$store.getters.setting.order || {};
        },
        deliverTips() {
            return this.orderConfig.deliver_tips || '商品一经寄出，非质量问题不支持退换';
        }
    },
    onLoad(e) {},
    created() {},
    methods: {
        // couponChange (e) {
        // 	if (e.id === this.currentCoupon.id) {
        // 	} else {
        // 		this.currentCoupon = e
        // 		this.initOrder()
        // 	}
        // },
        // initOrder() {
        // 	if (!this.address.id) {
        // 		return false
        // 	}
        // 	this.$http('/package/deliver-order/preview', 'POST', {
        // 		ids: this.selectedId,
        // 		address_id: this.address.id,
        // 		coupon_id: this.currentCoupon.id,
        // 	}).then(res => {
        // 		this.carriage = res.data.info.carriage
        // 		this.order = res.data.info,
        // 		this.unusableCoupons = res.data.info.coupons.unusable
        // 		this.usableCoupons = res.data.info.coupons.usable
        // 	})
        // },
        cancel() {
            this.$emit('cancel');
        },
        submit() {
            if (!this.address.id) {
                uni.showModal({
                    title: '请选择收货地址'
                });
                return false;
            }

            uni.showLoading({
                title: '提交中',
                icon: 'none'
            });

            this.$http(`/prize/${this.selectedId}`, 'POST', {
                address_id: this.address.id
            }).then((res) => {
                uni.hideLoading();
                this.$emit('success');
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.mask-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 860rpx;
    background-color: #ededed;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;
    padding: 30rpx 30rpx;
    box-sizing: border-box;

    .close-btn {
        position: absolute;
        right: 20rpx;
        top: 20rpx;
    }

    .title {
        text-align: center;
        font-size: 36rpx;
        font-weight: 500;
        margin-bottom: 30rpx;
    }

    .item-title {
        margin: 0rpx 0rpx 0rpx 0rpx;
        font-size: 28rpx;
    }

    .item-value {
        text-align: right;
        font-weight: 500;
    }

    .block {
        display: flex;
        align-items: center;
        padding: 16rpx 0rpx;

        .item-title {
            flex-grow: 1;
            font-weight: 500;
        }

        .price-c {
        }

        .redpack-switch {
            margin-left: 10rpx;
            position: relative;
            left: 10rpx;
            transform: scale(0.8);
        }
    }

    .address-c {
        margin-top: 30rpx;
    }

    .sku-list {
        display: flex;
        flex-wrap: wrap;

        .item {
            padding: 0 26rpx;
            height: 48rpx;
            line-height: 48rpx;
            font-size: 24rpx;
            margin-right: 16rpx;
            margin-bottom: 16rpx;
            border-radius: 40rpx;
            border: 2rpx solid #eaebed;
            text-align: center;
            min-width: 70rpx;

            &.actived {
                color: white;
                background: rgba(105, 56, 182, 1);
                border: 2rpx solid rgba(105, 56, 182, 1);
            }

            &:last-child {
                margin-right: 0rpx;
            }
        }
    }

    .total {
        margin-top: 20rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 0 16rpx;
        text-align: right;
        color: red;
        font-size: 28rpx;
    }

    .tips {
        text-align: center;
        color: red;
        font-size: 24rpx;
        margin-top: 60rpx;
    }

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
    }
}
</style>
