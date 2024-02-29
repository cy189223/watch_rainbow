<template>
	<view class="container-ccc">
		<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
		<image class="poster" mode="widthFix" v-if="posterPath" :src="posterPath"></image>
		<view v-else class="empty-block"></view>
	</view>
</template>

<script>
	import _app from '@/js_sdk/QuShe-SharerPoster/util/QS-SharePoster/app.js';
	import {
		getSharePoster
	} from '@/js_sdk/QuShe-SharerPoster/util/QS-SharePoster/QS-SharePoster.js';

	export default {
		data() {
			return {
				canvasId: 'default_PosterCanvasId',
				poster: null,
				posterPath: null
			};
		},
		components: {},
		computed: {
			displayPrice () {
				let price = ''
				if (this.info && this.info.money_price) {
					price = this.info.money_price / 100 + ''
				}
				if (this.info && this.info.score_price) {
					price += (price ? '+' : '') + this.info.score_price + this.scoreAlias
				}
				if (!price) {
					price = '0'
				}
				return price
			}
		},
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		watch: {
			info () {
				this.generatePoster()
			}
		},
		mounted() {
			this.generatePoster()
		},
		methods: {
			async generatePoster() {
				console.log('ahres',this.info)
				try {
					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						posterCanvasId: this.canvasId,
						delayTimeScale: 20, //延时系数
						background: { //设置自定义背景画布, 若传该属性则背景图失效
							height: 1100, //画布高度
							width: 800, //画布宽度
							backgroundColor: '#ffffff'//背景颜色
						},
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = bgObj.width * 0.3;
							const fontSize = bgObj.width * 0.045;
							const lineHeight = bgObj.height * 0.04;
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
										type: 'image',
										url: this.info.thumb,
										dx: 0,
										dy: 0,
										infoCallBack(imageInfo) {
											return {
												dWidth: bgObj.width, // 因为设置了圆形图片 所以要乘以2
												dHeight: bgObj.width,
												mode: 'aspectFill'
											}
										}
									},
									{
										type: 'image',
										url: this.info.qrcode,
										dx: 420,
										dy: bgObj.width + 80,
										infoCallBack(imageInfo) {
											let scale = bgObj.width * 0.2 / imageInfo.height;
											return {
												dWidth: 130, // 因为设置了圆形图片 所以要乘以2
												dHeight: 130,
												roundRectSet: { // 圆角矩形
													r: 70
												}
											}
										}
									},
									{
										type: 'text',
										text: this.info.title,
										size: 34,
										color: '#000',
										dx: 20,
										dy: bgObj.width + 50,
										// alpha: .5,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {}
										}
									},
									{
										type: 'text',
										text: this.displayPrice,
										size: 32,
										color: '#E63111',
										dx: 20,
										dy: bgObj.width + 150,
										// alpha: .5,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {}
										}
									},
								]);
							})
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => { // 为动态设置画布宽高的方法，
							this.poster = bgObj;
						},
					});
					this.poster.finalPath = d.poster.tempFilePath;
					this.posterPath = d.poster.tempFilePath;

					this.$emit('getPosterUrl', this.posterPath);


				} catch (e) {
					_app.hideLoading();
					_app.showToast(JSON.stringify(e));
					console.log(JSON.stringify(e));
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	.container-ccc {
		padding: 10px 10rpx;
		text-align: center;
		
		.hideCanvas {
			width: 100%;
			position: fixed;
			right: 200%;
		}

		.poster {
			border-radius: 8rpx;
		}

		.empty-block {
			width: 100%;
			height: 580rpx;
		}
	}
</style>
