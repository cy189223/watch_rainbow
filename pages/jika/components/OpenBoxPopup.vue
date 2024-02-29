<template>
	<view class="container-scope animated">
		<view class="content-scope">
			
			<view class="close-btn" @tap="close" v-if="showResult">
				<text class="new-iconfont icon-close"></text>
			</view>
			
			<view v-if="!isOpen">
			</view>
			<scroll-view class="scroll-view-212" scroll-y v-else>
				<view class="sku-list">
					<view class="item" @tap="checkSku(item)" :class="'item-' + skus.length" v-for="(item, index) in skus">
						<view class="thumb-c">
							<image class="thumb" :src="item.thumb" mode="aspectFit"></image>
							<view class="title">{{item.title}}</view>
							<view class="total">×{{item.total || 1}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="bottom" v-if="showResult">
				<view class="button-c">
					<view class="btn confirm bg-purple" @tap="close">
						返回抽卡
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			boxImg: String,
			buttonTitle: String,
			list: Array,
			isNavbarEnable: false
		},
		data() {
			return {
				isOpen: false,
				showResult: false,
				status: 0,
				package: {},
			}
		},
		mounted() {
			
			this.initData()
		},
		computed: {
			skus() {
				return this.list || []
			}
		},
		methods: {
			initData() {
				this.startOpenAnimate()
			},
			startOpenAnimate()  {
				// 开盒动画
				setTimeout(() => {
					this.status = 1
					setTimeout(() => {
						this.isOpen = true
						this.$playAudio('open')
						setTimeout(() => {
							this.showResult = true
						}, 300)
					}, 200)
				}, 100)
			},
			handleRefresh() {
				this.isNotOpen  = false
				this.initData()
			},
			handleOk() {
				uni.switchTab({
					url: "/pages/myBox/index"
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			close() {
				this.$emit('close')
				this.$emit('refresh')
			},
		}
	}
</script>

<style lang="scss" scoped>

	.container-scope {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		z-index: 10000;
		padding-top: 200rpx;

		.close-btn {
			font-size: 38rpx;
			background: rgba(255,  255, 255, 0.4);
			border: 2px solid rgba(255,  255, 255, 0.4);
			border-radius: 50%;
			width: 60rpx;
			color: white;
			position: absolute;
			right: 200rpx;
			right: 50rpx;
			top: -50rpx;
			height: 60rpx;
			text-align: center;
			line-height: 56rpx;
			box-sizing: border-box;
			z-index: 1000;
		}

		.title {
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}

	.content-scope {
		width: 100%;
		position: relative;
		min-height: 100rpx;
		margin-top: 100rpx;
		
		background: url('https://box-1306374625.cos.ap-guangzhou.myqcloud.com/youmi/img/other/My56VSDVpEV5iJhkayERljy0bztXUv8bhp5RoIG5.png');
		background-size: 90% auto;
		background-repeat: no-repeat;
		background-position: 38rpx 0rpx;
		min-height: 100vh;
		
		.unopen-c {
			width: 300rpx;
			height: 420rpx;
			margin: 0 auto;
			margin-top: 280rpx;
			position: relative;
		
			&:after {
				content: "";
				position: absolute;
				bottom: -50rpx;
				left: -50rpx;
				width: 400rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #DCDFE6;
				box-shadow: 0 0 20rpx rgba(220, 223, 230, 1);
			}
		}
		
		.unopen {
			width: 100%;
			height: 100%;
			position: relative;
			z-index: 11;
		
			&.a0 {
				animation: shakeTopx 0.2s;
				animation-delay: 0.7s;
				animation-iteration-count: infinite;
				animation-timing-function: linear;
				transform-origin: bottom center;
			}
		
			&.a1 {
				animation: hide 0.3s;
				transform-origin: bottom center;
				animation-fill-mode: forwards;
			}
		
			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	
	.scroll-view-212 {
		max-height: 50vh;
		padding: 0rpx;
		box-sizing: border-box;
	}

	.sku-list {
		margin-top: 30rpx;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		

		.item {
			width: 210rpx;
			margin-top: 30rpx;
			margin-left: 20rpx;
			position: relative;
			overflow: hidden;
	

			image {
				width: 198rpx;
				height: 198rpx;
				display: block;
			}

			.thumb-c {
				margin: 0 auto;
				width: 210rpx;
				position: relative;
				background-color: #e57dff;
				z-index: 11;
				animation: showbox 1s;
				transform-origin: center;
				animation-fill-mode: forwards;
				padding-bottom: 10rpx;
				
				border: 6rpx solid white;
				box-sizing: border-box;
			}

			.title {
				color: black;
				font-size: 26rpx;
				font-weight: 500;
				text-align: center;
				margin-top: 10rpx;
			}
			.total {
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
			
			// 单个
			&.item-1 {
				width: 450rpx;
				.thumb-c {
					width: 450rpx;
					
					image {
						width: 438rpx;
						height: 438rpx;
					}
				}
			}
		}
	}
	
	.bottom {
		margin-top: 130rpx;
	}


	.button-c {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 11;
		margin: 60rpx 110rpx;

		.btn {
			z-index: 11;
			height: 82rpx;
			line-height: 82rpx;
			width: 240rpx;
			text-align: center;
			background-color: #6938b6;
			border-radius: 10rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: white;
			&:last-child {
				margin-left: 30rpx;
			}
		}
	}

	@keyframes shakeTopx {
		0% {
			transform: rotate(-6deg);
		}

		25% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(6deg);
		}

		75% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(-6deg);
		}
	}

	@keyframes hide {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		100% {
			transform: scale(0);
			opacity: 0;
		}
	}

	@keyframes showbox {
		0% {
			transform: scale(0, 0);
			opacity: 0;
		}

		30% {
			transform: scale(1, 1);
			opacity: 1;
		}

		50% {
			transform: scale(0.7, 1);
			opacity: 1;
		}

		100% {
			transform: scale(1, 1);
		}
	}
</style>
