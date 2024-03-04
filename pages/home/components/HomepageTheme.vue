<template>
    <view class="_homePageThemeWrap">
        <view class="navlistbox" :style="'top: ' + customBar + 'px'">
            <view class="navbox" @tap="changeTab(item)" :class="navtype == item.type ? 'cur' : ''" v-for="(item, index) in navlist" :key="index">
                <image :src="item.icon" :class="item.iconClass"></image>
                <text class="title">{{ item.name }}</text>
            </view>
        </view>
        <!-- TODO -->
        <!-- <view v-if="navtype == 'liushuijiangli'" class="liushuilistbox">
            <view class="liushuibox" v-if="liushuilist.list">
                <view v-for="(item, index) in liushuilist.list" :key="index" style="padding-bottom: 5px">
                    <view>{{ item.start_time }} 至 {{ item.end_time }}</view>
                    <view>无限赏累计消费金额：{{ item.amount }}</view>
                    <view v-for="(ite, ind) in item.skus" :key="ind" class="mainbox">
                        <view class="titletext">无限赏累计消费满{{ ite.amount }}送</view>
                        <view class="canbuy">{{ ite.can_get == 2 ? '已领取' : ite.can_get == 1 ? '可领取' : '未达成' }}</view>
                        <view class="flexbox">
                            <view class="numbox">
                                <image class="img" src="../../../static/zuanshi.png" mode=""></image>
                                <view>{{ ite.score && ite.score != '' ? ite.score : '0' }}</view>
                            </view>
                            <image v-if="ite.thumb && ite.thumb != ''" :src="ite.thumb" mode="aspectFill" class="imgbox"></image>
                            <view v-if="ite.thumb && ite.thumb != ''" class="flextitle">{{ ite.title }}</view>
                            <view v-if="ite.can_get == 1" @tap="receive(item.uuid, ite)" class="flexbtnbox">领取</view>
                            <view v-else-if="ite.can_get == 2" class="flexbtnbox">已领取</view>
                            <view v-else class="flexbtnbox grayflexbtnbox">领取</view>
                        </view>
                    </view>
                </view>
            </view>
            <NoData v-if="liushuilist && !liushuilist.list.length"></NoData>
        </view> -->
        <view class="module-c" style="margin-top: 0px; padding: 0 14px" v-if="navtype == 'yifanshang'">
            <view class="list-scope list-grid2">
                <view class="item-container grid2" @click="clickyfsItem(item)" v-for="(item, index) in yfslist.list" :key="index">
                    <view class="tag">{{ (item && item.tags && item.tags[0]) || '创意热销' }}</view>
                    <view class="thumb-c">
                        <image class="p-tag" :class="'location-' + item.image_tag.location" :src="item.image_tag.image" v-if="item.image_tag"></image>
                        <image mode="aspectFill" :src="item.thumb" class="thumb"></image>
                        <view class="presell-c" v-if="item.is_presell">预售</view>
                    </view>
                    <view class="body">
                        <view class="title">{{ item.title }}</view>
                        <view class="bottom">
                            <view class="price">
                                <PriceDisplay :info="item"></PriceDisplay>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- <view class="module-c" style="margin-top: 0px; padding: 0 14px" v-if="navtype == 'shuangsuiji'">
            <view class="list-scope list-grid2">
                <view class="item-container grid2"  @click="clickyfsItem(item)" v-for="(item, index) in ssjlist.list" :key="index">
                    <view class="tag">{{ (item && item.tags && item.tags[0]) || '创意热销' }}</view>
                    <view class="thumb-c">
                        <image class="p-tag" :class="'location-' + item.image_tag.location" :src="item.image_tag.image" v-if="item.image_tag"></image>
                        <image mode="aspectFill" :src="item.thumb" class="thumb"></image>
                        <view class="presell-c" v-if="item.is_presell">预售</view>
                    </view>
                    <view class="body">
                        <view class="title">{{ item.title }}</view>
                        <view class="bottom">
                            <view class="price">
                                <PriceDisplay :info="item"></PriceDisplay>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view> -->

        <view class="content-c">
            <view class="module-c" :style="'margin-top:' + item.style.margin_top + 'rpx; padding: 0 ' + item.style.margin + 'rpx;'" v-for="(item, index) in modules" :key="index">
                <ActivityList
                    :refreshCounter="refreshCounter"
                    :getNextPageCounter="getNextPageCounter"
                    :ids="item.list"
                    :module="item"
                    v-show="item.type === 'activities' && navtype == item.activity_type"
                />
            </view>
        </view>
        <!-- <view class="mask" @tap="isShowPay = false" v-if="isShowPay">
            <view class="mask-content" @tap.stop>
                <text class="new-iconfont icon-close close-btn" @tap="isShowPay = false"></text>
                <view class="title">领取奖品</view>
                <view style="height: 30rpx"></view>
                <SelectAddress class="address-c" v-model="address"></SelectAddress>
                <view class="tips">{{ deliverTips }}</view>
                <view class="button" @click="submit">
                    <text>确认领取奖品</text>
                </view>
            </view>
        </view> -->
    </view>
