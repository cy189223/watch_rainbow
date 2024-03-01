<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content animated fadeInDown" @tap.stop>
            <text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
            <view class="title">邀请活动规则</view>

            <view class="body">
                <ul class="rule-list">
                    <li>① 用户分享活动给好友，好友点击进入活动页并首次授权登陆后为一个成功邀请。</li>
                    <li>
                        ② 被邀请者可获得奖励：
                        <span class="color-text">{{ rule.invited_reward || 0 }}次</span>
                        。
                    </li>
                    <li>
                        ③ 邀请者可获得基础奖励：
                        <span class="color-text">{{ rule.per_reward || 0 }}次</span>
                        。
                    </li>
                    <li>④ 邀请者可获得额外奖励：</li>
                    <li>
                        <uni-table border v-if="addedRule.length">
                            <uni-tr>
                                <uni-th align="center">邀请人数达到</uni-th>
                                <uni-th align="center">额外奖励</uni-th>
                            </uni-tr>
                            <uni-tr v-for="(item, index) in addedRule">
                                <uni-td align="center">{{ item.total }}人</uni-td>
                                <uni-td align="center">{{ item.reward }}次</uni-td>
                            </uni-tr>
                        </uni-table>
                        <view class="no-added-reward" v-else>(无额外奖励)</view>
                    </li>
                    <li>
                        ⑤ 邀请者累计最高可获得
                        <span class="color-text">{{ rule.max_reward || 0 }}次</span>
                        奖励。
                    </li>
                    <li>⑥ 每个奖励对应在本活动中一次免费参与机会。即仅限于在活动"{{ info.title }}"中使用。</li>
                    <li>⑦ 本活动规则最终解释权归本公司所有。</li>
                </ul>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {};
    },
    props: {
        info: {
            type: Object,
            default: {}
        }
    },
    computed: {
        rule() {
            return this.info.rule || {};
        },
        // 额外奖励
        addedRule() {
            return this.rule.added || [];
        }
    },
    watch: {},
    created() {},
    methods: {
        cancel() {
            this.$emit('cancel');
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-text {
    color: #e63111;
}

.no-added-reward {
    text-align: center;
    color: gray;
    line-height: 60rpx;
    font-size: 28rpx;
}

.mask-content {
    width: 660rpx;
    // height: 680rpx;
    background-color: #ffe171;
    // background: white;
    // background-color: white;
    border-radius: 20rpx;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // animation: show 0.8s;
    padding: 60rpx 0rpx 0rpx 0rpx;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    .close-btn {
        position: absolute;
        right: 26rpx;
        top: 26rpx;

        color: #333;
    }

    .title {
        text-align: center;
        font-size: 36rpx;
        font-weight: 500;
        color: #333;
        letter-spacing: 6rpx;
        margin-bottom: 50rpx;
        position: relative;
        // background: #DB5B4E;
        // padding: 60rpx 0rpx 30rpx 0rpx;
        // padding: 0rpx 40rpx 0rpx 40rpx;

        &:after,
        &:before {
            position: absolute;
            top: 50%;
            background: #333;
            content: '';
            height: 1px;
            width: 50rpx;
        }

        /*调整背景横线的左右距离*/
        &:before {
            left: 140rpx;
        }

        &:after {
            right: 140rpx;
        }
    }

    .body {
        background: white;
        padding: 50rpx 50rpx 100rpx 50rpx;
        ul {
            padding-left: 0rpx !important;
            list-style-type: none;
        }
        li {
            margin-left: 0rpx !important;
            text-align: justify;
            font-size: 30rpx;
            // font-weight: 500;
            margin-top: 16rpx;
            // color: #888;
        }
    }
}
</style>
