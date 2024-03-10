<template>
    <view class="wrap">
        <view
            class="bl"
            :class="{
                selled: item.isSell
            }"
            @click="handlerClick(item)"
            v-for="(item, index) in source"
        >
            {{ index + 1 }}
            <view class="icon"></view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        source: {
            default: [
                { key: 'a1', isSell: true },
                { key: 'a2', isSell: false },
                { key: 'a3', isSell: false },
                { key: 'a4', isSell: false },
                { key: 'a5', isSell: false },
                { key: 'a6', isSell: false },
                { key: 'a7', isSell: true },
                { key: 'a8', isSell: false },
                { key: 'a9', isSell: false },
                { key: 'a10', isSell: false },
                { key: 'a11', isSell: false },
                { key: 'a12', isSell: false },
                { key: 'a13', isSell: false },
                { key: 'a14', isSell: false },
                { key: 'a15', isSell: false },
                { key: 'a16', isSell: false },
                { key: 'a17', isSell: false },
                { key: 'a18', isSell: false },
                { key: 'a19', isSell: false },
                { key: 'a20', isSell: false }
            ]
        }
    },
    data() {
        return {};
    },
    methods: {
        handlerClick(item) {
            if (item.isSell) {
                return;
            }
            console.log(item);
        }
    }
};
</script>

<style scoped lang="scss">
.wrap {
    margin-top: 20rpx;
    display: grid;
    grid-template-columns: repeat(auto-fill, 70rpx);
    grid-row-gap: 19rpx;
    grid-column-gap: 19rpx;
    .bl {
        height: 70rpx;
        background: linear-gradient(60deg, #7e30ee 0%, #ea25e7 100%);
        text-align: left;
        padding-left: 6rpx;
        border-radius: 10rpx;
        font-size: 26rpx;
        color: #fff;
        position: relative;
    }
    .selled {
        background: #f2f2f2;
        color: #c4c4c4;
    }
    .selled::before {
        content: '';
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        background-image: url(https://watch-box.oss-cn-beijing.aliyuncs.com/%E5%B7%B2%E5%94%AE1.png);
        background-size: 100% 100%;
        right: 0px;
        bottom: 0;
    }

    .bl::before {
        content: '';
    }
}
</style>
