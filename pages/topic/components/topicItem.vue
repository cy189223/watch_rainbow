<template>
    <view class="item-container" @tap="toDetail">
        <view class="top">
            <image mode="aspectFill" class="headimg" :src="info.user.headimg"></image>
            <view class="name-c">
                <view class="name">{{ info.user.name }}</view>
                <view class="time">{{ $tool.showShortTime(info.created_at) }}</view>
            </view>
            <text class="set-top-text" v-if="info.set_top_at">置顶</text>
            <text class="new-iconfont icon-heart" @tap.stop="likeOrCancel" :class="{ actived: isLike }"></text>
        </view>
        <view class="body">
            <view class="text">{{ info.text }}</view>
            <view v-if="info.images.length" class="image-c" :class="'image-c-' + imageList">
                <image mode="aspectFill" :src="url + '?x-oss-process=image/resize,w_300'" v-for="(url, index) in imageList"></image>
            </view>
            <view class="bottom">
                <text class="new-iconfont icon-comment"></text>
                <text class="comment-total">{{ info.comments_count }}</text>
                <view v-if="info.topic_tag" class="tag">#{{ info.topic_tag.title }}</view>
                <view class="brank"></view>
                <text class="new-iconfont icon-more"></text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            isLike: false
        };
    },
    props: {
        info: {
            type: Object
        }
    },
    computed: {
        imageList() {
            return this.info.images.splice(0, 3);
        }
    },
    watch: {
        info() {
            this.isLike = this.info.is_liked;
        }
    },
    onLoad() {},
    onShow() {},
    methods: {
        likeOrCancel() {
            this.isLike = !this.isLike;

            this.$http(`/topics/${this.info.uuid}/actions`, 'POST', {
                type: 'like_or_cancel'
            });
        },
        toDetail() {
            uni.navigateTo({
                url: '/pages/topic/topicDetail?uuid=' + this.info.uuid
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.item-container {
    padding-bottom: 20rpx;
    margin-bottom: 50rpx;
    border-bottom: 1rpx solid #e7e7e7;

    .top {
        display: flex;
        align-items: center;
        justify-content: center;

        .headimg {
            width: 72rpx;
            height: 72rpx;
            border-radius: 50%;
            margin-right: 20rpx;
        }

        .name-c {
            flex-grow: 1;

            .name {
                font-size: 30rpx;
                font-weight: 500;
                color: #333333;
                // line-height: 30rpx;
                margin-bottom: 6rpx;
                width: 400rpx;

                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }

            .time {
                font-size: 22rpx;
                font-weight: 500;
                color: #8c939b;
            }
        }

        .set-top-text {
            margin-right: 20rpx;
            font-size: 22rpx;
            border: 1px solid red;
            color: red;
            padding: 0rpx 10rpx;
            border-radius: 10rpx;
        }

        .icon-heart {
            font-size: 40rpx;
            color: #eee;

            &.actived {
                color: red;
            }
        }
    }

    .body {
        .text {
            font-size: 28rpx;
            // font-weight: 500;
            color: #373c4e;
            line-height: 38rpx;
            padding: 20rpx 0rpx;
            text-align: justify;
        }

        .image-c {
            image {
                width: 212rpx;
                height: 174rpx;
                border-radius: 20rpx;
                margin-right: 22rpx;

                &:nth-child(3n) {
                    margin-right: 0rpx;
                }
            }
        }
    }

    .bottom {
        font-weight: 500;
        color: #b7bbc3;
        display: flex;
        align-items: center;
        font-size: 36rpx;
        margin-top: 10rpx;

        .comment-total {
            margin-left: 10rpx;
            font-size: 28rpx;
        }

        .tag {
            padding: 4rpx 20rpx;
            border-radius: 20rpx;
            background-color: #f1f1f1;
            color: #b7bbc3;
            font-size: 20rpx;
            margin-left: 20rpx;
        }

        .brank {
            flex: 1;
            height: 1rpx;
        }
    }
}
</style>
