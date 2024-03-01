<template>
    <view class="scope-container" :style="'background: url(' + bg + '); background-size: 100% auto;background-repeat: no-repeat;'">
        <!-- 商品滑动板 -->
        <view class="product-c">
            <swiper class="swiper">
                <swiper-item v-for="(group, index) in skuGroup" class="swiper-item">
                    <view class="item" v-for="(item, index) in group" @tap="showDetail">
                        <image mode="aspectFit" class="thumb" :src="item.thumb"></image>
                        <view class="stock">{{ item.stock }}件</view>
                    </view>
                </swiper-item>
            </swiper>
            <view class="bottom-c">
                <view class="price-c">
                    <PriceDisplay :info="info"></PriceDisplay>
                </view>
            </view>
        </view>

        <view class="btn open-5" @tap="runLottery(5)" hover-class="hover1">
            <image :src="btn5" class="off" mode="aspectFill"></image>
            <image :src="btn5On" class="on" mode="aspectFill"></image>
        </view>
        <view class="btn open-1" @tap="runLottery(1)" hover-class="hover1">
            <image :src="btn1" class="off" mode="aspectFill"></image>
            <image :src="btn1On" class="on" mode="aspectFill"></image>
        </view>
        <view class="btn free-try" @tap="tryLottery" hover-class="hover1">
            <image :src="btnTry" class="off" mode="aspectFill"></image>
            <image :src="btnTryOn" class="on" mode="aspectFill"></image>
        </view>

        <image :src="btn1On"></image>
        <image :src="btn5On"></image>
        <image :src="btnTryOn"></image>
    </view>
</template>

<script>
export default {
    props: {
        info: {
            type: Object
        }
    },
    data() {
        return {};
    },
    created() {},
    computed: {
        skuGroup() {
            let res = [];
            let list = this.info.skus || [];
            let perPage = 6;
            let groupTotal = Math.ceil(list.length / 6);

            for (let i = 0; i < groupTotal; i++) {
                res.push(list.slice(i * perPage, (i + 1) * perPage));
            }
            return res;
        },
        bg() {
            return this.info.body_image || 'https://api.caihongbox.com.cn/image/newbg.png';
        },
        btn1() {
            return this.info.btn_1 || 'https://api.caihongbox.com.cn/image/btn1.png';
        },
        btn1On() {
            return this.info.btn_1_on || 'https://api.caihongbox.com.cn/image/btn11.png';
        },
        btn5() {
            return this.info.btn_5 || 'https://api.caihongbox.com.cn/image/btn2.png';
        },
        btn5On() {
            return this.info.btn_5_on || 'https://api.caihongbox.com.cn/image/btn21.png';
        },
        btnTry() {
            return this.info.btn_try || 'https://api.caihongbox.com.cn/image/btn33.png';
        },
        btnTryOn() {
            return this.info.btn_try_on || 'https://api.caihongbox.com.cn/image/btn31.png';
        }
    },
    methods: {
        runLottery(total) {
            this.$emit('runLottery', total);
        },
        tryLottery() {
            this.$emit('tryLottery');
        },
        showDetail() {
            this.$emit('showDetail');
        }
    }
};
</script>

<style lang="scss" scoped>
.scope-container {
    background-repeat: no-repeat;
    width: 750rpx;
    height: 1156rpx;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 100rpx;

    .egg-title {
        position: absolute;
        width: 250rpx;
        height: 80rpx;
        left: 256rpx;
        top: 150rpx;
    }

    .product-c {
        width: 376rpx;
        height: 376rpx;
        position: absolute;
        left: 192rpx;
        top: 306rpx;

        .swiper {
            width: 370rpx;
            height: 290rpx;
            margin-top: 20rpx;
            padding-left: 8rpx;
            box-sizing: border-box;
        }

        .bottom-c {
            margin: 0rpx 10rpx;
            .price-c {
                text-align: center;
                font-weight: 700;
                padding: 10rpx 0rpx;
                margin-top: 6rpx;
            }
        }
    }

    .swiper-item {
        display: flex;
        flex-wrap: wrap;
        .item {
            background: url('https://api.caihongbox.com.cn/image/item-bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 106rpx;
            height: 140rpx;
            margin-left: 10rpx;
            position: relative;
            overflow: hidden;
            border-radius: 6rpx;
            .thumb {
                width: 106rpx;
                height: 140rpx;
            }
            .stock {
                position: absolute;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                font-size: 22rpx;
                font-weight: 500;
                text-align: center;
                bottom: 0rpx;
                width: 100%;
            }
        }
    }

    .btn {
        position: absolute;

        .off {
            display: block;
        }
        .on {
            display: none;
        }
        &.hover1 {
            .off {
                display: none;
            }
            .on {
                display: block;
            }
        }

        image {
            width: 100%;
            height: 100%;
        }

        &.open-5 {
            width: 126rpx;
            height: 66rpx;
            bottom: 150rpx;
            left: 130rpx;
        }

        &.open-1 {
            width: 200rpx;
            height: 80rpx;
            bottom: 150rpx;
            left: 275rpx;
        }

        &.free-try {
            width: 126rpx;
            height: 72rpx;
            bottom: 150rpx;
            right: 130rpx;
        }
    }
}
</style>
