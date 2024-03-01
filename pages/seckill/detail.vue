<template>
    <view class="container">
        <view class="tips">活动加载中...</view>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            uuid: ''
        };
    },
    computed: {},
    watch: {},
    onLoad(e) {
        this.uuid = e.uuid;

        uni.showLoading({
            title: '加载中'
        });

        this.$http(`/seckills/${this.uuid}`).then((res) => {
            uni.hideLoading();
            let info = res.data.info;

            if (info.node_type === 'product')
                uni.redirectTo({
                    url: `/pages/productDetail/index?uuid=${info.node_uuid}&seckillId=${info.id}`
                });
        });

        this.$visitor.record('activity_index');
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
.tips {
    text-align: center;
    margin-top: 200rpx;
    font-size: 90%;
}
</style>
