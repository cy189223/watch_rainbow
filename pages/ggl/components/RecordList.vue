<template>
    <view class="wrap">
        <view class="_item">
            <view class="left">
                <image class="icon" src="https://i2.hdslb.com/bfs/face/5a516225ee26cfc3193b8a0d868fde3100a7e1ea.jpg@150w_150h.jpg"></image>
                <view>
                    <text class="username">张三的小弟张三的小弟</text>
                    <br />
                    <text class="time">2024-2-22 23:59</text>
                </view>
            </view>
            <view class="right">
                <image class="productIcon" src="https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/OdzjbTIVwwwmxouf1AKgOriDBECmPWZwUo2OmwfG.jpg"></image>
                <view>
                    <text class="productName">阿斯兰&基拉の奸情</text>
                    <br />
                    <text class="productTag">A赏</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {}
};
</script>

<style scoped lang="scss">
.wrap {
    padding: 0 20rpx;
    font-size: 28rpx;
    ._item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .left {
            max-width: 50%;
            display: flex;
            align-items: center;
            line-height: 22rpx;
            .icon {
                width: 60rpx;
                height: 60rpx;
                border-radius: 20rpx;
                margin-right: 16rpx;
            }
            .username {
                font-size: 24rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .time {
                font-size: 20rpx;
            }
        }
        .right {
            display: flex;
            .productIcon {
                width: 60rpx;
                height: 60rpx;
                border-radius: 6rpx;
            }
            .productName {
                font-size: 24rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .productTag {
                font-size: 20rpx;
                background-image: linear-gradient(to bottom, #d353e4, #70bad7);
                padding: 2rpx 10rpx;
                border-radius: 10rpx;
            }
        }
    }
}
</style>
