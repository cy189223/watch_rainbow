<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content" @tap.stop v-if="isInit && !isReturnSaleSuccess">
            <text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
            <view class="title">确认返售给平台吗?</view>
            <view class="sku-list" scroll-y v-if="skus.length <= 6">
                <view class="sku-c" v-for="(item, index) in skus">
                    <view class="stock-c">x{{ item.total }}</view>
                    <image :src="item.thumb" mode="aspectFit" class="sku-thumb"></image>
                    <view class="sku-title">{{ item.title }}</view>
                    <view class="price-c">
                        <PriceDisplay :info="item"></PriceDisplay>
                    </view>
                </view>
            </view>
            <scroll-view class="sku-list scroll-list" scroll-y v-else>
                <view class="sku-c" v-for="(item, index) in skus">
                    <view class="stock-c">x{{ item.total }}</view>
                    <image :src="item.thumb" mode="aspectFit" class="sku-thumb"></image>
                    <view class="sku-title">{{ item.title }}</view>
                    <view class="price-c">
                        <PriceDisplay :info="item"></PriceDisplay>
                    </view>
                </view>
            </scroll-view>
            <view class="money-c">
                <view class="sub-title">当前折价率为{{ info.return_sale_ratio }}，返售后你将获得:</view>
                <view class="money item" v-if="info.return_money">
                    <view>人民币</view>
                    <view class="number money">{{ info.return_money / 100 }}</view>
                    元
                    <view class="type">(原路退回)</view>
                </view>
                <view class="money item" v-if="info.return_redpack">
                    <view>人民币</view>
                    <view class="number money">{{ info.return_redpack / 100 }}</view>
                    元
                    <view class="type">(退回{{ $money() }}数)</view>
                </view>
                <view class="redpack item">
                    <view>{{ scoreAlias }}</view>
                    <view class="number score">{{ info.return_score }}</view>
                    个
                    <view class="type">(实时退回余额)</view>
                </view>
                <view class="tips">抽到{{ scoreAlias }}、优惠券、{{ $money() }}等虚拟礼品不可返售</view>
            </view>

            <view class="btn-c">
                <button class="btn cancel bg-purple" @tap="cancel">再想想</button>
                <button class="btn submit bg-yellow" @tap="submit">确认返售</button>
            </view>
        </view>
        <view class="mask-content" @tap.stop v-else-if="isReturnSaleSuccess">
            <text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
            <view class="title">
                <text class="new-iconfont icon-check"></text>
                返售成功
            </view>
            <view class="sku-c">
                <image :src="sku.thumb" mode="aspectFit" class="sku-thumb"></image>
                <view class="sku-title">{{ sku.title }}</view>
            </view>
            <view class="btn-c">
                <button class="btn cancel bg-purple" @tap="toPage('/pages/myRedpack/index')">{{ $money() }}数量</button>
                <button class="btn submit bg-yellow" @tap="toPage('/pages/myScore/index')">{{ scoreAlias }}数</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            info: {},
            skus: [],
            isInit: false,
            isReturnSaleSuccess: false
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
            this.$http(`/orders/${this.uuid}/return-sale-info`).then((res) => {
                this.isInit = true;
                this.skus = res.data.skus;
                (this.info = res.data), uni.hideLoading();
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
    width: 660rpx;
    background-color: #ededed;
    background-color: white;
    border-radius: 20rpx;
    padding: 60rpx 60rpx 50rpx 60rpx;
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
    }

    .sku-list {
        display: flex;
        justify-content: center;
        margin-top: 30rpx;
        margin: 30rpx -20rpx 0rpx -20rpx;
        flex-wrap: wrap;

        .sku-c {
            text-align: center;
            margin: 20rpx 6rpx;
            position: relative;

            .stock-c {
                position: absolute;
                right: 0rpx;
                top: 0rpx;
                background: rgba(0, 0, 0, 0.4);
                color: white;
                font-size: 22rpx;
                font-weight: 500;
                padding: 0rpx 20rpx;
                border-radius: 20rpx;
            }

            .sku-thumb {
                width: 180rpx;
                height: 200rpx;
                border-radius: 20rpx;
                background: #f1f1f1;
            }

            .sku-title {
                font-size: 22rpx;
                color: #666;
                font-weight: 500;
                height: 60rpx;

                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                line-clamp: 2;
                max-width: 180rpx;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }

        &.scroll-list {
            display: block;
            max-height: 50vh;
            width: 600rpx;
            .sku-c {
                float: left;
            }
        }
    }

    .money-c {
        .sub-title {
            margin-top: 10rpx;
            margin-bottom: 20rpx;
            font-size: 28rpx;
            font-weight: 500;
        }

        .item {
            display: flex;
            align-items: center;

            .number {
                font-size: 40rpx;
                font-weight: 500;
                color: #e63111;
            }

            .type {
                margin-left: 10rpx;
                color: gray;
            }
        }

        .tips {
            font-size: 22rpx;
            color: red;
        }
    }

    .icon-check {
        color: #2ba246;
        font-size: 46rpx;
        position: relative;
        top: 4rpx;
        margin-right: 10rpx;
    }

    .btn-c {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn {
            padding: 0;
            margin: 50rpx 0rpx 0rpx 0rpx;
            width: 46%;
            border-radius: 20rpx;
            height: 86rpx;
            line-height: 86rpx;
            text-align: center;
            font-size: 30rpx;
            font-weight: bold;
            background-color: #6938b6;
            color: white;

            &:after {
                border: none;
            }

            &.submit {
            }
        }
    }
}
</style>
