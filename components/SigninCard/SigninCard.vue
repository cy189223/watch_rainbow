<template>
    <view class="container" v-if="isInit">
        <image src="../../static/qiandao.png" mode="aspectFit" style="width: 380rpx; height: 80rpx; display: block; margin: 0 auto 30rpx"></image>
        <view class="day-c">
            <view v-for="(item, n) in days" class="item">
                <view class="round" :class="{ completed: days[n].is_completed }">
                    <text class="new-iconfont icon-right"></text>
                </view>
                <view class="score">{{ scoreAlias }}+{{ days[n].score }}</view>
                <view class="day">第{{ days[n].number }}天</view>
            </view>
        </view>
        <view class="signin-btn" hover-class="hover" @tap="signIn" v-if="!isSignIn">签到</view>
        <view class="signin-btn completed" v-else>今天已签到</view>
        <view class="signin-total">累计签到{{ signinTotal }}天</view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        refreshCount: {
            type: Number
        }
    },
    computed: {
        ...mapGetters(['token'])
    },
    data() {
        return {
            list: [],
            signinTotal: 0,
            isSignIn: false,
            days: [],
            isInit: false
        };
    },
    watch: {
        token() {
            this.initData();
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            this.$http('/sign-in-card-info').then((res) => {
                this.days = res.data.days;
                this.isSignIn = res.data.is_sign_in;
                this.signinTotal = res.data.sign_in_total;
                this.isInit = true;
            });
        },
        signIn() {
            uni.showLoading({
                title: '签到中'
            });
            this.$http('/sign-in', 'POST').then((res) => {
                uni.hideLoading();
                uni.showModal({
                    title: `连续签到${res.data.continuous_days}天了哦~ ${this.scoreAlias}+${res.data.award_score}`,
                    confirmText: '朕知道了'
                });

                this.initData();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 10px 20px 20px;
    background-image: linear-gradient(to bottom, #f7ebff, #fff);
    border-radius: 20px;

    .day-c {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .item {
            width: 190rpx;
            background-image: url('https://api.caihongbox.com.cn/image/liwu.png');
            background-size: 100% 100%;
            height: 190rpx;
            margin-bottom: 20rpx;
            position: relative;

            .round {
                position: absolute;
                top: 100rpx;
                left: 110rpx;
                width: 55rpx;
                height: 55rpx;
                background: #f0f0f0;
                border-radius: 50%;

                text-align: center;
                line-height: 55rpx;
                color: gray;

                &.completed {
                    background: #6938b6;
                    color: #fff;
                }
            }
        }

        .score,
        .day {
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 20rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
            line-height: 26rpx;
        }
        .score {
            bottom: 10rpx;
        }
        .day {
            top: 10rpx;
        }
    }

    .signin-btn {
        margin: 0 auto 10rpx auto;
        width: 560rpx;
        height: 74rpx;
        background: #6938b6;
        border-radius: 38rpx;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        line-height: 74rpx;

        &.completed {
            background: #6938b6;
            font-size: 26rpx;
        }
    }

    .signin-total {
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 26rpx;
        text-align: center;
    }
}
</style>
