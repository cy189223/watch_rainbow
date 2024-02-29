<template>
	<view class="container">
		<view class="login-bg">
			<image :src="bgImage" mode="aspectFill"></image>
		</view>
		<view class="logo-c">
			<image class="logo" mode="widthFix" :src="logo"></image>
		</view>
		<view class="button-c">

			<button class="button" lang="zh_CN" @tap="wechatLogin">微信登录</button>

			<button class="button apple-login-btn" lang="zh_CN" v-if="isIos" @tap="appleIdLogin">通过Apple登陆</button>

			<view class="stop-login-c" @tap="stopLogin">暂不登陆</view>
		</view>

		<GetPhonePopup v-if="isShowPhonePopup" @success="getPhoneNumberSuccess" @cancel="isShowPhonePopup=false">
		</GetPhonePopup>

	</view>
</template>

<script>
	import {
		$getStorage
	} from "@/utils/auth.js";

	export default {
		name: "login",
		components: {
		},
		data() {
			return {
				code: '',
				params: {},
				isShowPhonePopup: false,
				dataUuid: '',
				loginMethod: ''
			}
		},
		created() {},
		onShow() {
			let token = $getStorage('token')
			if (token) {
				// console.log(token)
				uni.navigateBack({
					delta: 1
				})
			}
		},
		computed: {
			logo() {
				return this.$store.getters.setting.login_page.logo || ''
			},
			bgImage() {
				return this.$store.getters.setting.login_page.bg_image || ''
			},
			isIos() {
				return uni.getSystemInfoSync().platform == 'ios'
			}
		},
		methods: {
			wechatLogin() {
				this.loginMethod = 'wechat'
				uni.login({
					success: res => {
						console.log('get wechat login res', res)
						this.$store.dispatch("login", {
							type: 'app/with-wechat',
							params: {
								"access_token": res.authResult.access_token,
								"openid": res.authResult.openid
							}
						}).then(res => {
							uni.hideLoading()

							console.log('res =====>', res)

							// 需要手机号
							if (res.data.is_need_phone_number || res.data.is_need_phone) {

								this.isShowPhonePopup = true
								this.dataUuid = res.data.data_uuid

							} else if (res.data.token) {
								this.$store.dispatch("getUserInfo");

								uni.navigateBack({
									delta: 1
								})

							}
						})

					},
					fail: err => {}
				})
			},
			stopLogin() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			getPhoneNumberSuccess(data) {
				this.params = {
					data_uuid: this.dataUuid,
					phone: data.phone,
					phone_code: data.phone_code,
				}

				this.submitLogin(this.params)
			},
			appleIdLogin() {
				this.loginMethod = 'apple'
				uni.login({  
				    provider: 'apple',  
				    success: (loginRes) => {  
				        // 登录成功  
				        uni.getUserInfo({  
				            provider: 'apple',  
				            success: (userInfo) => {  
				                // 获取用户信息成功  
								
								let idToken = userInfo.identityToken
								
								this.$store.dispatch("login", {
									type: 'app/with-apple-id',
									params: {
										"identity_token": idToken
									}
								}).then(res => {
									uni.hideLoading()
								
									console.log('res =====>', res)
								
									// 需要手机号
									if (res.data.is_need_phone_number || res.data.is_need_phone) {
								
										this.isShowPhonePopup = true
										this.dataUuid = res.data.data_uuid
								
									} else if (res.data.token) {
										this.$store.dispatch("getUserInfo");
								
										uni.navigateBack({
											delta: 1
										})
								
									}
								})
								
					        }  
				        })  
				    },  
				    fail: function (err) {  
						console.log(err)
				        uni.showToast({
				        	title: '登陆失败',
							icon: 'none'
				        })
				    }  
				});  
			
			},
			submitLogin(params) {
				let type = this.loginMethod === 'wechat' ? 'app/with-wechat' : 'app/with-apple-id'

				uni.showLoading({
					title: "登录中"
				})

				return this.$store.dispatch("login", {
					type: type,
					params: params
				}).then(res => {
					uni.hideLoading()

					console.log('res =====>', res)

					// 需要手机号
					if (res.data.is_need_phone_number || res.data.is_need_phone) {

						this.isShowPhonePopup = true
						this.dataUuid = res.data.data_uuid

						// 重新获取code
						if (this.loginMethod === 'wechat') {
							this.getCode()
						}
					} else if (res.data.token) {
						this.$store.dispatch("getUserInfo");

						uni.navigateBack({
							delta: 1
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.contaier {
		overflow: hidden;
	}

	.apple-login-btn {
		margin-top: 20rpx;
	}

	.stop-login-c {
		color: white;
		margin-top: 30rpx;
		text-align: center;
		font-size: 80%;
	}

	.login-bg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		image {
			width: 100%;
			height: 100%;
		}

		.mask {
			position: absolute;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.1);
		}
	}

	.logo-c {
		margin: 400rpx auto;
		text-align: center;
	}

	.logo {
		width: 286rpx;
	}

	.button-c {
		position: fixed;
		bottom: 200rpx;
		left: 0rpx;
		width: 100%;

	}

	.button {
		width: 600rpx;
		height: 96rpx;
		background: #FFFFFF;
		box-shadow: 0px 18rpx 30rpx 0px rgba(255, 187, 42, 0.7);
		border-radius: 10rpx;
		font-size: 32rpx;
		line-height: 96rpx;
		color: #333;
		font-weight: 500;

		&:after {
			border: none;
		}
	}
</style>
