<template>
    <view class="list-scope" :class="'list-' + grid" v-if="wrapMode === 'wrap'">
        <template v-if="grid == 'row1'">
            <template v-if="activityType === 'seckill'">
                <Row1Seckill @click="clickItem(item)" :info="item" v-for="(item, index) in list" :key="index" />
            </template>
            <Row1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" v-else :key="index" />
        </template>
        <template v-if="grid == 'grid1'">
            <Grid1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
        <template v-else-if="grid == 'grid2'">
            <Grid2 @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
        <template v-else-if="grid == 'grid3'">
            <Grid3 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
    </view>
    <scroll-view scroll-x class="scroll-list" :class="grid" v-else-if="wrapMode === 'scroll'">
        <template v-if="grid == 'row1'">
            <Row1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
        <template v-if="grid == 'grid1'">
            <Grid1 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
        <template v-else-if="grid == 'grid2'">
            <Grid2 @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
        <template v-else-if="grid == 'grid3'">
            <Grid3 theme="theme-1" @click="clickItem(item)" :class="grid" v-for="(item, index) in list" :info="item" :key="index" />
        </template>
    </scroll-view>
</template>

<script>
import Row1 from '@/components/ActivityItem/Row1.vue';
import Grid1 from '@/components/ActivityItem/Grid1.vue';
import Grid2 from '@/components/ActivityItem/Grid2.vue';
import Grid3 from '@/components/ActivityItem/Grid3.vue';
import Row1Seckill from '@/components/ActivityItem/Row1Seckill.vue';

export default {
    props: {
        ids: {
            type: Array
        },
        module: {
            type: Object,
            default() {
                return {};
            }
        },
        refreshCounter: Number,
        getNextPageCounter: Number
    },
    components: {
        Row1,
        Grid1,
        Grid2,
        Grid3,
        Row1Seckill
    },
    data() {
        return {
            page: 1,
            list: []
        };
    },
    mounted() {
        this.initData();
    },
    computed: {
        isScroll() {
            return this.module.display == 'scroll';
        },
        grid() {
            return this.module.grid || 'grid3';
        },
        wrapMode() {
            return this.module.wrap_mode || 'wrap';
        },
        url() {
            let map = {
                yifanshang: '/yifanshangs',
                lottery: '/lotteries',
                seckill: '/seckills',
                egg_lottery: '/egg-lotteries',
                jika: '/jikas',
                fudai: '/fudais',
                rotate_lottery: '/rotate-lotteries',
                box: '/boxes',
                ggl: '/boxes' //TODO
            };
            return map[this.module.activity_type];
        },
        activityType() {
            return this.module.activity_type || '';
        }
    },
    watch: {
        ids() {
            this.initData();
        },
        refreshCounter() {
            this.initData();
        },
        getNextPageCounter(val) {
            if (this.module.list_content === 'all') {
                this.getNextPage();
            }
        }
    },
    methods: {
        initData() {
            if (this.module.list_content === 'all') {
                this.page = 1;

                this.$http(this.url, 'GET', {
                    page: this.page,
                    per_page: 12
                }).then((res) => {
                    this.list = res.data.list;
                });
            } else {
                if (this.ids && this.ids.length > 0) {
                    this.$http(this.url, 'GET', {
                        per_page: 100,
                        ids: this.ids
                    }).then((res) => {
                        this.list = res.data.list;
                    });
                }
            }
        },
        clickItem(item) {
            let url = '';
            if (item.activity_type === 'yifanshang') {
                url = `/pages/yifanshang/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'lottery') {
                url = `/packageA/lottery/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'egg_lottery') {
                url = `/packageA/eggLottery/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'seckill') {
                url = `/pages/seckill/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'jika') {
                url = `/pages/jika/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'fudai') {
                url = `/pages/fudai/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'rotate_lottery') {
                url = `/packageA/rotateLottery/detail?uuid=${item.uuid}`;
            } else if (item.activity_type === 'box') {
                // url = `/pages/boxDetail/index?uuid=${item.uuid}`;
                url = `/pages/ggl/detail?uuid=${item.uuid}`; //TODO 这里暂时先这样处理 后期等ggl有数据 在将这里改回 /boxes/
            } else if (item.activity_type === 'ggl') {
                url = `/pages/ggl/detail?uuid=${item.uuid}`;
            }

            uni.navigateTo({
                url: url
            });
        },
        getNextPage() {
            this.page++;

            this.$http(this.url, 'GET', {
                page: this.page,
                per_page: 12
            }).then((res) => {
                this.list = this.list.concat(res.data.list);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.list-scope {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;
    border-radius: 10px;

    .row1 {
        width: 100%;
    }

    .grid1 {
        width: 100%;
    }

    .grid2 {
        width: 50%;
    }

    .grid3 {
        width: 32%;
    }
}

.scroll-list {
    white-space: nowrap;

    .grid1 {
        margin-right: 20rpx;
        display: inline-block;
        width: 80%;
    }

    .grid2 {
        margin-right: 30rpx;
        display: inline-block;
        width: 52%;
    }

    .row1 {
        margin-right: 30rpx;
        display: inline-block;
        width: 90%;
    }

    .grid3 {
        width: 34%;
        margin-right: 20rpx;
        display: inline-block;
    }
}
</style>
