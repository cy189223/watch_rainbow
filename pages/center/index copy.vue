<template>
	<view class="container">
		<image class="center-bg" src="/static/center-bg.png" mode="aspectFill"></image>
		<view class="header" :style="'padding-top:'+deviceInfo.customBar+'px'">
			<view class="headimg">
				<image :src="avatar" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<view class="u-name">
					<text>{{userName}}</text>
				</view>
			</view>
			<button class="contact-btn" open-type="contact">联系客服</button>
		</view>

		<view class="section">
			<view class="data-list">
				<view class="item" @tap="gotoMyScore">
					<view class="value">{{userInfo.score || 0}}</view>
					<view class="text">幸运值</view>
				</view>
				<view class="item"  @tap="gotoMyRedpack">
					<view class="value"><span class="small">￥</span>{{(userInfo.redpack || 0) / 100}}</view>
					<view class="text">{{$money()}}</view>
				</view>
				<view class="item" @tap="gotoMyInvitee">
					<view class="value">{{userInfo.invitees_count || 0}}<span class="small">人</span></view>
					<view class="text">邀请好友</view>
				</view>
			</view>
			
			<view class="banner-c">
				<navigator url="/pages/shareRule/index">
					<img mode="widthFix" src="https://loz.oss-cn-qingdao.aliyuncs.com/banner.png"></img>
				</navigator>
			</view>
			
			<view class="list">
				<navigator class="list-item" hover-class="hover" url="/pages/myBox/index" open-type="switchTab">
					<view class="icon">
						<image src="/static/center/icon1.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">抽盒订单</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator>
				<navigator class="list-item" hover-class="hover" url="/pages/orderList/index">
					<view class="icon">
						<image src="/static/center/icon2.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">商品订单</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator>
				<navigator class="list-item" hover-class="hover" url="/pages/cart/index">
					<view class="icon">
						<image src="/static/center/icon2.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">购物车</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator>
				<navigator class="list-item" hover-class="hover" url="/pages/myCoupons/index">
					<view class="icon">
						<image src="/static/center/icon3.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">优惠券</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator>
				<navigator class="list-item" hover-class="hover" url="/pages/myAddress/index">
					<view class="icon">
						<image src="/static/center/icon4.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">收货地址</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator>
			</view>

			<view class="list" style="margin-top: 24rpx;">
				<navigator class="list-item" hover-class="hover" url="/pages/deal/index">
					<view class="icon">
						<image src="/static/center/icon5.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">协议与规则</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator>
				<!-- <navigator class="list-item" hover-class="hover" url="/pages/rule/index">
					<view class="icon">
						<image src="/static/center/icon6.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">规则</text>
						<text class="iconfont icon-on-right"></text>
					</view>
				</navigator> -->
				<view class="list-item">
					<view class="icon">
						<image src="/static/center/icon7.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">音效</text>
						<switch :checked="personalSettings.music" color="#FFCC33" style="transform:scale(0.7)" data-key="music" @change="change" />
					</view>
				</view>
				<view class="list-item">
					<view class="icon">
						<image src="/static/center/icon8.png" mode="aspectFit"></image>
					</view>
					<view class="body">
						<text class="text">弹幕</text>
						<switch :checked="personalSettings.danmu" color="#FFCC33" style="transform:scale(0.7)" data-key="danmu" @change="change" />
					</view>
				</view>
			</view>
		</view>
		<button v-if="!isLogin" class="no-login-mask" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo"></button>
		<FloatBtn v-else></FloatBtn>
	</view>
</template>

