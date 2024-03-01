<template>
	<view class="pagebox">
		<view v-if="wintype == ''" class="refreshbox" @tap="refreshRoom">刷新</view>
		<view class="rulebtn" @tap="ruleshow = true">规则</view>
		<!-- <view class="liushuibtn" @tap="showliushuipopup()" v-if="liushuilist.list && liushuilist.list.length">流水奖励</view> -->
		<image v-if="ispk" src="https://api.caihongbox.com.cn/image/pkheader.png" mode="widthFix" class="headerimg">
		</image>
		<image v-else src="https://api.caihongbox.com.cn/image/qjheader.png" mode="widthFix" class="headerimg"></image>
		<image v-if="ispk" src="https://api.caihongbox.com.cn/image/abpk.png" mode="scaleToFill" class="pkimg"></image>
		<view v-if="ispk" class="pktext">AB阵营获胜概率各50%</view>
		<view class="sku-list">
			<view class="title-c">
				<view class="stock-c" v-if="pkdata.room_index">第{{pkdata.room_index}}箱奖品池</view>
			</view>
			<view class="item" v-for="(item, index) in pkssku.list" :key="index">
				<view class="thumb">
					<image mode="aspectFill" :src="item.thumb"></image>
				</view>
				<view class="title">{{item.title}}</view>
				<view class="moneytext">
					售价:{{item.money_price == null ? '' : '￥' + (item.money_price/100).toFixed(2)}}{{(item.money_price == null || item.score_price == null) ? '' : '+'}}{{item.score_price == null ? '' : item.score_price + scoreAlias}}
				</view>
				<view class="bottomflex" v-if="ispk">
					<view style="line-height: 80rpx;font-size: 24rpx;" v-if="item.prize_type == 'A'">A阵营保底奖励</view>
					<view style="line-height: 80rpx;font-size: 24rpx;" v-else-if="item.prize_type == 'B'">B阵营保底奖励</view>
					<block v-else>
						<view class="display-price" style="border-right: 1px solid #ccc;">
							<view class="value">{{(100/pkadata.length).toFixed(2)}}%</view>
							<view class="key">A阵营胜后<br>获得概率</view>
						</view>
						<view class="display-price">
							<view class="value">100%</view>
							<view class="key">B阵营胜后<br>获得概率</view>
						</view>
					</block>
				</view>
				<view class="bottomflex" v-else>
					<view style="line-height: 40rpx;font-size: 22rpx;">
						{{item.prize_type == 'A' ? '保底奖励' : item.prize_type == 'C' ? '串串奖励' : '获得概率：' + (100/pkadata.length).toFixed(2) + '%'}}
					</view>
				</view>
				<view v-if="item.prize_type == 'A'" class="tagbox atag">{{ispk ? 'A阵营保底' : '保底奖励'}}</view>
				<view v-if="item.prize_type == 'B'" class="tagbox btag">B阵营保底</view>
				<view v-if="item.prize_type == 'C'" class="tagbox btag">串串奖励</view>
			</view>
		</view>

		<view class="sku-list" v-if="wintype != ''" style="margin-bottom: 0;">
			<view class="title-c">
				<view class="stock-c" v-if="pkdata.room_index">第{{pkdata.room_index}}箱获奖列表</view>
			</view>
			<view class="list-scope">
				<view v-for="(item, index) in pkdata.users" :key="index" class="item-scope">
					<view class="user-c" style="border-bottom: 1px dashed #eee;padding-bottom: 10rpx;">
						<image :src="item.user.headimg" mode="aspectFill" class="headimg"></image>
						<view class="sku-title">{{item.user.name}}</view>
						<view class="weizhi" v-if="ispk">
							{{item.type == 'A' ? 'A' : '通杀位'}}{{item.type == 'A' ? item.seat_code + '号位' : ''}}
						</view>
						<view class="weizhi" v-else>{{item.seat_code}}号位</view>
					</view>
					<view class="user-c" v-for="(ite, ind) in item.packages" :key="ind">
						<image :src="ite.thumb" mode="aspectFill" class="headimg" style="border-radius: 0;"></image>
						<view class="sku-title" style="width: 100%;">{{ite.title}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="bottombtnbox">
			<view class="joinbox" @tap="openprev">上一箱</view>
			<view class="boxnum" v-if="pkdata.room_index" @tap="isRoomPopup = true">第 {{pkdata.room_index}} 箱</view>
			<view class="joinbox" @tap="opennext">下一箱</view>
		</view>

		<view class="mainbox">
			<view class="userlistbox parta" :class="ispk ? '' : 'quanjushang'">
				<view class="userbox" v-for="(item,index) in pkadata" :key="index" @tap="topay(item)">
					<view class="num">{{item.seat_code}}</view>
					<image v-if="item.user && item.user.headimg" :src="item.user.headimg" mode="scaleToFill"
						class="userimg"></image>
					<image v-else src="/static/jia.png" mode="scaleToFill" class="userimg"></image>
					<view class="usertextbox">
						<view v-if="item.user && item.user.name" class="usernamebox">{{item.user.name}}</view>
						<view v-else class="joinbox"
							style="position: static;transform: translate(0, 0);width: 100%;box-sizing: border-box;">点击加入
						</view>
					</view>
				</view>
				<!-- <view class="joinbox" v-if="teama && wintype == ''" @tap="topaya()">{{ispk ? '加入阵营' : '点击参与'}}</view>
				<view class="joinbox" v-else>阵营已满</view> -->
				<view class="moneynum" v-if="pkdata.activity && pkdata.activity.money_price != undefined">
					入场：{{(pkdata.activity.money_price == 0 || !pkdata.activity.money_price) ? '' : '￥' + (pkdata.activity.money_price/100).toFixed(2)}}{{((pkdata.activity.money_price == 0 || !pkdata.activity.money_price) || (pkdata.activity.score_price == 0 || !pkdata.activity.score_price)) ? '' : '+'}}{{(pkdata.activity.score_price == 0 || !pkdata.activity.score_price) ? '' : pkdata.activity.score_price + scoreAlias}}
				</view>
				<view class="blackbg" v-if="wintype != ''">
					<block v-if="ispk">
						<image src="https://api.caihongbox.com.cn/image/win.png" mode="aspectFit" v-if="wintype == 'A'">
						</image>
						<image src="https://api.caihongbox.com.cn/image/lose.png" mode="aspectFit" v-else></image>
					</block>
				</view>
			</view>
			<view class="userlistbox partb"
				style="display:flex;align-items: center;justify-content: center;flex-direction: column;" v-if="ispk">
				<view class="userbox" style="width: calc(100% - 60rpx);margin-top: 10rpx;"
					v-for="(item,index) in pkdata.users" v-if="item.type == 'B'" :key="index" @tap="topay(item)">
					<view class="usertextbox">
						<view v-if="item.user && item.user.name" class="usernamebox">{{item.user.name}}</view>
						<view v-else class="joinbox"
							style="position: static;transform: translate(0, 0);width: 100%;box-sizing: border-box;">通杀位
						</view>
					</view>
					<image v-if="item.user && item.user.headimg" :src="item.user.headimg" mode="scaleToFill"
						class="userimg" style="margin-right: 0;"></image>
					<image v-else src="/static/jia.png" mode="scaleToFill" class="userimg" style="margin-right: 0;">
					</image>
				</view>
				<!-- <view class="joinbox" v-if="teamb && wintype == ''" @tap="topayb()">加入阵营</view>
				<view class="joinbox" v-else>阵营已满</view> -->
				<view class="moneynum" v-if="pkdata.activity && pkdata.activity.other_money_price != undefined">
					入场：{{(pkdata.activity.other_money_price == 0 || !pkdata.activity.other_money_price) ? '' : '￥' + (pkdata.activity.other_money_price/100).toFixed(2)}}{{((pkdata.activity.other_money_price == 0 || !pkdata.activity.other_money_price) || (pkdata.activity.other_score_price == 0 || !pkdata.activity.other_score_price)) ? '' : '+'}}{{(pkdata.activity.other_score_price == 0 || !pkdata.activity.other_score_price) ? '' : pkdata.activity.other_score_price + scoreAlias}}
				</view>
				<view class="blackbg" v-if="wintype != ''">
					<image src="https://api.caihongbox.com.cn/image/win.png" mode="aspectFit" v-if="wintype == 'B'">
					</image>
					<image src="https://api.caihongbox.com.cn/image/lose.png" mode="aspectFit" v-else></image>
				</view>
			</view>
		</view>

		<view class="ruleboxbg" @tap="ruleshow = false" v-if="ruleshow">
			<view class="rulebox" @tap.stop>
				<view class="rulemainbtn">
					<text class="new-iconfont icon-close close-btn" @tap="ruleshow = false"></text>
					<view class="ruletitle">规则说明</view>
					<view class="ruletext">
						{{ispk ? pkdata.setting.pkhtml : pkdata.setting.html}}
					</view>
				</view>
			</view>
		</view>

		<RoomPopup v-if="isRoomPopup" @select="changeRoom" @close="hideRoom()" :uuid="pkid"></RoomPopup>

		<PayCard v-if="isShowPayCard" :pkskus="pkdata.activity" :paytype="paytype" :payuuid="payuuid" :pktype="pktype"
			:payseat_uuid="payseat_uuid" :payjoin_type="payjoin_type" @success="paySuccess"
			@cancel="isShowPayCard=false"></PayCard>
	</view>
</template>

<script>
	import PayCard from "./components/PayCard.vue"
	import RoomPopup from "./components/RoomPopup.vue"
	export default {
		components: {
			PayCard,
		},
		data() {
			return {
				isRoomPopup: false,
				pkid: '',
				payCardInfo: {},
				uuid: '',
				id: '',
				address: {},
				amountnum: '',
				ruleshow: false,
				isShowPayCard: false,
				pkdata: {},
				pkadata: {},
				teama: false,
				teamb: false,
				pkssku: {},
				prevuuid: '',
				nextuuid: '',
				wintype: '',
				paytype: '',
				payuuid: '',
				payjoin_type: '',
				payseat_uuid: '',
				ispk: false,
				pktype: '',
			}
		},
		onShow() {},
		onLoad(opts) {
			if (opts && opts.id) {
				this.pkid = opts.id
				this.pktype = opts.type
				if (opts.type == 'ydd') {
					this.ispk = true
				}
				this.initData()
				this.getpkssku()
			}
		},
		computed: {
			share() {
				if (this.pkdata && this.pkdata.activity) {
					return {
						title: '[第' + this.pkdata.room_index + '箱]' + this.pkdata.activity.title,
						thumb: this.pkdata.activity.thumb,
						path: '/pages/pkindex/pkindex?id=' + this.pkid + '&type=' + this.pktype
					}
				}
			},
		},
		methods: {
			hideRoom() {
				this.isRoomPopup = false
			},
			changeRoom(room) {
				uni.showLoading({
					title: '加载中...'
				})
				this.isRoomPopup = false
				this.getpkroom(room.uuid).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '加载完成~',
						icon: 'none'
					})
				})
			},
			refreshRoom() {
				uni.showLoading({
					title: '刷新中...'
				})
				this.initData().then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '刷新完成~',
						icon: 'none'
					})
				})
			},
			getpkssku() {
				this.$http(`/pks/${this.pkid}/sku`, 'GET', {}).then(res => {
					this.pkssku = res.data
				})
			},
			getpkroom(type) {
				return this.$http(`/pk-room/${type}`, 'GET', {}).then(res => {
					this.pkdata = res.data.data
					this.prevuuid = res.data.prev_uuid
					this.nextuuid = res.data.next_uuid
					if (this.pkdata.status == 2) {
						this.pkdata.users.forEach((item, index) => {
							if (item.is_prize == 1) {
								this.wintype = item.type
								return
							}
						})
					} else {
						this.wintype = ''
					}
					this.pkdata.users.forEach((item, index) => {
						if (item.type == 'A') {
							if (!(item.user && item.user != '')) {
								this.teama = true
							}
						} else if (item.type == 'B') {
							if (!(item.user && item.user != '')) {
								this.teamb = true
							}
						}
					})
					this.pkadata = this.pkdata.users.filter(item => item.type == 'A')
				})
			},
			initData() {
				return this.$http(`/pk/${this.pkid}`, 'GET', {}).then(res => {
					this.pkdata = res.data.data
					this.prevuuid = res.data.prev_uuid
					this.nextuuid = res.data.next_uuid
					this.wintype = ''
					this.pkdata.users.forEach((item, index) => {
						if (item.type == 'A') {
							if (!(item.user && item.user != '')) {
								this.teama = true
							}
						} else if (item.type == 'B') {
							if (!(item.user && item.user != '')) {
								this.teamb = true
							}
						}
					})
					this.pkadata = this.pkdata.users.filter(item => item.type == 'A')
				})
			},
			paySuccess() {
				this.isShowPayCard = false
				this.initData()
				// this.getList()
				uni.showToast({
					title: '加入成功',
					icon: 'none'
				})
			},
			topay(item) {
				if (item.user && item.user != '') {
					uni.showToast({
						title: '该位置已有用户',
						icon: 'none'
					})
					return
				}
				this.paytype = item.type
				this.payuuid = this.pkdata.uuid
				this.payjoin_type = 1
				this.payseat_uuid = item.uuid
				this.isShowPayCard = true
			},
			topaya() {
				this.paytype = 'A'
				this.payuuid = this.pkdata.uuid
				this.payjoin_type = 2
				this.payseat_uuid = ''
				this.isShowPayCard = true
			},
			topayb() {
				this.paytype = 'B'
				this.payuuid = this.pkdata.uuid
				this.payjoin_type = 2
				this.payseat_uuid = ''
				this.isShowPayCard = true
			},
			openprev() {
				if (this.prevuuid == '') {
					uni.showToast({
						title: '没有上一箱',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中...'
				})
				this.getpkroom(this.prevuuid).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '加载完成~',
						icon: 'none'
					})
				})
			},
			opennext() {
				if (this.nextuuid == '') {
					uni.showToast({
						title: '没有下一箱',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中...'
				})
				this.getpkroom(this.nextuuid).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '加载完成~',
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rulebtn {
		position: fixed;
		right: 0rpx;
		top: 220rpx;
		width: 100rpx;
		line-height: 60rpx;
		padding-left: 10rpx;
		text-align: center;
		background: #c6b3ff;
		border-radius: 33px 0px 0px 33px;
		box-sizing: border-box;
		z-index: 99;
		font-size: 25rpx;
	}


	.refreshbox {
		position: fixed;
		top: 600rpx;
		right: 10px;
		width: 45px;
		height: 20px;
		font-size: 11px;
		padding-top: 25px;
		z-index: 99;
		color: #f5f5f5;
		text-align: center;
		background-image: url('https://api.caihongbox.com.cn/image/shuaxin.png');
		background-size: 100% 100%;
	}

	.pagebox {
		padding-bottom: 40rpx;
		background-image: linear-gradient(to bottom, #0d093c, #1a0641);
	}

	.headerimg {
		width: 100%;
		height: auto;
	}

	.pkimg {
		display: block;
		width: 640rpx;
		height: 115rpx;
		margin: 20rpx auto 0;
	}

	.joinbox {
		margin: 30rpx auto;
		width: 210rpx;
		line-height: 50rpx;
		color: #fff;
		text-align: center;
		border-radius: 50rpx;
		border: 5rpx solid transparent;
		background-clip: padding-box, border-box;
		background-origin: padding-box, border-box;
		background-image: linear-gradient(to bottom, #6118a0, #8038c1, #6118a0), linear-gradient(to right, #ef3dfe, #7976e3, #60dde8);
	}

	.blackbg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9;
	}

	.mainbox {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		margin: 0 25rpx;

		.userlistbox {
			width: 345rpx;
			position: relative;
			border-radius: 20rpx 20rpx 0 0;
			padding-bottom: 25rpx;

			&.quanjushang {
				width: 700rpx;
				margin-top: 20rpx;
				display: flex;
				flex-wrap: wrap;
				align-items: flex-start;
				padding-bottom: 60rpx;

				.userbox {
					width: calc(50% - 60rpx);
					margin-bottom: 10rpx;
				}
			}

			&.parta {
				background-image: linear-gradient(to bottom, #d23017, transparent);
			}

			&.partb {
				background-image: linear-gradient(to bottom, #083ad0, transparent);

				.usertextbox {
					text-align: right;
					width: calc(100% - 100rpx);
				}

			}

			.blackbg {
				bottom: -20rpx;
				padding-bottom: 60rpx;
				border-radius: 20rpx 20rpx 0 0;

				image {
					width: 40%;
					height: 100%;
				}
			}
		}

		.userbox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 30rpx 30rpx 40rpx;
			color: #fff;
		}

		.userimg {
			width: 75rpx;
			height: 75rpx;
			margin: 0 10rpx;
			border-radius: 50%;
			border: 1px solid #fff;
			background-color: #fff;
		}

		.usertextbox {
			width: calc(100% - 120rpx);
			font-size: 28rpx;

			.usernamebox {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.baoditext {
			margin-top: 5rpx;
			font-size: 26rpx;
		}


		.joinbox {
			margin: 0;
			position: absolute;
			bottom: 5rpx;
			left: 50%;
			transform: translate(-50%, 50%);
		}

		.moneynum {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			color: #fff;
			line-height: 30rpx;
			font-size: 26rpx;
			text-align: center;
		}
	}

	.sku-list {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		margin: 90rpx 15rpx 30rpx;
		padding: 65rpx 35rpx;
		background-image: url('https://api.caihongbox.com.cn/image/listbg.png');
		background-size: 100% 100%;


		.title-c {
			position: absolute;
			top: -40rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 90;
			padding: 5rpx 15rpx;
			border-radius: 35rpx;
			background-color: #130842;
			border: 2px solid #fff;
			box-shadow: 0 0 6px 1px #ff3cf9;

			.stock-c {
				word-break: keep-all;
				padding: 0 50rpx;
				line-height: 60rpx;
				border: 2px solid #fff;
				border-radius: 30rpx;
				text-align: center;
				box-shadow: 0 0 10px 1px #ff3cf9;
				font-size: 30rpx;
				color: #fff;
				text-shadow: 0 0 5px #c33edc;
				background-image: linear-gradient(to right, #4610be, #8348d4, #28218b);
			}
		}


		.item {
			position: relative;
			margin: 5rpx 4rpx;
			padding: 5rpx;
			width: calc(100%/3 - 4rpx - 4rpx);
			box-sizing: border-box;
			border-radius: 25rpx;
			border: 5rpx solid transparent;
			background-clip: padding-box, border-box;
			background-origin: padding-box, border-box;
			background-image: linear-gradient(to right, #fff, #fff), linear-gradient(30deg, #a252cb, #3c53df, #a252cb);

			.thumb {
				position: relative;
				overflow: hidden;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 20rpx;
				position: relative;

				image {
					width: 100%;
					aspect-ratio: 1;
					height: auto;
					display: block;
				}

			}

			.title {
				font-size: 24rpx;
				font-family: PingFang;
				color: #000000;
				margin: 5rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.moneytext {
				font-size: 24rpx;
				color: #000000;
				font-family: PingFang;
				margin: 5rpx;
			}

			.bottomflex {
				display: flex;
				justify-content: center;
				align-items: flex-start;
				border-top: 1px dashed #ccc;
				margin: 0 -2rpx;
				padding-top: 5rpx;

				.display-price {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 50%;
					height: 80rpx;
					font-size: 22rpx;
					text-align: center;

					.value {
						font-weight: normal;
					}

					.key {
						color: #999;
						line-height: 25rpx;
						font-size: 20rpx;
					}
				}
			}


			.tagbox {
				border-radius: 20rpx 0 20rpx 0;
				color: white;
				position: absolute;
				left: 5rpx;
				top: 5rpx;
				z-index: 90;
				padding: 0 15rpx;
				line-height: 42rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: bold;

				&.atag {
					background-color: #ff3c1c;
				}

				&.btag {
					background-color: #0945fe;
				}
			}

		}
	}

	.ruleboxbg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999999;

		.rulebox {
			width: 70%;
			padding: 5rpx;
			border-radius: 20rpx;
			border: 5rpx solid transparent;
			background-clip: padding-box, border-box;
			background-origin: padding-box, border-box;
			background-image: linear-gradient(to right, #000, #000), linear-gradient(to bottom, #d353e4, #70bad7);

			.rulemainbtn {
				position: relative;
				width: 100%;
				background-image: url('https://api.caihongbox.com.cn/image/popupbg.jpg');
				background-position: top;
				background-size: 100%;
				background-repeat: no-repeat;
				background-color: #fff;
				border-radius: 15rpx;
			}

			.close-btn {
				font-size: 16px;
				position: absolute;
				top: 20px;
				right: 20px;
			}

			.ruletitle {
				padding: 20px 0;
				font-weight: bold;
				color: #573884;
				text-align: center;
			}

			.ruletext {
				height: 45vh;
				overflow-y: auto;
				padding: 0 20rpx 20rpx;
			}
		}
	}

	.close-btn {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.list-scope {
		margin: 0rpx 10rpx;
		width: 100%;

		.item-scope {
			position: relative;
			background: white;
			border-radius: 25rpx;
			padding: 20rpx 20rpx 30rpx;
			margin-bottom: 20rpx;
			width: 100%;
			box-sizing: border-box;

			.user-c {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 10rpx;

				.headimg {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
				}

				.sku-title {
					font-size: 30rpx;
					text-align: left;
					margin-left: 10rpx;
					margin-right: auto;
					width: calc(100% - 170rpx);
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

			}

		}
	}

	.bottombtnbox {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 60rpx 0;

		.joinbox {
			width: 150rpx;
			margin: 0;
		}

		.boxnum {
			margin: 0 30rpx;
			padding: 0 20px;
			line-height: 50rpx;
			border: 2px solid #fff;
			border-radius: 20rpx;
			text-align: center;
			box-shadow: 0 0 10px 1px #ff3cf9;
			font-size: 30rpx;
			color: #fff;
			text-shadow: 0 0 5px #c33edc;
			background-image: linear-gradient(to right, #4610be, #8348d4, #28218b);
		}
	}

	.pktext {
		text-align: center;
		margin: -10rpx 0 10rpx;
		color: #fff;
		font-size: 25rpx;
	}
</style>