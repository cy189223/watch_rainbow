<template>
	<view class="coupon-item" @tap="click">
		<view class="discount-money">
			<view class="price" v-if="coupon.discount_type===0">
				<text class="unit">¥</text>
				<text class="money">{{coupon.discount_money/100}}</text>
			</view>
			<view class="price" v-else-if="coupon.discount_type===1">
				<text>{{coupon.discount_rate/10}}</text>
				<text class="unit">折</text>
			</view>
			<view class="price" v-else-if="coupon.discount_type===2">
				<text>包邮券</text>
			</view>
			<view class="price small" v-else-if="coupon.discount_type===3">
				<text>兑换券</text>
			</view>
			<view class="type">
				<text v-if="coupon.minimum_money != 0">满{{(coupon.minimum_money / 100).toFixed(2)}}使用</text>
				<text v-else>无门槛</text>
			</view>
		</view>
		<view class="detail">
			<view class="title">{{coupon.title}}</view>
			<view class="label">{{coupon.usable_range_text}}</view>
			<view class="valid-date">
				<text v-if="coupon.time_limit_type == 0">{{validDateStr}}</text>
				<text v-else-if="coupon.time_limit_type == 1">领取后{{coupon.valid_time}}小时内有效</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "CouponItem",
		props: {
			coupon: {
				type: Object,
				default() {
					return {}
				}
			},
			isdetail: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			validDateStr() {
				if (!this.coupon) return ''
				if(this.coupon.time_limit_type == 0){
					return this.coupon.usable_start_at.substr(0, 10) + ' 至 ' + this.coupon.usable_end_at.substr(0, 10)
				}else {
					return ''
				}
			}
		},
		methods: {
			click() {
				if(this.isdetail) return
				uni.navigateTo({
					url: '/pages/couponDetail/index?uuid=' + this.coupon.uuid
				})
				this.$emit('click', this.coupon)
			}
		}
	}
</script>

<style lang="scss">
	.coupon-item {
		background-image: url('https://api.caihongbox.com.cn/image/coupon.png');
		background-size: 100% 100%;
		overflow: hidden;
		position: relative;
		margin: 16rpx auto 0;
		width: 720rpx;
		height: 290rpx;
		color: #fff;
		
		&:last-child {
			margin-bottom: 16rpx;
		}
		
		.discount-money {
			position: absolute;
			top: 70rpx;
			left: 60rpx;
			width: 165rpx;
		
			.price {
				font-size: 50upx;
				font-weight: bold;
                height: 60rpx;
                line-height: 60rpx;
				
				.unit {
					font-size: 24upx;
					margin-right: 5rpx;
				}
				
				&.small {
					font-size: 40rpx;
				}
			}
			
			.type {
				margin-top: 10upx;
				font-size: 22upx;
			}
		}
		
		.detail {
			position: absolute;
			top: 60rpx;
			right: 85rpx;
			width: 300rpx;
			text-align: right;
			
			.title {
				font-size: 30upx;
			}
			.label {
				font-size: 24upx;
				margin-top: 15upx;
			}
			.valid-date {
				font-size: 24upx;
				margin-top: 15upx;
			}
		}
	}
</style>
