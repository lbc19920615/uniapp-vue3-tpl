<template>
  <view class="page-wrapper"
        :class="{  'page-wrapper--no-nav': !proxy.$props.showNav, [cusCls]: true}"
      :style="styleObj"
  >
    <navigatorbar v-if="showNav"></navigatorbar>
    <cus-tabbar class="page-wrapper__tabbar"></cus-tabbar>
    <view class="page-wrapper__content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import navigatorbar from "@/components/navigatorbar.vue"
import CusTabbar from "@/components/cusTabbar.vue";

let app  =  getApp();
let systemInfo = app.globalData.infoSync ?? uni.getSystemInfoSync();
if (!app.globalData.cacheSync) {
  systemInfo = uni.getSystemInfoSync()
  app.globalData.cacheSync = true
}

let safeAreaInsets = systemInfo.safeAreaInsets

let {proxy} = getCurrentInstance();

// console.log(proxy);

let styleObj = reactive({
  '--safe-area-inset-top': safeAreaInsets.top + 'px',
})

defineProps({
  showNav: {
    type: Boolean,
    default: true
  },
  cusCls: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
@import "./pageWrapper.scss";
</style>
