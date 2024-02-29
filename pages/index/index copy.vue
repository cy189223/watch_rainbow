<template>
	<view class="container">
		<HomeNavbar :title="title" searchType="box" :theme="scrollTop > 200 ? 'white' : ''"></HomeNavbar>
		
		<Banner :list="banner" style="height: 640rpx;" class="banner-c"></Banner>
		<!-- <swiper class="swiper" autoplay @change="swiperChange">
			<swiper-item v-for="item in swiperList" :key="item.image">
				<image mode="aspectFill" :src="item.image" class="slide-image" @tap="handleClick(item)" />
			</swiper-item>
		</swiper> -->
		
		<PageRender :page="page"></PageRender>

		<!-- <view class='body' v-if="isInit">
			<view class="new-list-title">
				<view class="text">新品推荐</view>
				<view class="more-btn" @tap="more" hover-class="hover">
					<text>更多</text>
				</view>
			</view>
			<view class="new-box-list">
				<smallBoxItem class="item" tag="new" theme="theme-1" v-for="(item, index) in newBoxList" :info="item"></smallBoxItem>
			</view>
			
			<view class="hot-ip-title">
				热门IP
			</view>
			<view class="hot-ip-list">
				<AllIP :list="ipList"></AllIP>
			</view>
			
			<view class="all-list-title">
				<view class="text">全部抽盒机</view>
				<view class="more-btn" @tap="more" hover-class="hover">
					<text>更多</text>
				</view>
			</view>
			<view class="all-box-list">
				<boxItem v-for="(item, index) in allBoxList" :info="item"></boxItem>
			</view>
		</view> -->
		
		<FloatBtn></FloatBtn>
	</view>
</template>

<script>
	import boxItem from "./components/boxItem.vue"
	import smallBoxItem from "./components/smallBoxItem.vue"
	import AllIP from "./components/AllIP.vue"

	export default {
		components: {
			boxItem,
			smallBoxItem,
			AllIP
		},
		data() {
			return {
				newBoxList: [],
				allBoxList: [],
				ipList: [],
				isInit: false,
				scrollTop: 0
			}
		},
		computed: {
			page() {
				return this.$store.getters.setting.box_home
			},
			contentStyle() {
				let deviceInfo = this.$store.getters.deviceInfo;
				return `padding-top:${deviceInfo.customBar}px;`;
			},
			title () {
				return this.$store.getters.setting.box_home.title || '未设置'
			},
			banner () {
				return this.$store.getters.setting.box_home.banner || []
			}
		},
		watch: {
		},
		onLoad() {
			uni.showLoading({
				title: '刷新中'
			})
			
			this.initAllBoxList().then(res => {
				uni.hideLoading()
			})
			this.initNewBoxList()
			this.initIPList().then(res => {
				this.isInit = true
			})
			
			this.$visitor.record('box_index');
		},
		onPullDownRefresh() {
			this.$showPullRefresh()
			
			this.initAllBoxList()
			this.initNewBoxList()
			this.initIPList()
		},
		onShow() {},
		methods: {
			initIPList() {
				return this.$http('/ip/categories', 'GET', {
					per_page: 5
				}).then(res => {
					this.ipList = res.data.list
				})	
			},
			initAllBoxList() {
				return this.$http('/boxes', 'GET', {
					per_page: 20
				}).then(res => {
					this.allBoxList = res.data.list
				})
			},
			initNewBoxList() {
				return this.$http('/recommend-boxes').then(res => {
					this.newBoxList = res.data.list
				})
			},
			swiperChange () {
				
			},
			more(e) {
				uni.navigateTo({
					url: '/pages/category/index'
				})
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>

<style lang="scss" scoped>
	
	.more-btn {
		width: 92rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 22rpx;
		background: #6938b6;
		color: white;
		opacity: 0.9;
		border-radius: 50rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		.icon-arrow-right {
			font-size: 28rpx;
			margin-left: 0rpx;
			display: inline;
			width: 10rpx;
		}
	}
	
	
	.container {
		width: 750rpx;
		overflow: hidden;
		

		.body {
			padding: 40rpx 32rpx;
			// background-color: #f1f1f1;
			background: url('@/static/box-list-bg.png');
			background-size: 100% auto;
			background-repeat: no-repeat;
			// background-image: linear-gradient(rgba(0,0,0,0), #FFFCF1);
			position: relative;
			top: -40rpx;
		}
		
		.new-list-title {
			background: url('@/static/new-list-title.png');
			background-size: 402rpx auto;
			background-repeat: no-repeat;
			padding-top: 10rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
			margin: 10rpx 0rpx 38rpx 0rpx;
			
			display: flex;
			align-items: center;
			.text {
				flex-grow: 1;
			}
		}
		
		.new-box-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			box-sizing: border-box;
			
			.item {
				width: 32%;
				display: inline-block;
				&:first-child {
				}
			}
		}
		
		
		.hot-ip-title {
			background: url('@/static/new-list-title.png');
			background-size: 402rpx auto;
			background-repeat: no-repeat;
			padding-top: 10rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
			margin: 10rpx 0rpx 38rpx 0rpx;
		}
		
		.all-list-title {
			background: url('@/static/all-list-title.png');
			background-size: 402rpx auto;
			background-repeat: no-repeat;
			padding-top: 10rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
			margin: 40rpx 0rpx 38rpx 0rpx;
			
			display: flex;
			align-items: center;
			.text {
				flex-grow: 1;
			}
		}

		.all-box-list {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}
	}
</style>
