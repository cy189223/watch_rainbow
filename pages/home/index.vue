<template>
    <view class="container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <!-- #ifndef MP-ALIPAY -->
        <HomeNavbar :title="page.title" searchType="all" :theme="scrollTop > 150 ? '#1d0051' : 'transparent'"></HomeNavbar>
        <!-- #endif -->
        <PageRender :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :page="page" theme="default" :isshowye="true"></PageRender>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            scrollTop: 0,
            refreshCounter: 0,
            getNextPageCounter: 0
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
    onPullDownRefresh() {
        this.$showPullRefresh().then((res) => {
            this.refreshCounter++;
        });
    },
    onShow() {},
    methods: {},
    onReachBottom() {
        this.getNextPageCounter++;
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding-top: 1rpx;
    background-color: #1d0051;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/bg_page_particle.gif');
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);
}
</style>
