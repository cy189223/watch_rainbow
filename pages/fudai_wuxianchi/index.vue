<template>
    <view class="scope-container" :style="'min-height: 100vh; background: url(' + bgImage + '); background-size: 100% 100%; background-position: center center;'">abcde</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    components: {},
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['userInfo']),
        bgImage() {
            return '';
        }
    },
    watch: {},
    filters: {},
    onLoad(e) {
        this.uuid = e.uuid;
    },
    onUnload() {},
    onPullDownRefresh() {
        this.$showPullRefresh();
        this.initData();
    },
    onShow() {
        uni.showLoading({
            title: '加载中'
        });
        this.initData()
            .then((res) => {
                uni.hideLoading();
            })
            .catch((res) => {});
    },
    onReachBottom() {},
    methods: {
        initData() {
            return this.$http(`/jikas/${this.uuid}`, 'GET', {}).then((res) => {
                this.info = res.data.info;
                this.cardList = res.data.info.cards;
                this.skus = res.data.info.skus;
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.scope-container {
    // padding-top: 150rpx;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: 180rpx;
    padding-bottom: 80rpx;
}
</style>
