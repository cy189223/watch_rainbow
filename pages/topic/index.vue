<template>
	<view class="container">
		<view class="group-c">
			<view class="group-list global-shadow">
				<view class="item" hover-class="hover"  @tap="$tool.toPage(`/pages/topic/topicList?title=${item.title}&groupId=${item.id}`)" v-for="(item, index) in groupList">
					<image mode="aspectFill" class="thumb" :src="item.thumb"></image>
					<view class="title">{{item.title}}</view>
					<view class="total">{{item.onstock_topics_count}}条动态</view>
				</view>
				<view class="item" @tap="$tool.toPage('/pages/topic/groupList')">
					<image mode="aspectFill" class="thumb" src="@/static/topic/add.png"></image>
					<view class="title">更多圈子</view>
					<view class="total">更多动态</view>
				</view>
			</view>
		</view>

		<view class="topic-item-title">
			<cardTitle title="热门话题" link="/pages/topic/tagList" :isShowMore="true" leftIcon="https://cdn2.hquesoft.com/box/icon/tag.png" cssStyle="margin: 0rpx 30rpx"></cardTitle>
		</view>
		
		<scroll-view class="tag-c" scroll-x>
			<view class="tag-list">
				<view class="item"  hover-class="hover"  @tap="$tool.toPage(`/pages/topic/topicList?title=#${item.title}&tagId=${item.id}`)" v-for="(item, index) in tagList">
					<image mode="aspectFill" class="thumb" :src="item.thumb"></image>
					<view class="title">#{{item.title}}</view>
				</view>
			</view>
		</scroll-view>

		<view class="topic-item-title">
			<cardTitle title="最新动态" link="/pages/topic/topicList" :isShowMore="true" leftIcon="https://cdn2.hquesoft.com/box/icon/topic.png" class="topic-item-title" cssStyle="margin: 0rpx 30rpx"></cardTitle>
		</view>
		<view class="topic-list">
			<topicItem class="item" :info="item" v-for="(item, index) in topicList"></topicItem>
			<NoMore></NoMore>
		</view>

		<image v-if="isShowCreateBtn" class="publish-btn" @tap="$tool.toPage('/pages/topic/create')" src="@/static/topic/publish.png"></image>
	</view>
</template>

<script>
	import topicItem from "./components/topicItem.vue"
	export default {
		components: {
			topicItem
		},
		data() {
			return {
				groupList: [],
				tagList: [],
				topicList: [],
				page: 1,
				isLoading: false
			}
		},
		computed: {
			title () {
				return this.$store.getters.setting.topic_home.title || '未设置'
			},
			isShowCreateBtn () {
				return this.$store.getters.setting.topic_home.is_show_create_btn
			}
		},
		watch: {
			title(val) {
				uni.setNavigationBarTitle({
					title: this.title
				})
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.title
			})
			
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
				this.$http('/topic-groups', 'GET', {
					'per_page': 4
				}).then(res => {
					this.groupList = res.data.list
				})

				this.$http('/topic-tags', 'GET', {
					'per_page': 8
				}).then(res => {
					this.tagList = res.data.list
				})
				
				
				this.getMoreTopicList()
			},
			getMoreTopicList() {
				if (this.loading) {
					return false
				}
				
				this.loading = true 
				return this.$http('/topics', 'GET', {
					'per_page': 10,
					'page': this.page
				}).then(res => {
					this.topicList = this.topicList.concat(res.data.list)
					this.loading = false
					this.page ++
					uni.hideLoading()
				})
			},
			likeOrCancel(e) {
				let index = e.index
				let item = this.topicList[index]
				this.topicList[index].is_liked = !this.topicList[index].is_liked
				
				this.$http(`/topics/${item.uuid}/actions`, 'POST', {
					'type': 'like_or_cancel'
				})
			}
		},
		onReachBottom () {
			this.getMoreTopicList()
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.container {
		.topic-item-title {
			position: -webkit-sticky;
			position: sticky;
			top: -20rpx;
			background: white;
			padding: 30rpx 0rpx;
			z-index: 100;
		}

		.topic-list {
			padding: 0rpx 30rpx;

			.item {
				padding-bottom: 20rpx;
				margin-bottom: 50rpx;
				border-bottom: 1rpx solid #E7E7E7;
			}
		}

		.tag-c {
			width: 100%;
			white-space: nowrap;

			.tag-list {
				width: 100%;
				padding: 0rpx 0rpx 60rpx 0rpx;
				display: flex;
				margin-left: 30rpx;

				.item {
					box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
					padding: 10rpx 12rpx;
					border-radius: 20rpx;
					align-items: center;
					flex-direction: column;
					margin-right: 16rpx;

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

		.group-c {
			width: 100%;
			background-image: linear-gradient(#6938b6, #fff);
			padding: 10rpx 30rpx 0rpx 30rpx;
			box-sizing: border-box;

			.group-list {
				display: flex;
				background: white;
				border-radius: 20rpx;
				justify-content: space-around;
				padding: 20rpx 0rpx;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.thumb {
						width: 88rpx;
						height: 88rpx;
						border-radius: 50%;
					}

					.title {
						font-size: 22rpx;
						font-weight: 500;
						color: #000000;
						line-height: 26rpx;
						margin-top: 6rpx;
					}

					.total {
						font-size: 18rpx;
						font-weight: 500;
						color: #999999;
						line-height: 26rpx;
						margin-top: 8rpx;
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
