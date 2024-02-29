
export default {
	filters: {
		// 价格补两位小数，后台返回价格单位分
		priceToFixed(value) {
			return value ? (value/100).toFixed(2) : '0.00'
		},
		productAttrsToString(attrs = []) {
			let arr = []
			attrs.forEach(item => {
				arr.push(item.value || item.v)
			})
			return arr.join("/")
		},
		bigNumberDisplay(number) {
			if (number > 999999) {
				return (number/10000000).toFixed(1) + 'kw'
			}
			else if (number > 9999) {
				return (number/10000).toFixed(1) + 'w'
			}
			else if (number > 999) {
				return (number/1000).toFixed(1) + 'k'
			}
			return number
		}
	},
	computed: {
		isBgmPlay () {
			return this.$store.getters.isBgmPlay
		},
		scoreAlias () {
			return (this.$store.getters.setting.score && this.$store.getters.setting.score.alias) || '积分'
		},
		miniappSubscribeIds() {
			// console.log('miniapp', this.$store.getters.setting.miniapp_subscribe_ids)
			return this.$store.getters.setting.miniapp_subscribe_ids
		}
	},
	data (){
		return {
			noClick: true
		}
	},
	methods: {
		disableMultiClick(methods) {
			let that = this;
			    
			if (that.noClick) {
				that.noClick= false;
				methods();
				setTimeout(() => {
					this.noClick= true;
				}, 1000)
			} else {
				console.log('屏蔽连击')
				// console.log("请")
			}
		},
		getStorage(key) {
			try {
				return uni.getStorageSync(key)
			} catch (e) {
				return null
			}
		},
		setStorage(key, data) {
			try {
				uni.setStorageSync(key, data)
			} catch (e) {
				throw new Error("setStorage Error")
			}
		},
		// 联系客服
		openContact () {
			// #ifdef MP-ALIPAY
			let name  = this.$store.getters.setting.taobao.contact_name || '未设置昵称'
			my.tb.openMessage({
			  sellerNick: name,
			  success: (res) => {
			    console.log(res);
			  },
			  fail: (res) => {
			   console.log(res);
			  },
			})
			// #endif
			
			// #ifdef APP-PLUS
				uni.navigateTo({
					url: '/pages/contact/index'
				})
			// #endif
		},
		// 前往登陆页
		toLoginPage () {
			// #ifdef APP-PLUS
			uni.navigateTo({
				url: '/pages/login/app'
			})
			// #endif
			// #ifndef APP-PLUS
			uni.navigateTo({
				url: '/pages/login/index'
			})
			// #endif
		}
	}
}
