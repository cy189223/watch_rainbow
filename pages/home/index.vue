<template>
    <view class="container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <!-- #ifndef MP-ALIPAY -->
        <HomeNavbar :title="page.title" searchType="all" :theme="scrollTop > 150 ? '#000000' : 'transparent'"></HomeNavbar>
        <!-- #endif -->
        <PageRender :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :page="page" theme="default">
            <template v-slot:gonggao>
                <view class="orderbox" v-if="ordernotice">
                    <image class="gonggao-icon" src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%85%AC%E5%91%8A.png" mode="scaleToFill"></image>
                    <NoticeBar scrollable single :text="ordernotice" style="flex: 1" color="#fff" background-color="none" speed="50"></NoticeBar>
                </view>
            </template>
            <template v-slot:tools>
                <view class="btnlist">
                    <view class="btnbox">
                        <image
                            src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%AE%A2%E6%9C%8Dnew1.png"
                            mode="scaleToFill"
                            @tap="toDetail('/pages/jiaoliuqun/jiaoliuqun')"
                        ></image>
                        <text>客服</text>
                    </view>

                    <view class="btnbox">
                        <image src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E7%AD%BE%E5%88%B0new1.png" mode="scaleToFill" @tap="toDetail('/pages/activity/index')"></image>
                        <text>签到</text>
                    </view>

                    <view class="btnbox">
                        <image
                            src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E6%8E%92%E8%A1%8C%E6%A6%9Cnew1.png"
                            mode="scaleToFill"
                            @tap="toDetail('/pages/ranking/index')"
                        ></image>
                        <text>排行榜</text>
                    </view>
                </view>
            </template>
        </PageRender>

        <HomepageTheme
            @getliushuilist="getList"
            :page="box_home_page"
            :refreshCounter="refreshCounter"
            :getNextPageCounter="getNextPageCounter"
            :yfslist="yfslist"
            :ssjlist="ssjlist"
            :liushuilist="list"
        ></HomepageTheme>
    </view>
</template>

<script>
import NoticeBar from '../../components/NoticeBar/index.vue';
import HomepageTheme from './components/HomepageTheme.vue';
export default {
    components: {
        NoticeBar,
        HomepageTheme
    },
    data() {
        return {
            scrollTop: 0,
            refreshCounter: 0,
            getNextPageCounter: 0,
            ordernotice: '',
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
        },
        box_home_page() {
            return this.$store.getters.setting.box_home;
        }
    },
    watch: {},
    onLoad() {
        this.$visitor.record('box_index');
        this.$http(`/setting/notice`).then((res) => {
            this.ordernotice = res.data.setting.notice;
        });
    },
    onPullDownRefresh() {
        this.$showPullRefresh().then((res) => {
            this.refreshCounter++;
        });
        // this.getDanmu();  //TODO
        this.getList();
        this.getyfsList();
        this.getssjList();
        this.$http(`/setting/notice`).then((res) => {
            this.ordernotice = res.data.setting.notice;
        });
    },
    onShow() {
        this.getList();
        this.getyfsList();
        this.getssjList();
    },
    methods: {
        toDetail(url) {
            uni.navigateTo({
                url: url
            });
        },
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
        getList() {
            this.$http(`/accounts`, 'get', {
                type: 'fudai'
            }).then((res) => {
                this.list = res.data;
            });
        }
    },
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
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/65dea2a339eab7782bf47e83.gif');
    background-position: top;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);
    .orderbox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .gonggao-icon {
            width: 48rpx;
            height: 48rpx;
        }
    }
    .btnlist {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #fff;
        box-shadow: 0rpx 0rpx 11rpx 0rpx rgba(176, 128, 255, 0.8);
        border: 2px solid #a809f8;
        padding: 15rpx 0 50rpx 0;
        margin-bottom: 25rpx;
        border-radius: 10rpx;
        .btnbox {
            width: 100rpx;
            height: 110rpx;
            text-align: center;
            font-size: 28rpx;
            image {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
