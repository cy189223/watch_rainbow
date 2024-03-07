<template>
    <view class="container">
        <view :style="'height:' + customBar + 'px;'"></view>
        <Navbar title="打拳"></Navbar>
        <!-- <HomeNavbar :title="page.title" searchType="all" :theme="scrollTop > 20 ? '#000000' : 'transparent'"></HomeNavbar> -->

        <!-- <view class="navlistbox">
            <view class="navbox" @tap="navtype = item.type" :class="navtype == item.type ? 'cur' : ''" v-for="(item, index) in navlist" :key="index">
                {{ item.name }}
            </view>
        </view> -->

        <!-- <view class="module-c" style="margin-top: 0px; padding: 0 14px" v-if="navtype == 'qjs'"> -->
        <view class="module-c" style="margin-top: 0px; padding: 0 14px">
            <view class="list-scope list-grid2">
                <view class="item-container grid2" hover-class="hover" @click="clickyfsItem(item, navtype)" v-for="(item, index) in qjslist.list" :key="index">
                    <view class="thumb-c">
                        <image class="p-tag" :class="'location-' + item.image_tag.location" :src="item.image_tag.image" v-if="item.image_tag"></image>
                        <image mode="aspectFill" :src="item.thumb" class="thumb"></image>
                        <view class="presell-c" v-if="item.is_presell">预售</view>
                    </view>
                    <view class="body">
                        <view class="title">{{ item.title }}</view>
                        <view class="bottom">
                            <view class="tag">{{ (item && item.tags && item.tags[0]) || '创意热销' }}</view>
                            <view class="price">
                                <PriceDisplay :info="item"></PriceDisplay>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- <view class="module-c" style="margin-top: 0px; padding: 0 14px" v-if="navtype == 'ydd'">
            <view class="list-scope list-grid2">
                <view class="item-container grid2" hover-class="hover" @click="clickyfsItem(item, navtype)" v-for="(item, index) in yddlist.list" :key="index">
                    <view class="thumb-c">
                        <image class="p-tag" :class="'location-' + item.image_tag.location" :src="item.image_tag.image" v-if="item.image_tag"></image>
                        <image mode="aspectFill" :src="item.thumb" class="thumb"></image>
                        <view class="presell-c" v-if="item.is_presell">预售</view>
                    </view>
                    <view class="body">
                        <view class="title">{{ item.title }}</view>
                        <view class="bottom">
                            <view class="tag">{{ (item && item.tags && item.tags[0]) || '创意热销' }}</view>
                            <view class="price">
                                <PriceDisplay :info="item"></PriceDisplay>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view> -->

        <!-- <uni-popup style="z-index: 1000" ref="getPopup" type="bottom">
            <view class="mask-content">
                <text class="new-iconfont icon-close close-btn" @tap="hidegetpopup()"></text>
                <view class="title">领取奖品</view>
                <view style="height: 30rpx"></view>
                <SelectAddress class="address-c" v-model="address"></SelectAddress>
                <view class="tips">商品一经寄出，非质量问题不支持退换</view>
                <view class="button" @click="submit">
                    <text>确认领取奖品</text>
                </view>
            </view>
        </uni-popup> -->
    </view>
</template>

<script>
import Navbar from '@/components/Navbar/index.vue';
export default {
    components: {
        Navbar
    },
    data() {
        return {
            isShowPay: false,
            uuid: '',
            id: '',
            address: {},
            scrollTop: 0,
            navtype: 'qjs',
            liushuilist: [],
            qjslist: {},
            yddlist: {},
            navlist: [
                {
                    name: '打拳',
                    type: 'qjs'
                },
                {
                    name: 'PK赏',
                    type: 'ydd'
                }
            ]
        };
    },
    onPullDownRefresh() {
        this.$showPullRefresh().then((res) => {
            this.getList();
            this.getqjsList();
            this.getyddList();
        });
    },
    onShow() {
        this.getList();
        this.getqjsList();
        this.getyddList();
    },
    computed: {
        page() {
            return this.$store.getters.setting.box_home;
        },
        customBar() {
            return this.$store.getters.deviceInfo.customBar;
        }
    },
    methods: {
        getList() {
            this.$http(`/accounts`, 'get', {
                type: 'pk'
            }).then((res) => {
                this.liushuilist = res.data;
            });
        },
        getqjsList() {
            this.$http(`/pk`, 'get', {
                type: 1
            }).then((res) => {
                this.qjslist = res.data;
            });
        },
        getyddList() {
            this.$http(`/pk`, 'get', {
                type: 2
            }).then((res) => {
                this.yddlist = res.data;
            });
        },
        // hidegetpopup() {
        //     this.$refs.getPopup.close();
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
        //         this.getList();
        //         this.uuid = '';
        //         this.id = '';
        //         uni.hideLoading();
        //         this.$refs.getPopup.close();
        //         uni.showModal({
        //             title: '领取成功',
        //             content: '已成功提交发货请求，请注意查收快递哦~'
        //         });
        //     });
        // },
        clickyfsItem(item, type) {
            uni.navigateTo({
                url: `/pages/pkindex/pkindex?id=` + item.uuid + '&type=' + type
            });
        }
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
        //         this.$refs.getPopup.open('bottom');
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
        //             this.getList();
        //             this.uuid = '';
        //             this.id = '';
        //             uni.hideLoading();
        //             this.$refs.getPopup.close();
        //             uni.showModal({
        //                 title: '领取成功',
        //                 content: this.scoreAlias + '领取成功，请注意查收~'
        //             });
        //         });
        //     }
        // }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #000000;
    background-image: url('https://api.caihongbox.com.cn/image/centertopbg.png');
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
}

.navlistbox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 5px 20px 20px;

    .navbox {
        position: relative;
        color: #fff;
        font-size: 16px;
        text-shadow:
            1px 1px 0px #00d0ff,
            -2px 0px 0px #c33edc;
    }

    .navbox.cur::after {
        content: '';
        position: absolute;
        bottom: -9px;
        right: 50%;
        transform: translateX(50%);
        width: 25px;
        border-radius: 10px;
        height: 4px;
        background-color: #fff;
        box-shadow: 0 0 5px 3px #c33edc;
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

.mask-content {
    width: 100%;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;
    padding: 30rpx;
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

    .address-c {
        margin-top: 30rpx;
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

.list-scope {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;
    border-radius: 10px;
    // background: #f7f0ff;

    .grid2 {
        width: 48%;
    }

    .item-container {
        width: calc(48% - 10rpx);
        border-radius: 30rpx 30rpx 20rpx 20rpx;
        overflow: hidden;
        margin-bottom: 28rpx;
        box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
        position: relative;
        background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/boxItemBg.png');

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
                background: rgba(230, 49, 17, 0.5);
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
            background: white;
            padding: 12rpx 21rpx 10rpx 21rpx;
            box-sizing: border-box;

            .title {
                font-size: 30rpx;
                font-weight: 500;
                color: #000000;

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
</style>
