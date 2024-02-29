<template>
	<view class="container">
		<view class="item">
			<view class="item-title">提现方式</view>
			<view class="gateway-list">
				<view class="scope-item" @tap="form.withdraw_type = item" :class="{activited: item === form.withdraw_type}" v-for="item in gatewayList">
					{{typeList[item]}}
				</view>
			</view>
		</view>
		<view class="item">
			<view class="item-title">提现金额(最多{{$tool.formatPrice(maxMoney)}})</view>
			<input class="input" v-model="form.value" placeholder="提现金额" />
		</view>
		<view class="item" v-if="shouldInputAccount">
			<view class="item-title">提现帐号</view>
			<textarea class="text-input input" :placeholder="tipsText" v-model="form.account"></textarea>
		</view>
		<view class="item" v-if="shouldUploadAccountQrcode">
			<view class="item-title">收款码</view>
			<UploadImage mode="single" v-model="form.account_qrcode" :count="1"></UploadImage>
		</view>
		<view class="footer safe-area-bottom">
			<view class="footer-button" @click="submit" hover-class="hover">
				<text>提交提现</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				form: {
					withdraw_type: 'alipay',
					value: 0,
					account: '',
					account_qrcode: ''
				},
				typeList: {
					wechat_pay_auto: '微信零钱',
					wechat_pay: '微信转帐',
					bank: '银行卡转帐',
					alipay: '支付宝'
				},
				setting: {}
			}
		},
		computed: {
			shouldInputAccount () {
				return this.form.withdraw_type === 'bank'
			},
			shouldUploadAccountQrcode () {
				return this.form.withdraw_type === 'wechat_pay' || this.form.withdraw_type === 'alipay'
			},
			gatewayList() {
				return this.setting.withdraw_gateway && this.setting.withdraw_gateway.filter(item => {
					return this.typeList[item]
				}) || []
			},
			userInfo() {
				return this.$store.getters.userInfo
			},
			maxMoney() {
				return this.userInfo.redpack
			},
			tipsText() {
				let map = {
					'alipay': '支付宝帐号 + 姓名',
					'wechat_pay': '微信号',
					'bank': '银行帐号 + 姓名 + 开户行'
				}
				
				return map[this.form.withdraw_type]
			}
		},
		watch: {
		},
		async onLoad() {
			this.$http('/balance/withdraw/detail').then(res => {
				this.setting = res.data.setting || {
					withdraw_gateway: []
				}
				
				if (this.gatewayList.length) {
					this.form.withdraw_type = this.gatewayList[0]
				}
			})
		},
		onShow () {
			this.$store.dispatch("getUserInfo")
		},
		methods: {
			submit () {
				if (this.shouldInputAccount && !this.form.account) {
					uni.showToast({
						title: '请输入' + this.tipsText,
						icon: 'none'
					})
					return false
				}
				
				if (this.shouldUploadAccountQrcode && !this.form.account_qrcode) {
					uni.showToast({
						title: '请上传收款码',
						icon: 'none'
					})
					return false
				}
				
				let value = parseFloat(this.form.value)
				if (value == 0) {
					uni.showToast({
						title: '请输入提现金额',
						icon: 'none'
					})
					return false
				}
				if (this.form.value != value) {
					uni.showToast({
						title: '请输入正确的提现金额',
						icon: 'none'
					})
					return false
				}
				if (value > this.maxMoney) {
					uni.showToast({
						title: '提现金额超限制',
						icon: 'none'
					})
					return false
				}
				
				uni.showLoading({
					title: '提交中'
				})
				this.$http('/balance/withdraw', 'post', {
					...this.form,
					value: value * 100
				}).then(res => {
					uni.hideLoading()
					uni.redirectTo({
						url: '/pages/myRedpack/withdrawList'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0rpx 30rpx;
	}
	
	.gateway-list {
		display: flex;
		margin-top: 20rpx;
		flex-wrap: wrap;
		.scope-item {
			border-radius: 6rpx;
			border: 2rpx solid #333;
			text-align: center;
			line-height: 90rpx;
			height: 90rpx;
			width: 200rpx;
			flex: 0 0 200rpx;
			margin-left: 22rpx;
			margin-top: 20rpx;
			
			&.activited {
				background: #6938b6;
				border: 2rpx solid #6938b6;
				color: #fff;
			}
		}
	}
	
	.item {
		border-bottom: 1px solid #f1f1f1;
		padding-bottom: 10rpx;
		margin-bottom: 20rpx;
		margin-top: 50rpx;
	}
	
	.item-title {
		padding: 0 24rpx;
		margin: 0 0rpx;
		height: 70upx;
		line-height: 70upx;
		font-size: 34upx;
		font-weight: 500;
		position: relative;
		flex-grow: 1;
		
		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 18upx;
			width: 3px;
			height: 34upx;
			background-color: #6938b6;
		}
	}
	
	.text-input {
		height: 80rpx;
	}
	
	.input {
		margin-top: 20rpx;
		padding-left: 30rpx;
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	
		.footer-button {
			margin: 0 auto;
			margin-bottom: 10rpx;
			width: 600rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #6938b6;
			color: #fff;
			box-shadow: 0 0 20rpx rgba(105, 56, 182, 0.6);
			border-radius: 80rpx;
		}
	}
</style>
