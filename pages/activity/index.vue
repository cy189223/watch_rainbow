<template>
    <view class="container">
        <view class="signinbox" v-if="item.type === 'signin'" v-for="(item, index) in page.modules" :key="index">
            <SigninCard :module="item" />
        </view>
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
            return this.$store.getters.setting.activity_home;
        }
    },
    watch: {},
    onLoad() {
        this.$visitor.record('activity_index');
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
        // console.log('reach bottom')
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-image: url('https://api.caihongbox.com.cn/image/qiandaobg.jpg');
    background-position: top;
    background-size: 100%;
}
.signinbox {
    padding: 260rpx 30rpx 0;
}
</style>
