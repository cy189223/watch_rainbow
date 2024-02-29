<template>
		<view >
			<view class="tag-list">
				<view class="item" :class="{actived: tag === 'all'}" @tap="setTag('all')">全部</view>
				<view class="item" :class="{actived: tag === item.id}" @tap="setTag(item.id)" v-for="(item, index) in tagList">
					{{item.title}}
				</view>
			</view>
			<scroll-view scroll-y class="scroll-view" @scrolltolower="fetchList">
				<view class="list-scope">
					<view v-for="(item, index) in list" class="item-scope">

						<view class="user-c">
							<image :src="item.user && item.user.headimg" mode="aspectFill" class="headimg"></image>
							<view class="name">{{item.user && item.user.name}}</view>
							<view class="time">{{$tool.formatDate(item.created_at, 'MM/dd hh:mm:ss')}}</view>
						</view>
						
						<view class="sku-c">
							<image :src="item.thumb" mode="aspectFit" class="thumb"></image>
							<view class="sku-title">{{item.title}}</view>
							<view style="flex-grow: 1"></view>
							<view class="shang-title strong" style="margin-right: 10rpx;" v-if="item.is_free_order">免单</view>
							<view class="shang-title" :class="{strong: item.options.shang_type === 1}">{{item.options.shang_title}}</view>
							<view class="total">x{{item.total}}</view>
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
				tag: 'all'
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
			tag () {
				this.page = 1
				this.list = []
				this.fetchList()
			}
		},
		created() {
			this.initData()
		},
		methods: {
			getlist () {
				this.page = 1
				this.list = []
				this.fetchList()
			},
			setTag (tag) {
				this.tag = tag 
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
				if (this.isLoading)
					return false

				this.isLoading = true

				return this.$http(`/yifanshang/records`, 'GET', {
					room_id: this.room.id,
					page: this.page,
					per_page: this.perPage,
					tag: this.tag
				}).then(res => {
					this.isInit = true
					this.list = this.list.concat(res.data.list)
					this.isLoading = false
					this.page++
					this.total = res.data.item_total
				}).catch(err => {
					this.isInit = false
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
					width: 40rpx;
					height: 40rpx;
					flex: 0 0 40rpx;
					border-radius: 50%;
				}

				.name {
					font-weight: 500;
					font-size: 28rpx;
					flex-grow: 1;
					margin-left: 10rpx;
				}
				.time {
					font-weight: 500;
					font-size: 28rpx;
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
				}
				
				.total {
					margin-left: 20rpx;
				}
				
				.sku-title {
					font-size: 28rpx;
					font-weight: 500;
					text-align: left;
					margin-left: 10rpx;
					max-width: 410rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
</style>
