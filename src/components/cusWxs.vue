<template>
    <view
    class="cus-wxs"
    :class="cls"
    data-text="1+1"
    @transitionend="test.touchstart"
    >1111</view>
</template>

<script module="test" lang="wxs" src="./index.wxs"></script>


<script lang="ts">
export default {
    data() {
        return {
            cls: 'good'
        }
    },
    mounted() {

    },
  methods: {
    alert(args) {
      console.log(args);
    }
  }
}
</script>

<style lang="scss">
.cus-wxs {
    transform: translateX(0);
    transition: all ease .1s;
}
.good {
    transform: translateX(1px);
}
</style>