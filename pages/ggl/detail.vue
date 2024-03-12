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
                    <view class="block" style="background: linear-gradient(60deg, #7e30ee 0%, #ea25e7 100%)"></view>
                    已售 &nbsp; &nbsp;
                    <view class="block" style="background: #f2f2f2"></view>
                </view>
                <view class="l1_2">剩余 {{ rankList.length - rankList.filter((item) => item.isSell).length }}/{{ rankList.length }}</view>
            </view>
            <view class="l2">
                <image class="dun" src="https://watch-box.oss-cn-beijing.aliyuncs.com/dunpai.png"></image>
                已开启排队机制
            </view>
            <view class="l3">
                <view
                    class="bl"
                    :class="{
                        selled: item.isSell,
                        isCheck: item.isCheck
                    }"
                    @click="handlerClick(item, index)"
                    v-for="(item, index) in rankList"
                >
                    {{ index + 1 }}
                </view>
            </view>
            <view class="l4">
                <view class="body animated" :class="{ bounceOutRight: startMoving, bounceInLeft: !startMoving }">
                    <view class="sku-list">
                        <view class="skutitlebox">
                            <image src="../../static/skutitle.png" mode="" class="skubg"></image>
                            <image src="../../static/spyl.png" mode="" class="skuspyl skuimg" @tap="changetype(1)"></image>
                            <image src="../../static/csjl.png" mode="" class="skucsjl skuimg" @tap="changetype(2)"></image>
                            <image src="../../static/spyla.png" mode="" class="skuspyla skuimga" v-if="skutype == 1"></image>
                            <image src="../../static/csjla.png" mode="" class="skucsjla skuimga" v-else-if="skutype == 2"></image>
                        </view>

                        <view class="item" v-for="(item, index) in skuList" :key="item.id" @tap="showSkuPopup" v-if="isShow && skutype == 1">
                            <view class="thumb">
                                <view class="sell-out-c" v-if="!item.stock">
                                    <image mode="widthFix" class="sell-out" src="@/static/empty-stock-2.png"></image>
                                </view>
                                <image mode="aspectFill" :src="item.thumb + '?x-oss-process=image/resize,w_300'"></image>
                                <view class="total">{{ item.stock }}/{{ item.total }}</view>
                                <view class="shang-title" :class="{ gift: item.shang_type === 1 }">{{ item.shang_title }}</view>
                            </view>
                            <view class="title">{{ item.title }}</view>
                            <view class="bottomflex">
                                <view class="display-price" style="border-right: 1px solid #ccc">
                                    <view class="value">
                                        <text style="font-weight: bold" v-if="item.display_money_price">￥{{ item.display_money_price / 100 }}</text>
                                        <PriceDisplay :info="boxInfo" v-else></PriceDisplay>
                                    </view>
                                    <view class="key">零售价</view>
                                </view>
                                <view class="display-price">
                                    <template v-if="item.shang_type === 1">
                                        <text class="value">只赠不售</text>
                                    </template>
                                    <template v-else>
                                        <text class="value">{{ item.odds }}%</text>
                                        <text clas="key">概率</text>
                                    </template>
                                </view>
                            </view>
                        </view>
                        <RecordList ref="record" v-if="skutype == 2" :info="boxInfo" :room="boxInfo.room" style="width: 100%"></RecordList>
                    </view>
                </view>
            </view>
        </view>
        <BottomRankPanel :isWait="isWait" @changeWaitStatus="(status) => (isWait = status)"></BottomRankPanel>
        <view class="bottomPay">
            <view class="left">
                <text style="font-size: 32rpx">共：{{ checkMoney }}</text>

                <br />
                <text style="font-size: 26rpx">已选{{ checkItemNum.length }}个</text>
            </view>
            <view class="right" @tap="buyNow">立即购买</view>
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
        <PayCard :buyTotal="checkItemNum.length" v-if="isShowPayCard" :info="payCardInfo" @success="paySuccess" @cancel="isShowPayCard = false"></PayCard>
        <OpenBoxPopup v-if="isOpenPopup" :order="order" @close="goBack"></OpenBoxPopup>
    </view>
</template>

