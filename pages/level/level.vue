<template>
    <view>
        <view class="card">
            <image mode="aspectFill" class="headimg" :src="userInfo.headimg" />
            <view class="right">
                <view class="bar">
                    <view class="item">
                        <view class="number">LV{{ userInfo.user_level_name && userInfo.user_level_name != '' ? userInfo.user_level_name : '0' }}</view>
                        <view class="key">当前等级</view>
                    </view>
                    <view class="item">
                        <view class="number">{{ userInfo.total_price }}</view>
                        <view class="key">累计消费</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="sku-list">
            <view v-for="(item, index) in skuList" :key="item.uuid" class="itembox">
                <image :src="item.goods_image" mode="aspectFill" class="thumb"></image>
                <view class="right">
                    <view class="title">
                        {{ item.goods_name }}
                    </view>
                    <view class="descbox">{{ item.goods_desc }}</view>
                    <view class="bottom">累计消费{{ item.min_price }}升至LV{{ item.level_name }}可领取</view>
                </view>
                <view class="btnbox" :class="item.can_prize == 0 ? 'disabled' : ''" @tap="receive(item)">
                    {{ item.can_prize == 2 ? '查看物流' : item.can_prize == 3 ? '已收货' : '领取' }}
                </view>
            </view>
        </view>
        <PayCard v-if="isShowPay" :selectedId="selectedIds" :cardtype="cardtype" :prizelist="prizelist" @success="successDeliver" @cancel="isShowPay = false"></PayCard>
    </view>
</template>

<script>
import PayCard from './components/PayCard.vue';
export default {
    data() {
        return {
            skuList: [],
            isShowPay: false,
            selectedIds: '',
            cardtype: '',
            prizelist: {}
        };
    },
    components: {
        PayCard
    },
    onLoad() {
        this.getList();
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo;
        }
    },
    methods: {
        getList() {
            this.$http('/userlevel').then((res) => {
                this.skuList = res.data.userlist;
            });
        },
        receive(item) {
            if (item.can_prize == 1) {
                this.cardtype = 1;
                this.selectedIds = item.uuid;
                this.isShowPay = true;
            } else if (item.can_prize == 2) {
                this.cardtype = 2;
                this.prizelist = item.prize;
                this.isShowPay = true;
            }
        },
        successDeliver() {
            this.getList();
            this.isShowPay = false;
            uni.showModal({
                title: '领取成功',
                content: '已成功提交发货请求，请注意查收快递哦~'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.card {
    display: flex;
    align-items: center;
    width: 94%;
    height: 174rpx;
    background: #6938b6;
    color: #fff;
    border-radius: 20rpx;
    margin: 20rpx auto;
    padding: 10rpx 40rpx;
    align-items: center;
    box-sizing: border-box;

    .headimg {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 50rpx;
        border: 10rpx solid white;
        box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
    }

    .right {
        flex-grow: 1;
        padding: 0 8%;

        .bar {
            display: flex;
            justify-content: space-between;

            .item {
                text-align: center;

                .number {
                    font-size: 35rpx;
                    font-weight: 800;
                    color: #fff;
                }

                .key {
                    font-size: 30rpx;
                    font-weight: 500;
                    color: #fff;
                }
            }
        }
    }
}

.sku-list {
    padding: 0 20rpx 30rpx;

    .itembox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15rpx 0rpx;
        border-bottom: 1rpx solid #f1f1f1;
        position: relative;

        .thumb {
            width: 160rpx;
            height: 160rpx;
            margin-right: 20rpx;
            border-radius: 14rpx;
        }

        .right {
            width: calc(100% - 320rpx);
            margin-right: auto;
        }

        .title {
            width: 100%;
            color: #393939;
            font-size: 28rpx;
            font-weight: bold;
            height: 40rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }

        .descbox {
            width: 100%;
            color: #b3b3b3;
            font-size: 25rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            height: 67rpx;
        }

        .bottom {
            color: #ff294a;
            font-size: 24rpx;
        }

        .btnbox {
            width: 130rpx;
            font-size: 25rpx;
            margin-left: 10rpx;
            text-align: center;
            line-height: 60rpx;
            border-radius: 40rpx;
            background-color: #c046fe;
            color: #fff;

            &.disabled {
                background-color: #ccc;
            }
        }
    }
}
</style>
