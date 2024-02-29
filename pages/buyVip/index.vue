<template>
	<view class="container">
		<TextNavBar :title="title"></TextNavBar>

		<PageRender :page="page" theme="default"></PageRender>
		<view class="footer safe-area-bottom global-shadow">
			<button class="submit" @tap="isShowSku=true">选择VIP套餐</button>
		</view>

		<PayCard v-if="isShowSku" @success="successPay" @cancel="isShowSku=false"></PayCard>

	</view>
</template>

<script>
	import PayCard from "./components/PayCard.vue"
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			PayCard
		},
		data() {
			return {
				isShowSku: false,
			}
		},
		mounted () {
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		computed: {
			...mapGetters(["userInfo"]),
			title() {
				return this.$store.getters.setting.vip_page.title || 'VIP会员'
			},
			page() {
				return this.$store.getters.setting.vip_page
			}
		},
		methods: {
			successPay() {
				this.isShowSku = false
				uni.showModal({
					content: '恭喜您成功购买会员套餐~',
					success: (res) => {
						uni.switchTab({
							url: '/pages/center/index'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 34rpx 0rpx;



		.footer {
			position: fixed;
			width: 100%;
			bottom: 0rpx;
			left: 0rpx;

			.submit {
				border: 0rpx;
				background: #673AB7;
				font-size: 30rpx;
				font-weight: bold;
				color: #fff;
				text-align: center;
				line-height: 96rpx;
				border-radius: 50rpx;
				width: 660rpx;
				margin: 0rpx auto 30rpx;

				&::after {
					display: none;
				}
			}
		}
	}
</style>
