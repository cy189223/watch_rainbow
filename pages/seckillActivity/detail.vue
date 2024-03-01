<template>
    <view class="container"></view>
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

        this.$http(`/seckill/${this.uuid}`).then((res) => {
            uni.hideLoading();
            let info = res.data.info;
            uni.redirectTo({
                url: `/pages/productDetail/index?uuid=${info.product_uuid}&activityUuid=${info.uuid}`
            });
        });

        this.$visitor.record('activity_index');
    },
    methods: {}
};
</script>

<style></style>
