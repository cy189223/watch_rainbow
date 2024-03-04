<template>
    <view class="container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <!-- 淘宝小程序不需要 -->
        <!-- #ifndef MP-ALIPAY -->
        <HomeNavbar :title="page.title" searchType="all" :theme="scrollTop > 20 ? '#000000' : 'transparent'"></HomeNavbar>
        <!-- #endif -->
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            scrollTop: 0
        };
    },
    computed: {
        page() {
            return this.$store.getters.setting.shop_home;
        },
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        }
    },
    watch: {},
    onLoad() {
        this.$visitor.record('box_index');
    },
    onPullDownRefresh() {},
    onReachBottom() {
        this.getNextPageCounter++;
    },
    onShow() {},
    methods: {},
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #000000;
    background-image: url('https://api.caihongbox.com.cn/image/centertopbg.png');
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
}
</style>
