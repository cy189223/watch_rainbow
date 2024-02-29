<template>
	<view class="content">
		<view  @tap="openAddres" v-if="pickerText">{{pickerText}}</view>
		<view  @tap="openAddres" v-else class="empty-tips">点击选择地址</view>
		<simple-address class="address-c" confirmColor="#87cc6e" cancelColor="#b4b4b4" ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
	import simpleAddress from './simple-address.nvue';
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				labelArr: []
			};
		},
		props: {
			value: {
				type: Array
			}
		},
		components: {
			simpleAddress
		},
		computed: {
			pickerText () {
				return this.labelArr && this.labelArr.join('-')
			}
		},
		mounted () {
			if (this.value)
				this.labelArr = this.value
		},
		watch: {
			labelArr () {
				if(this.labelArr != ''){
					this.cityPickerValueDefault = this.$refs.simpleAddress.queryIndex(this.labelArr, 'label').index
				}
			}
		},
		methods: {
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.labelArr = e.labelArr;
				this.$emit('change', e)
			}
		}
	};
</script>

<style scoped lang="scss">
	
	.content {
		font-size: 28rpx;
		color: #000;
	}
	.address-c {
		width: 100%;
	}
	.empty-tips {
		color: gray;
	}
</style>
