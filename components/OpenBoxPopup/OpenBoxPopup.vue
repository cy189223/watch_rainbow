<template>
    <view class="container-scope animated bounceInDown" :class="{ 'with-navtar': isNavbarEnable }">
        <view class="content-scope" v-if="isNotOpen">
            <view class="title" style="margin-top: 300rpx">抢购用户太多了</view>
            <view class="title" style="margin-top: 20rpx">请不要离开此页面，等待几秒后刷新哦~</view>
            <view class="bottom">
                <view class="button-c">
                    <view class="btn confirm bg-purple" @tap="handleRefresh">立即刷新</view>
                </view>
            </view>
        </view>
        <view class="content-scope" v-else>
            <image src="https://api.caihongbox.com.cn/image/getimg.png" mode="aspectFit" class="titleimg"></image>

            <scroll-view class="scroll-view-212" scroll-y>
                <view class="sku-list">
                    <view class="item" @tap="checkSku(item)" :class="'item-' + skus.length" v-for="(item, index) in skus" :key="item.uuid">
                        <view class="thumb-c">
                            <view class="lockIcons" v-show="isShowLockIcon(item) && !isReturnSaleSuccess">
                                <image class="_lockIcon" v-show="item.isLock" :src="`https://watch-box.oss-cn-beijing.aliyuncs.com/${item.isLock ? 'lock' : 'unlock'}.png`"></image>
                            </view>
                            <image class="thumb" :src="item.thumb" mode="aspectFit"></image>
                            <view class="_mTitle" :class="item.options.shang_title ? 'shang-title' : 'title'">{{ item.title }}</view>
                            <view class="total">×{{ item.total }}</view>
                            <view class="title" :class="{ gift: item.options.shang_type === 1 }" v-if="item.options.shang_title">{{ item.options.shang_title }}</view>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <view class="lottery-tips" v-if="showResult && rewardJikaTimes" @tap="goJikaDetail">
                <text>恭喜您额外获得</text>
                <text class="ticket-total">{{ rewardJikaTimes.total }}</text>
                <text>次集卡机会</text>
                <text class="new-iconfont icon-arrow-right"></text>
            </view>
            <view class="lottery-tips" v-else-if="showResult && rewardLotteryTicket" @tap="goLotteryDetail">
                <text>恭喜您额外获得</text>
                <text class="ticket-total">{{ rewardLotteryTicket.total }}</text>
                <text>张活动抽奖码</text>
                <text class="new-iconfont icon-arrow-right"></text>
            </view>

            <view class="bottom" v-if="showResult">
                <view class="button-c" v-if="isReturnSaleSuccess">
                    <view class="btn confirm bg-purple" @tap="goBack">再抽一个</view>
                    <view class="btn return-sale bg-white">已返售</view>
                </view>
                <view class="button-c" v-else-if="tryMode">
                    <view class="btn confirm bg-purple" @tap="goBack">试玩不发货哦~</view>
                </view>
                <view class="button-c" v-else>
                    <view class="btn confirm bg-purple" @tap="sendCloud">
                        全部云发货({{ skus.filter((item) => !item.isLock).reduce((sum, e) => sum + Number(e.score_price * e.total || 0), 0) }})
                    </view>
                    <view class="btn return-sale" @tap="returnSale" v-if="!orderConfig.is_ban_return_sale">我的赏袋</view>
                </view>
            </view>
        </view>

        <ReturnSalePopup @cancel="isShowReturnSale = false" @refresh="isReturnSaleSuccess = true" :uuid="orderUuid" v-if="isShowReturnSale"></ReturnSalePopup>
    </view>
</template>

