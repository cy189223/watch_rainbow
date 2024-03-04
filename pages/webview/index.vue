<template>
    <web-view :src="url"></web-view>
</template>

<script>
export default {
    data() {
        return {
            url: ''
        };
    },
    onLoad: function (e) {
        this.url = e.url;
    },
    onShareAppMessage: function () {
        return {
            path: '/pages/home/index'
        };
    },
    methods: {}
};
</script>
<style></style>