</template>

<script>
export default {
    props: {
        refreshCount: {
            type: Number
        },
        liushuilist: Object,
        yfslist: Object,
        ssjlist: Object,
        // amountnum:String,
        refreshCounter: Number,
        getNextPageCounter: Number
    },
    data() {
        return {
            isShowPay: false,
            uuid: '',
            id: '',
            address: {},
            navtype: 'fudai',
            navlist: [
                { name: '无限赏', type: 'fudai', icon: 'https://watch-box.oss-cn-beijing.aliyuncs.com/wuxian1.png', iconClass: 'icon' },
                { name: '一番赏', type: 'yifanshang', icon: 'https://watch-box.oss-cn-beijing.aliyuncs.com/money1.png', iconClass: 'icon2' },
                // { name: '双随机', type: 'shuangsuiji' },
                { name: '刮刮乐', type: 'box', icon: 'https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%88%AE%E5%88%AE%E4%B9%90.png', iconClass: 'icon' },
                // { name: '流水奖励', type: 'liushuijiangli' },
                { name: '打拳', type: 'pk', icon: 'https://watch-box.oss-cn-beijing.aliyuncs.com/%E6%8B%B3%E5%A4%B4%E4%BC%98%E5%8A%BF.png', iconClass: 'icon2' }
            ]
        };
    },
    computed: {
        modules() {
            return (this.$store.getters.setting.box_home.modules || []).filter((item) => item.isAutoShow === '0');
        },
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        },
        orderConfig() {
            return this.$store.getters.setting.order || {};
        },
        deliverTips() {
            return this.orderConfig.deliver_tips || '商品一经寄出，非质量问题不支持退换';
        }
    },
    created() {},
    methods: {
        changeTab({ type }) {
            if (type == 'pk') {
                this.navtype = 'fudai';
                uni.navigateTo({
                    url: '/pages/pkindex/index'
                });
            } else {
                this.navtype = type;
            }
        },
        // receive(uuid, item) {
        //     if (item.can_get == 2) {
        //         uni.showToast({
        //             title: '已经领取过了哦',
        //             icon: 'none'
        //         });
        //         return;
        //     }
        //     if (item.can_get != 1) {
        //         uni.showToast({
        //             title: '流水不足',
        //             icon: 'none'
        //         });
        //         return;
        //     }
        //     if (item.thumb && item.thumb != '') {
        //         this.uuid = uuid;
        //         this.id = item.id;
        //         this.isShowPay = true;
        //     } else {
        //         uni.showLoading({
        //             title: '领取中',
        //             icon: 'none'
        //         });
        //         this.$http(`/account/order/confirm`, 'post', {
        //             uuid: uuid,
        //             sku_id: item.id
        //             // address_id: this.address.id,
        //         }).then((res) => {
        //             this.$emit('getliushui');
        //             this.uuid = '';
        //             this.id = '';
        //             uni.hideLoading();
        //             uni.showModal({
        //                 title: '领取成功',
        //                 content: this.scoreAlias + '领取成功，请注意查收~'
        //             });
        //         });
        //     }
        // },
        // submit() {
        //     if (!this.address.id) {
        //         uni.showModal({
        //             title: '请选择收货地址'
        //         });
        //         return false;
        //     }

        //     uni.showLoading({
        //         title: '提交中',
        //         icon: 'none'
        //     });

        //     this.$http(`/account/order/confirm`, 'post', {
        //         uuid: this.uuid,
        //         sku_id: this.id,
        //         address_id: this.address.id
        //     }).then((res) => {
        //         this.$emit('getliushui');
        //         this.uuid = '';
        //         this.id = '';
        //         uni.hideLoading();
        //         this.isShowPay = false;
        //         uni.showModal({
        //             title: '领取成功',
        //             content: '已成功提交发货请求，请注意查收快递哦~'
        //         });
        //     });
        // },
        clickyfsItem(item) {
            uni.navigateTo({
                url: `/pages/yifanshang/detail?uuid=${item.uuid}`
            });
        }
    }
};
</script>

