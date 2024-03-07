<template>
    <view class="liushuilistbox">
        <view class="liushuibox" v-if="liushuilist.list">
            <view v-for="(item, index) in liushuilist.list" :key="index" style="padding-bottom: 5px">
                <view>{{ item.start_time }} 至 {{ item.end_time }}</view>
                <view>PK赏累计消费金额：{{ item.amount }}</view>
                <view v-for="(ite, ind) in item.skus" :key="ind" class="mainbox">
                    <view class="titletext">PK赏累计消费满{{ ite.amount }}送</view>
                    <view class="canbuy">{{ ite.can_get == 2 ? '已领取' : ite.can_get == 1 ? '可领取' : '未达成' }}</view>
                    <view class="flexbox">
                        <view class="numbox">
                            <image class="img" src="../../static/zuanshi.png" mode=""></image>
                            <view>{{ ite.score && ite.score != '' ? ite.score : '0' }}</view>
                        </view>
                        <image v-if="ite.thumb && ite.thumb != ''" :src="ite.thumb" mode="aspectFill" class="imgbox"></image>
                        <view v-if="ite.thumb && ite.thumb != ''" class="flextitle">{{ ite.title }}</view>
                        <view v-if="ite.can_get == 1" @tap="receive(item.uuid, ite)" class="flexbtnbox">领取</view>
                        <view v-else-if="ite.can_get == 2" class="flexbtnbox">已领取</view>
                        <view v-else class="flexbtnbox grayflexbtnbox">领取</view>
                    </view>
                </view>
            </view>
        </view>
        <NoData v-if="liushuilist && !liushuilist.list.length"></NoData>
    </view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    components: {},
    data() {
        return {
            liushuilist: {
                list: []
            }
        };
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    onLoad() {},
    onShow() {
        this.initData();
    },
    methods: {
        initData() {
            this.$http(`/accounts`, 'get', {
                type: 'pk'
            }).then((res) => {
                this.liushuilist = res.data;
            });
        }
    }
};
</script>

<style lang="scss">
.liushuilistbox {
    margin: 0 30rpx 20px;
    padding: 10px;
    background-color: #f7f0ff;
    border-radius: 10px;
}

.liushuibox {
    .mainbox {
        position: relative;
        background-color: #fff;
        padding: 10px;
        border-radius: 15px;
        margin-top: 10px;

        .flexbox {
            display: flex;
            align-items: flex-end;
            margin-top: 8px;
            font-size: 13px;

            .flexbtnbox {
                margin-left: auto;
                background-image: url('https://api.caihongbox.com.cn/image/btnbg.png');
                background-size: 100% 100%;
                color: #fff;
                width: 50px;
                text-align: center;
                line-height: 28px;
            }

            .grayflexbtnbox {
                background-image: url('https://api.caihongbox.com.cn/image/graybtnbg.png') !important;
            }

            .numbox {
                width: 65px;
                display: flex;
                align-items: center;

                .img {
                    width: 18px;
                    height: 18px;
                }
            }

            .imgbox {
                width: 50px;
                height: 50px;
                border: 3px solid transparent;
                border-radius: 15px;
                background-clip: padding-box, border-box;
                background-origin: padding-box, border-box;
                background-image: linear-gradient(to right, #fff, #fff), linear-gradient(15deg, #d84fe8, #414afc, #d84fe8);
            }

            .flextitle {
                width: calc(100% - 180px);
                margin-left: 5px;
                align-self: center;
                font-weight: bold;
            }
        }

        .titletext {
            font-style: italic;
        }

        .canbuy {
            position: absolute;
            top: 10px;
            right: 10px;
            font-style: italic;
        }
    }
}
</style>
