<template>
    <view class="container">
        <view class="header" v-if="userInfo && userInfo.name">
            <view style="position: relative">
                <navigator url="/pages/myProfile/index">
                    <image :src="userInfo.headimg" class="headimg"></image>
                </navigator>
                <view class="level" @tap="toDetail('/pages/level/level')">LV{{ userInfo.user_level_name && userInfo.user_level_name != '' ? userInfo.user_level_name : '0' }}</view>
            </view>
            <view class="middle">
                <view class="name">{{ userInfo.name }}</view>
                <view class="idnum">ID:{{ userInfo.id }}</view>
                <!-- #ifndef MP-ALIPAY -->
                <view class="vipbox" v-if="config.is_show_vip">
                    <view class="vip-c" v-if="userInfo.vip_status == 1" @tap="toBuyVip">
                        <text class="new-iconfont icon-vip"></text>
                        <text>{{ $tool.formatDate(userInfo.vip_end_at, 'yyyy-MM-dd') }} 到期</text>
                    </view>
                    <view class="vip-c disabled" v-else @tap="toBuyVip">
                        <text class="new-iconfont icon-vip"></text>
                        <text>开通VIP会员</text>
                    </view>
                </view>
                <!-- #endif -->
            </view>
            <div style="flex-grow: 1"></div>

            <!-- #ifndef MP-KUAISHOU -->
            <button class="right" open-type="contact" @tap="openContact">
                <text class="new-iconfont icon-contact">客服</text>
            </button>
            <!-- #endif -->
        </view>
        <view class="status-bar">
            <view class="item" @tap="toDetail('/pages/myScore/index')">
                <view class="number">{{ userInfo.score || 0 }}</view>
                <view class="text">{{ scoreAlias }}</view>
            </view>
            <!-- <view class="line"></view>
			<view class="item" @tap="toDetail('/pages/myChip/index')">
				<view class="number">{{userInfo.chip_count || 0}}</view>
				<view class="text">积分</view>
			</view> -->
            <template v-if="config.is_show_invite_total">
                <view class="line"></view>
                <view class="item" @tap="toDetail('/pages/myInvitees/index')">
                    <view class="number">{{ userInfo.invitees_count || 0 }}</view>
                    <view class="text">邀请记录</view>
                </view>
            </template>
            <view class="line"></view>
            <view class="item" @tap="toDetail('/pages/myCoupons/index')">
                <view class="number">{{ userInfo.coupon_count || 0 }}</view>
                <view class="text">优惠券</view>
            </view>
        </view>
        <view class="qianbaobox">
            <view class="text">{{ $money() }}{{ (userInfo.redpack || 0) / 100 }}元</view>
            <view class="chakan" @tap="toDetail('/pages/myRedpack/index')">查看</view>
        </view>
        <view class="order-c">
            <view class="top">
                <view class="title">我的订单</view>
                <view class="all-btn" @tap="toDetail('/pages/orderList/index?status=all')">
                    全部订单
                    <text class="icon new-iconfont icon-arrow-right"></text>
                </view>
            </view>
            <view class="body">
                <view class="item" @tap="toDetail('/pages/orderList/index?status=pay_pending')" hover-class="hover">
                    <view v-if="orderStat.pay_pending" class="dot">
                        {{ orderStat.pay_pending }}
                    </view>
                    <image mode="widthFix" style="width: 57rpx; height: 49rpx" src="@/static/center/order-return-sale.png"></image>
                    <text>待付款</text>
                </view>
                <view class="item" @tap="toDetail('/pages/orderList/index?status=deliver_pending')" hover-class="hover">
                    <view v-if="orderStat.deliver_pending" class="dot">
                        {{ orderStat.deliver_pending }}
                    </view>
                    <image mode="widthFix" style="width: 57rpx; height: 49rpx" src="@/static/center/order-deliver-pending.png"></image>
                    <text>待发货</text>
                </view>
                <view class="item" @tap="toDetail('/pages/orderList/index?status=delivered')" hover-class="hover">
                    <view v-if="orderStat.delivered" class="dot">
                        {{ orderStat.delivered }}
                    </view>
                    <image mode="widthFix" style="width: 66rpx; height: 59rpx" src="@/static/center/order-delivered.png"></image>
                    <text>已发货</text>
                </view>
            </view>
        </view>
        <!-- <Banner
            class="center-banner"
            v-if="config.banner && config.banner.length"
            :list="config.banner"
            iStyle="height: 220rpx;"
            imageStyle="border-radius: 50rpx 50rpx 0rpx 0rpx; box-shadow: 10px 10rpx 10rpx 10rpx rgba(243, 238, 220, 0.4);"
        ></Banner> -->
        <view class="action-list action-list-1">
            <view class="item" @tap="toDetail('/pages/liushui/index')" hover-class="hover">
                <view class="left-icon">
                    <image src="@/static/center/liushui.png"></image>
                </view>
                <view class="text">流水奖励</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
            <view class="item" @tap="toDetail('/pages/ranking/index')" hover-class="hover">
                <view class="left-icon">
                    <image src="@/static/center/paihang.png"></image>
                </view>
                <view class="text">排行榜</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
            <view class="item" @tap="toDetail('/pages/myCard/index')" hover-class="hover">
                <view class="left-icon">
                    <image style="width: 30rpx; height: 30rpx" src="@/static/center/toushi.png"></image>
                </view>
                <view class="text">道具卡</view>
                <view class="total">{{ userInfo.card_total }}</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
            <view class="item" @tap="toDetail('/pages/code/index')" hover-class="hover">
                <view class="left-icon">
                    <image style="width: 30rpx; height: 30rpx" src="@/static/center/rule.png"></image>
                </view>
                <view class="text">兑换码</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
            <view class="item" @tap="toDetail('/pages/couponlist/couponlist')" hover-class="hover">
                <view class="left-icon">
                    <image src="@/static/center/coupon.png"></image>
                </view>
                <view class="text">领券中心</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
            <view class="item noBorder" @tap="toDetail('/pages/level/level')" hover-class="hover">
                <view class="left-icon">
                    <image style="width: 30rpx; height: 30rpx" src="@/static/center/jiangli.png"></image>
                </view>
                <view class="text">等级奖励</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
        </view>

        <view class="action-list">
            <view
                class="item"
                :class="{
                    noBorder: index == items.length - 1
                }"
                v-for="(item, index) in items"
                @tap="$tool.toLink(item.link)"
                hover-class="hover"
                :key="index"
            >
                <view class="left-icon">
                    <image :src="item.image"></image>
                </view>
                <view class="text">{{ item.text }}</view>
                <text class="icon new-iconfont icon-arrow-right"></text>
            </view>
        </view>

        <!-- #ifndef MP-ALIPAY -->
        <FloatBtn v-if="floatBtn.is_show" :link="floatBtn.link" :isAnimated="floatBtn.is_animate" :src="floatBtn.image"></FloatBtn>
        <!-- #endif -->

        <view class="copyright-c" v-if="config.copyright">{{ config.copyright }}</view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'center',
    components: {},
    data() {
        return {
            code: '',
            init: false,
            orderStat: {}
        };
    },
    computed: {
        ...mapGetters(['deviceInfo', 'userInfo', 'token', 'personalSettings']),
        isLogin() {
            return this.token ? true : false;
        },
        userName() {
            return this.token ? this.userInfo.name : '点击登录';
        },
        avatar() {
            return this.token ? this.userInfo.headimg : '/static/toux.png';
        },
        config() {
            return this.$store.getters.setting.user_center;
        },
        items() {
            return (this.config && this.config.items) || [];
        },
        isAnimated() {
            return true;
        },
        floatBtn() {
            return {
                is_show: this.config.is_show_float_btn,
                link: this.config.float_btn_link,
                image: this.config.float_btn_image,
                is_animate: this.config.float_btn_is_animate
            };
        }
    },
    onLoad() {
        uni.login({
            success: (res) => {
                this.code = res.code;
            },
            fail: (err) => {}
        });

        this.$visitor.record('center');
    },
    onShow() {
        this.$store.dispatch('getUserInfo').then((res) => {
            this.$http('/order-stat').then((res) => {
                this.orderStat = res.data.info;
            });
        });
    },
    methods: {
        toDetail(url) {
            uni.navigateTo({
                url: url
            });
        },
        totabbar(url) {
            uni.switchTab({
                url: url
            });
        },
        toDayTask() {
            this.isAnimated = false;
            uni.navigateTo({
                url: '/pages/dayTask/index'
            });
        },
        toBuyVip() {
            uni.navigateTo({
                url: '/pages/buyVip/index'
            });
        }
    }
};
</script>

