<template>
    <view>
        <!-- <view class="title-container">
            <view class="text" v-if="classlist && classlist != ''" @tap="navtype = 0" :class="navtype === 0 ? 'cur' : ''">全部</view>
            <view class="text" @tap="navtype = item.id" :class="navtype == item.id ? 'cur' : ''" v-for="(item, index) in classlist" :key="index">
                {{ item.title }}
            </view>
        </view> -->
        <view class="list-scope" :class="{ scroll: isScroll }" v-if="wrapMode === 'wrap'">
            <template v-if="grid == 'grid2'">
                <ProductItem @tap="clickItem" :class="grid" :grid="grid" v-for="(item, index) in list" :info="item" :key="index"></ProductItem>
            </template>
            <template v-else-if="grid == 'grid3'">
                <ProductItem @tap="clickItem" theme="theme-1" :grid="grid" :isShowTags="false" :class="grid" v-for="(item, index) in list" :info="item" :key="index"></ProductItem>
            </template>
            <NoData v-if="!list.length" style="margin: 0 auto"></NoData>
        </view>
        <scroll-view scroll-x class="scroll-list" v-else-if="wrapMode === 'scroll'">
            <template v-if="grid == 'grid2'">
                <ProductItem @tap="clickItem" :class="grid" :grid="grid" v-for="(item, index) in list" :info="item" :key="index"></ProductItem>
            </template>
            <template v-else-if="grid == 'grid3'">
                <ProductItem @tap="clickItem" theme="theme-1" :grid="grid" :isShowTags="false" :class="grid" v-for="(item, index) in list" :info="item" :key="index"></ProductItem>
            </template>
        </scroll-view>
    </view>
</template>

<script>
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
    data() {
        return {
            page: 1,
            list: [],
            title: '全部',
            classlist: [],
            navtype: 0
        };
    },
    mounted() {
        this.initData();
        this.$http('/shop/recommend-cateogries', 'GET', {}).then((res) => {
            this.classlist = res.data.list;
        });
    },
    computed: {
        isScroll() {
            return this.module.theme == 'scroll';
        },
        grid() {
            return this.module.grid || 'grid3';
        },
        wrapMode() {
            return this.module.wrap_mode || 'wrap';
        }
    },
    watch: {
        ids() {
            this.initData();
        },
        navtype() {
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

                this.$http('/shop/products', 'GET', {
                    page: this.page,
                    per_page: 12,
                    category_ids: this.navtype === 0 ? '' : this.navtype
                }).then((res) => {
                    this.list = res.data.list;
                });
            } else {
                if (this.ids && this.ids.length > 0) {
                    this.$http('/shop/products', 'GET', {
                        per_page: 80,
                        ids: this.ids,
                        category_ids: this.navtype === 0 ? '' : this.navtype
                    }).then((res) => {
                        this.list = res.data.list;
                    });
                }
            }
        },
        clickItem() {
            this.$playAudio('click');
        },
        getNextPage() {
            this.page++;

            this.$http('/shop/products', 'GET', {
                page: this.page,
                per_page: 12
            }).then((res) => {
                this.list = this.list.concat(res.data.list);
            });
        }
    }
};
</script>

<style lang="scss">
.title-container {
    padding: 15rpx 10rpx 20rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: #fff;
    border: 2px solid #f7f0ff;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    margin-top: 30rpx;
    display: flex;
    align-items: center;
    overflow-x: auto;

    .icon {
        width: 34rpx;
        height: 34rpx;
        margin-right: 10rpx;
    }

    .text {
        position: relative;
        word-break: keep-all;
        margin: 0 15rpx;
        font-size: 32rpx;
        line-height: 46rpx;

        &.cur {
            text-shadow:
                1px 1px 0px #00d0ff,
                -2px 0px 0px #c41cef;
            font-size: 34rpx;
        }
    }
}
.list-scope {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #f7f0ff;
    padding: 12px;

    &.scroll {
        flex-wrap: nowrap;
    }

    .grid2 {
        width: 48%;
        display: inline-block;
    }

    .grid3 {
        width: 32%;
        display: inline-block;
    }
}

.scroll-list {
    white-space: nowrap;
    background: #f7f0ff;
    padding-top: 10px;

    &.scroll {
        flex-wrap: nowrap;
    }

    .grid2 {
        margin-right: 20rpx;
        display: inline-block;
        width: 52%;
    }

    .grid3 {
        width: 34%;
        margin-right: 20rpx;
        display: inline-block;
    }
    .grid3:first-child {
        margin-left: 20rpx;
    }
}
</style>
