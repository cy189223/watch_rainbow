<template>
		<view >
			<view class="tag-list">
				<!-- <view class="item" :class="{actived: sku_level === ''}" @tap="setTag('')">全部</view>
				<view class="item" :class="{actived: sku_level === index - 0 + 1}" @tap="setTag(index - 0 + 1)" v-for="(item, index) in info.sku_level" :key="index">
					{{item.title}}
				</view> -->
			</view>
			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<view v-for="(item, index) in list" class="item-scope">
					
						<view class="user-c">
							<image :src="item.headimg" mode="aspectFill" class="headimg"></image>
							<view class="sku-title">{{item.text}}</view>
						</view>
						
						<view class="sku-c">
							<view class="time">{{item.created_at}}</view>
							<view style="flex-grow: 1"></view>
							<view class="shang-title" :class="'shang-title' + item.sku_level">{{getLevelTitle(item.sku_level)}}</view>
							<!-- <view class="total">第{{item.open_indexs}}抽</view> -->
						</view>
						
					</view>
					<NoData v-if="!list.length && isInit"></NoData>
				</view>
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
				total: 0,
				page: 1,
				perPage: 20,
				sku_level: '',
				sku_levelList:[5,4,3,2,1]
			}
		},
		props: {
			info: {
				type: Object
			},
		},
		computed: {
			tagList () {
				return this.info.skus.filter(item => {
					return item.shang_type === 0
				}).map(item => {
					return {
						title: item.shang_title,
						id: item.id
					}
				}).slice(0, 3)
			}
		},
		watch: {
			payTotal() {
				this.initOrder()
			},
			sku_level () {
				this.page = 1
				this.list = []
				this.fetchList()
			}
		},
		created() {
			this.initData()
		},
		methods: {
			getLevelTitle (level) {
				if(level) {
					return this.info.sku_level[level - 1].title
				}
			},
			setTag (tag) {
				this.sku_level = tag 
			},
			initData() {
				uni.showLoading({
					title: '加载中'
				})

				this.fetchList().then(res => {
					uni.hideLoading()
				})
			},
			fetchList() {
				
				return this.$http(`/danmus/fudai_detail`, 'GET', {
					node_id: this.info.id,
					sku_level: this.sku_level,
					page: this.page,
					per_page: this.perPage
				}).then(res => {
					this.list = [...this.list, ...res.data.list]
					console.log(this.list, 'list')
					this.isInit = true
					this.page++
				})

			},
			cancel() {
				this.$emit('close')
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>

	.scroll-view {
		min-height: 60vh;
	    max-height: 100vh;
	}
	
	.tag-list {
		display: flex;
		margin-top: 20rpx;
		padding-bottom: 20rpx;
		.item {
			border-radius: 15rpx;
			border: 2rpx solid #e1e1e1;
			color: #fff;
			width: 90rpx;
			line-height: 45rpx;
			text-align: center;
			margin: 0 10rpx;
			font-size: 26rpx;
			
			&.actived {
				background: #531e86;
				border: 2rpx solid #a747cd;
				box-shadow: 0 0 5px 2px #a747cd;
				text-shadow: 1px 1px 2px #a747cd, -1px 1px 2px #a747cd, -1px -1px 2px #a747cd, 1px -1px 2px #a747cd;
			}
		}
	}

	.list-scope {
		margin: 0rpx 10rpx;

		.item-scope {
			position: relative;
		    background: white;
		    border-radius: 25rpx;
		    padding: 30rpx 20rpx;
			margin-bottom: 20rpx;
		
			.user-c {
				display: flex;
				align-items: center;
				.headimg {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
				}
				
				.sku-title {
					font-size: 30rpx;
					text-align: left;
					margin-left: 10rpx;
					width: calc(100% - 60rpx);
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
		
			}
			
			.sku-c {
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				
				.thumb {
					width: 40rpx;
					height: 40rpx;
					border: 1rpx solid #e1e1e1;
					max-width: 400rpx;
				}
				
				.shang-title {
					font-size: 28rpx;
					font-weight: 500;
					&.strong {
						background:  #FCF6D8;
						color: #F58348;
						padding: 4rpx 10rpx;
						font-size: 24rpx;
						border-radius: 6rpx;
						margin-left: 10rpx;
						
					}
					&.shang-title1 {
						color: #4ada39;
   					    text-shadow: 1px 1px 3px #afffa5;
					}
					&.shang-title2 {
						color: #4fb4fc;
   					    text-shadow: 1px 1px 3px #68f1fb;
					}
					&.shang-title3 {
						color: #3746ff;
   					    font-size: 30rpx;
   					    text-shadow: 1px 1px 3px #73a5ff;
					}
					&.shang-title4 {
						color: #781dff;
   					    font-size: 30rpx;
   					    text-shadow: 1px 1px 3px #b786ed;
					}
					&.shang-title5 {
						color: #d5a826;
   					    font-size: 30rpx;
   					    text-shadow: 1px 1px 3px #fae869;
					}
				}
				
				.time {
					font-weight: 500;
					font-size: 28rpx;
					color: #999;
				}
				
				.total {
					margin-left: 20rpx;
				}
				
				
			}
		}
	}
</style>
