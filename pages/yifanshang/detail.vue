<template>
    <view class="scope-container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <Navbar :title="info.title" :scrollTop="scrollTop"></Navbar>
        <view class="content">
            <view class="refreshbox" @tap="refreshRoom">刷新</view>
            <view class="headerBox">
                <view class="bg1"></view>
                <view class="banner">
                    <FBanner :list="info.skus"></FBanner>
                </view>
                <view class="topimgtext">
                    <view class="changebox" @tap="showRoomPopup">
                        <text class="new-icon icon-express-package"></text>
                        换箱
                    </view>
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
                <view class="title-c">
                    <view class="stock-c" v-if="info.room && info.room.num">第{{ info.room.num | fixNumber }}箱 当前剩余{{ info.room.stock }}/{{ info.room.total }}张</view>
                </view>
                <view class="sku-list">
                    <view class="skutitlebox">
                        <image src="../../static/skutitle.png" mode="" class="skubg"></image>
                        <image src="../../static/spyl.png" mode="" class="skuspyl skuimg" @tap="changetype(1)"></image>
                        <image src="../../static/csjl.png" mode="" class="skucsjl skuimg" @tap="changetype(2)"></image>
                        <image src="../../static/spyla.png" mode="" class="skuspyla skuimga" v-if="skutype == 1"></image>
                        <image src="../../static/csjla.png" mode="" class="skucsjla skuimga" v-else-if="skutype == 2"></image>
                    </view>
                    <view class="item" v-for="(item, index) in info.skus" :key="item.id" @tap="showSkuPopup" v-if="skutype == 1">
                        <view class="imageArea">
                            <view class="thumb">
                                <view class="sell-out-c" v-if="!item.stock">
                                    <image mode="widthFix" class="sell-out" src="@/static/empty-stock-2.png"></image>
                                </view>
                                <image mode="aspectFill" :src="item.thumb + '?x-oss-process=image/resize,w_300'"></image>
                                <view class="total">{{ item.stock }}/{{ item.total }}</view>
                                <view class="shang-title" :class="{ gift: item.shang_type === 1 }">{{ item.shang_title }}</view>
                            </view>
                        </view>

                        <view class="title">{{ item.title }}</view>
                        <view class="bottomflex">
                            <view class="display-price" style="border-right: 1px solid #ccc">
                                <view class="value">
                                    <text style="font-weight: bold" v-if="item.display_money_price">￥{{ item.display_money_price / 100 }}</text>
                                    <PriceDisplay :info="info" v-else></PriceDisplay>
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
                    <RecordList ref="record" v-if="skutype == 2" :info="info" :room="info.room" style="width: 100%"></RecordList>
                </view>
            </view>
        </view>

        <view class="footer-c">
            <view class="btn-c">
                <image :class="{ 'gray-image': !isEnableBtn(1) }" src="/static/x1.png" mode="widthFix" class="btn" @tap="buy(1)"></image>
                <image :class="{ 'gray-image': !isEnableBtn(3) }" src="/static/x3.png" mode="widthFix" class="btn" @tap="buy(3)"></image>
                <image :class="{ 'gray-image': !isEnableBtn(10) }" src="/static/x10.png" mode="widthFix" class="btn" @tap="buy(10)"></image>
                <image :class="{ 'gray-image': !isEnableBtn(0) }" src="/static/all.png" mode="widthFix" class="btn" @tap="buy(0)"></image>
            </view>
        </view>

        <PayCard :info="payInfo" @close="hidePayPopup" @success="paySuccess" v-if="isPayPopup"></PayCard>

        <RoomPopup v-if="isRoomPopup" @select="changeRoom" @close="hideRoom()" :info="info" :room="info.room"></RoomPopup>

        <uni-popup style="z-index: 1000" ref="detailPopup" type="bottom">
            <BoxSkuPopup :skuList="info.skus" :detailImageList="info.detail_images" @close="hideSkuPopup"></BoxSkuPopup>
        </uni-popup>

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

        <OpenBoxPopup :isNavbarEnable="true" :info="info" v-if="isOpenPopup" :order="order" @close="goBack" :boxImg="info.image_3d" />

        <SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>
    </view>
</template>

<script>
import PayCard from './components/PayCard.vue';
import RoomPopup from './components/RoomPopup.vue';
import RecordList from './components/RecordList.vue';
import Navbar from '@/components/Navbar/index.vue';
import { mapGetters } from 'vuex';
import FBanner from './components/fBanner';

