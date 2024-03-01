<template>
    <view class="category-menu">
        <!-- <view class="item">
			<image src="/static/c1.png"></image>
			<text>ALL</text>
		</view> -->

        <view class="item" v-for="(item, index) in list" :key="index" @tap="handleClick(item)">
            <view class="ip-thumb" :class="{ active: current == item.id }">
                <image mode="aspectFill" hover-class="hover" :src="item.thumb + '?x-oss-process=image/resize,w_250'"></image>
            </view>
            <text>{{ item.title }}</text>
        </view>

        <view class="item" @tap="more">
            <image src="/static/more-round.png" hover-class="hover"></image>
            <text>更多</text>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {},
    methods: {
        handleClick(item) {
            uni.navigateTo({
                url: `/pages/search/index?type=box&category_id=${item.id}&title=${item.title}`
            });
        },
        more(e) {
            uni.navigateTo({
                url: '/pages/category/index'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.category-menu {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .ip-thumb {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);

            &.active {
                position: relative;
                &:after {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    width: 100%;
                    height: 100%;
                    border: 2px solid #6938b6;
                    border-radius: 50%;
                }
            }
        }

        image {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
        }

        text {
            margin-top: 10rpx;
            color: #000;
            font-size: 22rpx;
            line-height: 30rpx;
        }
    }
}
</style>
