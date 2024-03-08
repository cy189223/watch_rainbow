<template>
    <view class="wrap">
        <view class="bl" v-for="item in num">
            {{ item }}
        </view>
    </view>
</template>

<script>
export default {
    props: {
        num: {
            default: 100
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style scoped lang="scss">
.wrap {
    margin-top: 20rpx;
    display: grid;
    grid-template-columns: repeat(auto-fill, 60rpx);
    grid-row-gap: 20rpx;
    grid-column-gap: 20rpx;
    .bl {
        height: 60rpx;
        background: #f86567;
        line-height: 60rpx;
        text-align: center;
        border-radius: 10rpx;
    }
}
</style>
