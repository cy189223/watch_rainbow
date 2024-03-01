<template>
    <view class="mask-c" @tap="close">
        <view class="mask-content" :class="{ 'with-header': isShowHeaderTab }" @tap.stop>
            <view class="close-btn" @tap="close">关闭详情</view>

            <view class="header-tabs" v-if="isShowHeaderTab">
                <view class="tab-item" :class="{ active: current == 0 }" :data-current="0" @tap="currentChange">
                    <text class="text">商品列表({{ skuList.length }})</text>
                </view>
                <view class="tab-item" :class="{ active: current == 1 }" :data-current="1" @tap="currentChange">
                    <text class="text">商品详情</text>
                </view>
            </view>
            <view class="header-tabs" v-else>
                <view class="tab-item active">
                    <text class="text">商品</text>
                </view>
            </view>

            <view class="swiper-wrapper-292">
                <swiper class="swiper-292" :current="current" @change="currentChange2">
                    <swiper-item v-if="isShowSkuList">
                        <scroll-view scroll-y class="scroll-view">
                            <view class="sku-list-30192">
                                <view v-for="(item, index) in skuList" :key="item.uuid" class="item-3452">
                                    <view v-if="item.is_hidden_sku" class="hidden-sku-text">隐藏款</view>
                                    <image :src="item.thumb + '?x-oss-process=image/resize,w_300'" mode="aspectFill" class="thumb" @tap="previewSkuThumb(index)"></image>
                                    <view class="right">
                                        <view class="title-201">
                                            {{ item.title }}
                                        </view>
                                        <view class="shang-title" :class="{ gift: item.shang_type == 1 }" v-if="item.shang_title">
                                            <span>{{ item.shang_title }}</span>
                                        </view>
                                        <view class="bottom-9234">
                                            <view class="price">
                                                <PriceDisplay :info="item" prefix="display_" v-if="item.display_money_price || item.display_score_price"></PriceDisplay>
                                                <PriceDisplay :info="item" v-else></PriceDisplay>
                                            </view>
                                            <template v-if="item.stock != null">
                                                <text class="sale">剩余{{ item.stock || 0 }}件</text>
                                            </template>
                                            <text class="percent" v-if="item.shang_type === 1">只赠不售</text>
                                            <text class="percent" v-else-if="item.odds != null">概率{{ item.odds }}%</text>
                                        </view>
                                    </view>
                                </view>
                                <view style="height: 150rpx"></view>
                            </view>
                        </scroll-view>
                    </swiper-item>
                    <swiper-item v-if="isShowDetail">
                        <scroll-view scroll-y class="scroll-view">
                            <image mode="widthFix" class="detail-image" :src="item" v-for="(item, index) in detailImageList" :key="index"></image>
                            <view style="height: 150rpx"></view>
                        </scroll-view>
                    </swiper-item>
                </swiper>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            current: 0
        };
    },
    props: {
        skuList: {
            type: Array
        },
        detailImageList: {
            type: Array
        },
        setting: {}
    },
    computed: {
        isShowDetail() {
            return this.detailImageList && this.detailImageList.length;
        },
        isShowSkuList() {
            return this.skuList && this.skuList.length;
        },
        isShowHeaderTab() {
            return this.isShowDetail && this.isShowSkuList;
        }
    },
    watch: {},
    onLoad(e) {},
    created() {},
    methods: {
        currentChange(e) {
            let index = e.currentTarget.dataset.current;
            this.current = index;
        },
        currentChange2(e) {
            let index = e.detail.current;
            this.current = index;
        },
        close() {
            this.$emit('close');
        },
        previewSkuThumb(index) {
            uni.previewImage({
                urls: this.skuList.map((item) => {
                    return item.thumb;
                }),
                current: index
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.mask-c {
    background: rgba(0, 0, 0, 0.3);
    position: relative;
    height: 100vh;
}

.mask-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;

    .swiper-wrapper-292 {
        height: calc(80vh - 90rpx);
    }

    .close-btn {
        position: absolute;
        bottom: 50rpx;
        padding: 0;
        z-index: 1000;

        width: 400rpx;
        left: 175rpx;

        border-radius: 50rpx;
        height: 86rpx;
        line-height: 86rpx;
        text-align: center;
        font-size: 30rpx;
        font-weight: bold;
        background-color: #6938b6;
        color: white;
        box-shadow: 0 0 20rpx rgba(105, 56, 182, 0.6);

        &:after {
            border: none;
        }

        &.disabled {
            background-color: #ddd;
            color: black;
            box-shadow: 0 0 20rpx #ddd;
        }
    }

    .scroll-view {
        height: 100%;
    }
}

.header-tabs {
    width: 100%;
    height: 90rpx;
    display: flex;
    z-index: 10;
    background-color: #ffffff;

    .tab-item {
        flex: 1;
        line-height: 90rpx;
        text-align: center;
        font-size: 28rpx;
        color: rgba(198, 198, 198, 1);
        font-weight: 500;

        &.active {
            color: rgba(51, 51, 51, 1);
            position: relative;
            font-weight: 500;

            .text {
                border-bottom: 6rpx solid rgba(51, 51, 51, 1);
                padding: 0rpx 0rpx 4rpx 0rpx;
            }
        }
    }
}

.swiper-292 {
    height: 100% !important;
}

.sku-list-30192 {
    padding: 0 30rpx;

    .item-3452 {
        display: flex;
        padding: 10rpx 0rpx;
        border-bottom: 1rpx solid #f1f1f1;
        position: relative;

        .hidden-sku-text {
            background: url('@/static/activity/status-bg-working.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            width: 120rpx;
            padding-left: 20rpx;
            height: 60rpx;
            line-height: 50rpx;
            text-align: center;
            color: white;
            font-size: 26rpx;
            font-weight: 500;
            right: 0rpx;
            top: 0rpx;
        }

        &.disableLine {
            border-bottom: 0rpx solid #f1f1f1;
        }

        .category {
            color: #393939;
            font-size: 22rpx;
            display: inline-block;
            margin: 20rpx 0rpx 10rpx 0rpx;
        }

        .thumb {
            width: 160rpx;
            height: 160rpx;
            margin-right: 30rpx;
            border-radius: 14rpx;
            flex: 0 0 160rpx;
        }

        .right {
            flex-grow: 1;
        }

        .title-201 {
            color: #393939;
            font-size: 28rpx;
            font-weight: bold;
            min-height: 60rpx;
            margin-top: 30rpx;
            width: 400rpx;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .shang-title {
            background-image: linear-gradient(to bottom, #4fb4fc, #68f1fb);
            border-radius: 6rpx;
            padding: 2rpx 10rpx;
            color: white;
            display: inline-block;
            position: relative;
            position: absolute;
            top: 35rpx;
            right: 10rpx;
            z-index: 100;
            font-size: 24rpx;
            font-weight: bold;

            &.gift {
                background: #6938b6;
            }
        }

        .price {
            color: #ff3535;
            font-weight: 500;
            margin-right: 20rpx;
        }

        .bottom-9234 {
            display: flex;
            align-items: center;
        }

        .origin-price {
            color: #b3b3b3;
            font-size: 24rpx;
            text-decoration: line-through;
        }

        .sale {
            color: #b3b3b3;
            font-size: 24rpx;
            flex-grow: 1;
        }

        .percent {
            color: #b3b3b3;
            font-size: 24rpx;
            white-space: nowrap;
            margin-left: 20rpx;
        }
    }
}

.detail-image {
    display: block;
    width: 100%;
}
</style>
