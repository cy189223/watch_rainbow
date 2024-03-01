<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content" @tap.stop>
            <text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
            <view class="title">绑定手机号</view>

            <view class="block">
                <input v-model="phone" class="input phone" placeholder="请输入手机号" />
                <view class="get-code-btn" @tap="getCode">{{ getCodeText }}</view>
            </view>
            <view class="block">
                <input v-model="code" class="input code" placeholder="请输入验证码" />
            </view>

            <view class="button-2c">
                <view class="button submit" :class="{ disabled: !isCanSubmit }" @click="submit">
                    <text>确认绑定</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            phone: '',
            code: '',
            clock: 0
        };
    },
    props: {},
    computed: {
        isPhonePass() {
            return this.phone.length === 11;
        },
        isCanSubmit() {
            return this.isPhonePass && this.code.length === 6;
        },
        getCodeText() {
            if (this.clock <= 0) {
                return '验证码';
            } else {
                return this.clock + 's';
            }
        }
    },
    watch: {},
    onLoad(e) {},
    created() {},
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        submit() {
            if (!this.isCanSubmit) {
                uni.showModal({
                    title: '',
                    content: '请填写正确手机号及6位验证码',
                    icon: 'none'
                });

                return false;
            }

            this.$emit('success', {
                phone: this.phone,
                phone_code: this.code
            });
        },
        getCode() {
            if (this.clock > 0) {
                return false;
            }

            if (!this.isPhonePass) {
                uni.showModal({
                    title: '',
                    content: '手机号不正确',
                    icon: 'none'
                });
                return false;
            }

            uni.showLoading({
                title: '请求中',
                mask: false
            });

            this.$http('/login/phone-code', 'POST', {
                phone: this.phone
            }).then((res) => {
                uni.hideLoading();
                this.clock = 60;
                this.refreshClock();
            });
        },
        refreshClock() {
            setTimeout((res) => {
                this.clock--;

                if (this.clock > 0) {
                    this.refreshClock();
                }
            }, 1000);
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.mask-content {
    position: absolute;
    bottom: 50rpx;
    left: 25rpx;
    width: 100%;
    width: 700rpx;
    height: 580rpx;
    background-color: #ededed;
    background-color: white;
    border-radius: 14rpx;
    padding: 60rpx 30rpx;
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
    }

    .block {
        border-bottom: 1rpx solid #eee;
        display: flex;
        padding: 10rpx 20rpx;
        margin-top: 50rpx;
        align-items: center;
        justify-content: center;

        .input {
            flex-grow: 1;
            font-size: 28rpx;
            font-weight: 500;
        }
        .get-code-btn {
            font-size: 26rpx;
            font-weight: 700;
            color: #3461c5;
            min-width: 100rpx;
        }
    }

    .button-2c {
        display: flex;

        .button {
            padding: 0;
            margin: 70rpx auto 0rpx auto;
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

            &.daifu {
                margin-right: 30rpx;
                width: 300rpx;
                font-size: 28rpx;
                box-shadow: 0 0 0rpx rgba(105, 56, 182, 0.6);
            }

            &:after {
                border: none;
            }

            &.disabled {
                background-color: #ddd;
                box-shadow: 0 0 0rpx rgba(105, 56, 182, 0.6);
            }
        }
    }
}
</style>
