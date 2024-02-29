<template>
	<view class="scope-container">
		<TextNavBar title="动态详情"></TextNavBar>
		<image mode="widthFix" class="header-image" src="https://cdn2.hquesoft.com/box/header-bg.png"></image>

		<view class="detail">
			<view class="top">
				<template v-if="info.user">
					<image mode="aspectFill" class="headimg" :src="info.user.headimg"></image>
					<view class="name-c">
						<view class="name">{{info.user.name}}</view>
						<view class="time">{{$tool.showShortTime(info.created_at)}}</view>
					</view>
				</template>
				<text class="set-top-text" v-if="info.set_top_at">置顶</text>
				<text class="new-iconfont icon-heart" @tap="likeOrCancel" :class="{actived: isLike}"></text>
			</view>
			<view class='body'>
				<view class="text">{{info.text}}</view>
				<view v-if="info.images && info.images.length" class="image-c" :class="'image-c-' + imageList">
					<image @tap="previewImage(info.images, index)" mode="aspectFill"
						:src="url + '?x-oss-process=image/resize,w_300'" :key="index" v-for="(url, index) in imageList"></image>
				</view>
				<view class="bottom">
					<text class="new-iconfont icon-comment"></text>
					<text class="comment-total">{{commentTotal}}</text>
					<navigator v-if="info.topic_tag" :url="`/pages/topic/topicList?title=#${info.topic_tag.title}&tagId=${info.topic_tag.id}`">
						<view class="tag">#{{info.topic_tag.title}}</view>
					</navigator>
					<view class="brank"></view>
					<text class="new-iconfont icon-more"></text>
				</view>
			</view>
		</view>
		
		<view class="comment-c">
			<view class="title">全部评论 ({{commentTotal}})</view>
			<view class="comment-list">
				<NoData v-if="!commentList.length"></NoData>
				
				<view class="comment-item" v-for="(item, index) in commentList">
					<view class="top">
						<image mode="widthFix" class="headimg" :src="item.user.headimg"></image>
						<view class="name">{{item.user.name}}</view>
					</view>
					<view class="body">
						<view class="parent-comment" v-if="item.parent_comment">
							@{{item.parent_comment.user.name}}: {{item.parent_comment.text}}
						</view>
						<view class="text">{{item.text}}</view>
						<view v-if="item.images.length" class="image-c" :class="'image-c-' + item.images.length">
							<image @tap="previewImage(item.images, index)" mode="aspectFill"
								:src="url + '?x-oss-process=image/resize,w_300'" v-for="(url, index) in item.images"></image>
						</view>
					</view>
					<view class="bottom">
						<view class="comment-btn" @tap="writeComment(item)">回复</view>
						<view class="time">{{$tool.showShortTime(info.created_at)}}</view>
						<text class="new-iconfont icon-more"></text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bottom-c">
			<view class="input-c"  @tap="showCommentPopup">
				<image mode="widthFix" class="headimg" :src="userInfo.headimg"></image>
				<text class="placeholder">写评论吧~</text>
			</view>
		</view>
		
		<commentPopup v-if="isCommentPopup" :placeholder="writeCommentPlaceholder" :parentId="commentId" @commentSuccess="commentSuccess" @cancel="hideCommentPopup"></commentPopup>
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import commentPopup from "./components/commentPopup.vue"
	export default {
		components: {
			commentPopup
		},
		data() {
			return {
				uuid: "",
				info: {},
				isLike: false,
				commentId: '',
				isCommentPopup: false,
				commentList: [],
				commentTotal: 0,
				writeCommentPlaceholder: ''
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			imageList() {
				return this.info.images || []
			},
		},
		watch: {},
		onLoad(e) {
			this.uuid = e.uuid
		},
		onShow() {
			this.initData()
		},
		onPullDownRefresh() {},
		onReachBottom() {},
		methods: {
			// 回复评论
			writeComment (item) {
				// console.log(item)
				this.writeCommentPlaceholder = '回复 ' + item.user.name
				this.commentId = item.id
				this.isCommentPopup = true
			},
			initData() {
				return this.$http(`/topics/${this.uuid}`, 'GET').then(res => {
					this.info = res.data.info
					
					this.isLike = this.info.is_liked
					
					// 加载评论
					this.initCommentList()
				})
			},
			initCommentList () {
				this.$http(`/topics/${this.uuid}/comments`, 'GET').then(res => {
					this.commentList = res.data.list
					
					this.commentTotal = res.data.item_total
				})	
			},
			likeOrCancel() {
				this.isLike = !this.isLike
			
				this.$http(`/topics/${this.uuid}/actions`, 'POST', {
					'type': 'like_or_cancel'
				})
			},
			showCommentPopup () {
				this.commentId = this.info.id
				this.isCommentPopup = true
				this.writeCommentPlaceholder = ''
			},
			hideCommentPopup () {
				this.isCommentPopup = false
			},
			commentSuccess (res) {
				if (res.status == 0) {
					uni.showToast({
						title: '评论已提交，审核后显示~',
						icon: 'none'
					})
				}
				else {
					uni.showToast({
						title: '评论成功~',
						icon: 'none'
					})
				}
				
				this.isCommentPopup = false
				this.initData()
			},
			previewImage (urls, index) {
				uni.previewImage({
					urls: urls,
					current: index
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.scope-container {
		padding-bottom: 200rpx;
	}
	
	.header-image {
		width: 100%;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		z-index: -1;
	}

	.detail {
		padding: 230rpx 30rpx 50rpx 30rpx;
		
		.top {
			display: flex;
			align-items: center;
			justify-content: center;
		
			.headimg {
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
		
			.name-c {
				flex-grow: 1;
		
				.name {
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					margin-bottom: 6rpx;
					width: 400rpx;
				}
		
				.time {
					font-size: 22rpx;
					font-weight: 500;
					color: #8C939B;
				}
			}
		
			.set-top-text {
				margin-right: 20rpx;
				font-size: 22rpx;
				border: 1px solid red;
				color: red;
				padding: 0rpx 10rpx;
				border-radius: 10rpx;
			}
		
			.icon-heart {
				font-size: 40rpx;
				color: #eee;
		
				&.actived {
					color: red;
				}
		
			}
		}
		
		.body {
			.text {
				font-size: 28rpx;
				color: #373C4E;
				line-height: 38rpx;
				padding: 20rpx 0rpx;
				text-align: justify;
			}
		
			.image-c {
				image {
					width: 212rpx;
					height: 174rpx;
					border-radius: 20rpx;
					margin-right: 22rpx;
		
					&:nth-child(3n) {
						margin-right: 0rpx;
					}
				}
		
			}
		}
		
		.bottom {
			font-weight: 500;
			color: #B7BBC3;
			display: flex;
			align-items: center;
			font-size: 36rpx;
			margin-top: 10rpx;
		
			.comment-total {
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		
			.tag {
				padding: 4rpx 20rpx;
				border-radius: 20rpx;
				background-color: #f1f1f1;
				color: #B7BBC3;
				font-size: 20rpx;
				margin-left: 20rpx;
			}
		
			.brank {
				flex: 1;
				height: 1rpx;
			}
		
		}
	}

	.comment-c {
		border-top: 14rpx solid #F8F8F8;
		padding: 30rpx  30rpx;
		.title {
			font-size: 34rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #000000;
		}
		
		.comment-list {
			margin-top: 30rpx;
		}
	}
	
	.comment-item {
		margin-top: 30rpx;
		.top {
			display: flex;
			align-items: center;
			.headimg {
				width: 66rpx;
				height: 66rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.name {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #000000;
			}
		}
		.body {
			padding-left: 80rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			margin: 10rpx 0rpx;
			color: #000000;
			
			.parent-comment {
				background: #F4F5F6;
				border-radius: 6rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #999999;
				padding: 10rpx 10rpx;
				text-align: justify;
			}
			
			.text {
				margin-top: 10rpx;
			}
			
			.image-c {
				margin-top: 20rpx;
				image {
					width: 180rpx;
					height: 130rpx;
					border-radius: 10rpx;
					margin-right: 22rpx;
					
					&:nth-child(3n) {
						margin-right: 0rpx;
					}
				}
					
			}
		}
		
		.bottom {
			display: flex;
			align-items: center;
			padding-left: 70rpx;
			margin-top: 10rpx;
			.comment-btn {
				width: 102rpx;
				height: 48rpx;
				background: #F4F5F6;
				border-radius: 60rpx;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.icon-arrow-right {
					font-size: 38rpx;
					margin-left: -10rpx;
				}
			}
			.time {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #999999;
				line-height: 26rpx;
				margin-left: 20rpx;
				flex-grow: 1;
			}
		}
	}
	
	.bottom-c {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px -14rpx 10rpx 0px rgba(226, 222, 204, 0.1);
		padding: 30rpx 50rpx;
		min-height: 100rpx;
		
		&.popup {
			
		}
		
		.input-c  {
			width: 650rpx;
			height: 64rpx;
			background: #F4F5F6;
			border-radius: 32rpx;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			.headimg {
				width: 52rpx;
				height: 52rpx;
				border-radius: 50%;
			}
			
			.placeholder {
				margin-left: 20rpx;
				font-size: 26rpx;
			}
		}
		
	}
</style>
