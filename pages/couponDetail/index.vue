<template>
    <view class="container" v-if="info">
        <CouponItem :coupon="info" :isdetail="true"></CouponItem>

        <template v-if="!info.is_picked">
            <template v-if="code">
                <button class="pick-btn global-shadow" hover-class="hover" @click="useCode">确认兑换</button>
            </template>
            <template v-else>
                <button class="pick-btn global-shadow" hover-class="hover" @click="pickCoupon" v-if="!info.score_price">领取优惠券</button>
                <button class="pick-btn global-shadow" hover-class="hover" @click="pickCouponWithScore" v-else>使用{{ info.score_price }}{{ scoreAlias }}兑换</button>
            </template>
        </template>
        <button class="pick-btn global-shadow" hover-class="hover" @click="toShop" v-else>已领券，去使用</button>
    </view>
</template>

<script>
import CouponItem from '@/components/CouponList/components/CouponItem.vue';

export default {
    components: {
        CouponItem
    },
    data() {
        return {
            uuid: '',
            info: {},
            code: ''
        };
    },
    filters: {},
    onLoad(e) {
        this.uuid = e.uuid;
        this.code = e.code || '';
        this.initData();

        this.$visitor.record('couponn_detail');
    },
    onShow() {
        this.initData();
    },
    methods: {
        useCode() {
            uni.showLoading({
                title: '兑换中'
            });
            this.$http('/code/use', 'POST', {
                code: this.code
            }).then((res) => {
                uni.hideLoading();
                uni.showToast({
                    title: '兑换成功',
                    icon: 'none'
                });
                this.initData();
            });
        },
        toShop() {
            uni.switchTab({
                url: '/pages/home/index'
            });
        },
        initData() {
            this.$api.emit('core.coupon.show', this.uuid).then((res) => {
                this.info = res.data.info;

                // 不可转发
                if (!this.info.is_shareable) {
                    uni.hideShareMenu();
                }
            });
        },
        pickCoupon() {
            uni.showLoading({
                title: '领取中',
                mask: false
            });
            this.$api.emit('core.coupon.pick', this.uuid).then((res) => {
                uni.hideLoading();
                this.initData();

                uni.showToast({
                    title: '领取成功',
                    icon: 'none'
                });
            });
        },
        pickCouponWithScore() {
            uni.showModal({
                title: '兑换提示',
                content: '确认支付' + this.info.score_price + this.scoreAlias + '兑换此优惠券吗?',
                success: (res) => {
                    if (res.confirm) {
                        this.pickCoupon();
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background: #fcfcfc;
    padding: 30upx 0;
    width: 100%;
    height: 100vh;

    .pick-btn {
        &:after {
            display: none;
        }

        margin: 50rpx 20rpx 0;
        border-radius: 100rpx;
        color: white;
        font-weight: 500;
        background: #6938b6;
        font-size: 30rpx;
    }
}
</style>
