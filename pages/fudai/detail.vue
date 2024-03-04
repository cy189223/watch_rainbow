<template>
    <view class="scope-container">
        <view class="content">
            <view class="topbox">
                <view class="topimgbox">
                    <image :src="info.thumb" mode="aspectFill" class="topimg"></image>
                    <view class="topimgtext" v-if="info.sales || info.sales === 0">
                        <image class="huoimg" src="../../static/redu.png" mode="aspectFit"></image>
                        <text style="margin-top: 5rpx">热度:{{ info.sales }}</text>
                    </view>
                </view>
                <view class="sharebtn" @tap="isSharePopup = true">
                    <text class="new-icon icon-fenxiang"></text>
                    <view>分享</view>
                </view>
                <view class="topmainbox">
                    <view class="topmainboxa">
                        <view class="titletext">{{ info.title }}</view>
                    </view>
                    <view class="topmainboxb">
                        <view class="textbox" @tap="showTips">
                            <text class="new-icon icon-a-1"></text>
                            规则说明
                        </view>
                        <view class="textbox" @tap="totabbar('/pages/myBox/index')">
                            <text class="new-icon icon-jineqiandaiyueshangjin"></text>
                            我的赏袋
                        </view>
                    </view>
                </view>
            </view>

            <view class="body animated" :class="{ bounceOutRight: startMoving, bounceInLeft: !startMoving }">
                <view class="sku-list">
                    <view class="skutitlebox">
                        <image src="../../static/skutitle.png" mode="" class="skubg"></image>
                        <image src="../../static/spyl.png" mode="" class="skuspyl skuimg" @tap="changetype(1)"></image>
                        <image src="../../static/csjl.png" mode="" class="skucsjl skuimg" @tap="changetype(2)"></image>
                        <image src="../../static/spyla.png" mode="" class="skuspyla skuimga" v-if="skutype == 1"></image>
                        <image src="../../static/csjla.png" mode="" class="skucsjla skuimga" v-else-if="skutype == 2"></image>
                    </view>
                    <view class="item" v-for="(item, index) in info.skus" :key="item.id" @tap="showDetailImagePopup(item)" v-if="skutype == 1">
                        <view class="thumb">
                            <image mode="aspectFill" :src="item.thumb + '?x-oss-process=image/resize,w_300'"></image>
                            <view class="shang-title" :class="'shang-title-' + item.level">{{ getLevelTitle(item.level) }}</view>
                        </view>
                        <view class="title">{{ item.title }}</view>
                        <view class="bottomflex">
                            <view class="display-price" style="border-right: 1px solid #ccc">
                                <view class="value">
                                    <PriceDisplay :info="item"></PriceDisplay>
                                </view>
                                <view class="key">零售价</view>
                            </view>
                            <view class="display-price">
                                <template>
                                    <template v-if="config.show_odds_mode === 'enable'">
                                        <text class="value">{{ item.front_odds }}%</text>
                                    </template>
                                    <template v-else-if="config.show_odds_mode === 'auto'">
                                        <text class="value" v-if="item.front_odds >= 0.1">{{ item.front_odds }}%</text>
                                        <text class="value" v-else>{{ '<' }}0.1%</text>
                                    </template>
                                    <text clas="key">概率</text>
                                </template>
                            </view>
                        </view>
                    </view>
                    <RecordList ref="record" v-if="skutype == 2" :info="info" style="width: 100%"></RecordList>
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

import { mapGetters } from 'vuex';
export default {
    components: {
        PayCard,
        RecordList
    },
    data() {
        return {
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
        skuLevel() {
            return this.info.sku_level || [];
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
                path: '/pages/fudai/detail?uuid=' + this.info.uuid
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
                uni.showToast({
                    title: '此款暂无详情~',
                    icon: 'none'
                });
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
            return this.$http(`/fudais/${this.uuid}`, 'GET', {}).then((res) => {
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
        getLevelIcon(level) {
            return this.skuLevel[level - 1].icon;
        },
        getLevelTitle(level) {
            return this.skuLevel[level - 1].title;
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.scope-container {
    box-sizing: border-box;
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/bg_page_particle.gif');
    background-position: top;
    background-size: 100%;
    min-height: calc(100vh - 1rpx);
}

.topbox {
    position: relative;
    margin: 0 22rpx;
    padding-top: 100rpx;

    .topimgbox {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 15rpx;
        left: 30rpx;

        .topimg {
            width: 235rpx;
            height: 235rpx;
            margin-bottom: 15rpx;
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
            font-size: 28rpx;

            .huoimg {
                width: 40rpx;
                height: 40rpx;
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
            padding: 5rpx;
            width: calc(100% / 3 - 4rpx - 4rpx);
            box-sizing: border-box;
            border-radius: 25rpx;
            border: 5rpx solid transparent;
            background-clip: padding-box, border-box;
            background-origin: padding-box, border-box;
            background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');

            .thumb {
                position: relative;
                overflow: hidden;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 20rpx;
                position: relative;

                image {
                    width: 100%;
                    aspect-ratio: 1;
                    display: block;
                    height: auto;
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
                font-size: 24rpx;
                font-family: PingFang;
                color: #000000;
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
                    }
                    .key {
                        color: #999;
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
    height: 270rpx;
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
    margin: 50rpx auto 0rpx auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .btn {
        width: 160rpx;
        height: 166rpx;
        background-image: url('https://api.caihongbox.com.cn/image/choubox.png');
        background-size: 100% 100%;
        text-align: center;

        .chounum {
            line-height: 64rpx;
            font-family: fantasy;
            color: #fff;
            margin-top: 40rpx;
            font-size: 64rpx;
        }
        .choutext {
            margin-top: 5rpx;
            font-size: 25rpx;
            line-height: 25rpx;
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
