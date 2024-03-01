<template>
    <view style="height: 100vh; overflow: auto">
        <view class="content">
            <view class="header-tabs">
                <view class="tab-item" v-for="(item, index) in typeTextList" :key="index" :class="{ active: current == index }" :data-current="index" @tap="currentChange">
                    <text class="text">{{ item }}</text>
                </view>
            </view>
            <view class="paihangtitle">—只显示前30名—</view>
            <view class="top3" v-if="paiming.length != 0">
                <view class="second" v-if="paiming.length >= 2">
                    <view class="touxiangbg">
                        <image class="touxiangimg" :src="paiming[1].headimg" mode=""></image>
                    </view>
                    <view class="paihangname">{{ paiming[1].name }}</view>
                    <view class="paihangfenshu">{{ rankListSetting == 1 || paiming[1].user_id == userInfo.id ? paiming[1].total : '*****' }}</view>
                </view>
                <view v-else></view>
                <view class="first">
                    <view class="touxiangbg">
                        <image class="touxiangimg" :src="paiming[0].headimg" mode=""></image>
                    </view>
                    <view class="paihangname">{{ paiming[0].name }}</view>
                    <view class="paihangfenshu">{{ rankListSetting == 1 || paiming[0].user_id == userInfo.id ? paiming[0].total : '*****' }}</view>
                </view>
                <view class="third" v-if="paiming.length >= 3">
                    <view class="touxiangbg">
                        <image class="touxiangimg" :src="paiming[2].headimg" mode=""></image>
                    </view>
                    <view class="paihangname">{{ paiming[2].name }}</view>
                    <view class="paihangfenshu">{{ rankListSetting == 1 || paiming[2].user_id == userInfo.id ? paiming[2].total : '*****' }}</view>
                </view>
                <view v-else></view>
            </view>
            <view v-if="paiming.length >= 4" v-for="(item, index) in paiming.slice(0, 30)" :key="item.value">
                <view class="paimingbox" v-if="index > 2" :class="item.user_id == userInfo.id ? 'wodepaiming' : ''">
                    <view class="mybox">我的排名</view>
                    <view style="width: 50px; font-size: 13px">NO.{{ index + 1 }}</view>
                    <image class="touxiang" :src="item.headimg" mode=""></image>
                    <view class="yonghu">{{ item.name }}</view>
                    <view class="paihangfenshu" style="width: 85px; text-align: right; font-size: 14px">
                        {{ rankListSetting == 1 || item.user_id == userInfo.id ? item.total : '*****' }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            paiming: [],
            typeTextList: ['本日', '本周', '全部'],
            current: 0,
            rankListSetting: ''
        };
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    onLoad() {
        this.getList();
        this.$http(`/setting/rankSetting`).then((res) => {
            this.rankListSetting = res.data.setting.rankListSetting;
        });
    },
    methods: {
        currentChange(e) {
            let index = e.currentTarget.dataset.current;
            if (index !== this.current) {
                this.current = index;
                this.getList();
            }
        },
        getList() {
            this.$http(`/paihang`, 'get', {
                type: this.current + 1
            }).then((res) => {
                this.paiming = res.data.list;
            });
        }
    }
};
</script>

<style>
.header-tabs {
    width: 100%;
    height: 90rpx;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: #ffffff;
}
.tab-item {
    flex: 1;
    line-height: 90rpx;
    text-align: center;
    font-size: 28rpx;
    color: rgba(198, 198, 198, 1);
    font-weight: 500;
}
.tab-item.active {
    color: rgba(51, 51, 51, 1);
    position: relative;
    font-weight: 500;
}

.tab-item.active .text {
    border-bottom: 6rpx solid rgba(51, 51, 51, 1);
    padding: 0rpx 0rpx 4rpx 0rpx;
}

.content {
    width: 95%;
    margin: 10px auto 0;
}
.paihangtitle {
    margin: 100rpx auto 20px;
    text-align: center;
    font-size: 14px;
    color: #bbb;
}

.top3 {
    display: flex;
    margin: 0 auto 30px;
    justify-content: space-between;
    align-items: flex-end;
}

.top3 > view {
    flex: 1;
}

.touxiangbg {
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.touxiangimg {
    width: 50px;
    height: 50px;
    position: absolute;
    bottom: 3px;
    right: 24px;
    border-radius: 50%;
}

.first {
    position: relative;
    top: -10px;
}

.first .touxiangbg {
    width: 90px;
    height: 90px;
    margin-left: 25px;
    background-image: url('https://api.caihongbox.com.cn/image/firstimg.png');
}

.second .touxiangbg {
    width: 77px;
    height: 77px;
    margin-left: 20px;
    background-image: url('https://api.caihongbox.com.cn/image/secondimg.png');
}

.third .touxiangbg {
    width: 77px;
    height: 77px;
    margin-left: 20px;
    background-image: url('https://api.caihongbox.com.cn/image/thirdimg.png');
}

.first .touxiangimg {
    width: 60px;
    height: 60px;
    border: 5px;
    right: 27px;
}

.first,
.second,
.third {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.paihangname {
    width: 100px;
    margin-top: 5px;
    font-size: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    overflow: hidden;
}

.paihangfenshu {
    margin: 3px 0;
    color: #673ab7;
    font-size: 16px;
    font-weight: bold;
}

.paimingbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 5px 10px;
    border-radius: 25px;
}

.paimingbox .touxiang {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.paimingbox .name {
    width: 75px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.yonghu {
    margin-left: 5px;
    margin-right: auto;
    width: calc(100% - 170px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mybox {
    display: none;
    padding: 1px 4px 2px;
    position: absolute;
    top: -7px;
    left: 20px;
    font-size: 12px;
    color: #fff;
    background-color: #673ab7;
    border-radius: 7px 7px 7px 0;
}

.wodepaiming {
    background-color: #fff4ff;
    border: 2px solid #f2cefc;
}

.wodepaiming .mybox {
    display: block;
}
</style>
