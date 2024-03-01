<template>
    <view class="container-scope animated bounceInDown">
        <view class="title" v-if="isOpen">恭喜您获得</view>
        <view class="content-scope">
            <view class="unopen-c" v-if="!isOpen">
                <view class="unopen" :class="{ a0: status === 0, a1: status === 1 }">
                    <image :src="boxImg" mode="aspectFill"></image>
                </view>
            </view>
            <view class="scroll-view" scroll-y v-else>
                <view class="sku-list">
                    <view class="item" @tap="checkSku(item)" :class="'item-' + skus.length" v-for="(item, index) in skus">
                        <view class="thumb-c">
                            <image class="thumb" :src="item.thumb" mode="aspectFill"></image>
                            <view class="title">{{ item.title }}</view>
                            <view class="total">×{{ item.total }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="bottom" v-if="showResult">
                <!-- <view class="luck-tips">
					<text>恭喜您获得\n{{openInfo.title}}</text>
				</view> -->
                <view class="button-c" v-if="isReturnSaleSuccess">
                    <view class="btn confirm bg-purple" @tap="goBack">再抽一个</view>
                    <view class="btn return-sale bg-white">已返售</view>
                </view>
                <view class="button-c" v-else>
                    <view class="btn confirm bg-purple" @tap="handleOk">
                        {{ buttonTitle || '去盒柜发货' }}
                    </view>
                    <view class="btn return-sale" @tap="returnSale">一键回收</view>
                </view>
            </view>

            <view class="close-btn" @tap="close" v-if="showResult">
                <text class="new-iconfont icon-close"></text>
            </view>

            <view class="reward-row" v-if="showResult && openInfo.score_reward">
                <view>
                    <text class="number">{{ openInfo.score_reward }}</text>
                    <text>{{ scoreAlias }}</text>
                </view>
                <view class="text-c">
                    <text>恭喜你获得随机{{ scoreAlias }}礼包</text>
                    <navigator class="check-asset-c" url="/pages/myScore/index">
                        <text class="check-asset-btn">查看余额</text>
                    </navigator>
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
        buttonTitle: String,
        orderUuid: String,
        tryMode: Boolean,
        tryInfo: Object
    },
    data() {
        return {
            isOpen: false,
            showResult: false,
            status: 0,
            isShowReturnSale: false,
            isReturnSaleSuccess: false,
            order: {}
        };
    },
    mounted() {
        // this.orderUuid = '605f34c73e765' // 测试
        // this.orderUuid = '605d614d3a951'

        // 演示模块
        if (this.tryMode) {
            console.log(this.tryInfo);
            this.order = this.tryInfo;
        } else {
            this.$http(`/orders/${this.orderUuid}`).then((res) => {
                this.order = res.data.info;
            });
        }

        setTimeout(() => {
            this.status = 1;
            setTimeout(() => {
                this.isOpen = true;
                this.$playAudio('open');
                setTimeout(() => {
                    this.showResult = true;
                }, 1100);
            }, 400);
        }, 2500);
    },
    computed: {
        skus() {
            return this.order.skus || [];
        }
    },
    methods: {
        returnSale() {
            if (this.tryMode) {
                uni.showModal({
                    title: '试一试模式不能返售哦~'
                });
                return false;
            }
            this.isShowReturnSale = true;
        },
        handleOk() {
            this.$emit('close');
            this.$emit('refresh');
            uni.navigateTo({
                url: '/pages/orderList/index'
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
            }
        }
    }
};
</script>

<style lang="scss">
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
    background-color: #efefef;
    // background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    padding-top: 200rpx;

    .close-btn {
        font-size: 38rpx;
        // font-weight: 500;
        background: #6938b6;
        border: 2px solid #6938b6;
        border-radius: 50%;
        width: 60rpx;
        color: white;
        // position: absolute;
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
}

.content-scope {
    width: 100%;
    position: relative;
    // border: 1px solid red;
    // overflow: hidden;
    min-height: 100rpx;
    margin-top: 100rpx;

    .unopen-c {
        width: 300rpx;
        height: 420rpx;
        margin: 0 auto;
        margin-top: 280rpx;
        position: relative;

        &:after {
            content: '';
            position: absolute;
            bottom: -50rpx;
            left: -50rpx;
            width: 400rpx;
            height: 100rpx;
            border-radius: 50%;
            background-color: #dcdfe6;
            box-shadow: 0 0 20rpx rgba(220, 223, 230, 1);
        }
    }

    .unopen {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 11;

        &.a0 {
            animation: shakeTopx 0.2s;
            animation-delay: 0.7s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            transform-origin: bottom center;
        }

        &.a1 {
            animation: hide 0.3s;
            transform-origin: bottom center;
            animation-fill-mode: forwards;
        }

        image {
            width: 100%;
            height: 100%;
        }
    }
}

.scroll-view {
    max-height: 800rpx;
    min-height: 500rpx;
    // height: 800rpx;
    box-sizing: border-box;
    // padding-top: 100rpx;
}

.sku-list {
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    // flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    // padding: 0rpx 60rpx 0rpx 100rpx;

    .item {
        // float: left;
        // float: left;
        width: 210rpx;
        height: 310rpx;
        margin-top: 30rpx;
        // border: 1px solid red;
        margin-left: 20rpx;
        // margin: 0 auto;
        // margin-top: 200rpx;
        position: relative;

        &:after {
            content: '';
            position: absolute;
            top: -60%;
            left: -50%;
            // top: 0rpx;
            // left: 0rpx;
            width: 200%;
            height: 200%;
            border-radius: 50%;
            // border: 1px solid red;
            // border: 1px solid red;
            background: radial-gradient(circle, #ffde7c, #efefef 50%);
            // clip:rect(50px,50px,200px,200px);
            clip-path: circle(200rpx at 50% 50%);
            // border: 1px solid red;
        }

        image {
            width: 100%;
            height: 100%;
            display: block;
        }

        .thumb-c {
            margin: 0 auto;
            width: 150rpx;
            height: 230rpx;
            position: relative;
            background-color: #c77cff;
            z-index: 11;
            animation: showbox 1s;
            transform-origin: center;
            animation-fill-mode: forwards;
            box-shadow: 0 0 20rpx rgba(218, 123, 255, 0.6);
        }

        .title {
            color: black;
            font-size: 26rpx;
            font-weight: 500;
            text-align: center;
            margin-top: 10rpx;
        }
        .total {
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

        // 单个
        &.item-1 {
            width: 420rpx;
            height: 600rpx;
            .thumb-c {
                width: 300rpx;
                height: 460rpx;
            }

            &:after {
                clip-path: circle(10000rpx at 50% 50%);
            }
        }
    }
}

.bottom {
    margin-top: 130rpx;
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
    justify-content: space-between;
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