<script>
export default {
    props: {
        boxImg: String,
        boxImgMode: String,
        buttonTitle: String,
        order: Object,
        tryMode: Boolean,
        tryInfo: Object,
        isNavbarEnable: false
    },
    data() {
        return {
            showResult: false,
            status: 0,
            isShowReturnSale: false,
            isReturnSaleSuccess: false,
            package: {},
            isNotOpen: false // 未开启
        };
    },
    mounted() {
        this.initData();
    },
    computed: {
        skus() {
            return this.package.skus || [];
        },
        orderConfig() {
            return this.$store.getters.setting.order;
        },
        rewardJikaTimes() {
            return this.package.reward && this.package.reward.jika_times;
        },
        rewardLotteryTicket() {
            return this.package.reward && this.package.reward.lottery_ticket;
        }
    },
    methods: {
        sendCloud() {
            const checkItem = this.skus.filter((item) => !item.isLock);
            if (checkItem.length == 0) {
                uni.showToast({
                    title: '暂无可发货赏品',
                    icon: 'none'
                });
                return;
            }
            uni.showModal({
                title: '确认回收',
                content: '确认要批量回收吗?',
                success: (res) => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '回收中...'
                        });
                        this.$http(`/asset/return-sale/confirm`, 'post', {
                            ids: checkItem.map((item) => item.id)
                        }).then((res) => {
                            this.isReturnSaleSuccess = 1;
                            uni.showToast({
                                title: '发货成功',
                                icon: 'none'
                            });
                        });
                    }
                }
            });
        },
        isShowLockIcon(item) {
            let flag = true;
            if (item.sku_type === 'score') {
                flag = false;
            } else if (item.sku_type === 'coupon') {
                flag = false;
            } else if (item.sku_type === 'redpack') {
                flag = false;
            }
            return flag;
        },
        initData() {
            // 演示模块
            if (this.tryMode) {
                this.$http(`/try/packages/${this.tryInfo.package_uuid}`).then((res) => {
                    res.data.skus.forEach((item) => {
                        item.isLock = false;
                    });
                    this.package = res.data;
                    this.$playAudio('open');
                    this.showResult = true;
                });
            } else {
                this.$http(`/asset/package?order_id=${this.order.id}`)
                    .then((res) => {
                        res.data.skus.forEach((item) => {
                            item.isLock = false;
                        });
                        this.package = res.data;
                        this.$playAudio('open');
                        this.showResult = true;
                    })
                    .catch((err) => {
                        // 未开启
                        this.isNotOpen = true;
                    });
            }
        },
        handleRefresh() {
            this.isNotOpen = false;
            this.initData();
        },
        goLotteryDetail() {
            uni.navigateTo({
                url: '/packageA/lottery/detail?uuid=' + this.rewardLotteryTicket.uuid
            });
        },
        goJikaDetail() {
            uni.navigateTo({
                url: '/pages/jika/detail?uuid=' + this.rewardJikaTimes.uuid
            });
        },
        returnSale() {
            uni.switchTab({
                url: '/pages/myBox/index'
            });
        },
        handleOk() {
            uni.switchTab({
                url: '/pages/myBox/index'
            });
        },
        goBack() {
            uni.navigateBack({
                delta: 1
            });
        },
        close() {
            this.$emit('close');
            this.$emit('refresh');
        },
        checkSku(item) {
            if (item.sku_type === 'score') {
                uni.navigateTo({
                    url: '/pages/myScore/index'
                });
            } else if (item.sku_type === 'coupon') {
                uni.navigateTo({
                    url: '/pages/myCoupons/index'
                });
            } else if (item.sku_type === 'redpack') {
                uni.navigateTo({
                    url: '/pages/myRedpack/index'
                });
            } else {
                console.log(item);
                item.isLock = !item.isLock;
                uni.showToast({
                    title: item.title + '已' + (item.isLock ? '加入保险柜' : '移出保险柜'),
                    icon: 'none'
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.lottery-tips {
    background: white;
    font-size: 26rpx;
    padding: 10rpx 20rpx 10rpx 30rpx;
    border-radius: 30rpx;
    width: 400rpx;
    margin: 30rpx auto;
    text-align: center;
    justify-content: center;

    .ticket-total {
        font-weight: 500;
        font-size: 36rpx;
        color: #e63111;
    }
    .icon-arrow-right {
        font-size: 40rpx;
    }
    display: flex;

    align-items: center;
}

.reward-row {
    text-align: center;
    font-size: 28rpx;
    font-weight: 500;

    .number {
        font-size: 46rpx;
        color: red;
        font-weight: 700;
        margin-right: 6rpx;
    }

    .text-c {
        color: gray;
        font-size: 28rpx;
        margin-top: 6rpx;

        .check-asset-c {
            display: inline;
            margin-left: 6rpx;
        }

        .check-asset-btn {
            color: #666;
            text-decoration: underline;
        }
    }
}

.container-scope {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

    .close-btn {
        font-size: 38rpx;
        background: #6938b6;
        border: 2px solid #6938b6;
        border-radius: 50%;
        width: 60rpx;
        color: white;
        margin: 0rpx auto;
        right: 50rpx;
        top: 260rpx;
        height: 60rpx;
        text-align: center;
        line-height: 56rpx;
        box-sizing: border-box;
        z-index: 1000;
    }

    .title {
        text-align: center;
        font-size: 34rpx;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .titleimg {
        display: block;
        margin: 0 auto;
        width: 300rpx;
        height: 100rpx;
    }
}

.scroll-view-212 {
    max-height: 50vh;
    padding: 0rpx;
    box-sizing: border-box;
}

.sku-list {
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .item {
        width: 210rpx;
        height: 260rpx;
        margin: 30rpx 10rpx 0;
        position: relative;

        image {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 155rpx;
            height: 155rpx;
            top: 36rpx;
            display: block;
        }

        .thumb-c {
            margin: 0 auto;
            width: 210rpx;
            height: 230rpx;
            position: relative;
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/getbg.png');
            z-index: 11;
            animation: showbox 1s;
            transform-origin: center;
            animation-fill-mode: forwards;
            background-size: 100% 100%;

            .lockIcons {
                position: absolute;
                z-index: 999;
                width: 25rpx;
                height: 25rpx;
                left: 47rpx;
                top: 12rpx;
                ._lockIcon {
                    width: 100%;
                    height: 100%;
                    position: initial;
                    transform: none;
                }
            }

            .shang-title {
                position: absolute;
                left: 0;
                right: 0;
                bottom: -30rpx;
                color: white;
                text-align: center;
                font-size: 24rpx;
            }
            .title {
                position: absolute;
                color: #6965c4;
                font-weight: 500;
                text-align: center;
                width: 100%;
                line-height: 19rpx;
                font-size: 19rpx;
                // top: 25rpx;
                // left: 35rpx;
                text-align: center;
                bottom: 20rpx;
            }
        }

        .total {
            position: absolute;
            right: -1rpx;
            bottom: -1rpx;
            width: 42rpx;
            line-height: 42rpx;
            text-align: center;
            background: #3834e0;
            border-radius: 50%;
            border: 1px solid #fff;
            color: white;
            font-size: 22rpx;
        }

        // 单个
        &.item-1 {
            width: 420rpx;
            height: 450rpx;
            .thumb-c {
                width: 383rpx;
                height: 420rpx;

                .lockIcons {
                    width: 40rpx;
                    height: 40rpx;
                    left: 92rpx;
                    top: 27rpx;
                }

                image {
                    top: 70rpx;
                    width: 285rpx;
                    height: 285rpx;
                    display: block;
                }

                .title {
                    // left: 64rpx;
                    width: 100%;
                    line-height: 30rpx;
                    font-size: 28rpx;
                    bottom: 32rpx;
                }
                .total {
                    width: 75rpx;
                    line-height: 75rpx;
                    font-size: 30rpx;
                }
                .shang-title {
                    font-size: 28rpx;
                }
            }

            &:after {
                clip-path: circle(10000rpx at 50% 50%);
            }
        }
    }
}

.luck-tips {
    position: relative;
    z-index: 11;
    text-align: center;
    font-size: 28rpx;
    letter-spacing: 1px;
    font-weight: bold;
    line-height: 1.6;
    margin-top: 26rpx;
}

.button-c {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 11;
    margin: 60rpx 110rpx;

    .btn {
        z-index: 11;
        height: 82rpx;
        line-height: 82rpx;
        width: 240rpx;
        text-align: center;
        background-color: #6938b6;
        color: #fff;
        border-radius: 10rpx;
        font-size: 26rpx;
        font-weight: bold;
        &:last-child {
            margin-left: 30rpx;
        }
    }
}

@keyframes shakeTopx {
    0% {
        transform: rotate(-6deg);
    }

    25% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(6deg);
    }

    75% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-6deg);
    }
}

@keyframes hide {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

@keyframes showbox {
    0% {
        transform: scale(0, 0);
        opacity: 0;
    }

    30% {
        transform: scale(1, 1);
        opacity: 1;
    }

    50% {
        transform: scale(0.7, 1);
        opacity: 1;
    }

    100% {
        transform: scale(1, 1);
    }
}
</style>
