<template>
<view class="container" :class="theme">
	<parser :html="html"></parser>
</view>
</template>

<script>
import parser from "@/components/jyf-Parser/index"
export default {
  data() {
    return {
	};
  },
  components: {
	  parser
  },
  props: {
    html: {
      type: String
    },
	theme: {
		type: String,
		default: () => {
			return 'black'
		}
	}
  },
  watch: {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
</style>