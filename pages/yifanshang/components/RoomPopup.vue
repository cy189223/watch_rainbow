<template>
	<view class="mask" @tap="cancel">
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<view v-for="(item, index) in list" hover-class="hover" class="item-scope" @tap="selectRoom(item)">
						<view class="nostock" v-if="item.stock == 0">
							<image class="nostockimg" src="../../../static/shouqing.png" mode="scaleToFill"></image>
						</view>
						<view class="left">
							<image class="box-icon" mode="scaleToFill" src="/static/boximg.png" />
							<view class="textbox">
								<view class="title" :class="{'small-font': item.num >= 99}">第{{item.num}}箱</view>
								<view class='stock' :class="{empty: item.stock === 0}">剩 {{item.stock}} 发</view>
							</view>
						</view>
						<view class='right'>
							<view v-for="shang in item.normal_skus" class="shang-item">
								<text class="title">{{shang.shang_title}}</text> {{shang.stock}}/{{shang.total}}
							</view>
							<view v-for="shang in item.gift_skus" class="shang-item">
								<text class="title">{{shang.shang_title}}</text> {{shang.stock}}/{{shang.total}}
							</view>
						</view>
					</view>
				</view>
				<view style="height: 30rpx;"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				isInit: false,
				list: [],
				page: 1,
				perPage: 20
			}
		},
		props: {
			info: {
				type: Object
			},
			room: {
				type: Object
			}
		},
		computed: {
		},
		watch: {
			payTotal () {
				this.initOrder()
			}
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				uni.showLoading({
					title: '加载中'
				})
				
				this.fetchList().then(res => {
					uni.hideLoading()
				})
			},
			fetchList () {
				if (this.isLoading)
					return false 
					
				this.isLoading = true
				
				return this.$http(`/yifanshang/${this.info.uuid}/rooms`, 'GET', {
					page: this.page,
					per_page: this.perPage
				}).then(res => {
					this.isInit = true
					this.list = this.list.concat(res.data.list)
					this.isLoading = false
					this.page++
				}).catch(err => {
					this.isInit = false
				})
			},
			selectRoom(item) {
				if(item.stock == 0) return
				this.$emit('select', item)
			},
			cancel () {
				this.$emit('close')
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
		height: 1200rpx;
		background-color: #10083f;
		border-radius: 10rpx 10rpx 0 0;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
	}
	
	.scroll-view {
		height: 1100rpx;
	}
	
	
	.list-scope {
		padding: 30rpx 10rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
	
		.item-scope {
			box-sizing: border-box;
			width: calc(50% - 10rpx);
			border: 5rpx solid #9f49e4;
			border-radius: 15rpx;
			position: relative;
			overflow: hidden;
			margin-bottom: 20rpx;
			background-color: #fff;
			
			.nostock {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-color: rgba(0, 0, 0, 0.5);
				z-index: 99;
				
				.nostockimg {
					width: 180rpx;
					height: 70rpx;
				}
			}
			
			.left {
				display: flex;
				padding: 5rpx 12rpx;
				border-bottom: 5rpx solid #9f49e4;
				background: radial-gradient(ellipse at 50% 100%, #180e6d, #281b9b, #2e21b0);
				text-align: center;
				
				.textbox {
				    display: flex;
				    flex-direction: column;
				    justify-content: center;
				    align-items: flex-start;
				}
				
				.box-icon {
					width: 115rpx;
					height: 130rpx;
					margin-right: 30rpx;
				}
				
				.title {
					margin-bottom: 5rpx;
					font-size: 28rpx;
					color: #fff;
					text-shadow: 1px 1px 2px #67d5e9, -1px 1px 2px #67d5e9, -1px -1px 2px #67d5e9, 1px -1px 2px #67d5e9;
				}
				
				.stock {
					font-size: 28rpx;
					color: #fff;
				}
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx 15rpx;
				
				.shang-item {
					width: 50%;
					font-size: 25rpx;
					line-height: 40rpx;
					font-style: italic;
					.title {
						font-size: 25rpx;
						font-weight: bold;
						font-style: normal;
					}
				}
			}
			
		}
	}
	
</style>
