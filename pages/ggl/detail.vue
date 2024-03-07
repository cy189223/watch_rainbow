<template>
    <view class="scope-container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <Navbar title="刮刮乐名称"></Navbar>
        <view class="headerBox">
            <view class="bg1"></view>
            <view class="banner">
                <FBanner :list="bannerList"></FBanner>
            </view>
            <view class="topimgtext" v-if="info.sales || info.sales === 0">
                <image class="huoimg" src="../../static/redu.png" mode="aspectFit"></image>
                <text style="margin-top: 5rpx">{{ info.sales }}</text>
            </view>
            <view class="sharebtn" @tap="isSharePopup = true">
                <text class="new-icon icon-fenxiang"></text>
                <view>分享</view>
            </view>
        </view>
    </view>
</template>

<script>
import Navbar from '@/components/Navbar/index.vue';
import FBanner from './components/fBanner.vue';

export default {
    components: {
        Navbar,
        FBanner
    },
    computed: {
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        }
    },
    data() {
        return {
            bannerList: [
                {
                    thumb: 'https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/OdzjbTIVwwwmxouf1AKgOriDBECmPWZwUo2OmwfG.jpg',
                    link: 'www.baidu.com',
                    title: '我是标题',
                    front_odds: '0.1'
                },
                {
                    thumb: 'https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/oBopLzJcsjvPlktedSysexQxBbzHyqCtpHRwaeoB.jpg',
                    link: 'www.baidu.com',
                    title: '我是标题2',
                    front_odds: '0.2'
                }
            ]
        };
    },
    methods: {}
};
</script>

<style scoped lang="scss">
.scope-container {
    box-sizing: border-box;
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/65dea2a339eab7782bf47e83.gif');
    background-position: top;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);

    .headerBox {
        height: 400rpx;
        width: 100%;
        background: url('https://watch-box.oss-cn-beijing.aliyuncs.com/bg_unlimited_swiper_new.png') center;
        background-size: 96% 100%;
        background-repeat: no-repeat;
        text-align: center;
        position: relative;

        .bg1 {
            width: 200rpx;
            height: 200rpx;
            background: url('https://watch-box.oss-cn-beijing.aliyuncs.com/%E7%BB%84%20221.png') center;
            background-size: 96% 100%;
            background-repeat: no-repeat;
            position: absolute;
            bottom: -17px;
            left: 50%;
            margin-left: -100rpx;
            -webkit-animation-name: scaleDraw; /*关键帧名称*/
            -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
            -webkit-animation-iteration-count: infinite; /*动画播放的次数*/
            -webkit-animation-duration: 5s; /*动画所花费的时间*/
        }

        @keyframes scaleDraw {
            /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
            0% {
                transform: scale(1); /*开始为原始大小*/
            }
            25% {
                transform: scale(1.1); /*放大1.1倍*/
            }
            50% {
                transform: scale(1);
            }
            75% {
                transform: scale(1.1);
            }
        }

        .banner {
            width: 100%;
            height: 340rpx;
            margin: 0 auto;
            padding-top: 16rpx;
            position: absolute;
            top: 30rpx;
        }

        .topimgtext {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28rpx;
            position: absolute;
            left: 50rpx;
            top: 3rpx;
            background-image: linear-gradient(120deg, #7e30ee 0%, #ea25e7 100%);
            color: #fff;
            padding: 0 20rpx 3rpx 10rpx;
            border-radius: 10rpx;
            .huoimg {
                width: 34rpx;
                height: 34rpx;
                margin-right: 6rpx;
            }
        }

        .sharebtn {
            display: flex;
            align-items: center;
            position: absolute;
            top: 0rpx;
            right: 20rpx;
            color: #fff;
            font-size: 24rpx;
            line-height: 38rpx;
            background-image: linear-gradient(120deg, #7e30ee 0%, #ea25e7 100%);
            padding: 0 20rpx 3rpx 20rpx;
            border-radius: 10rpx;
            .new-icon {
                font-size: 24rpx;
                color: #ceffff;
                margin-right: 3px;
            }
        }
    }
}
</style>
