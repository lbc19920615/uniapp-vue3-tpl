<template>
  <view class="navigation-bar">
    <view>
      <template v-if="!isTabBar">
        <view v-if="pageLen === 1">
          <uni-icons @click="backHome"
                     class="navigation-bar__home"
                     color="var(--navigation-bar-text)" type="home" size="20"></uni-icons>
        </view>
        <template v-else-if="pageLen > 1">
          <view
            @click="back"> <uni-icons color="var(--navigation-bar-text)" type="left" size="20"></uni-icons> </view>
        </template>
        <template v-else></template>
      </template>
    </view>
    <view>
      <view class="navigation-bar__title">{{titleText}}</view>
    </view>
    <view>&nbsp;</view>
  </view>
</template>

<style lang="scss">
.navigation-bar {
  height: calc(var(--navigation-bar-height) - 1px);
  //padding-top: constant(safe-area-inset-top); /* 兼容 iOS < 11.2 */
  //padding-top: env(safe-area-inset-top);
  padding-top: var(--safe-area-inset-top);
  background-color: var(--navigation-bar-bg-color);
  color: var(--navigation-bar-text);
  border-bottom: 1px solid var(--navigation-border-color, #eee);
  display: flex;
  align-items: center;
  gap: 10px;
  > view{
    flex: 1;
  }

  font-size: 32upx;
}
.navigation-bar__title {
  text-align: center;
}
.navigation-bar__home {
  margin-left: 10upx
}
</style>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { getPageInfo } from "@/utils/pageInfo";
function back() {
  uni.navigateBack()
}

function backHome() {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

let titleText = ref('');
let isTabBar = ref(true)
let pageLen = ref(0)

onShow(() => {
  // const systemInfo = uni.getSystemInfoSync();
  setTimeout(() => {
    let pages = getCurrentPages();
    pageLen = pages.length
    // console.log(systemInfo);
    let {navigationBarTitleText, meta} = getPageInfo()
    // console.log('onShow', navigationBarTitleText, __wxConfig?.tabBar?.list, meta.isTabBar);
    titleText.value = navigationBarTitleText
    isTabBar.value = meta.isTabBar
  }, 30)
})
</script>
