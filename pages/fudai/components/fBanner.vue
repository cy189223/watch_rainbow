<template>
    <view class="swiper-wrap" :style="iStyle">
        <swiper autoplay @change="change" :interval="3000">
            <swiper-item v-for="(item, index) in list" :key="index">
                <view style="position: relative">
                    <image
                        mode="aspectFill"
                        :src="item.thumb + '?x-oss-process=image/resize,w_1200'"
                        :style="imageStyle"
                        class="slide-image"
                        :data-item="item"
                        @tap="handleClick"
                    />
                    <view class="title">
                        {{ item.title }}
                        <text style="color: red; margin-left: 20rpx">概率：{{ item.front_odds }}%</text>
                    </view>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    name: 'Banner',
    props: {
        list: {
            type: Array
        },
        iStyle: {
            type: String
        },
        dotListStyle: {
            type: String
        }
    },
    data() {
        return {
            current: 0
        };
    },
    methods: {
        change(e) {
            this.current = e.detail.current;
        },
        handleClick(e) {
            let item = e.currentTarget.dataset.item;
            let link = item.link || {};
            this.$tool.toLink(link);
        }
    }
};
</script>

<style lang="scss" scoped>
.swiper-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 16rpx;

    swiper {
        height: 100%;
        image {
            width: 300rpx;
            height: 300rpx;
            border-radius: 10rpx;
        }
        .title {
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 22rpx;
        }
    }
}
</style>
