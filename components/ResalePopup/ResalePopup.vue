<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content" @tap.stop v-if="isInit && !isReturnSaleSuccess">
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">转售给朋友</view>
			<view class="sku-list" scroll-y v-if="skus.length <= 6">
				<view class="sku-c" v-for="(item, index) in skus">
					<view class="stock-c">x{{item.total}}</view>
					<image :src="item.thumb" mode="aspectFit" class="sku-thumb"></image>
					<view class="sku-title">{{item.title}}</view>
					<view class="price-c">
						单价: <PriceDisplay :info="item"></PriceDisplay>
					</view>
				</view>
			</view>
			<scroll-view class="sku-list scroll-list" scroll-y v-else>
				<view class="sku-c" v-for="(item, index) in skus">
					<view class="stock-c">x{{item.total}}</view>
					<image :src="item.thumb" mode="aspectFit" class="sku-thumb"></image>
					<view class="sku-title">{{item.title}}</view>
					<view class="price-c">
						<PriceDisplay :info="item"></PriceDisplay>
					</view>
				</view>
			</scroll-view>
			
			
			<view class="money-c">
				<view class="input-tips">
					一口价: 
				</view>
				<view class="input">{{moneyPrice}}</view>
				<span>{{$money()}}</span>
				<span style="margin: 0px 20rpx;">+</span> 
				<view class="input">{{scorePrice}}</view>
				<span>{{scoreAlias}}</span>
			</view>

			<view class="btn-c">
				<button class="btn cancel bg-purple" @tap="cancel">再想想</button>
				<button class="btn submit " @tap="submit">确认转售</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				info: {},
				skus: [],
				isInit: false,
				isReturnSaleSuccess: false,
				moneyPrice: '',
				scorePrice: '',
				isUseAdvisePrice: 1,
				adviseMoneyPrice: '',
				adviseScorePrice: ''
			}
		},
		props: {
			uuid: {
				type: String
			},
			packageSku: {
				type: Object
			}
		},
		computed: {},
		watch: {
			isUseAdvisePrice (val) {
				if (val) {
					this.moneyPrice = this.adviseMoneyPrice  / 100
					this.scorePrice = this.adviseScorePrice
				}
			}
		},
		onLoad(e) {

		},
		created() {
			this.initOrder()
		},
		methods: {
			switchChange(e) {
				this.isUseAdvisePrice = e.detail.value ? 1 : 0
			},
			initOrder() {
				uni.showLoading()
				this.$http(`/asset/resale/preview`, 'post', {
					ids: [ this.packageSku.id ]
				}).then(res => {
					this.isInit = true
					this.skus = res.data.skus
					this.info = res.data,
					this.moneyPrice = this.info.advise_money_price / 100
					this.scorePrice = this.info.advise_score_price
					
					this.adviseMoneyPrice = this.info.advise_money_price
					this.adviseScorePrice = this.info.advise_score_price
					uni.hideLoading()
				})
			},
			cancel() {
				this.$emit('cancel')
			},
			submit() {
				if (this.moneyPrice === '') {
					uni.showModal({
						title: '请填现金价，免费请填0哦~'
					})
					return false
				}
				if (this.scorePrice === '') {
					uni.showModal({
						title: '请填积分价，免费请填0哦~'
					})
					return false
				}
				
				uni.showLoading()
				this.$http(`/asset/resales`, 'post', {
					package_sku_id: this.packageSku.id,
					is_allow_fast_match: this.isUseAdvisePrice,
					money_price: this.moneyPrice ? this.moneyPrice * 100 : 0,
					score_price: this.scorePrice
				}).then(res => {
					uni.hideLoading()
					this.$emit('cancel')
					this.$emit('refresh')
					uni.navigateTo({
						url: '/pages/resale/detail?uuid=' + res.data.uuid
					})
				})
			},
			toPage(url) {
				uni.navigateTo({
					url: url
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>

	.mask {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mask-content {
		width: 660rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 20rpx;
		padding: 60rpx 60rpx 50rpx 60rpx;
		box-sizing: border-box;
		position: relative;

		.close-btn {
			position: absolute;
			right: 26rpx;
			top: 26rpx;

			color: #999;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
		}

		.sku-list {
			display: flex;
			justify-content: center;
			margin-top: 30rpx;
			margin: 30rpx -20rpx 0rpx -20rpx;
			flex-wrap: wrap;
			
			
			
			.sku-c {
				text-align: center;
				margin: 20rpx 6rpx;
				position: relative;
				
				
				.stock-c {
					position: absolute;
					right: 0rpx;
					top: 0rpx;
					background: rgba(0, 0, 0, 0.4);
					color: white;
					font-size: 22rpx;
					font-weight: 500;
					padding: 0rpx 20rpx;
					border-radius: 20rpx;
				}
			
				.sku-thumb {
					width: 180rpx;
					height: 200rpx;
					border-radius: 20rpx;
					background: #f1f1f1;
				}
			
				.sku-title {
					font-size: 22rpx;
					color: #666;
					font-weight: 500;
					height: 60rpx;
					
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					line-clamp: 2;
					max-width: 180rpx;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			
			&.scroll-list {
				display: block;
				max-height: 50vh;
				width: 600rpx;
				.sku-c {
					float: left;
				}
			}
		}

		.input-tips {
			font-size: 28rpx;
			text-align: center;
			margin-right: 10rpx;
		}
		
		.redpack-switch {
			margin-left: 10rpx;
			position: relative;
			left: 10rpx;
			transform: scale(0.8);
		}

		.money-c {
			
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 10rpx;
			.input {
				background: #F2F2F2;
			    border-radius: 10rpx;
			    line-height: 70rpx;
			    margin: 0 6rpx;
			    text-align: center;
			    font-size: 28rpx;
			    font-weight: 500;
			    padding: 0rpx 30rpx;
			}
			
			.tips {
				font-size: 22rpx;
				color: red;
			}
		}
		
		.icon-check {
			color: #2BA246;
			font-size: 46rpx;
			position: relative;
			top: 4rpx;
			margin-right: 10rpx;
		}

		.btn-c {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn {
				padding: 0;
				margin: 50rpx 0rpx 0rpx 0rpx;
				width: 46%;
				border-radius: 20rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				background-color: #6938b6;
				color: white;

				&:after {
					border: none;
				}

				&.submit {}
			}
		}
	}
</style>
