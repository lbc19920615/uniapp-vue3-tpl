

<template>
  <pageWrapper :show-tabbar="true" cus-cls="profile-page">
    <view>
      <!-- 头像显示圆点 -->
      <view class="mb-50" style="height: 400rpx; background-color: var(--primary-color)">
        <list-chat
          class="my-live-chart mb-20"
          style="position: relative; background-color: transparent; top: 220rpx;"
          title="用户名" :avatarCircle="true"
                       avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
                       note="" time="" badge-positon="left"></list-chat>
      </view>

      <view class="mb-30 fs-28 pl-30 pr-30 font-bold">会员服务</view>
<!--      <uni-grid :square="false" :show-border="false" :column="4" :highlight="true" @change="onChange">-->
<!--        <uni-grid-item v-for="(item, index) in 8" :index="index" :key="index">-->
<!--          <view class="flex flex-col items-center mb-30" >-->
<!--            <uni-icons type="image" :size="30" color="#777" />-->
<!--            <text class="text text-center fs-24">功能{{index}}</text>-->
<!--          </view>-->
<!--        </uni-grid-item>-->
<!--      </uni-grid>-->
      <view class="grid grid-cols-4">
        <view v-for="(item, index) in 8" :index="index" :key="index">
          <view class="flex flex-col items-center mb-30" >
            <uni-icons type="image" :size="30" color="#777" />
            <text class="text text-center fs-24">功能{{index}}</text>
          </view>
        </view>
      </view>
    </view>
  </pageWrapper>
</template>

<script lang="ts" setup>
import { $getStore } from "@/frame/app";
import pageWrapper from "@/components/pageWrapper.vue"
function onChange(e) {
  let {
    index
  } = e.detail
  this.list[index].badge && this.list[index].badge++

  uni.showToast({
    title: `点击第${index+1}个宫格`,
    icon: 'none'
  })
}
</script>

<style lang="scss">
.my-live-chart {
  .uni-list-chat__content-title {
    font-size: 24rpx;
  }
}

.profile-page {
  --navigation-bar-bg-color: var(--color-primary);
  --navigation-border-color: var(--color-primary);
}
</style>
