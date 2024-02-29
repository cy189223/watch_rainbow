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
					<view class="item" :class="{actived: payTotal === 1}"  @tap="changepay(1)">购1张</view>
					<view class="item" :class="{actived: payTotal === 3}" @tap="changepay(3)">购3张</view>
					<view class="item" :class="{actived: payTotal === 10}" @tap="changepay(10)">购10张</view>
					<view class="item" :class="{actived: payTotal === 0}" @tap="changepay(0)">全包</view>
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
			
			<UserStatement v-model="isCheckUserStatement"></UserStatement>
			
			<view class="button" @tap="disableMultiClick(submit)" v-if="isInit && isCheckUserStatement">
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
				payTotal: -1,
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
				isLoading: false,
				isCheckUserStatement: true,
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		created() {
			this.payTotal = this.info.pay_total
			this.initOrder()
		},
		methods: {
			changepay(type){
				if(this.payTotal == type) return
				this.currentCoupon = {}
				this.initOrder(type)
			},
			couponChange (e) {
				if (e.id === this.currentCoupon.id) {
				} else {
					this.currentCoupon = e
					this.initOrder()
				}
			},
			initOrder(type) {
				uni.showLoading()
				this.$http('/yifanshang/preview-orders', 'POST', {
					room_id: this.info.room_id,
					pay_total: type == undefined ? this.payTotal : type,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					this.isInit = true
					this.order = res.data.order,
					this.unusableCoupons = res.data.order.coupons.unusable
					this.usableCoupons = res.data.order.coupons.usable
					uni.hideLoading()
					if(type != undefined){
						this.payTotal = type
					}
					if(this.form.is_use_redpack == 1 && !this.order.max_useable_score) {
						this.form.is_use_score = 0
					}
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
				this.$emit('close')
			},
			createOrder() {
				
				if (this.isLoading) {
					return false
				}
				
				this.isLoading = true
				
				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})

				this.$http('/yifanshang/orders', 'POST', {
					room_id: this.info.room_id,
					pay_total: this.payTotal,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					
					setTimeout(() => {
						this.isLoading = false
					}, 1500)
				
					uni.hideLoading()
					
					let info = res.data
					if (info.is_need_pay) {
						payment.pay({
							pay_config: info.pay_config,
							success: () => {
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
				
				if (this.isLoading) {
					return false
				}
				
				this.createOrder()
				
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>

	.mask-content {
		position: absolute;
		bottom: 0rpx;
		width: 100%;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		padding: 50rpx 30rpx;
		box-sizing: border-box;

		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}

		.title {
			margin-bottom: 10rpx;
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
						border: 2rpx solid #6938b6;
						color: white;
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
			margin: 30rpx auto 0rpx auto;
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