<script>
import Navbar from '@/components/Navbar/index.vue';
import FBanner from './components/fBanner.vue';
import NoticeBar from '@/components/NoticeBar/index.vue';
import PayCard from './components/PayCard.vue';
import RecordList from './components/RecordList.vue';
import BottomRankPanel from '@/components/BottomRankPanel/index.vue';

export default {
    components: {
        Navbar,
        NoticeBar,
        PayCard,
        RecordList,
        BottomRankPanel,
        FBanner
    },
    computed: {
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        },
        posterInfo() {
            return {
                money_price: this.boxInfo.money_price,
                score_price: this.boxInfo.score_price,
                title: this.boxInfo.title,
                path: this.getShareConfig().path,
                thumb: this.boxInfo.thumb
            };
        },
        checkItemNum() {
            return this.rankList.filter((item) => item.isCheck);
        },
        checkMoney() {
            const res = this.checkItemNum.length * this.price;
            return res;
        },
        payCardInfo() {
            return {
                box: this.boxInfo,
                room: this.roomInfo,
                sku_index: this.skuIndex,
                page_uuid: this.pageUuid
            };
        }
    },
    data() {
        return {
            price: 100,
            rankList: [
                { key: 'a1', isSell: true, isCheck: false },
                { key: 'a2', isSell: false, isCheck: true },
                { key: 'a3', isSell: false, isCheck: false },
                { key: 'a4', isSell: false, isCheck: false },
                { key: 'a5', isSell: false, isCheck: false },
                { key: 'a6', isSell: false, isCheck: false },
                { key: 'a7', isSell: true, isCheck: false },
                { key: 'a8', isSell: false, isCheck: false },
                { key: 'a9', isSell: false, isCheck: false },
                { key: 'a10', isSell: false, isCheck: false },
                { key: 'a11', isSell: false, isCheck: false },
                { key: 'a12', isSell: false, isCheck: false },
                { key: 'a13', isSell: false, isCheck: false },
                { key: 'a14', isSell: false, isCheck: false },
                { key: 'a15', isSell: false, isCheck: false },
                { key: 'a16', isSell: false, isCheck: false },
                { key: 'a17', isSell: false, isCheck: false },
                { key: 'a18', isSell: false, isCheck: false },
                { key: 'a19', isSell: false, isCheck: false },
                { key: 'a20', isSell: false, isCheck: false }
            ],
            ordernotice: '我是公告',
            order: {}, // 创建成功的订单
            roomUuid: '658cdde3d9f16', //TODO 临时测试用
            skuIndex: '9', //TODO 临时测试用
            boxInfo: {},
            isSharePopup: false,
            ruleshow: false,
            isShowPayCard: false,
            isOpenPopup: false,
            isShow: false,
            skuList: [],
            roomInfo: {},
            skutype: 1,
            pageUuid: '',
            isWait: true,
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
    onPullDownRefresh() {
        this.$showPullRefresh();
        this.initData();
    },
    onLoad(e) {
        this.initRoom();
    },
    methods: {
        initRoom() {
            return this.$http(`/rooms/${this.roomUuid}/skus/${this.skuIndex}`).then((res) => {
                this.boxInfo = res.data.box;
                this.roomInfo = res.data.room;
                this.skuList = res.data.sku_list;
                this.pageUuid = res.data.page_uuid;
                this.isShow = true;
            });
        },
        paySuccess(order) {
            this.isShowPayCard = false;
            uni.showToast({
                title: '支付成功, 开盒中',
                icon: 'none'
            });
            this.order = order;
            this.isOpenPopup = true;
        },
        handlerClick(item, index) {
            if (item.isSell) {
                return;
            }
            this.rankList[index].isCheck = !item.isCheck;
        },
        goBack() {
            uni.navigateBack({
                delta: 1
            });
        },
        buyNow() {
            this.isShowPayCard = true;
        },
        changetype(type) {
            this.skutype = type;
        }
    }
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
    padding: 0 30rpx 250rpx 30rpx;
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
        .l3 {
            margin-top: 20rpx;
            display: grid;
            grid-template-columns: repeat(auto-fill, 70rpx);
            grid-row-gap: 15rpx;
            grid-column-gap: 15rpx;
            padding: 0 15rpx;
            .bl {
                height: 70rpx;
                background: linear-gradient(60deg, #7e30ee 0%, #ea25e7 100%);
                text-align: left;
                padding-left: 6rpx;
                border-radius: 10rpx;
                font-size: 26rpx;
                color: #fff;
                position: relative;
            }
            .selled {
                background: #f2f2f2;
                color: #c4c4c4;
            }

            .selled::before {
                content: '';
                position: absolute;
                width: 50rpx;
                height: 50rpx;
                background-image: url(https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%B7%B2%E5%94%AE1.png);
                background-size: 100% 100%;
                right: 0px;
                bottom: 0;
            }

            .isCheck::before {
                content: '';
                position: absolute;
                width: 30rpx;
                height: 30rpx;
                background-image: url(https://watch-box.oss-cn-beijing.aliyuncs.com/%E9%80%89%E4%B8%AD.png);
                background-size: 100% 100%;
                right: 4rpx;
                bottom: 4rpx;
            }
        }
        .l4 {
            .sku-list {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                margin: 70rpx 15rpx 30rpx;
                padding: 65rpx 35rpx;
                background-image: url('https://api.caihongbox.com.cn/image/listbg.png');
                background-size: 100% 100%;
                .skutitlebox {
                    position: absolute;
                    height: 95rpx;
                    top: -45rpx;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 111;

                    .skubg {
                        width: 520rpx;
                        height: 95rpx;
                    }

                    .skuimg {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 145rpx;
                        height: 30rpx;
                    }

                    .skuimga {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 300rpx;
                        height: 85rpx;
                    }

                    .skuspyl {
                        left: 60rpx;
                    }

                    .skuspyla {
                        left: 5rpx;
                    }

                    .skucsjl {
                        right: 60rpx;
                    }

                    .skucsjla {
                        right: 5rpx;
                    }
                }
                .item {
                    margin: 5rpx 4rpx;
                    padding: 30rpx;
                    width: calc(100% / 3 - 4rpx - 4rpx);
                    box-sizing: border-box;
                    border-radius: 25rpx;
                    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');
                    color: #fff;
                    background-size: 100% 100%;

                    .thumb {
                        position: relative;
                        overflow: hidden;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 20rpx;
                        position: relative;

                        image {
                            width: 100%;
                            aspect-ratio: 1;
                            height: auto;
                            display: block;
                        }

                        .sell-out-c {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            .sell-out {
                                width: 90rpx;
                                height: 90rpx;
                            }
                        }

                        .total {
                            background: rgba(0, 0, 0, 0.5);
                            border-radius: 6rpx;
                            padding: 2rpx 10rpx;
                            color: white;
                            position: absolute;
                            bottom: 10rpx;
                            right: 10rpx;
                            z-index: 100;
                            font-size: 20rpx;
                            font-weight: bold;
                        }

                        .shang-title {
                            background-image: linear-gradient(to bottom, #4fb4fc, #68f1fb);
                            border-radius: 0 0 10rpx 0;
                            color: white;
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 100;
                            padding: 0 15rpx;
                            line-height: 40rpx;
                            text-align: center;
                            font-size: 24rpx;
                            font-weight: bold;

                            &.gift {
                                background: #f15858;
                            }
                        }
                    }

                    .title {
                        font-size: 24rpx;
                        // font-family: PingFang;
                        // color: #000000;
                        text-align: center;
                        margin: 5rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }

                    .bottomflex {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-top: 1px dashed #ccc;
                        padding-top: 5rpx;

                        .display-price {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            width: 50%;
                            height: 60rpx;
                            font-size: 22rpx;
                            text-align: center;

                            .value {
                                font-weight: normal;
                                color: red;
                            }

                            .key {
                                // color: #999;
                            }
                        }
                    }
                }
            }
        }
    }

    .bottomPay {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 140rpx;
        background-color: #161616;
        left: 0;
        padding: 0 40rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right {
            width: 200rpx;
            height: 70rpx;
            background-color: red;
            border-radius: 20rpx;
            text-align: center;
            line-height: 70rpx;
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