<script>
	import FloatBtn from "@/components/FloatBtn/index.vue"
	import {
		mapGetters
	} from "vuex"
	export default {
		name: "center",
		components: {
			FloatBtn
		},
		data() {
			return {
				code: '',
				init: false
			}
		},
		computed: {
			...mapGetters(["deviceInfo", "userInfo", "token", "personalSettings"]),
			isLogin() {
				return this.token ? true : false
			},
			userName() {
				return this.token ? this.userInfo.name : "点击登录"
			},
			avatar() {
				return this.token ? this.userInfo.headimg : "/static/toux.png"
			}
		},
		onLoad() {
			uni.login({
				success: res => {
					this.code = res.code
				},
				fail: err => {
				}
			})
			
			this.$store.dispatch("visitor", {
				page: {
					type: "center"
				}
			})
		},
		async onShow() {
			if (this.token) {
				await this.$store.dispatch("getUserInfo")
			}
		},
		methods: {
			gotoMyInvitee() {
				uni.navigateTo({
					url: "/pages/myInvitees/index"
				})
			},
			gotoMyScore() {
				uni.navigateTo({
					url: "/pages/myScore/index"
				})
			},
			gotoMyRedpack() {
				uni.navigateTo({
					url: "/pages/myRedpack/index"
				})
			},
			change(e) {
				this.$store.dispatch("setPersonalSettings", {
					key: e.currentTarget.dataset.key,
					value: e.detail.value
				})
			},
			async getuserinfo(e) {
				if (!e.detail.encryptedData) return
				uni.showLoading({
					title: "登录中",
					mask: true
				})
				await this.$store.dispatch("login", {
					e: e, 
					code: this.code,
				}).catch(err => {
					uni.hideLoading()
				});
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f8fc;
	}

	.container {
		position: relative;
	}

	.center-bg {
		width: 100%;
		height: 380rpx;
		position: absolute;
		z-index: -1;
	}

	.header {
		padding: 0 24rpx;
		display: flex;
		align-items: center;

		.headimg {
			width: 124rpx;
			height: 124rpx;
			border-radius: 50%;
			background-color: #fff;
			padding: 6rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.user-info {
			margin-left: 20rpx;
			flex-grow: 1;

			.u-name {
				// margin-top: 10rpx;
				// font-size: 32rpx;
				// line-height: 32rpx;
				font-size: 38rpx;
				font-weight: bold;
				letter-spacing: 1px;
			}

			.meta {
				display: flex;
				margin-top: 24rpx;

				view {
					width: 150rpx;
					display: flex;
					flex-direction: column;

					.text {
						font-size: 24rpx;
						color: #c4c5de;
					}

					.num {
						font-weight: bold;
					}
				}
			}
		}
		
		.contact-btn {
			font-size: 26rpx;
			border-radius: 70rpx;
		}
	}

	.section {
		margin-top: 16rpx;
		padding: 24rpx;
		
		.banner-c {
			margin: 10px 2px;
			img {
				width: 100%;
			}
		}
		
		.data-list {
			display: flex;
			background: white;
			align-items: center;
			margin-bottom: 10rpx;
			border-radius: 16rpx;
			box-shadow: 0 0 30rpx rgba(231, 238, 253, 0.9);
			padding: 20rpx;
			.item {
				flex-grow: 1;
				text-align: center; 
				
				.text {
					// color: gray;
					font-size: 26rpx;
				}
				
				.value {
					font-size: 40rpx;
					font-weight: 700;
				}
				.small {
					font-size: 26rpx;
					// color: red;
				}
			}
		}

		.list {
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0 0 30rpx rgba(231, 238, 253, 0.9);
			overflow: hidden;

			.list-item {
				height: 98rpx;
				display: flex;
				align-items: center;

				&.hover {
					background-color: #f3f3f3;
				}

				&:last-child .body {
					border-bottom: none;
				}

				.icon {
					width: 80rpx;
					display: flex;
					justify-content: center;

					image {
						width: 30rpx;
						height: 30rpx;
					}
				}

				.body {
					height: 100%;
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #f3f3f3;
					box-sizing: border-box;

					.text {
						font-size: 28rpx;
						font-weight: bold;
					}

					.icon-on-right {
						color: #c4c5de;
						margin-right: 10rpx;
					}
				}
			}
		}
	}

	.no-login-mask {
		padding: 0;
		margin: 0;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		height: 100%;
		background-color: transparent;
		border-radius: 0;

		&:after {
			border: none;
		}
	}
</style>
