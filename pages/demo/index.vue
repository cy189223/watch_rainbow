<template>
    <view class="sku-list">
        <view class="item" :class="'item-' + skus.length" v-for="(item, index) in skus" :key="item.uuid">
            <view
                class="card"
                :class="{
                    active: skusActiveStatus[index].isActive
                }"
                @click="setActive(index)"
            >
                <view class="card-face card-front"></view>
                <view class="card-face card-back">
                    <view class="thumb-c">
                        <view class="lockIcons" v-show="isShowLockIcon(item)">
                            <image class="_lockIcon" v-show="item.isLock" :src="`https://watch-box.oss-cn-beijing.aliyuncs.com/${item.isLock ? 'lock2' : 'unlock2'}.png`"></image>
                        </view>
                        <image class="thumb" :src="item.thumb" mode="aspectFit"></image>
                        <view class="_mTitle" :class="item.options.shang_title ? 'shang-title' : 'title'">{{ item.title }}</view>
                        <view class="total">×{{ item.total }}</view>
                        <view class="title" :class="{ gift: item.options.shang_type === 1 }" v-if="item.options.shang_title">{{ item.options.shang_title }}</view>
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
            skus: [
                {
                    id: 106736,
                    uuid: '65f10c169b824',
                    title: 'PP玛特随机盲盒',
                    number: null,
                    thumb: 'https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/CPJrQPPTwlL0vcYXiGaiygQ3WR0SaELrVhrDL99X.jpg',
                    money_price: 0,
                    score_price: 10,
                    total: 1,
                    options: null,
                    sid: 'S107847',
                    union_status: 'pending',
                    union_status_text: '待处理'
                },
                {
                    id: 106737,
                    uuid: '65f10c169bbd0',
                    title: 'PP玛特随机盲盒',
                    number: null,
                    thumb: 'https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/CPJrQPPTwlL0vcYXiGaiygQ3WR0SaELrVhrDL99X.jpg',
                    money_price: 0,
                    score_price: 10,
                    total: 1,
                    options: null,
                    sid: 'S107848',
                    union_status: 'pending',
                    union_status_text: '待处理'
                }
            ],
            skusActiveStatus: [
                {
                    isActive: false
                },
                {
                    isActive: false
                }
            ],
            mIndex: -1,
            mInterval: null
        };
    },
    mounted() {
        this.mInterval = setInterval(() => {
            this.mIndex++;
            if (this.skusActiveStatus[this.mIndex]) {
                this.skusActiveStatus[this.mIndex].isActive = true;
            } else {
                clearInterval(this.mInterval);
            }
        }, 500);
    },
    methods: {
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
        }
    }
};
</script>

<style scoped lang="scss">
.sku-list {
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 300rpx;

    .item {
        width: 210rpx;
        height: 260rpx;
        margin: 30rpx 10rpx 0;
        position: relative;
        perspective: 600px;

        .card {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 1s;
            transform-style: preserve-3d;
        }
        .card.active {
            transform: rotateY(180deg);
        }

        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            line-height: 260px;
            color: #fff;
            text-align: center;
            font-weight: bold;
            font-size: 40px;
            backface-visibility: hidden;
        }
        .card-face.card-front {
            width: 210rpx;
            height: 230rpx;
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/getbg.png');
            background-size: 100% 100%;
        }

        .card-face.card-back {
            transform: rotateY(180deg);
        }

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
            animation: showbox 4s;
            transform-origin: center;
            animation-fill-mode: forwards;
            background-size: 100% 100%;

            .lockIcons {
                position: absolute;
                z-index: 999;
                width: 25rpx;
                height: 25rpx;
                left: 30rpx;
                top: 14rpx;
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
                    bottom: 36rpx;
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
</style>
