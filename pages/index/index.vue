<template>
    <view class="container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <!-- 淘宝小程序不需要 -->
        <!-- #ifndef MP-ALIPAY -->
        <HomeNavbar :title="page.title" searchType="all" :theme="scrollTop > 20 ? '#000000' : 'transparent'"></HomeNavbar>
        <!-- #endif -->

        <PageRender
            @getliushuilist="getliushuilist"
            :page="page"
            :refreshCounter="refreshCounter"
            :getNextPageCounter="getNextPageCounter"
            :yfslist="yfslist"
            :ssjlist="ssjlist"
            :liushuilist="list"
            theme="homepage"
        ></PageRender>

        <Danmus v-if="danmuSetting.is_enabled" :setting="danmuSetting" :list="danmuList"></Danmus>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            scrollTop: 0,
            danmuSetting: {},
            danmuList: [],
            refreshCounter: 0,
            getNextPageCounter: 0,
            list: {},
            // amountnum:'',
            yfslist: {},
            ssjlist: {}
        };
    },
    computed: {
        page() {
            return this.$store.getters.setting.box_home;
        },
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        }
    },
    watch: {},
    onLoad() {
        this.$visitor.record('box_index');

        this.getDanmu();
    },
    onPullDownRefresh() {
        this.$showPullRefresh().then((res) => {
            this.refreshCounter++;
        });
        this.getDanmu();
        this.getList();
        this.getyfsList();
        this.getssjList();
    },
    onReachBottom() {
        this.getNextPageCounter++;
    },
    onShow() {
        this.getList();
        this.getyfsList();
        this.getssjList();
    },
    methods: {
        getyfsList() {
            this.$http(`/yifanshangs`, 'get', {
                type: 'yfs'
            }).then((res) => {
                this.yfslist = res.data;
            });
        },
        getssjList() {
            this.$http(`/yifanshangs`, 'get', {
                type: 'ssj'
            }).then((res) => {
                this.ssjlist = res.data;
            });
        },
        getDanmu() {
            this.$http('/danmus/home').then((res) => {
                this.danmuSetting = res.data.setting;
                this.danmuList = res.data.list;
            });
        },
        getList() {
            this.$http(`/accounts`, 'get', {
                type: 'fudai'
            }).then((res) => {
                this.list = res.data;
            });
        },
        // getamount(){
        // 	this.$http(`/account/total_amount`, 'get', {
        // 		type: 'fudai'
        // 	}).then(res => {
        // 		this.amountnum = res.data.amount
        // 	})
        // },
        getliushuilist() {
            this.getList();
        }
    },
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
