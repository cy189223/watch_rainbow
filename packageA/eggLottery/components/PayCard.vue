<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				{{info.title}}
			</view>


			<view class="block">
				<view class="item-title">单价:</view>
				<view class="price-c">
					<PriceDisplay :info="info"></PriceDisplay>
				</view>
			</view>
			<view class="block">
				<view class="item-title">数量:</view>
				<view class="total-list">
					<view class="item" :class="{actived: payTotal === 1}"  @tap="payTotal = 1">扭1次</view>
					<view class="item"  :class="{actived: payTotal === 5}" @tap="payTotal = 5">扭5次</view>
				</view>
			</view>
			<view class="block">
				<view class="item-title">可用优惠券:</view>
				<view class="arrow-right bold" @tap="isCouponPopup = true">
					<text class="meta" v-if="order.coupon_discount"> - ¥{{$tool.formatPrice(order.coupon_discount)}}</text>
					<template v-else>
						<text class="meta" style="color: #FF1A1A;" v-if="usableCoupons.length">{{usableCoupons.length}}张可用</text>
						<text class="meta gray-text" v-else>暂无可用优惠券</text>
					</template>
					<text class="new-iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="block">
				<view class="item-title">可用{{$money()}}:</view>
				<view class="arrow-right bold">
					<template v-if="order.redpack">
						<text class="meta"> ¥{{$tool.formatPrice(order.redpack)}}</text>
						<switch class="redpack-switch" :checked="order.is_use_redpack" @change="switchChange" />
					</template>
					<text class="meta" v-else> ¥0 </text>
				</view>
			</view>
			<view class="block" v-if="order.max_useable_score">
				<view class="item-title">
					{{scoreAlias}}抵扣
				</view>
				<view class="arrow-right bold">
					<text class="meta"> {{order.max_useable_score}}{{scoreAlias}}</text>
					<text class="meta red" style="margin-left: 10rpx;" v-if="order.score_discount"> -¥{{order.score_discount | priceToFixed}}</text>
					<switch v-if="order.max_useable_score" class="redpack-switch" :checked="order.is_use_score" @change="scoreSwitchChange" />
				</view>
			</view>
			<view class="total">
				小计：
				<PriceDisplay :info="order" prefix="pay_"></PriceDisplay>
			</view>
			<view class="button" @tap="submit" v-if="isInit">
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
			@close="isCouponPopup = false">
		</UsableCouponPopup>
		
	</view>
</template>

<script>
	import payment from "@/utils/payment.js"
	export default {
		components: {},
		data() {
			return {
				payTotal: 0,
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
				isInit: false
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		watch: {
			payTotal () {
				this.initOrder()
			}
		},
		created() {
			this.payTotal = this.info.pay_total
			console.log('info', this.info)
			// this.initOrder()
		},
		methods: {
			couponChange (e) {
				if (e.id === this.currentCoupon.id) {
					// 再次点击取消使用优惠券  // 暂时关闭此功能
					// this.currentCoupon = {}
				} else {
					this.currentCoupon = e
					this.initOrder()
				}
			},
			initOrder() {
				uni.showLoading()
				this.$http('/egg-lottery/order/preview', 'POST', {
					activity_id: this.info.id,
					total: this.payTotal,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					this.isInit = true
					this.order = res.data.order,
					this.unusableCoupons = res.data.order.coupons.unusable
					this.usableCoupons = res.data.order.coupons.usable
					uni.hideLoading()
				}).catch(err => {
					this.isInit = false
					this.cancel()
				})
			},
			switchChange(e) {
				this.form.is_use_redpack = e.detail.value ? 1 : 0
				this.initOrder()
			},
			scoreSwitchChange(e) {
				this.form.is_use_score = e.detail.value ? 1 : 0
				this.initOrder()
			},
			cancel() {
				this.$emit('cancel')
			},
			createOrder() {
				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})

				this.$http('/egg-lottery/order/confirm', 'POST', {
					activity_id: this.info.id,
					total: this.payTotal,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					uni.hideLoading()
					let info = res.data
					if (info.is_need_pay) {
						payment.pay({
							pay_config: info.pay_config,
							success: () => {
								// uni.showToast({
								// 	title: "支付成功",
								// 	icon: "none"
								// })
								this.$emit('success', info.order)
							},
							fail: () => {
								uni.showToast({
									title: "支付失败",
									icon: "none"
								})

								// 关闭订单
								this.$http(`/orders/${info.order.uuid}`, 'PUT', {
									type: 'close_and_delete'
								})
							}
						})
					} else {
						this.$emit('success', info.order)
					}
				})
			},
			submit() {
				// 微信小程序请求订阅消息
				// #ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
					tmplIds: [
						this.miniappSubscribeIds.order_delivered, // 发货提醒
						this.miniappSubscribeIds.order_paid, // 支付成功通知
					],
					complete: (res) => {
						this.createOrder()
					}
				})
				// #endif
				// #ifndef MP-WEIXIN
					this.createOrder()
				// #endif
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.mask-content {
		position: absolute;
		bottom: 0;
		width: 100%;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		padding: 30rpx 30rpx 100rpx 30rpx;
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
			
			.total-list {
				display: flex;
				.item {
					font-weight: 500;
					border-radius: 40rpx;
					border: 2rpx solid #e1e1e1;
					padding: 4rpx 20rpx;
					margin-left: 20rpx;
					font-size: 24rpx;
					
					&.actived {
						background: #6938b6;
						border: 2rpx solid rgba(105, 56, 182, 1.0);
						color: white;
					}
				}
			}

			.price-c {}
			
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
