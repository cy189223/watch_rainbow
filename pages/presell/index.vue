<template>
    <view class="container">
        <view class="item" v-for="(item, index) in list">
            <view class="left">
                <view class="day">{{ $tool.formatDate(item.day, 'dd') }}</view>
                <view class="month">{{ $tool.formatDate(item.day, 'M月') }}</view>
            </view>
            <view class="middle">
                <view class="dot"></view>
                <view class="line"></view>
            </view>
            <view class="right">
                <view class="sub-item global-shadow" v-for="(subItem, i) in item.list" @tap="$tool.toLink(subItem.link)">
                    <image class="thumb" mode="aspectFill" :src="subItem.thumb"></image>
                    <view class="bottom">
                        <view class="title">
                            {{ subItem.title }}
                        </view>
                        <view class="price-c" v-if="subItem.money_price || subItem.score_price">
                            <PriceDisplay :info="subItem"></PriceDisplay>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            list: []
        };
    },
    computed: {},
    watch: {},
    onLoad() {
        this.initList();
    },
    methods: {
        initList() {
            uni.showLoading({
                title: '加载中'
            });
            this.$http('/presell-items').then((res) => {
                uni.hideLoading();
                this.list = res.data.list;
            });
        }
    }
};
</script>

<style lang="scss">
.container {
    padding-top: 30rpx;
}
.item {
    display: flex;
    margin-bottom: 30rpx;
    .left {
        width: 100rpx;
        flex: 0 0 100rpx;
        text-align: right;
        position: relative;
        top: -30rpx;
        .day {
            font-size: 46rpx;
            font-weight: 700;
        }
    }
    .middle {
        width: 60rpx;
        padding-left: 20rpx;
        flex: 0 0 60rpx;

        .dot {
            border-radius: 50%;
            width: 20rpx;
            height: 20rpx;
            border: 6rpx solid black;
            background: #ffcc0b;
        }
        .line {
            height: 100%;
            width: 1rpx;
            border-left: 2rpx dashed #333;
            position: relative;
            left: 14rpx;
        }
    }
    .right {
        .sub-item {
            border-radius: 20rpx;
            overflow: hidden;
            margin-bottom: 30rpx;
            .thumb {
                width: 530rpx;
                height: 280rpx;
            }

            .bottom {
                display: flex;
                justify-content: space-between;
                padding: 10rpx 20rpx 20rpx 20rpx;
                .title {
                    title: 28rpx;
                    font-weight: 500;
                }
                .price-c {
                    text-align: right;
                    color: #e63111;
                }
            }
        }
    }
}
</style>
