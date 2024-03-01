<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content animated bounceInDown" @tap.stop>
            <text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
            <view class="title">隐藏款开盒榜单</view>
            <scroll-view scroll-y class="list" v-if="list.length">
                <view class="item" v-for="(item, index) in list">
                    <image :src="item.user.headimg" mode="aspectFit" class="headimg"></image>

                    <view class="middle">
                        <view class="name">{{ item.user.name }}</view>
                        <view class="time">{{ $tool.formatDate(item.created_at, 'MM/dd hh:mm') }}</view>
                        <view class="sku-title">抽到了 {{ item.title }}</view>
                    </view>
                    <view class="right">
                        <image :src="item.thumb" mode="aspectFit" class="thumb"></image>
                    </view>
                </view>
            </scroll-view>
            <NoData v-else title="暂无榜单" styleStr="margin-top: 80rpx;"></NoData>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            list: [],
            isInit: false
        };
    },
    props: {
        uuid: {
            type: String
        }
    },
    computed: {},
    watch: {},
    onLoad(e) {},
    created() {
        this.initOrder();
    },
    methods: {
        initOrder() {
            uni.showLoading();
            this.$http(`/boxes/${this.uuid}/hidden-sku-rank`).then((res) => {
                this.list = res.data.list;
                uni.hideLoading();
            });
        },
        cancel() {
            this.$emit('cancel');
        },
        submit() {
            uni.showLoading();
            this.$http(`/orders/${this.uuid}/return-sale`, 'POST').then((res) => {
                this.isReturnSaleSuccess = 1;
                uni.hideLoading();
                this.$emit('refresh');

                this.$store.dispatch('getUserInfo');
            });
        },
        toPage(url) {
            uni.navigateTo({
                url: url
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.mask-content {
    width: 650rpx;
    min-height: 860rpx;
    background-color: #ededed;
    background-color: white;
    border-radius: 20rpx;
    padding: 30rpx 20rpx 50rpx 20rpx;
    box-sizing: border-box;
    position: relative;

    .close-btn {
        position: absolute;
        right: 26rpx;
        top: 26rpx;

        color: #999;
    }

    .title {
        text-align: center;
        font-size: 36rpx;
        font-weight: 500;
        margin-bottom: 30rpx;
    }

    .list {
        height: 40vh;

        .item {
            display: flex;
            align-items: center;
            border-bottom: 1rpx solid #f1f1f1;
            margin-bottom: 20rpx;
            margin-right: 10rpx;
            margin-left: 30rpx;

            .headimg {
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
                flex: 0 0 80rpx;
            }

            .middle {
                flex-grow: 1;
                margin: 0rpx 10rpx 0rpx 20rpx;

                .name {
                    font-size: 24rpx;
                    font-weight: 500;

                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                .time {
                    font-size: 24rpx;
                    font-weight: 500;
                }

                .sku-title {
                    font-size: 24rpx;
                    font-weight: 500;
                    text-align: left;
                }
            }

            .right {
                .thumb {
                    width: 120rpx;
                    height: 120rpx;
                    border-radius: 10rpx;
                    background: #f1f1f1;
                }

                .title {
                    font-size: 24rpx;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>
