<template>
    <view class="mask" @tap="cancel" @touchmove.stop>
        <view class="mask-content animated bounceInUp" @tap.stop>
            <text class="new-iconfont icon-close close-btn" @tap="cancel"></text>

            <textarea class="text-input" :placeholder="placeholder || '写下想要评论的话'" v-model="form.text"></textarea>

            <UploadImage v-model="form.images"></UploadImage>

            <button class="submit-btn" hover-class="hover" @tap="submit">确认发布</button>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    props: {
        parentId: {
            type: String | Number
        },
        placeholder: {
            type: String
        }
    },
    data() {
        return {
            form: {
                text: '',
                images: [],
                group_id: '',
                tag_id: ''
            },
            isSubmit: false
        };
    },
    computed: {},
    watch: {},
    onLoad() {},
    onShow() {},
    onPullDownRefresh() {},
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        initData() {},
        cleanForm() {
            this.form = {
                text: '',
                images: [],
                group_id: '',
                tag_id: ''
            };
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

            uni.showLoading({
                title: '发布中'
            });
            this.$http('/topic/comments', 'POST', {
                parent_id: this.parentId,
                ...this.form
            }).then((res) => {
                this.isSubmit = true;
                uni.hideLoading();

                this.cleanForm();

                this.$emit('commentSuccess', {
                    status: res.data.status
                });
            });
        }
    },
    onPageScroll(e) {}
};
</script>

<style lang="scss" scoped>
.mask-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 880rpx;
    background-color: #ededed;
    background-color: white;
    border-radius: 10rpx 10rpx 0 0;
    padding: 30rpx 30rpx;
    box-sizing: border-box;
}

.mask-content {
    padding: 60rpx 30rpx;
    box-sizing: border-box;

    .close-btn {
        position: absolute;
        right: 20rpx;
        top: 20rpx;
    }

    .text-input {
    }

    .submit-btn {
        width: 690rpx;
        box-sizing: border-box;
        position: fixed;
        bottom: 100rpx;
        background: #ffd73d;
        border-radius: 100rpx;
        color: white;
        font-weight: 500;
        text-align: center;
        line-height: 76rpx;
        border: 0rpx;
        margin: 0rpx;
        font-size: 28rpx;

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
