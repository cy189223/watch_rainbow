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
                <slot :name="item.slotName" v-else-if="item.type === 'customSlot'"></slot>
            </view>
        </view>
    </view>
</template>

<script>
import ImageList from '../modules/ImageList.vue';
import PureImageList from '../modules/PureImageList.vue';
import VideoItem from '../modules/Video.vue';
import SearchBar from '../modules/SearchBar.vue';

export default {
    components: {
        ImageList,
        PureImageList,
        VideoItem,
        SearchBar
    },
    props: {
        isHome: {
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
            customBar: 80
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
    methods: {
        toDetail(url) {
            uni.navigateTo({
                url: url
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
