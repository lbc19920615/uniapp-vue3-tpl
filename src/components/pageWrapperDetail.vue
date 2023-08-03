<template>
  <view class="page-wrapper page-wrapper--noTabbar"
      :style="styleObj"
  >
    <navigatorbar></navigatorbar>
    <view class="page-wrapper__content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import navigatorbar from "@/components/navigatorbar.vue"

let app  =  getApp();
let systemInfo = app.globalData.infoSync ?? uni.getSystemInfoSync();
if (!app.globalData.cacheSync) {
  systemInfo = uni.getSystemInfoSync()
  app.globalData.cacheSync = true
}

let safeAreaInsets = systemInfo.safeAreaInsets
let styleObj = reactive({
  '--safe-area-inset-top': safeAreaInsets.top + 'px'
})
</script>

<style lang="scss">
@import "./pageWrapper.scss";
</style>
