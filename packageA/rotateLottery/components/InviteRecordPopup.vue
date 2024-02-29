<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated fadeInDown" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">我的邀请记录</view>
			
			<scroll-view scroll-y class="record-list">
				<view class="item" v-for="(item, index) in list">
					<template v-if="item.user">
						<image class="left headimg" :src="item.user.headimg"></image>
						<view class="body">
							<view class="name">{{item.user.name}}</view>
							<view class="time">{{item.created_at}}</view>
						</view>
						<view class="right">
							<view class="index">NO.{{list.length - index}} </view>
						</view>
						</template>
				</view>
				<view style="padding-top: 50rpx;" v-if="!list.length">
					<NoData></NoData>
				</view>
			</scroll-view>

			<view class="btn-c">
				<button open-type="share" class="btn share-btn cancel">转发给好友</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				list: []
			}
		},
		props: {
			node: {
				type: Object
			}
		},
		computed: {},
		watch: {
		},
		created() {
			this.initList()
		},
		methods: {
			initList () {
				this.$http('/activity/invite-records', 'GET', {
					node_uuid: this.node.uuid
				}).then(res => {
					this.list = res.data.list
				})
			},
			toMyBox() {
				uni.switchTab({
					url: '/pages/myBox/index'
				})
			},
			cancel() {
				this.$emit('cancel')
			},
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
		background-color: #DB5B4E;
		border-radius: 20rpx;
		padding: 60rpx 0rpx 0rpx 0rpx;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	
		.close-btn {
			position: absolute;
			right: 26rpx;
			top: 26rpx;
	
			color: #333;
		}
	
		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #F6F1C9;
			letter-spacing: 6rpx;
			margin-bottom: 50rpx;
			position: relative;
			
			&:after, &:before {
				position: absolute;
				top: 50%;
				background: #ddd;
				content: "";
				height: 1px;
				width: 50rpx;
			}
			&:before {
				left: 140rpx;
			}
			&:after {
				right: 140rpx;
			}
		}
		
		.record-list {
			background: white;
			height: 700rpx;
			width: 100%;
			
			.item {
				display: flex;
				padding: 10px;
				margin: 10px;
				background: white;
				border-radius: 6rpx;
				align-items: center;
				border-bottom: 1rpx solid #f1f1f1;
			
				.left {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 18rpx;
				}
			
				.body {
					flex-grow: 1;
			
					.name {
						font-weight: 700;
					}
			
					.time {
						color: gray;
						font-size: 26rpx;
					}
				}
			
				.right {
					.plus {
						color: red;
					}
			
					.number {
						color: red;
						font-size: 45rpx;
					}
				}
			}
		}
	
		.btn-c {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 40rpx 50rpx 40rpx;
			background: white;
	
			.btn {
				padding: 0;
				margin: 10rpx 0rpx 0rpx 0rpx;
				width: 100%;
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
				
				&.share-btn {
					background: #DB5B4E;
				}
			}
		}
	}
</style>