export default {
    components: {
        PayCard,
        RoomPopup,
        RecordList,
        Navbar,
        FBanner
    },
    data() {
        return {
            uuid: '',
            info: {},
            payTotal: 0,
            ruleshow: false,
            isPayPopup: false,
            isRoomPopup: false,
            startMoving: false,
            selectedRoom: {},
            isShowDetail: false,
            isOpenPopup: false, // 是否开盒
            isRecordList: false,
            order: {}, // 支付成功后的订单
            roomId: '',
            skutype: 1,
            ruletext: '',
            scrollTop: 0,
            isSharePopup: false
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        },
        payInfo() {
            if (!this.info || !this.info.room) {
                return {};
            }

            return {
                room_id: this.info.room.id,
                pay_total: this.payTotal,
                title: this.info.title,
                money_price: this.info.money_price,
                score_price: this.info.score_price
            };
        },
        isAllPickDisable() {
            return !this.info.last_stock_all_pick_enable || this.info.last_stock_all_pick_enable > this.info.room.stock;
        },
        share() {
            if (this.info && this.info.room) {
                return {
                    title: '[第' + this.info.room.num + '箱]' + this.info.title,
                    thumb: this.info.thumb,
                    path: '/pages/yifanshang/detail?uuid=' + this.info.uuid + '&roomId=' + this.info.room.id
                };
            }
        },
        showSkuTitleList() {
            let list = JSON.parse(JSON.stringify(this.info.skus || []));
            return list.splice(0, 6);
        },
        posterInfo() {
            if (this.info && this.info.room) {
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
        }
    },
    filters: {
        fixNumber(val) {
            if (val < 10) {
                return '0' + val;
            }
            return val;
        }
    },
    onLoad(e) {
        this.uuid = e.uuid;
        this.roomId = e.roomId || '';
    },
    onPullDownRefresh() {
        this.$showPullRefresh();
        this.initData();
    },
    onShow() {
        uni.showLoading({
            title: '加载中'
        });
        this.initData().then((res) => {
            uni.hideLoading();
        });
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    methods: {
        isEnableBtn(total) {
            if (this.info && this.info.room) {
                // 抽*发按钮是否可用
                let flag = true;

                if (total === 0) {
                    flag = !this.info.is_limit_1 && this.isAllPickDisable && this.info.room.stock;
                } else if (total === 1) {
                    flag = this.info.room && this.info.room.stock;
                } else {
                    flag = !this.info.is_limit_1 && this.info.room.stock && this.info.room.stock - total >= 0;
                }
                return flag;
            }
        },
        hideRecordList() {
            this.isRecordList = false;
        },
        showRecordList() {
            this.isRecordList = true;
        },
        showTips() {
            this.ruleshow = true;
        },
        initData() {
            return this.$http(`/fudai_yifanshangs/${this.uuid}`, 'GET', {
                room_id: this.roomId
            }).then((res) => {
                this.info = res.data.info;
                this.roomId = this.info.room && this.info.room.id;
                uni.setNavigationBarTitle({
                    title: this.info.type == 'yfs' ? '一番赏' : '双随机'
                });
            });
        },
        hidePayPopup() {
            this.isPayPopup = false;
        },
        showSkuPopup() {
            this.$refs.detailPopup.open('bottom');
        },
        hideSkuPopup() {
            this.$refs.detailPopup.close();
        },
        // 点击购买
        buy(total) {
            if (!this.isEnableBtn(total)) {
                return false;
            }

            this.payTotal = total;
            this.isPayPopup = true;
        },
        showRoomPopup() {
            this.isRoomPopup = true;
        },
        refreshRoom() {
            uni.showLoading({
                title: '刷新中...'
            });
            this.initData().then((res) => {
                uni.hideLoading();
                this.skutype = 1;
                uni.showToast({
                    title: '刷新完成~',
                    icon: 'none'
                });
            });
        },
        changeRoom(room) {
            this.selectedRoom = room;
            this.roomId = room.id;
            this.isRoomPopup = false;

            this.showAnimate();
            this.initData();
            this.skutype = 1;
        },
        showAnimate() {
            this.startMoving = true;
            setTimeout(() => {
                this.startMoving = false;
            }, 300);
        },
        hideRoom() {
            this.isRoomPopup = false;
        },
        paySuccess(order) {
            // 线上开盒流程
            this.isPayPopup = false;
            uni.showToast({
                title: '支付成功, 抽赏中',
                icon: 'none'
            });
            this.order = order;
            this.isOpenPopup = true;
        },
        goBack() {
            this.isOpenPopup = false;
            this.initData();
            if (this.skutype == 2) {
                this.$refs.record.getlist();
            }
        },
        totabbar(url) {
            uni.switchTab({
                url: url
            });
        },
        changetype(type) {
            this.skutype = type;
        }
    }
};
</script>

<style lang="scss" scoped>
.refreshbox {
    position: fixed;
    bottom: 690rpx;
    right: 10px;
    width: 45px;
    height: 20px;
    font-size: 11px;
    padding-top: 25px;
    z-index: 99;
    color: #f5f5f5;
    text-align: center;
    background-image: url('https://api.caihongbox.com.cn/image/shuaxin.png');
    background-size: 100% 100%;
}

.scope-container {
    box-sizing: border-box;
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/65dea2a339eab7782bf47e83.gif');
    background-position: top;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);
}

.topbox {
    position: relative;
    margin: 0 22rpx;
    padding-top: 100rpx;

    .topimgbox {
        position: absolute;
        top: 15rpx;
        left: 30rpx;

        .topimg {
            width: 235rpx;
            height: 235rpx;
            border-radius: 25rpx;
            box-shadow: 0 0 7px 3px #8048a5;
            border: 10rpx solid transparent;
            background-clip: padding-box, border-box;
            background-origin: padding-box, border-box;
            background-image: linear-gradient(to right, #fff, #fff), linear-gradient(30deg, #00ddff, #dc3dff, #00ddff, #dc3dff);
        }

        .topimgtext {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10rpx;
            font-size: 24rpx;

            .changebox {
                color: #fff;
                width: 95rpx;
                margin-left: 10rpx;
                text-align: center;
                line-height: 30rpx;
                border-radius: 30px;
                background-image: linear-gradient(to bottom, #348d9d, #51b4ef);
            }

            .icon-express-package {
                font-size: 24rpx;
                margin-right: 5rpx;
            }
        }
    }

    .sharebtn {
        display: flex;
        align-items: center;
        position: absolute;
        top: 30rpx;
        right: 20rpx;
        color: #fff;
        font-size: 14px;
        line-height: 24px;

        .new-icon {
            font-size: 20px;
            color: #ceffff;
            margin-right: 3px;
        }
    }

    .topmainbox {
        padding: 8rpx;
        background-color: #fff;
        border-radius: 20rpx;
        border-top: 10rpx solid #75f1f9;
        border-bottom: 10rpx solid #ef86fc;

        .topmainboxa {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            height: 105rpx;
            border-radius: 10rpx 10rpx 0 0;
            background-image: linear-gradient(to right, #4515b7, #9a45e1 40%, #3b2a90);

            .titletext {
                width: calc(100% - 325rpx);
                margin-right: 30rpx;
                color: #fff;
                text-shadow:
                    1px 1px 3px #b2b2f8,
                    -1px 1px 3px #b2b2f8,
                    -1px -1px 3px #b2b2f8,
                    1px -1px 3px #b2b2f8;
            }
        }

        .topmainboxb {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            height: 105rpx;

            .textbox {
                margin-right: 30rpx;
                font-size: 30rpx;

                .new-icon {
                    margin-right: 10rpx;
                    font-weight: bold;
                    font-size: 35rpx;
                }
            }
        }
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
        font-size: 24rpx;
        position: absolute;
        left: 50rpx;
        top: 3rpx;
        background-image: linear-gradient(120deg, #7e30ee 0%, #ea25e7 100%);
        color: #fff;
        padding: 8rpx 20rpx 6rpx 20rpx;
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

    padding-bottom: 270rpx;

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

    .sku-list {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        margin: 70rpx 15rpx 30rpx;
        padding: 65rpx 35rpx;
        background-image: url('https://api.caihongbox.com.cn/image/listbg.png');
        background-size: 100% 100%;

        .item {
            margin: 5rpx 4rpx;
            padding: 30rpx;
            width: calc(100% / 3 - 4rpx - 4rpx);
            box-sizing: border-box;
            border-radius: 25rpx;
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');
            color: #fff;
            background-size: 100% 100%;

            .imageArea {
                padding: 10rpx;
                box-sizing: border-box;
                position: relative;

                .thumb {
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
            }

            .title {
                font-size: 22rpx;
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
                    height: 50rpx;
                    font-size: 20rpx;
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

.footer-c {
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    height: 210rpx;
    border-radius: 30px 30px 0 0;
    background-image: linear-gradient(to bottom, #613396, #1332ca);
}

.btn-c {
    width: 700rpx;
    margin: 30rpx auto 0rpx auto;
    display: flex;
    justify-content: space-between;

    .btn {
        width: 140rpx;
        flex: 0 0 140rpx;
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
