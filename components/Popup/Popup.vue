<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated bounceInDown" @tap.stop>
			<image :src="info.image" class="thumb" mode="widthFix" @tap="toLink"></image>
			
			<view class="close-btn" @tap="close">
				<text class="new-iconfont icon-wrong"></text>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		watch: {},
		onLoad(e) {

		},
		created() {
		},
		methods: {
			close() {
				this.$emit('close')
			},
			toLink() {
				this.$tool.toLink(this.info.link)
				this.$emit('close')
			}
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
		border-radius: 20rpx;
		box-sizing: border-box;
		position: relative;

		
		.thumb {
			width: 660rpx;
		}
		
		.close-btn {
			border: 4rpx solid white;
			border-radius: 50%;
			font-size: 40rpx;
			width: 80rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: white;
			margin: 10rpx auto 0rpx auto;
		}
	}
</style>
