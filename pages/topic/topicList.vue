<template>
	<view class="list-container">
		<topicItem class="item" :info="item" v-for="(item, index) in list"></topicItem>
		<NoData v-if="!list.length"></NoData>
		<NoMore v-else-if="noMore"></NoMore>
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
				title: '全部动态',
				list: [],
				perPage: 8,
				page: 1,
				noMore: false,
				tagId: '',
				groupId: ''
			}
		},
		computed: {},
		watch: {},
		onLoad(e) {
			this.title = e.title || this.title 
			uni.setNavigationBarTitle({
				title: this.title
			})
			
			this.tagId= e.tagId || ''
			this.groupId = e.groupId || ''
			
			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				uni.hideLoading()
			})
		},
		onShow() {
		},
		onPullDownRefresh() {
			this.$showPullRefresh()
			this.list = []
			this.page = 1
			this.initData()
		},
		onReachBottom () {
			this.initData()
		},
		methods: {
			initData() {
				if (this.noMore) {
					return false 
				}
				
				return this.$http('/topics', 'GET', {
					'tag_id': this.tagId,
					'group_id': this.groupId,
					'per_page': this.perPage,
					'page': this.page
				}).then(res => {
					this.list.push(...res.data.list)
					this.page ++
					if (this.page > res.data.page_total) {
						this.noMore = true
					}
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.list-container {
		padding: 50rpx 30rpx;
	}
</style>
