<template>
    <view class="item" :key="info.uuid">
        <template v-if="info.user">
            <image class="left headimg" :src="info.user.headimg"></image>
            <view class="body">
                <view class="name">{{ info.user.name }}</view>
                <view class="time">{{ info.created_at }}</view>
            </view>
            <view class="right">
                <view class="index">NO.{{ info.node_invite_index }}</view>
            </view>
        </template>
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
            type: Object
        }
    },
    computed: {},
    async onLoad() {},
    methods: {},
    filters: {}
};
</script>
<style lang="scss" scoped>
.item {
    display: flex;
    padding: 10px;
    margin: 10px;
    background: white;
    border-radius: 6rpx;
    align-items: center;
    border-bottom: 1rpx solid #f1f1f1;

    .left {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 18rpx;
    }

    .body {
        flex-grow: 1;

        .name {
            font-weight: 700;
        }

        .time {
            color: gray;
            font-size: 26rpx;
        }
    }

    .right {
        .plus {
            color: red;
        }

        .number {
            color: red;
            font-size: 45rpx;
        }
    }
}
</style>
