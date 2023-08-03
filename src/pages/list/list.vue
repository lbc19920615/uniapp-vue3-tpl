<template>
  <page-wrapper :show-tabbar="true">
    <view class="w-full h-full flex flex-col"
          style="background-color: #f7f8f9">
      <view style="height: fit-content; background-color: #fff">
        <view class="flex items-center">
          <view class="flex-1 text-center p-30 list__item"
                :class="{'is-current': store.current === 0}"
                @click="store.setCurrent(0)"
          >茶饮订单</view>
          <view class="flex-1 text-center p-30 list__item"
                :class="{'is-current': store.current === 1}"
                @click="store.setCurrent(1)"
          >卡券订单</view>
        </view>
      </view>
      <view class="flex-1 overflow-hidden" v-if="isShow">
        <swiper :current="store.current" @change="store.onSwiperChange" class="h-full">
          <swiper-item>
            <scroll-view  style="height: 100%"  :scroll-y="true">
              <ShopCard v-for="item in store.items" :item="item"></ShopCard>
              <view class="flex justify-center p-50">到底了</view>
            </scroll-view>
          </swiper-item>
          <swiper-item>
            <scroll-view  style="height: 100%"  :scroll-y="true">
              <ShopCard v-for="item in store.items" :item="item"></ShopCard>
              <view class="flex justify-center p-50">到底了</view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
      <view class="flex-1 overflow-hidden" v-if="!isShow">
        <page-loading></page-loading>
      </view>
    </view>
  </page-wrapper>
</template>

<script setup lang="ts">
import { $getStore } from "@/frame/app";
import ShopCard from "@/components/ShopCard.vue";
import PageLoading from "@/components/pageLoading.vue";
// import { clearStoreCache } from "@/frame/storeMan";

let { ins: store, refs } = $getStore("List")
let isShow = ref(false)


onPullDownRefresh(async () => {
  uni.stopPullDownRefresh()
  store.setItems()
})

onShow(async () => {
  await store.setItems();
  setTimeout(() => {
    isShow.value = true
  }, 50)
})
</script>

<style lang="scss">
.list__item {
  position: relative;
  &:after {
    position: absolute;
    bottom: 0;
    left: 50%;
    content: "";
    width: 100rpx;
    display: block;
    height: 4rpx;
    background-color: var(--list-bdb-color, transparent);
    transform: translateX(-50%);
    transition: background-color .5s ease;
  }
}

.is-current {
  --list-bdb-color: var(--primary-color);
}
</style>

