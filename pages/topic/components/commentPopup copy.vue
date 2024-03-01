<template>
    <view class="scope-container">
        <textarea class="text-input" placeholder="尽情写下此刻想分享的事" v-model="form.text"></textarea>

        <UploadImage v-model="form.images"></UploadImage>

        <view class="item">
            <view class="left">#圈子</view>
            <IPicker class="right" :list="groupList" v-model="form.group_id"></IPicker>
            <text class="new-iconfont icon-arrow-right"></text>
        </view>
        <view class="item">
            <view class="left">#话题</view>
            <IPicker class="right" :list="tagList" v-model="form.tag_id"></IPicker>
            <text class="new-iconfont icon-arrow-right"></text>
        </view>

        <button class="submit-btn" hover-class="hover" @tap="submit">确认发布</button>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            form: {
                text: '',
                images: [],
                group_id: '',
                tag_id: ''
            },
            groupList: [],
            tagList: [],
            isSubmit: false
        };
    },
    computed: {},
    watch: {},
    onLoad() {
        this.initData();
    },
    onShow() {},
    onPullDownRefresh() {},
    methods: {
        initData() {
            uni.showLoading({
                title: '加载中'
            });
            this.$http('/topic-groups', 'GET').then((res) => {
                this.groupList = res.data.list.map((item) => {
                    return {
                        label: item.title,
                        key: item.id
                    };
                });
                uni.hideLoading();
            });

            this.$http('/topic-tags', 'GET').then((res) => {
                this.tagList = res.data.list.map((item) => {
                    return {
                        label: '#' + item.title,
                        key: item.id
                    };
                });
            });
        },
        submit() {
            if (this.isSubmit) return false;

            if (this.form.text.length < 10) {
                uni.showToast({
                    title: '至少发表10个字哦~',
                    icon: 'none'
                });
                return false;
            }

            if (this.form.images.length == 0) {
                uni.showToast({
                    title: '至少发布一张图片哦~',
                    icon: 'none'
                });
                return false;
            }

            uni.showLoading({
                title: '发布中'
            });
            this.$http('/topics', 'POST', {
                ...this.form
            }).then((res) => {
                this.isSubmit = true;
                uni.hideLoading();

                if (res.data.status == 1) {
                    uni.showToast({
                        title: '发布成功，即将返回~',
                        icon: 'none'
                    });
                } else if (res.data.status == 0) {
                    uni.showToast({
                        title: '已提交，审核通过后显示哦~',
                        icon: 'none'
                    });
                }

                setTimeout((res) => {
                    uni.navigateBack({
                        delta: 1
                    });
                }, 1500);
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.scope-container {
    padding: 20rpx 30rpx;
    box-sizing: border-box;

    .text-input {
    }

    .submit-btn {
        width: 690rpx;
        box-sizing: border-box;
        position: fixed;
        bottom: 100rpx;
        height: 86rpx;
        background-image: linear-gradient(#ffe998, #ffd73d);
        border-radius: 100rpx;
        color: white;
        font-weight: bold;
        text-align: center;
        line-height: 86rpx;
        border: 0rpx;
        margin: 0rpx;

        &:after {
            display: none;
        }
    }

    .item {
        display: flex;
        padding: 20rpx 0rpx;
        border-bottom: 1rpx solid #f1f1f1;
        margin-bottom: 20rpx;
        align-items: center;

        .left {
            flex-grow: 1;
            color: gray;
        }

        .icon-arrow-right {
            font-size: 46rpx;
            color: #aaa;
            position: relative;
        }
    }
}
</style>