<style lang="scss">
.copyright-c {
    text-align: center;
    font-size: 90%;
    color: #999;
    height: 50rpx;
}

page {
    background-image: url('https://api.caihongbox.com.cn/image/centerbg.png');
    background-size: 100% 585rpx;
    background-repeat: no-repeat;
    background-color: #f5f8fc;
}

.container {
    padding-top: 60px;
    background-color: #000000;
    background-image: url('https://watch-box.oss-cn-beijing.aliyuncs.com/65dea2a339eab7782bf47e83.gif');
    background-position: top;
    background-size: 100%;
}

.header {
    display: flex;
    align-items: center;
    color: #fff;

    .headimg {
        width: 160rpx;
        flex: 0 0 160rpx;
        margin: 0rpx 30rpx;
        height: 160rpx;
        border-radius: 50%;
        border: 10rpx solid #9d48e4;
        box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
    }
    .level {
        position: absolute;
        font-size: 12px;
        left: 50%;
        bottom: 0;
        padding: 0 10rpx;
        line-height: 30rpx;
        transform: translate(-50%, 20%);
        background-color: #0f0d2f;
        border-radius: 20px;
        border: 1rpx solid #fff;
        box-shadow: 0 0 0 1rpx #8937cc;
        color: #fff;
        text-shadow:
            1px 1px 3px #8937cc,
            -1px 1px 3px #8937cc,
            -1px -1px 3px #8937cc,
            1px -1px 3px #8937cc;
    }

    .middle {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .name {
            font-size: 34rpx;
            font-weight: bold;
            color: #fff;
            margin-bottom: 15rpx;
        }

        .vipbox {
            margin-top: 15rpx;
            display: flex;
            align-items: center;

            .idnum {
                margin-left: 5px;
                font-size: 12px;
            }
        }

        .vip-c {
            padding: 0rpx 20rpx;
            border-radius: 50rpx;
            display: flex;
            align-items: center;
            background: #9d48e4;

            .icon-vip {
                margin-right: 10rpx;
                font-size: 36rpx;
                line-height: 40rpx;
            }

            font-size: 24rpx;
            font-weight: 500;
            color: #fff;

            &.disabled {
                color: #fff;
            }
        }
    }

    .right {
        margin-right: 30rpx;
        padding: 0rpx;
        font-size: 26rpx;
        width: 130rpx;
        border-radius: 100rpx !important;
        line-height: 50rpx;
        overflow: hidden;
        height: 50rpx;
        color: #fff;
        background-color: #9d48e4;

        &::after {
            display: none;
        }
    }
}

