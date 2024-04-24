<template>
    <view class="scope-container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <Navbar :title="info.title" :scrollTop="scrollTop"></Navbar>
        <view class="content">
            <view class="headerBox">
                <view class="bg1"></view>
                <view class="banner">
                    <FBanner :list="skus"></FBanner>
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
            <view class="middleBox">
                <view class="myMoneyInfo">
                    彩虹币：{{ userInfo.score }}
                    <br />
                    彩虹积分：{{ userInfo.redpack }}
                </view>
                <view class="textbox" @tap="showTips">
                    <text class="new-icon icon-a-1"></text>
                    规则说明
                </view>
                <view class="textbox" @tap="totabbar('/pages/myBox/index')">
                    <text class="new-icon icon-jineqiandaiyueshangjin"></text>
                    我的赏袋
                </view>
            </view>

            <view class="body animated" :class="{ bounceOutRight: startMoving, bounceInLeft: !startMoving }">
                <view class="sku-list">
                    <view class="headerTool" :style="'top:' + customBar + 'px'">
                        <view
                            @click="changetype(1)"
                            class="headerToolItem"
                            :class="{
                                headerToolCur: skutype == 1
                            }"
                        >
                            赏品一览
                        </view>
                        <view
                            @click="changetype(2)"
                            class="headerToolItem"
                            :class="{
                                headerToolCur: skutype == 2
                            }"
                        >
                            抽赏记录
                        </view>
                        <view
                            class="headerToolItem"
                            @click="changetype(3)"
                            :class="{
                                headerToolCur: skutype == 3
                            }"
                        >
                            欧皇榜
                        </view>
                        <view
                            @click="changetype(4)"
                            class="headerToolItem"
                            :class="{
                                headerToolCur: skutype == 4
                            }"
                        >
                            非酋榜
                        </view>
                    </view>

                    <view class="_block" v-if="skutype == 1" v-for="item in skuLevelReverse" :key="item.title" v-show="getSkusByLevel(item.odds).length > 0">
                        <view class="_t1">
                            <image :src="item.icon" class="_icon"></image>
                            {{ item.title }}

                            <view style="margin-left: 20rpx" v-if="config.show_odds_mode === 'enable'">
                                概率{{ item.odds }}%
                                <text style="font-size: 20rpx">（此概率为当前赏级出赏概率）</text>
                            </view>
                            <view style="margin-left: 20rpx" v-else-if="config.show_odds_mode === 'auto'">
                                <view v-if="item.front_odds >= 0.1">概率{{ item.odds }}%</view>
                                <view v-else>概率{{ '<' }}0.1%</view>
                                <text style="font-size: 20rpx">（此概率为当前赏级出赏概率）</text>
                            </view>
                        </view>
                        <view class="itemWrap">
                            <view class="item" v-for="(item, index) in getSkusByLevel(item.odds)" :key="item.id" @tap="showDetailImagePopup(item)" v-if="skutype == 1">
                                <view class="thumb">
                                    <image mode="aspectFill" :src="item.thumb + '?x-oss-process=image/resize,w_300'"></image>
                                    <view class="shang-title" :class="'shang-title-' + item.level">{{ getLevelTitle(item.front_odds) }}</view>
                                </view>
                                <view class="title">{{ item.title }}</view>
                                <view class="bottomflex">
                                    <view>零售价：</view>
                                    <PriceDisplay style="color: red" :info="item"></PriceDisplay>
                                </view>
                            </view>
                        </view>
                    </view>

                    <RecordList ref="record" v-if="skutype == 2" :info="info" style="width: 100%"></RecordList>
                </view>
                <view class="_t3" v-if="skutype == 3">
                    <scroll-view scroll-y class="scroll-view">
                        <view class="list-scope">
                            <view class="item-scope">
                                <view class="user-c">
                                    <image
                                        src="https://watchrainbow.oss-cn-beijing.aliyuncs.com/img/other/Bfg3Go3zygcK90dDwkIaSF7plXv7iBqVou1xzdTd.jpg"
                                        mode="aspectFill"
                                        class="headimg"
                                    ></image>
                                    <view class="name">生亦何欢</view>
                                    <view class="time">{{ $tool.formatDate(new Date(), 'MM/dd hh:mm:ss') }}</view>
                                </view>
                                <view class="sku-c">
                                    <view class="sku-title">积分</view>
                                    333
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="_t4" v-if="skutype == 4">
                    <scroll-view scroll-y class="scroll-view">
                        <view class="list-scope">
                            <view class="item-scope">
                                <view class="user-c">
                                    <image
                                        src="https://watchrainbow.oss-cn-beijing.aliyuncs.com/img/other/Bfg3Go3zygcK90dDwkIaSF7plXv7iBqVou1xzdTd.jpg"
                                        mode="aspectFill"
                                        class="headimg"
                                    ></image>
                                    <view class="name">乱我道心</view>
                                    <view class="time">{{ $tool.formatDate(new Date(), 'MM/dd hh:mm:ss') }}</view>
                                </view>
                                <view class="sku-c">
                                    <view class="sku-title">积分</view>
                                    222
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>

        <view class="footer-c">
            <view class="btn-c">
                <view class="btn" @tap="pay(item.total)" v-for="(item, index) in info.total_list" :key="index">
                    <view class="chounum">x{{ item.total }}</view>
                    <view class="choutext">抽{{ item.total }}次</view>
                </view>
            </view>
        </view>

        <PayCard :info="payInfo" :Total="paytotal" @close="hidePayPopup" @success="paySuccess" v-if="isPayPopup"></PayCard>

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
        <OpenBoxPopup boxImgMode="square" v-if="isShowResultPopup" :order="order" @close="goBack"></OpenBoxPopup>

        <uni-popup style="z-index: 1000" ref="detailPopup" type="bottom">
            <BoxSkuPopup :detailImageList="detailImageList" @close="hideDetailImagePopup"></BoxSkuPopup>
        </uni-popup>
    </view>
