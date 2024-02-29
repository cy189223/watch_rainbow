<template>
	<view class="container safe-area-bottom">
		<view class="exit-btn" hover-class="hover" @tap="handleLogout">
			退出登陆
		</view>
		<view class="headimg-c">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image :src="form.headimg != ''? form.headimg:userInfo.headimg"></image>
			</button>
		</view>
		<view class="info-c">
			<view class="item">
				<view class="key">姓名</view>
				<input v-model="form.name"  @blur="changeName" type="nickname"></input>
			</view>
			<view class="item">
				<view class="key">姓别</view>
				<picker mode="selector" @change="selectGender" :range="gender">
					<view class="uni-input">{{gender[genderIndex]}}</view>
				</picker>
			</view>
			<view class="item">
				<view class="key">城市</view>
				<input v-model="form.city"></input>
			</view>
			<view class="item">
				<view class="key">手机</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="userInfo.phone" class="phone-c">
					<button class="get-phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" hover-class="hover">
						更换
					</button>
					{{userInfo.phone}}
				</view>
				<button v-else class="get-phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" hover-class="hover">
					点击获取
				</button>
				<!-- #endif -->
				
				<!-- 使用自定义实现的弹窗 -->
				<!-- #ifndef MP-WEIXIN -->
				<view v-if="userInfo.phone" class="phone-c">
					<button class="get-phone-btn" @tap="startGetPhone" hover-class="hover">
						更换
					</button>
					{{userInfo.phone}}
				</view>
				<button v-else class="get-phone-btn" @tap="startGetPhone" hover-class="hover">
					点击获取
				</button>
				<!-- #endif -->
			</view>
		</view>
		<view class="button-c">
			<button class="submit-btn" @click="updateProfile">
				<text>保存</text>
			</button>
		</view>
		
		<GetPhonePopup v-if="isShowPhonePopup" @success="getPhoneNumberSuccess" @cancel="isShowPhonePopup=false"></GetPhonePopup>
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import {
		$getStorage
	} from "@/utils/auth.js";
	// import IButton from "@/components/Button/index.vue"
	export default {
		components: {
			// IButton
		},
		data() {
			return {
				gender: ['男', '女'],
				genderIndex: 0,
				code: '',
				isShowPhonePopup: false,
				form: {
					name: '',
					headimg:'',
					phone: '',
					city: '',
					gender: '',
					email: '',
					birthday: '',
				},
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		watch: {
			userInfo () {
				this.initForm()
			}
		},
		created() {
			
			// #ifndef APP-PLUS
			uni.login({
				success: res => {
					this.code = res.code
				},
				fail: err => {}
			})
			// #endif
			
		},
		async onLoad() {
			
			this.$store.dispatch("getUserInfo")

			this.initForm()
		},
		methods: {
			handleLogout () {
				uni.showModal({
					title: '确定要退出登录吗?',
					confirmText: '退出登录',
					cancelText: '暂不',
					success: (res) => {
						if (res.confirm) {
							this.$store.dispatch("logout")
							uni.showToast({
								title: '已退出登陆，跳转中~',
								icon: 'none'
							})
							
							setTimeout(() => {
								this.toLoginPage()
							}, 1800)
						}
					}
				})
			},
			startGetPhone () {
				this.isShowPhonePopup = true
			},
			getPhoneNumberSuccess(data) {
				this.$http('/phone-update/with-code', 'POST', {
					phone: data.phone,
					phone_code: data.phone_code
				}).then(res => {
					this.$store.dispatch("getUserInfo")
				
					uni.showToast({
						title: '手机号更新成功~',
						icon: 'none'
					})
					
					this.isShowPhonePopup = false
				})
			},
			initForm() {
				this.form.name = this.userInfo.name
				this.form.headimg = this.userInfo.headimg
				this.form.phone = this.userInfo.phone
				this.form.city = this.userInfo.city
				this.form.gender = this.userInfo.gender
				this.form.email = this.userInfo.email
				this.form.birthday = this.userInfo.birthday
				
				this.genderIndex = this.userInfo.gender === '男' ? 0 : 1
			},
			changeName(e) {
				this.form.name = e.detail.value;
				let str = this.form.name.trim();
				if (str.length == 0) {
					uni.showToast({
						title:'请输入合法的姓名',
						icon:'none'
					})
					return
				}
			},
			
			onChooseAvatar(e) {
				let that = this
				this.form.headimg = e.detail.avatarUrl
				uni.uploadFile({
					url: that.$configindex.BASE_URL + '/upimage', //仅为示例，非真实的接口地址
					filePath: that.form.headimg,
					name: 'image',
			    	header: {
		    			Authorization: $getStorage('token')
		    		},
					formData: {
						'user': 'test'
					},
					success: (res) => {
						if (res) {
							that.form.headimg = JSON.parse(res.data).data.image.url;
						}
					}
				});
			},
			
 			updateProfile() {
				uni.showLoading({
					title: "更新中"
				})
				this.$http({
					url: '/user',
					method: 'PUT',
					data: this.form
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '更新成功，跳转中~',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1300)
				})
			},
			selectBirthday(e) {
				this.form.birthday = e.detail.value
			},
			selectGender(e) {
				this.genderIndex = e.detail.value
				this.form.gender = this.gender[this.genderIndex]
			},
			getPhoneNumber(e) {
				if (!e.detail.encryptedData) return

				console.log('eeee', e)
				this.$http('/phone-update/with-miniapp', 'POST', {
					encrypt_data: e.detail.encryptedData,
					iv: e.detail.iv,
					code: this.code
				}).then(res => {
					this.$store.dispatch("getUserInfo")

					uni.showModal({
						title: '手机号更新成功~',
						icon: 'none'
					})
					
					uni.login({
						success: res => {
							this.code = res.code
						},
						fail: err => {}
					})
				})
			},
		},
		onShow() {},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>
<style lang="scss">
	page {
		background: white;
	}
</style>
<style lang="scss" scoped>
	.exit-btn {
		background: #f1f1f1;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		position: fixed;
		right: 30rpx;
		top: 30rpx;
		border-radius: 50rpx;
		padding: 6rpx 20rpx;
	}
	
	.phone-c {
		display: flex;
		align-items: center;
		
		.get-phone-btn {
			font-size: 24rpx;
			margin-right: 20rpx;
		}
	}
	.submit-btn {
		background: #6938b6;
		border-radius: 100rpx;
		width: 90%;
		color: white;
	}

	.gray-text {
		color: #979797;
	}

	.get-phone-btn {
		background: #6938b6;
		font-size: 26rpx;
		border-radius: 100px;
		line-height: 50rpx;
		color: white;
		min-width: 100rpx;
		padding: 0rpx 20rpx;
		height: 50rpx;

		&::after {
			display: none;
		}
	}

	.container {
		background: white;
		position: fixed;
		width: 100%;
		height: 100%;

		.headimg-c {
			height: 300rpx;
			background: white;
			text-align: center;
			padding-top: 60rpx;
			box-sizing: border-box;
			
			.avatar-wrapper {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				padding: 0;
			}
			
			.avatar-wrapper::after {
				border: none;
			}

			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}
		}

		.info-c {
			padding: 0rpx 30rpx;

			.item {
				background: white;
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				padding: 28rpx 8rpx;
				border-bottom: 1px solid #eee;

				.key {
					flex-grow: 1;
					display: inline-block;
					font-weight: 700;
					min-width: 200rpx;
				}

				input,
				.input-text {
					text-align: right;
					font-weight: 400;
					color: #393939;
				}
			}

			.birthday-input {
				.gray-text {
					color: gray;
					font-weight: 400;
				}
			}
		}

		.button-c {
			width: 100%;
			margin: 100rpx auto;
			
			.submit-btn {
				margin: 0 auto;
				&::after {
					display: none;
				}
			}
			
		}
	}
</style>