/* #ifdef MP-ALIPAY */
.header {
    margin-top: 50rpx;
    .headimg {
        width: 120rpx;
        height: 120rpx;
        flex: 0 0 120rpx;
    }
}
/* #endif */

.status-bar {
    display: flex;
    margin: 50rpx 0rpx 30rpx 0rpx;
    align-items: center;
    color: #fff;

    .line {
        height: 40rpx;
        width: 1rpx;
        flex: 0 0 1rpx;
        border-left: 1rpx solid #999;
    }

    .item {
        flex-grow: 1;
        text-align: center;

        .number {
            font-size: 32rpx;
            font-weight: 700;
            line-height: 40rpx;
        }

        .text {
            font-size: 24rpx;
            font-weight: 500;
        }
    }
}

.order-c {
    width: 700rpx;
    height: 200rpx;
    background: #ffffff;
    box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.4);
    border-radius: 20rpx;
    margin: 0rpx auto;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    margin-bottom: 30rpx;

    .top {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;

        .title {
            font-weight: bold;
            color: #333333;
            font-size: 28rpx;
            flex-grow: 1;
        }

        .all-btn {
            font-size: 24rpx;
            font-weight: 500;
            color: #673ab7;
        }
    }

    .body {
        display: flex;
        align-items: flex-end;
        padding: 0 30rpx;
        justify-content: space-between;

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

            text {
                font-weight: bold;
                color: #333333;
                font-size: 24rpx;
            }

            .dot {
                left: 60%;
                bottom: 76rpx;
                position: absolute;
                line-height: 30rpx;
                background: #ff6b14;
                border-radius: 50%;
                text-align: center;
                width: 30rpx;
                font-size: 20rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: #ffffff;
            }
        }
    }
}

.center-banner {
    width: 680rpx;
    height: 160rpx;
    display: block;
    margin: 0rpx auto 0rpx auto;
}

.action-list {
    width: 700rpx;
    margin: 0rpx auto 20rpx auto;
    background: #ffffff;
    box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.16);
    border-radius: 20rpx;
    position: relative;
    top: -10rpx;

    .item {
        display: flex;
        align-items: center;
        padding: 30rpx 20rpx 30rpx 30rpx;
        border-bottom: 1rpx solid #f3f3f3;

        .left-icon {
            width: 60rpx;
            flex: 0 0 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            image {
                width: 34rpx;
                height: 34rpx;
            }
        }

        .text {
            font-size: 28rpx;
            font-weight: bold;
            color: #333333;
            flex-grow: 1;
        }

        .total {
            height: 40rpx;
            background: #f2f2f2;
            border-radius: 20rpx;
            font-size: 28rpx;
            font-weight: bold;
            color: #333333;
            padding: 0rpx 30rpx;
            margin-right: 10rpx;
        }

        .icon-arrow-right {
            display: flex;
            align-items: center;
            font-size: 42rpx;
            display: block;
            color: #aaa;
            line-height: 42rpx;
            padding: 0rpx;
        }
    }
    .noBorder {
        border-bottom: none;
    }
}

.qianbaobox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40rpx 0 120rpx;
    color: #fff;
    font-size: 30rpx;
    background-image: url('https://api.caihongbox.com.cn/image/qianbao.png');
    height: 110rpx;
    background-size: 100% 100%;
    margin-bottom: 30rpx;

    .chakan {
        width: 100rpx;
        line-height: 45rpx;
        border-radius: 30rpx;
        text-align: center;
        border: 1rpx solid #fff;
        font-size: 28rpx;
    }
}
</style>
