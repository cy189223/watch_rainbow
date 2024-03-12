<template>
    <view class="wrap animated" :style="`bottom:${bottomRpx}rpx`" :class="{ bounceOutRight: startMoving, bounceInLeft: !startMoving }">
        <view class="left">
            <image class="userIcon" :src="userInfo.userIcon"></image>
            <view class="middle">
                <view class="l1">{{ userInfo.userName }} 排到了你 剩{{ time }}秒</view>
                <view class="l2">再次下单将重置60秒 | 共{{ rankNum }}人排队</view>
            </view>
        </view>
        <view class="rbtn btn-orange-border backRank" v-if="isWait" @click="changeWaitStatus(false)">退出队列</view>
        <view class="rbtn btn-orange-border" v-else @click="changeWaitStatus(true)">加入队列</view>
    </view>
</template>

<script>
export default {
    props: {
        userInfo: {
            default: {
                userName: '**历时',
                userIcon: 'https://i2.hdslb.com/bfs/face/5a516225ee26cfc3193b8a0d868fde3100a7e1ea.jpg@150w_150h.jpg'
            }
        },
        //前面的人数
        rankNum: {
            default: 1
        },
        //当前用户是否在队列里面
        isWait: {
            default: true
        },
        //距离底部的距离
        bottomRpx: {
            default: 140
        }
    },
    data() {
        return {
            time: 60,
            _setInterval: null
        };
    },
    mounted() {
        this.timeLoad();
    },
    methods: {
        changeWaitStatus(status) {
            this.$emit('changeWaitStatus', status);
            if (status) {
                this.resetTime();
                this.timeLoad();
            } else {
                this.stopTime();
            }
        },
        //重设时间
        resetTime() {
            this.time = 60;
        },
        stopTime() {
            this._setInterval && clearInterval(this._setInterval);
        },
        timeLoad() {
            this.stopTime();
            this._setInterval = setInterval(() => {
                this.time--;
            }, 1000);
        }
    }
};
</script>

<style scoped lang="scss">
.wrap {
    width: 100%;
    position: fixed;
    padding: 0 20rpx;
    background: #eee;
    left: 0;
    box-sizing: border-box;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 110rpx;
    .left {
        display: flex;
        align-items: center;
        .userIcon {
            width: 70rpx;
            height: 70rpx;
            border-radius: 20rpx;
        }
        .middle {
            font-size: 28rpx;
            margin-left: 20rpx;
            .l2 {
                font-size: 22rpx;
                color: #3333339e;
            }
        }
    }
    .rbtn {
        padding: 16rpx;
    }
    .backRank {
        color: #9c91af !important;
    }
}
</style>
