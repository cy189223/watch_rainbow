<template>
    <view class="scope-container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <Navbar title="刮刮乐名称"></Navbar>
        <view class="headerBox">
            <view class="bg1"></view>
            <view class="banner">
                <FBanner :list="bannerList"></FBanner>
            </view>
            <view class="ruleInfo" @tap="ruleshow = true">
                <text class="new-icon icon-express-package"></text>
                玩法说明
            </view>
            <view class="sharebtn" @tap="isSharePopup = true">
                <text class="new-icon icon-fenxiang"></text>
                <view>分享</view>
            </view>
        </view>
        <view class="orderbox">
            <image class="gonggao-icon" src="https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%85%AC%E5%91%8A.png" mode="scaleToFill"></image>
            <NoticeBar scrollable single :text="ordernotice" style="flex: 1" color="#fff" background-color="none" speed="50"></NoticeBar>
        </view>

        <view class="main">
            <view class="l1">
                <view class="l1_1">
                    <view style="font-size: 28rpx; margin-right: 20rpx">指定选择</view>

                    可选
                    <view class="block" style="background: #f86567"></view>
                    已售 &nbsp; &nbsp;
                    <view class="block" style="background: #f2f2f2"></view>
                </view>
                <view class="l1_2">剩余 98/100</view>
            </view>
            <view class="l2">
                <image class="dun" src="https://watch-box.oss-cn-beijing.aliyuncs.com/dunpai.png"></image>
                已开启排队机制
            </view>
            <view class="l3">
                <BlockFactor :num="100"></BlockFactor>
            </view>
        </view>

        <view class="ruleboxbg" @tap="ruleshow = false" v-if="ruleshow">
            <view class="rulebox" @tap.stop>
                <view class="rulemainbtn">
                    <text class="new-iconfont icon-close close-btn" @tap="ruleshow = false"></text>
                    <view class="ruletitle">规则说明</view>
                    <view class="ruletext">
                        {{ info.setting.html }}
                    </view>
                </view>
            </view>
        </view>
        <SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>
    </view>
</template>

<script>
import Navbar from '@/components/Navbar/index.vue';
import FBanner from './components/fBanner.vue';
import NoticeBar from '@/components/NoticeBar/index.vue';
import BlockFactor from './components/blockFactor.vue';

export default {
    components: {
        Navbar,
        NoticeBar,
        BlockFactor,
        FBanner
    },
    computed: {
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        },
        posterInfo() {
            let globalShareConfig = this.getShareConfig(false);
            if (globalShareConfig.path) {
                return {
                    money_price: this.info.money_price,
                    score_price: this.info.score_price,
                    title: this.info.title,
                    path: globalShareConfig.path,
                    app_url: globalShareConfig.app_url,
                    thumb: this.info.thumb
                };
            }
        }
    },
    data() {
        return {
            ordernotice: '我是公告',
            isSharePopup: false,
            ruleshow: false,
            info: {
                setting: {
                    html: '我是游戏规则'
                }
            },
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
    padding: 0 30rpx;
    color: #fff;

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

        .ruleInfo {
            display: flex;
            align-items: center;
            position: absolute;
            top: 0rpx;
            left: 20rpx;
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

    .orderbox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .gonggao-icon {
            width: 48rpx;
            height: 48rpx;
        }
        margin: 20rpx 0;
    }

    .main {
        .l1 {
            display: flex;
            justify-content: space-between;
            .l1_1 {
                font-size: 24rpx;
                display: flex;
                align-items: center;
                margin-left: 20rpx;
                .block {
                    width: 26rpx;
                    height: 26rpx;
                    border-radius: 6rpx;
                    margin: 0 10rpx;
                }
            }
        }
        .l2 {
            margin-top: 20rpx;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            .dun {
                width: 40rpx;
                height: 40rpx;
            }
        }
    }

    .ruleboxbg {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;

        .rulebox {
            width: 70%;
            padding: 5rpx;
            border-radius: 20rpx;
            border: 5rpx solid transparent;
            background-clip: padding-box, border-box;
            background-origin: padding-box, border-box;
            background-image: linear-gradient(to right, #000, #000), linear-gradient(to bottom, #d353e4, #70bad7);

            .rulemainbtn {
                position: relative;
                width: 100%;
                background-image: url('https://api.caihongbox.com.cn/image/popupbg.jpg');
                background-position: top;
                background-size: 100%;
                background-repeat: no-repeat;
                background-color: #fff;
                border-radius: 15rpx;
            }

            .close-btn {
                font-size: 16px;
                position: absolute;
                top: 20px;
                right: 20px;
            }

            .ruletitle {
                padding: 20px 0;
                font-weight: bold;
                color: #573884;
                text-align: center;
            }

            .ruletext {
                height: 45vh;
                overflow-y: auto;
                padding: 0 20rpx 20rpx;
            }
        }
    }
}
</style>
