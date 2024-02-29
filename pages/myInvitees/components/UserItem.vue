<template>
	<view class="item global-shadow-2">
		<image class="left headimg" :src="info.headimg"></image>
		<view class="body">
			<view class="name">{{info.name}}</view>
			<view class="time">{{info.created_at}}</view>
		</view>
		<view class="right">
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		async onLoad() {},
		methods: {},
		filters: {}
	}
</script>
<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 10px;
		margin: 10px;
		background: white;
		border-radius: 6rpx;
		align-items: center;

		.left {
			width: 100rpx;
			height: 100rpx;
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
</style>
