<template>
	<view class="tag-container">
		<view class="tag-list">
			<view class="item"  @tap="$tool.toPage(`/pages/topic/topicList?title=${item.title}&tagId=${item.id}`)" v-for="(item, index) in tagList">
				<image mode="aspectFill" class="thumb" :src="item.thumb"></image>
				<view class="title">#{{item.title}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				tagList: []
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
				return this.$http('/topic-tags', 'GET', {
					'per_page': 1000
				}).then(res => {
					this.tagList = res.data.list
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.tag-container {

		.tag-list {
			width: 100%;
			padding: 0rpx 30rpx 60rpx 30rpx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				margin-top: 20rpx;
				box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
				padding: 10rpx 12rpx;
				border-radius: 20rpx;
				align-items: center;
				flex-direction: column;

				.thumb {
					width: 198rpx;
					height: 238rpx;
					border-radius: 40rpx;
				}

				.title {
					font-size: 26rpx;
					font-weight: 500;
					color: #000000;
					line-height: 40rpx;
					margin-top: 10rpx;
					text-align: center;
					width: 200rpx;
					text-align: center;

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
			}
		}

	}
</style>
