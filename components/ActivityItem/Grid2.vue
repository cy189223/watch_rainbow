<template>
    <view class="item-container grid2" :class="theme" @tap="$emit('click')">
        <view class="tag">{{ tagString }}</view>
        <view class="thumb-c">
            <image class="p-tag" :class="'location-' + info.image_tag.location" :src="info.image_tag.image" v-if="info.image_tag"></image>
            <image mode="aspectFill" :src="info.thumb" class="thumb"></image>
            <view class="presell-c" v-if="info.is_presell">预售</view>
        </view>
        <view class="body">
            <view class="title">{{ info.title }}</view>
            <view class="bottom">
                <view class="price">
                    <PriceDisplay :info="info"></PriceDisplay>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default() {
                return {};
            }
        },
        tag: {
            type: String
        },
        theme: {
            type: String,
            default() {
                return 'default-theme';
            }
        }
    },
    data() {
        return {};
    },
    computed: {
        tagString() {
            return (this.info && this.info.tags && this.info.tags[0]) || '创意热销';
        }
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
.item-container {
    border-radius: 30rpx 30rpx 20rpx 20rpx;
    overflow: hidden;
    margin-bottom: 28rpx;
    // box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
    position: relative;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 40rpx 30rpx 40rpx 44rpx;

    .tag {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        position: absolute;
        z-index: 9;
        font-size: 22rpx;
        padding: 2rpx 10rpx;
        border-radius: 6rpx;
        top: 36rpx;
        background-image: linear-gradient(120deg, #efde73 0%, #bea04f 100%);
        color: #463b3b;
    }

    .thumb-c {
        position: relative;
        .thumb {
            width: 100%;
            height: 330rpx;
            display: block;
        }

        .presell-c {
            position: absolute;
            width: 100%;
            text-align: center;
            background: #8352c4d1;
            color: white;
            left: 0rpx;
            bottom: 0rpx;
            font-size: 24rpx;
            padding: 6rpx 0rpx;
        }

        .p-tag {
            position: absolute;
            width: 100rpx;
            height: 100rpx;
            top: 0rpx;

            // 右上角
            &.location-1 {
                right: 0rpx;
            }

            // 右上角
            &.location-2 {
                left: 0rpx;
            }
        }
    }

    .body {
        padding: 12rpx 21rpx 10rpx 21rpx;
        box-sizing: border-box;
        .title {
            font-size: 26rpx;
            font-weight: 500;
            color: #fff;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }

        .price {
            text-align: right;
            font-size: 30rpx;
            font-weight: 800;
            color: #de1124;
        }
    }
}

.theme-1 {
    height: 400rpx;
    .body {
        border-radius: 20rpx;
        overflow: hidden;
        position: relative;
        top: -30rpx;

        .bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
}
</style>
