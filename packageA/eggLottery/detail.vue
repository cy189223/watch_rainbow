<template>
	<view class="container" :style="'height: 100vh; background: url(' + bg + '); background-size: 100% auto; background-position: center center;'">
		
		<navigator url="/pages/myScore/index">
			<view class="headimg-c">
				<image mode="widthFix" :src="userInfo.headimg" class="headimg"></image>
				<view class="right">
					<view class="name">{{userInfo.name}}</view>
					<view class="score">
						{{userInfo.score | bigNumberDisplay}}{{scoreAlias}}
					</view>
				</view>
			</view>
		</navigator>
		<!-- 规则 -->
		<navigator url="/pages/rule/index?type=egg_lottery">
			<view class="float-btn rule" hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/rule.png"></image>
				<text>规则</text>
			</view>
		</navigator>
		
		<!-- 我的 -->
		<navigator url="/pages/myBox/index" open-type="switchTab">
			<view class="float-btn my"  hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/my-box.png"></image>
				<text>盒柜</text>
			</view>
		</navigator>
		
		<view class="float-btn share" hover-class="hover" @tap="isSharePopup = true">
			<text class="new-iconfont icon-wechat"></text>
			<text>分享</text>
		</view>
		
		<TextNavBar :title="info.title"></TextNavBar>
		<Theme1 v-if="isInit" :info="info" @showDetail="showSkuPopup" @runLottery="runLottery" @tryLottery="tryLottery"></Theme1>
		
		<uni-popup  style="z-index: 1000;" ref="detailPopup" type="bottom">
			<BoxSkuPopup :skuList="info.skus" :detailImageList="info.detail_images" @close="$refs.detailPopup.close()"></BoxSkuPopup>
		</uni-popup>
		
		
		<PayCard v-if="isShowPayCard" :info="payInfo" @success="paySuccess" @cancel="isShowPayCard=false"></PayCard>
		
		
		<OpenBoxPopup v-if="isShowResult" :order="order" :tryMode="tryMode" :tryInfo="tryInfo" @close="goBack" :boxImg="info.image_3d"></OpenBoxPopup>
		
		<SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import Theme1 from "./theme/Theme1.vue"
	import PayCard from "./components/PayCard"

	export default {
		components: {
			Theme1,
			PayCard,
			// ResultPopup
		},
		data() {
			return {
				uuid: '',
				info: {},
				isShowPayCard: false,
				payTotal: 1,
				isShowResult: false,
				resultOrder: {},
				isSharePopup: false,
				tryMode: false,
				tryInfo: {},
				isShowDetail: false,
				isInit: false,
				order: {}
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			bg () {
				if (!this.isInit) {
					return ''
				}
				return this.info.bg_image || 'https://api.caihongbox.com.cn/image/bg.png'
			},
			payInfo () {
				return {
					id: this.info.id,
					uuid: this.info.uuid,
					title: this.info.title,
					money_price: this.info.money_price,
					score_price: this.info.score_price,
					pay_total: this.payTotal
				}
			},
			posterInfo() {
				return {
					money_price: this.info.money_price,
					score_price: this.info.score_price,
					title: this.info.title,
					path: this.getShareConfig().path,
					thumb: this.info.thumb
				}
			},
			share() {
				return {
					title: this.info.title,
					thumb: this.info.thumb
				}
			}
		},
		onLoad(e) {
			this.uuid = e.uuid 
		},
		onShow() {
			this.initData()
		},
		methods: {
			goBack () {
				this.isShowResult = false 
			},
			showSkuPopup () {
				this.$refs.detailPopup.open('bottom')
			},
			hideSkuPopup () {
				this.$refs.detailPopup.close()
			},
			refresh() {
				this.initData()
				this.$store.dispatch("getUserInfo")
			},
			initData() {
				this.$http(`/egg-lotteries/${this.uuid}`).then(res => {
					this.info = res.data.info
					this.isInit = true
				})
			},
			runLottery(total) {
				this.tryMode = false
				this.payTotal = total
				this.isShowPayCard = true
			},
			tryLottery() {
				uni.showModal({
					title: '试一试开出的奖品不发货，仅作演示作用~',
					cancelText: '试扭1次',
					confirmText: '试扭5次',
					success: (res) => {
						let total = 1
						if (res.confirm) {
							total = 5
						}
						
						this.$http(`/egg-lottery/order/try`, 'POST', {
							activity_id: this.info.id,
							total: total
						}).then(res => {
							this.tryInfo = {
								package_uuid: res.data.package_uuid
							}
							
							this.tryMode = true
							this.isShowResult = true
						})
					}
				})
			},
			paySuccess (order) {
				this.order = order
				this.isShowPayCard = false 
				this.isShowResult = true
				// 购买成功
				
				this.refresh()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		width: 100%;
		height: 100vh;
		z-index: 0;
		align-items: flex-end;

		.content {
			width: 480rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.gift-box-number {
				margin: 34rpx auto;
				text-align: center;
				line-height: 38rpx;
				font-size: 24rpx;
				color: #efefef;
				font-weight: 500;
				color: #333;
			}
		}
		
		.headimg-c {
			position: fixed;
			left: 40rpx;
			top: 200rpx;
			display: flex;
			border-radius: 60rpx;
			align-items: center;
			.headimg {
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				margin-right: 8rpx;
				border: 4rpx solid #F1DC6E;
				box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
			}
			.right {
				.name {
					font-size: 26rpx;
					font-weight: 500;
					
				}
				.score {
					margin-top: 2rpx;
					font-size: 26rpx;
					font-weight: 500;
				}
			}
		}
		
		.float-btn {
			position: fixed;
			right: 0rpx;
			top: 260rpx;
			width: 130rpx;
			height: 66rpx;
			background: #FFEFB3;
			border-radius: 33px 0px 0px 33px;
			padding: 0rpx 14rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-around;
			
			z-index: 100;
		
			font-weight: 500;
			font-size: 24rpx;
		
			image {
				width: 30rpx;
				height: 36rpx;
			}
		
			&.my {
				top: 350rpx;
				image {
					width: 30rpx;
					height: 40rpx;
				}
			}
			
			&.share {
				top: 600rpx;
				.icon-wechat {
					font-size: 40rpx;
				}
			}
		}
	}
</style>
