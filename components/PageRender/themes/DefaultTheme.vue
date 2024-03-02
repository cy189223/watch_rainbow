<template>
    <view>
        <view class="content-c" :style="'margin-top:' + pageStyle.margin_top + 'rpx; padding: 0 ' + pageStyle.margin + 'rpx;'">
            <view
                :style="
                    'margin-top:' +
                    (item.style && item.style.margin_top) +
                    'rpx; padding: 0 ' +
                    (item.style && item.style.margin) +
                    'rpx;' +
                    (item.style.display === 'none' ? 'display:none' : '') +
                    ';'
                "
                v-for="(item, index) in modules"
                :key="index"
            >
                <Banner
                    :list="item.list"
                    :iStyle="'height: ' + item.style.height + 'rpx;'"
                    :imageStyle="'border-radius: ' + item.style.radius + 'rpx;'"
                    v-if="item.type === 'swiper'"
                ></Banner>
                <block v-if="item.type === 'swiper' && isshowye">
                    <view class="orderbox">
                        <image class="gonggao-icon" src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%85%AC%E5%91%8A.png" mode="scaleToFill"></image>
                        <NoticeBar scrollable single :text="ordernotice" style="flex: 1" color="#fff" background-color="none" speed="50"></NoticeBar>
                    </view>
                    <view class="imgTools">
                        <image class="left" src="https://watch-box.oss-cn-beijing.aliyuncs.com/imgTool.png" mode="widthFix"></image>
                        <image class="right" src="https://watch-box.oss-cn-beijing.aliyuncs.com/imgTool.png" mode="widthFix"></image>
                    </view>
                    <view class="btnlist">
                        <image
                            class="btnbox"
                            src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%AE%A2%E6%9C%8D%20(1).png"
                            mode="scaleToFill"
                            @tap="toDetail('/pages/jiaoliuqun/jiaoliuqun')"
                        ></image>
                        <image
                            class="btnbox"
                            src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E7%AD%BE%E5%88%B0.png"
                            mode="scaleToFill"
                            @tap="toDetail('/pages/activity/index')"
                        ></image>
                        <image
                            class="btnbox"
                            src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E6%8E%92%E8%A1%8C%E6%A6%9C.png"
                            mode="scaleToFill"
                            @tap="toDetail('/pages/ranking/index')"
                        ></image>
                    </view>
                </block>
                <cardTitle
                    :title="item.title"
                    :moreText="item.more_text"
                    :isShowMore="item.is_show_more"
                    :leftIcon="item.left_icon"
                    :link="item.more_link"
                    v-else-if="item.type === 'title'"
                ></cardTitle>
                <BoxList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'boxes'" />
                <ProductList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'products'" />
                <CouponList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'coupons'" />
                <ActivityList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'activities'" />
                <IPList v-else-if="item.type === 'ips'"></IPList>
                <ImageList v-else-if="item.type === 'images'" :module="item"></ImageList>
                <SearchBar v-else-if="item.type === 'searchBar'" :module="item"></SearchBar>
                <PureImageList v-else-if="item.type === 'imageList'" :module="item"></PureImageList>
                <VideoItem v-else-if="item.type === 'video'" :module="item"></VideoItem>
                <SigninCard v-else-if="item.type === 'signin'" :module="item" />
                <HTML v-else-if="item.type === 'html'" :html="item.html" />
            </view>
        </view>
    </view>
</template>

<script>
import ImageList from '../modules/ImageList.vue';
import PureImageList from '../modules/PureImageList.vue';
import VideoItem from '../modules/Video.vue';
import SearchBar from '../modules/SearchBar.vue';
import NoticeBar from '../../../components/NoticeBar/index.vue';

export default {
    components: {
        ImageList,
        PureImageList,
        VideoItem,
        SearchBar,
        NoticeBar
    },
    props: {
        isshowye: {
            type: Boolean,
            default() {
                return false;
            }
        },
        refreshCount: {
            type: Number
        },
        page: {
            type: Object,
            default() {
                return {
                    style: {}
                };
            }
        },
        refreshCounter: Number,
        getNextPageCounter: Number
    },
    data() {
        return {
            customBar: 80,
            ordernotice: ''
        };
    },
    computed: {
        modules() {
            return this.page.modules || [];
        },
        pageStyle() {
            return (this.page && this.page.style) || {};
        }
    },
    created() {
        this.$http(`/setting/notice`).then((res) => {
            this.ordernotice = res.data.setting.notice;
        });
    },
    mounted() {},
    watch: {},
    methods: {
        toDetail(url) {
            uni.navigateTo({
                url: url
            });
        }
    }
};
</script>

<style lang="scss" scoped>
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
.imgTools {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 16rpx;
    image {
        width: 49%;
        height: auto;
    }
    .right {
        margin-left: 2%;
    }
}

.btnlist {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btnbox {
        width: 160rpx;
        height: 160rpx;
    }
}
</style>
