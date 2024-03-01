<template>
    <view class="title-container" :style="cssStyle">
        <image v-if="leftIcon" class="icon" :src="leftIcon"></image>
        <view class="text">
            {{ title }}
        </view>
        <view class="more-btn" v-if="isShowMore" @tap="more" hover-class="hover">
            <text>{{ moreText || '更多' }}</text>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default() {
                return '';
            }
        },
        leftIcon: {
            type: String,
            default() {
                return '';
            }
        },
        cssStyle: {
            type: String
        },
        isShowMore: {
            type: Boolean | Number,
            default: () => {
                return false;
            }
        },
        link: {
            type: Object | Array | String,
            default() {
                return {};
            }
        },
        moreText: {
            type: String,
            default() {
                return '';
            }
        }
    },
    methods: {
        more() {
            if (typeof this.link === 'string') {
                uni.navigateTo({
                    url: this.link
                });
            } else {
                this.$tool.toLink(this.link);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.title-container {
    background-size: 402rpx auto;
    background-repeat: no-repeat;
    padding: 15rpx 25rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: #fff;
    border: 2px solid #f7f0ff;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    margin-top: 30rpx;
    display: flex;
    align-items: center;

    .icon {
        width: 34rpx;
        height: 34rpx;
        margin-right: 10rpx;
    }

    .text {
        flex-grow: 1;
        position: relative;
        text-shadow:
            1px 1px 0px #00d0ff,
            -2px 0px 0px #c41cef;
        .en {
            font-size: 36rpx;
            font-weight: 800;
            color: #f9e9ad;
            position: absolute;
            top: -20rpx;
            left: 6rpx;
            z-index: 0;

            color: linear-gradient(#f9e9ad, rgba(255, 255, 255, 0.1));
        }
    }
}
</style>
