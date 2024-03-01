<template>
    <view @tap="handleClick" class="scope-float-btn-c" :class="{ 'float-icon-animate': isAnimate }">
        <span class="number-dot" v-if="stock">{{ stock }}</span>
        <image src="https://api.caihongbox.com.cn/image/share.png" mode="widthFix" class="free-times-icon"></image>
    </view>
</template>

<script>
export default {
    props: {
        uuid: String,
        nodeType: String
    },
    data() {
        return {
            inviteTotal: 0,
            usedTotal: 0,
            stock: 0,
            title: ''
        };
    },
    computed: {
        isAnimate() {
            return true;
        }
    },
    created() {
        this.initData();
    },
    methods: {
        handleClick() {
            // 如果没有剩余次数，直接跳转到邀请记录
            if (this.stock === 0) {
                uni.navigateTo({
                    url: '/pages/activityTicket/record?uuid=' + this.uuid + '&node_type=' + this.nodeType
                });
                return false;
            }

            uni.showModal({
                title: '选择操作',
                // content: '选择操作',
                confirmText: '兑换1次',
                cancelText: '邀请记录',
                success: (res) => {
                    if (res.confirm) {
                        // 使用一次兑换记录
                        this.$emit('useFreeTicket');
                    } else if (res.cancel) {
                        uni.navigateTo({
                            url: '/pages/activityTicket/record?uuid=' + this.uuid + '&node_type=' + this.nodeType
                        });
                    }
                }
            });
        },
        initData() {
            if (!this.uuid) {
                return false;
            }
            this.$http('/activity/ticket-total', 'GET', {
                node_type: this.nodeType,
                uuid: this.uuid
            }).then((res) => {
                this.inviteTotal = res.data.invite_total;
                this.usedTotal = res.data.used_total;
                this.stock = res.data.stock;

                this.title = res.data.title;
            });
        }
    },
    watch: {
        uuid(val) {
            this.initData();
        }
    }
};
</script>

<style lang="scss" scoped>
.scope-float-btn-c {
    position: fixed;
    right: 20rpx;
    bottom: 600rpx;
    width: 160rpx;

    .number-dot {
        background: red;
        border-radius: 50%;
        width: auto;
        padding: 2rpx 10rpx;
        color: white;
        position: absolute;
        right: 0rpx;
        font-size: 24rpx;
        z-index: 2;
    }
}
.free-times-icon {
    width: 160rpx;
}
</style>
