<template>
	<view class="group-container">
		<view class="group-c">
			<view class="group-list global-shadow">
				<view class="item"  @tap="$tool.toPage(`/pages/topic/topicList?title=${item.title}&groupId=${item.id}`)" v-for="(item, index) in groupList">
					<image mode="aspectFill" class="thumb" :src="item.thumb"></image>
					<view class="middle">
						<view class="title">{{item.title}}</view>
						<view class="total">{{item.onstock_topics_count}}条动态</view>
					</view>
					<text class="new-iconfont icon-arrow-right"></text>
				</view>
			</view>
		</view>
		<NoMore></NoMore>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				groupList: []
			}
		},
		computed: {},
		watch: {},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				uni.hideLoading()
			})
		},
		onShow() {
			this.initData()
		},
		onPullDownRefresh() {
			this.$showPullRefresh()

			this.initData()
		},
		methods: {
			initData() {
				return this.$http('/topic-groups', 'GET', {
					'per_page': 1000
				}).then(res => {
					this.groupList = res.data.list
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.group-container {
		.group-c {
			width: 100%;
			background-image: linear-gradient(#6938b6, #fff);
			padding: 10rpx 30rpx 0rpx 30rpx;
			box-sizing: border-box;

			.group-list {
				
				background: white;
				border-radius: 20rpx;
				padding: 20rpx 0rpx;

				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					border-bottom: 1rpx solid #f1f1f1;
					padding: 10rpx 20rpx;
					margin-bottom: 20rpx;

					.thumb {
						width: 88rpx;
						height: 88rpx;
						border-radius: 50%;
					}
					
					.middle {
						flex-grow: 1;
						margin-left: 20rpx;
						.title {
							font-size: 28rpx;
							font-weight: 500;
							color: #000000;
							line-height: 26rpx;
							margin-top: 6rpx;
						}
						
						.total {
							font-size: 22rpx;
							font-weight: 500;
							color: #999999;
							line-height: 26rpx;
							margin-top: 8rpx;
						}
					}
					
					.icon-arrow-right {
						font-size: 40rpx;
						color: gray;
					}
				}
			}
		}

		.publish-btn {
			width: 178rpx;
			height: 178rpx;
			position: fixed;
			bottom: 20rpx;
			right: 0rpx;
		}
	}
</style>
