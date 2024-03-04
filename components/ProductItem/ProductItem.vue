<template>
    <view class="item-container" :class="theme + ' ' + grid" @tap="toDetail">
        <template v-if="isShowTags">
            <template v-if="info.tags && info.tags.length">
                <view class="tag" v-for="(tag, index) in info.tags" :key="index">{{ tag }}</view>
            </template>
            <view class="tag" v-else>{{ '人气新品' }}</view>
        </template>
        <view class="thumb-c">
            <image class="p-tag" :class="theme + ' ' + grid + ' location-' + info.image_tag.location" :src="info.image_tag.image" v-if="info.image_tag"></image>
            <image mode="aspectFill" :src="info.thumb + '?x-oss-process=image/resize,w_500'" class="thumb"></image>
            <view class="presell-c" v-if="info.is_presell">预售</view>
            <view class="empty-stock" v-if="info.stock === 0">
                <image src="@/static/empty-stock.png" mode="widthFix"></image>
            </view>
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
        grid: {
            type: String,
            default() {
                return 'grid2';
            }
        },
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
        },
        isShowTags: {
            type: Boolean,
            default() {
                return true;
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
    methods: {
        toDetail() {
            uni.navigateTo({
                url: '/pages/productDetail/index?uuid=' + this.info.uuid
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.item-container {
    border-radius: 20rpx 20rpx 10rpx 10rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    // box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
    position: relative;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 40rpx 30rpx 40rpx 44rpx;
    box-sizing: border-box;

    .tag {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        position: absolute;
        z-index: 999;
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
            height: 210rpx;
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
            width: 70rpx;
            height: 70rpx;
            top: 0rpx;

            // 右上角
            &.location-1 {
                right: 0rpx;
            }

            // 右上角
            &.location-2 {
                left: 0rpx;
            }

            &.grid2 {
                width: 100rpx;
                height: 100rpx;
            }
        }

        .empty-stock {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0rpx;
            left: 0rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
                width: 50%;
            }
            background: rgba(0, 0, 0, 0.5);
        }
    }

    .body {
        // background: white;
        padding: 4rpx 14rpx 10rpx 14rpx;
        box-sizing: border-box;

        .title {
            font-weight: 500;
            color: #fff;
            font-size: 26rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }

        .price {
            text-align: right;
            font-size: 26rpx;
            font-weight: 800;
            color: #de1124;
        }
    }

    &.grid2 {
        border-radius: 20rpx 20rpx 20rpx 20rpx;

        .thumb {
            height: 310rpx;
        }

        .body {
            .title {
                font-size: 26rpx;
            }

            .price {
                text-align: right;
                font-size: 26rpx;
                font-weight: 800;
                color: #de1124;
            }
        }
    }
}
</style>