<style lang="scss" scoped>
._homePageThemeWrap {
    margin-top: 40rpx;
}

.content-c {
    position: relative;
    overflow: hidden;

    .module-c {
        box-sizing: border-box;
    }
}
.liushuilistbox {
    margin: 0 30rpx 20px;
    padding: 10px;
    background-color: #f7f0ff;
    border-radius: 10px;
}
.liushuibox {
    .mainbox {
        position: relative;
        background-color: #fff;
        padding: 10px;
        border-radius: 15px;
        margin-top: 10px;

        .flexbox {
            display: flex;
            align-items: flex-end;
            margin-top: 8px;
            font-size: 13px;

            .flexbtnbox {
                margin-left: auto;
                background-image: url('https://api.caihongbox.com.cn/image/btnbg.png');
                background-size: 100% 100%;
                color: #fff;
                width: 50px;
                text-align: center;
                line-height: 28px;
            }

            .grayflexbtnbox {
                background-image: url('https://api.caihongbox.com.cn/image/graybtnbg.png') !important;
            }

            .numbox {
                width: 65px;
                display: flex;
                align-items: center;

                .img {
                    width: 18px;
                    height: 18px;
                }
            }

            .imgbox {
                width: 50px;
                height: 50px;
                border: 3px solid transparent;
                border-radius: 15px;
                background-clip: padding-box, border-box;
                background-origin: padding-box, border-box;
                background-image: linear-gradient(to right, #fff, #fff), linear-gradient(15deg, #d84fe8, #414afc, #d84fe8);
            }

            .flextitle {
                width: calc(100% - 180px);
                margin-left: 5px;
                align-self: center;
                font-weight: bold;
            }
        }

        .titletext {
            font-style: italic;
        }

        .canbuy {
            position: absolute;
            top: 10px;
            right: 10px;
            font-style: italic;
        }
    }
}

.list-scope {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;
    border-radius: 10px;

    .grid2 {
        width: 50%;
    }

    .item-container {
        border-radius: 30rpx 30rpx 20rpx 20rpx;
        overflow: hidden;
        margin-bottom: 28rpx;
        position: relative;
        background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 40rpx 30rpx 40rpx 44rpx;
        box-sizing: border-box;

        .tag {
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;

            position: absolute;
            z-index: 9;
            font-size: 22rpx;
            padding: 2rpx 10rpx;
            border-radius: 6rpx;
            top: 36rpx;
            background-image: linear-gradient(120deg, #efde73 0%, #bea04f 100%);
            color: #463b3b;
        }

        .thumb-c {
            position: relative;
            .thumb {
                width: 100%;
                height: 330rpx;
                display: block;
            }

            .presell-c {
                position: absolute;
                width: 100%;
                text-align: center;
                background: #8352c4d1;
                color: white;
                left: 0rpx;
                bottom: 0rpx;
                font-size: 24rpx;
                padding: 6rpx 0rpx;
            }

            .p-tag {
                position: absolute;
                width: 100rpx;
                height: 100rpx;
                top: 0rpx;

                // 右上角
                &.location-1 {
                    right: 0rpx;
                }

                // 右上角
                &.location-2 {
                    left: 0rpx;
                }
            }
        }

        .body {
            padding: 12rpx 21rpx 10rpx 21rpx;
            box-sizing: border-box;
            .title {
                font-size: 26rpx;
                font-weight: 500;
                color: #fff;

                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }

            .tag {
                height: 36rpx;
                background: #f7f7f7;
                border-radius: 50rpx;
                font-size: 22rpx;
                font-weight: 500;
                color: #999999;
                line-height: 36rpx;
                padding: 0rpx 12rpx;
                max-width: 180rpx;
                display: inline;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }

            .price {
                text-align: right;
                font-size: 30rpx;
                font-weight: 800;
                color: #de1124;
            }
        }
    }
}

.mask-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 300px;
    background-color: #ededed;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;
    padding: 30rpx 30rpx;
    box-sizing: border-box;

    .close-btn {
        position: absolute;
        right: 20rpx;
        top: 20rpx;
    }

    .title {
        text-align: center;
        font-size: 36rpx;
        font-weight: 500;
        margin-bottom: 30rpx;
    }

    .item-title {
        margin: 0rpx 0rpx 0rpx 0rpx;
        font-size: 28rpx;
    }

    .item-value {
        text-align: right;
        font-weight: 500;
    }

    .block {
        display: flex;
        align-items: center;
        padding: 16rpx 0rpx;

        .item-title {
            flex-grow: 1;
            font-weight: 500;
        }

        .redpack-switch {
            margin-left: 10rpx;
            position: relative;
            left: 10rpx;
            transform: scale(0.8);
        }
    }

    .address-c {
        margin-top: 30rpx;
    }

    .sku-list {
        display: flex;
        flex-wrap: wrap;

        .item {
            padding: 0 26rpx;
            height: 48rpx;
            line-height: 48rpx;
            font-size: 24rpx;
            margin-right: 16rpx;
            margin-bottom: 16rpx;
            border-radius: 40rpx;
            border: 2rpx solid #eaebed;
            text-align: center;
            min-width: 70rpx;

            &.actived {
                color: white;
                background: rgba(105, 56, 182, 1);
                border: 2rpx solid rgba(105, 56, 182, 1);
            }

            &:last-child {
                margin-right: 0rpx;
            }
        }
    }

    .total {
        margin-top: 20rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 0 16rpx;
        text-align: right;
        color: red;
        font-size: 28rpx;
    }

    .tips {
        text-align: center;
        color: red;
        font-size: 24rpx;
        margin-top: 60rpx;
    }

    .button {
        padding: 0;
        margin: 20rpx auto 0rpx auto;
        width: 100%;
        border-radius: 50rpx;
        height: 86rpx;
        line-height: 86rpx;
        text-align: center;
        font-size: 30rpx;
        font-weight: bold;
        background-color: #6938b6;
        color: #fff;
        box-shadow: 0 0 20rpx rgba(105, 56, 182, 0.6);

        &:after {
            border: none;
        }
    }
}
.navlistbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10rpx 40rpx 0;
    position: sticky;
    z-index: 970;
    background-color: #000000;
    padding-bottom: 40rpx;

    .navbox {
        position: relative;
        color: #fff;
        font-size: 16px;
        padding: 0 20rpx;
        width: 100rpx;
        height: 90rpx;
        // text-shadow:
        //     1px 1px 0px #00d0ff,
        //     -2px 0px 0px #c33edc;
        background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/tagItemBg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-sizing: border-box;
        .title {
            position: absolute;
            bottom: -32rpx;
            font-size: 25rpx;
            width: 100%;
            left: 0;
            text-align: center;
        }
        .icon {
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            top: 19rpx;
            left: 25rpx;
        }
        .icon2 {
            width: 32rpx;
            height: 32rpx;
            position: absolute;
            top: 29rpx;
            left: 35rpx;
        }
    }
    .cur {
        .title {
            color: #8352c4;
        }
    }

    // .navbox.cur::after {
    //     content: '';
    //     position: absolute;
    //     bottom: -9px;
    //     right: 50%;
    //     transform: translateX(50%);
    //     width: 25px;
    //     border-radius: 10px;
    //     height: 4px;
    //     background-color: #fff;
    //     box-shadow: 0 0 5px 3px #c33edc;
    // }
}
</style>
