<template>
    <view class="page-scope">
        <DefaultTheme :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" v-if="renderTheme === 'default'" :page="page" :isshowye="isshowye"></DefaultTheme>
        <HomepageTheme
            @getliushui="getliushui"
            :liushuilist="liushuilist"
            :yfslist="yfslist"
            :ssjlist="ssjlist"
            :refreshCounter="refreshCounter"
            :getNextPageCounter="getNextPageCounter"
            v-else-if="renderTheme === 'homepage'"
            :page="page"
        ></HomepageTheme>

        <FloatBtn v-if="isShowFloatBtn" :link="floatBtn.link" :isAnimated="floatBtn.is_animate" :src="floatBtn.image"></FloatBtn>
    </view>
</template>

<script>
import DefaultTheme from './themes/DefaultTheme.vue';
import HomepageTheme from './themes/HomepageTheme.vue';
export default {
    components: {
        DefaultTheme,
        HomepageTheme
    },
    props: {
        isshowye: {
            type: Boolean,
            default() {
                return false;
            }
        },
        page: {
            type: Object,
            default() {
                return {
                    title: '',
                    modules: []
                };
            }
        },
        theme: {
            type: String
        },
        fullPageMode: {
            type: Boolean,
            default() {
                return true;
            }
        },
        liushuilist: Object,
        yfslist: Object,
        ssjlist: Object,
        refreshCounter: Number,
        getNextPageCounter: Number
    },
    data() {
        return {};
    },
    computed: {
        renderTheme() {
            return (this.page && this.page.base && this.page.base.theme) || this.theme || 'default';
        },
        title() {
            return (this.page && this.page.title) || '未设置';
        },
        navColor() {
            return (this.page && this.page.nav_color) || '#FFFFFF';
        },
        isShowFloatBtn() {
            return this.page && this.page.is_float_btn;
        },
        floatBtn() {
            return (this.page && this.page.float_btn) || {};
        }
    },
    mounted() {
        this.setNav();
    },
    watch: {
        title() {
            this.setNav();
        },
        navColor() {
            this.setNav();
        }
    },
    methods: {
        setNav() {
            if (!this.fullPageMode) return false;

            uni.setNavigationBarTitle({
                title: this.title
            });
        },
        getliushui() {
            this.$emit('getliushuilist');
        }
    }
};
</script>

<style lang="scss" scoped></style>
