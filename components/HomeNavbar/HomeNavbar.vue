<template>
    <view class="header white" :style="'height:' + customBar + 'px;'">
        <view class="home-nav white" :style="computedStyle">
            <view class="nav-content">
                <view class="title">
                    {{ title }}
                </view>
                <view class="search-btn" @tap="toSearch" hover-class="hover">
                    <image src="@/static/search.png" class="search-icon"></image>
                    搜索
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'HomeNav',
    props: {
        current: Number,
        bgColor: {
            type: String,
            default() {
                return 'transparent';
            }
        },
        title: {
            type: String
        },
        searchType: {
            type: String,
            default: () => {
                return 'box';
            }
        },
        theme: {
            type: String
        }
    },
    data() {
        return {
            tabs: ['全部', '新品', '推荐'],
            customBar: 64,
            contentStyle: 64
        };
    },
    computed: {
        deviceInfo() {
            return this.$store.getters.deviceInfo;
        },
        computedStyle() {
            let bgColor = `background:${this.theme};`;
            return this.contentStyle + bgColor;
        }
    },
    created() {
        this.customBar = this.deviceInfo.customBar;
        this.contentStyle = `height:${this.deviceInfo.customBar}px;padding-top:${this.deviceInfo.statusBar}px;`;
    },
    methods: {
        toSearch() {
            uni.navigateTo({
                url: '/pages/search/index?type=' + this.searchType
            });
        },
        handleClick(e) {
            this.$emit('change', e.currentTarget.dataset.current);
        }
    }
};
</script>

<style lang="scss">
.header {
    position: fixed;
    z-index: 1000;
}
.home-nav {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    z-index: 10;

    transition: background 0.2s;
    -webkit-transition: background 0.2s;

    .nav-content {
        padding: 0 30rpx;
        height: 100%;
        display: flex;
        align-items: center;

        .title {
            font-size: 42rpx;
            font-weight: bold;
            color: #ffffff;

            transition:
                font-size 0.5s,
                color 0.5s;
            -webkit-transition:
                font-size 0.5,
                color 0.5s;
        }

        .search-btn {
            width: 134rpx;
            height: 52rpx;
            background: #814bd5;
            opacity: 0.8;
            border-radius: 26rpx;
            margin-left: 20rpx;

            font-weight: 500;
            color: #fff;
            font-size: 26rpx;
            line-height: 52rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .search-icon {
                width: 26rpx;
                height: 26rpx;
                margin-right: 2rpx;
            }
        }
    }

    &.white {
        background: white;
        .nav-content {
            .title {
                color: white;
                font-size: 36rpx;
            }

            .search-btn {
                background: #de38f0;
                color: white;
                opacity: 1;
            }
        }
    }
}
</style>