</template>

<script>
import PayCard from './components/PayCard.vue';
import RecordList from './components/RecordList.vue';
import Navbar from '@/components/Navbar/index.vue';
import FBanner from './components/fBanner';

import { mapGetters } from 'vuex';
export default {
    components: {
        PayCard,
        RecordList,
        Navbar,
        FBanner
    },
    data() {
        return {
            bannerList: [
                {
                    image: 'https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/OdzjbTIVwwwmxouf1AKgOriDBECmPWZwUo2OmwfG.jpg',
                    link: 'www.baidu.com',
                    title: '我是标题',
                    prencent: '0.1'
                },
                {
                    image: 'https://watchrainbow.oss-cn-beijing.aliyuncs.com/box/img/other/oBopLzJcsjvPlktedSysexQxBbzHyqCtpHRwaeoB.jpg',
                    link: 'www.baidu.com',
                    title: '我是标题2',
                    prencent: '0.2'
                }
            ],
            scrollTop: 0,
            uuid: '',
            isInit: false,
            isPayPopup: false,
            info: {},
            order: {},
            pageUuid: '',
            isNotFound: false,
            isShowResultPopup: false,
            danmuSetting: {},
            danmuList: [],
            config: {},
            detailImageList: [],
            paytotal: '',
            ruleshow: false,
            skutype: 1,
            ruletext: '',
            isSharePopup: false
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        },
        skuLevel() {
            return this.info.sku_level || [];
        },
        skuLevelReverse() {
            return (this.info.sku_level || []).reverse() || [];
        },
        skus() {
            return this.info.skus || [];
        },
        payInfo() {
            return {
                page_uuid: this.pageUuid,
                title: this.info.title,
                total_list: this.info.total_list,
                money_price: this.info.money_price,
                score_price: this.info.score_price
            };
        },
        titleBgColor() {
            return '';
        },
        discountTips() {
            let totalList = this.info.total_list || [];
            for (let i = totalList.length - 1; i >= 0; i--) {
                // 有连开优惠
                if (totalList[i].is_discount) {
                    let str = totalList[i].total + '连开优惠';

                    if (totalList[i].money_discount) {
                        str += totalList[i].money_discount / 100 + '元';
                    }
                    if (totalList[i].score_discount) {
                        str += totalList[i].score_discount + this.scoreAlias;
                    }

                    return str;
                }
            }

            return false;
        },
        share() {
            return {
                title: this.info.title,
                thumb: this.info.thumb,
                path: '/pages/fudai_wuxianchi/detail?uuid=' + this.info.uuid
            };
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
    watch: {},
    filters: {},
    onLoad(e) {
        this.uuid = e.uuid;
    },
    onUnload() {},
    onPullDownRefresh() {
        this.$showPullRefresh();
        this.initData();
    },
    onShow() {
        uni.showLoading({
            title: '加载中'
        });
        this.initData()
            .then((res) => {
                this.isInit = true;
                uni.hideLoading();

                this.$http('/fudai/change', 'POST', {
                    fudai_id: this.info.id
                }).then((res) => {
                    this.pageUuid = res.data.page_uuid;
                });
            })
            .catch((res) => {
                this.isNotFound = true;
            });
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    onReachBottom() {},
    methods: {
        totabbar(url) {
            uni.switchTab({
                url: url
            });
        },
        showTips() {
            this.ruleshow = true;
        },
        changetype(type) {
            this.skutype = type;
        },
        getDanmu() {
            this.$http(`/danmus/fudai_detail?node_id=${this.info.id}`).then((res) => {
                this.danmuSetting = res.data.setting;
                this.danmuList = res.data.list;
            });
        },
        showDetailImagePopup(item) {
            if (!item.detail_images || !item.detail_images.length) {
                if (item.thumb) {
                    uni.previewImage({
                        urls: [item.thumb],
                        current: 0
                    });
                } else {
                    uni.showToast({
                        title: '此款暂无详情~',
                        icon: 'none'
                    });
                }

                return false;
            }
            this.$refs.detailPopup.open('bottom');
            this.detailImageList = item.detail_images || [];
        },
        hideDetailImagePopup() {
            this.$refs.detailPopup.close();
            // this.isShowDetail = false
        },
        refresh() {
            this.$store.dispatch('getUserInfo');
        },
        initData() {
            return this.$http(`/fudai_yifanshangs/${this.uuid}`, 'GET', {}).then((res) => {
                this.info = res.data.info;
                this.config = res.data.config;
                // this.getDanmu()
            });
        },
        paySuccess(order) {
            this.order = order;
            this.isPayPopup = false;
            this.isShowResultPopup = true;
            // 购买成功

            this.refresh();
        },
        goBack() {
            this.isShowResultPopup = false;
            if (this.skutype == 2) {
                this.$refs.record.initData();
            }
        },
        hidePayPopup() {
            this.isPayPopup = false;
        },
        pay(type) {
            this.isPayPopup = true;
            this.paytotal = type;
        },
        getLevelTitle(odds) {
            return this.skuLevel.find((item) => item.odds == odds).title;
        },
        getSkusByLevel(odds) {
            const res = this.skus.filter((item) => item.front_odds == odds);
            return res;
        }
    }
};
</script>

<style lang="scss" scoped>
.scope-container {
    box-sizing: border-box;
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/65dea2a339eab7782bf47e83.gif');
    background-position: top;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);

    .navBar {
        position: absolute;
        bottom: 0;
        bottom: 10px;
        width: 100%;
        text-align: center;
        font-size: 28rpx;
        color: #fff;
    }
}

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

.middleBox {
    padding: 26rpx 40rpx;
    margin: 20rpx;
    margin-top: 30rpx;
    display: flex;
    justify-content: space-between;
    color: #fff;
    align-items: center;
    background: url('https://watch-box.oss-cn-beijing.aliyuncs.com/bg_home_recommend.png');
    background-size: 96% 100%;
    background-repeat: no-repeat;
    .myMoneyInfo {
        line-height: 33rpx;
        font-size: 26rpx;
        text-shadow:
            1px 1px 3px #b2b2f8,
            -1px 1px 3px #b2b2f8,
            -1px -1px 3px #b2b2f8,
            1px -1px 3px #b2b2f8;
    }
    .textbox {
        margin-right: 30rpx;
        font-size: 30rpx;

        .new-icon {
            margin-right: 10rpx;
            font-weight: bold;
            font-size: 30rpx;
        }
    }
}

.float-btn {
    position: fixed;
    right: 0rpx;
    top: 260rpx;
    width: 130rpx;
    height: 66rpx;
    background: #ffefb3;
    border-radius: 33px 0px 0px 33px;
    padding: 0rpx 14rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;

    font-weight: 500;
    font-size: 24rpx;

    image {
        width: 30rpx;
        height: 36rpx;
    }

    &.my {
        top: 150rpx;

        image {
            width: 30rpx;
            height: 40rpx;
        }
    }

    &.share {
        top: 800rpx;

        .icon-wechat {
            font-size: 40rpx;
        }
    }
}

.body {
    width: 100%;
    position: relative;

    .title-c {
        margin: 30rpx 22rpx 25rpx;
        padding: 5rpx 15rpx;
        border-radius: 20rpx;
        background-color: #130842;
        border: 2px solid #fff;
        box-shadow: 0 0 6px 1px #ff3cf9;

        .stock-c {
            line-height: 65rpx;
            border: 2px solid #fff;
            border-radius: 20rpx;
            text-align: center;
            box-shadow: 0 0 10px 1px #ff3cf9;
            font-size: 30rpx;
            color: #fff;
            text-shadow: 0 0 5px #c33edc;
            background-image: linear-gradient(to right, #4610be, #8348d4, #28218b);
        }
    }
    padding-bottom: 200rpx;

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

    .headerTool {
        display: flex;
        justify-content: space-around;
        width: 100%;
        position: sticky;
        top: -1rpx;
        z-index: 999;
        .headerToolItem {
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/wTagItemBg.png');
            width: 170rpx;
            height: 70rpx;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            line-height: 70rpx;
            text-align: center;
            color: #fff;
            font-size: 26rpx;
        }
        .headerToolCur {
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/wTagItemBgActive.png');
        }
    }
    .sku-list {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        margin: 0 15rpx 30rpx;
        padding: 10rpx 5rpx;
        // background-image: url('https://api.caihongbox.com.cn/image/listbg.png');
        background-size: 100% 100%;

        ._block {
            height: 400rpx;
            width: 100%;
            background-image: url('../../static/_blockBg.png');
            background-size: 100% 100%;
            margin: 20rpx 0;
            padding: 20rpx;
            box-sizing: border-box;
            ._t1 {
                display: flex;
                padding: 20rpx;
                color: #fff;
                background-image: linear-gradient(120deg, #7e30ee 0%, #ea25e7 100%);
                border-radius: 10rpx;
                font-size: 27rpx;
                align-items: center;
                ._icon {
                    margin-right: 20rpx;
                    height: 40rpx;
                    width: 40rpx;
                }
            }

            .itemWrap {
                display: flex;
                overflow-x: auto;
                .item {
                    width: 230rpx;
                    flex-shrink: 0;
                }
            }
        }
        .item {
            padding: 24rpx;
            width: 49%;
            box-sizing: border-box;
            border-radius: 25rpx;
            background-clip: padding-box, border-box;
            background-origin: padding-box, border-box;
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');
            border: 5px solid transparent;
            background-size: 100% 100%;

            .thumb {
                position: relative;
                overflow: hidden;
                background: rgba(0, 0, 0, 0.5);
                position: relative;
                padding: 16rpx;

                image {
                    width: 100%;
                    aspect-ratio: 1;
                    display: block;
                    height: auto;
                    border-radius: 20rpx;
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
                    display: none;
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

                    &.shang-title-5 {
                        background-image: linear-gradient(to bottom, #d5a826, #fae869);
                    }

                    &.shang-title-4 {
                        background-image: linear-gradient(to bottom, #781dff, #b786ed);
                    }

                    &.shang-title-3 {
                        background-image: linear-gradient(to bottom, #3746ff, #73a5ff);
                    }

                    &.shang-title-1 {
                        background-image: linear-gradient(to bottom, #4ada39, #afffa5);
                    }
                }
            }

            .title {
                font-size: 22rpx;
                color: #fff;
                margin: 5rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                padding: 10rpx 0;
                height: 22rpx;
            }

            .bottomflex {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                font-size: 18rpx;
                color: #fff;
                border-top: 1px solid #eee;
                padding: 10rpx 6rpx;

                .display-price {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 60rpx;
                    font-size: 22rpx;
                    text-align: center;
                    color: #fff;

                    .value {
                        font-weight: normal;
                        color: red;
                    }
                }
            }
        }
    }
    ._t3 {
        .list-scope {
            margin: 0rpx 10rpx;

            .item-scope {
                position: relative;
                background: white;
                border-radius: 25rpx;
                padding: 30rpx 20rpx;
                margin-bottom: 20rpx;

                .user-c {
                    display: flex;
                    align-items: center;
                    .headimg {
                        width: 40rpx;
                        height: 40rpx;
                        flex: 0 0 40rpx;
                        border-radius: 50%;
                    }

                    .name {
                        font-weight: 500;
                        font-size: 28rpx;
                        flex-grow: 1;
                        margin-left: 10rpx;
                    }
                    .time {
                        font-weight: 500;
                        font-size: 28rpx;
                    }
                }

                .sku-c {
                    display: flex;
                    align-items: center;
                    margin-top: 10rpx;
                    justify-content: space-between;

                    .thumb {
                        width: 40rpx;
                        height: 40rpx;
                        border: 1rpx solid #e1e1e1;
                        max-width: 400rpx;
                    }

                    .shang-title {
                        font-size: 28rpx;
                        font-weight: 500;
                        &.strong {
                            background: #fcf6d8;
                            color: #f58348;
                            padding: 4rpx 10rpx;
                            font-size: 24rpx;
                            border-radius: 6rpx;
                            margin-left: 10rpx;
                        }
                    }

                    .total {
                        margin-left: 20rpx;
                    }

                    .sku-title {
                        font-size: 28rpx;
                        font-weight: 500;
                        text-align: left;
                        margin-left: 10rpx;
                        max-width: 410rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }

    ._t4 {
        .list-scope {
            margin: 0rpx 10rpx;

            .item-scope {
                position: relative;
                background: white;
                border-radius: 25rpx;
                padding: 30rpx 20rpx;
                margin-bottom: 20rpx;

                .user-c {
                    display: flex;
                    align-items: center;
                    .headimg {
                        width: 40rpx;
                        height: 40rpx;
                        flex: 0 0 40rpx;
                        border-radius: 50%;
                    }

                    .name {
                        font-weight: 500;
                        font-size: 28rpx;
                        flex-grow: 1;
                        margin-left: 10rpx;
                    }
                    .time {
                        font-weight: 500;
                        font-size: 28rpx;
                    }
                }

                .sku-c {
                    display: flex;
                    align-items: center;
                    margin-top: 10rpx;
                    justify-content: space-between;

                    .thumb {
                        width: 40rpx;
                        height: 40rpx;
                        border: 1rpx solid #e1e1e1;
                        max-width: 400rpx;
                    }

                    .shang-title {
                        font-size: 28rpx;
                        font-weight: 500;
                        &.strong {
                            background: #fcf6d8;
                            color: #f58348;
                            padding: 4rpx 10rpx;
                            font-size: 24rpx;
                            border-radius: 6rpx;
                            margin-left: 10rpx;
                        }
                    }

                    .total {
                        margin-left: 20rpx;
                    }

                    .sku-title {
                        font-size: 28rpx;
                        font-weight: 500;
                        text-align: left;
                        margin-left: 10rpx;
                        max-width: 410rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }
}

.footer-c {
    position: fixed;
    bottom: 0rpx;
    // border: 1px solid red;
    width: 100%;
    height: 210rpx;
    // padding-bottom: 60rpx;
    border-radius: 30px 30px 0 0;
    background-image: linear-gradient(to bottom, #613396, #1332ca);
}

.small-btn-c {
    text-align: center;
    font-size: 24rpx;
    font-family: PingFang;
    font-weight: 500;
    color: #a67c1d;
    line-height: 40rpx;
    padding: 30rpx 120rpx 0rpx 120rpx;
    width: 700rpx;
    box-sizing: border-box;

    margin: 0rpx auto 30rpx auto;

    display: flex;
    justify-content: space-around;

    .btn {
        height: 30rpx;
    }
}

.middle {
    display: flex;
    // align-items: center;
    align-items: center;
    justify-content: center;
    z-index: 100;

    .left-btn {
        width: 580rpx;
        // flex: 1;
        height: 100rpx;
        position: relative;
        // border: 1px solid red;
        .room-index {
            font-weight: 500;
            font-size: 46rpx;
            width: 80rpx;
            // border: 1px solid red;
            line-height: 90rpx;
            position: absolute;
            left: 180rpx;
            text-align: center;
        }
    }
    .right-btn {
        width: 100rpx;
        // flex: 1;
        height: 100rpx;
        margin-left: 10rpx;
    }
}
.btn-c {
    width: 700rpx;
    margin: 30rpx auto 0rpx auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .btn {
        width: 140rpx;
        height: 144rpx;
        background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/choubox%20(1).png');
        background-size: 100% 100%;
        text-align: center;

        .chounum {
            line-height: 64rpx;
            font-family: fantasy;
            color: #fff;
            margin-top: 32rpx;
            font-size: 64rpx;
        }
        .choutext {
            font-size: 25rpx;
            line-height: 20rpx;
            color: #2f366b;
            font-weight: bold;
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
</style>
