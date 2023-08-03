<template>
  <page-wrapper :show-tabbar="true">
<!--    {{shopStep}}-->
    <view
      class=" w-full h-full"
       v-if="shopStep === ''">
      <page-loading></page-loading>
    </view>
    <view
      class="flex flex-col w-full h-full"
      v-else-if="shopStep === 'needSelect'">
      <!--        {{longitude}} {{latitude}} {{needGetLocation}}-->
      <view class="position-relative w-full" style="height: fit-content">
        <map
          ref="map"
          style="width: 100%; height: 300px;"
          :latitude="latitude"
          :longitude="longitude"
          @regionchange="onRegionchange"
        >
        </map>
        <view class="position-absolute w-full h-full flex items-center justify-center" style="left: 0; top: 0; pointer-events: none">
<!--          <view style="width: 10rpx; height: 10rpx; background-color: var(&#45;&#45;color-error); border-radius: 1000px;">&nbsp;</view>-->
          <uni-icons type="map-pin-ellipse" color="var(--color-error)" size="30"></uni-icons>
        </view>
      </view>
<!--      <view>{{refs.centerLocation}}</view>-->
      <view
        class="p-20"
        v-for="(shop, index) in store.items"
        @click="store.shopStep = 'selected'">
        <view class="bgc-background fs-30 p-20 rounded-3xl">{{shop[1].extra.shop_name}}</view>
      </view>
    </view>

    <view
      class="flex flex-col w-full h-full sku-sell" style="position: relative"
      v-else>
      <view class=" p-20">
        <view class="fs-38 mb-10">{{ partStore.name }} <view class="arrow arrow-right"></view></view>
        <view class="text-thirdly">直线距离1000m</view>
      </view>

      <view class="flex items-center w-full pb-20 pt-20"
            style="position: absolute; bottom: 0; left: 0; z-index: 11111; background-color: #fff; height: var(--sku-cart-action-h); border-top: 1px solid #eee"
            v-show="isOpen || totalCount > 0"
      >
        <view class="flex items-center pl-20">
          <icon-mask>
            <template v-slot:mask><view class="fs-10 p-3 cart-action-dot">{{totalCount}}</view></template>
            <uni-icons type="cart" size="36" @click="open"></uni-icons>
          </icon-mask>
          <view>
            <view class="fs-36 ml-20">{{totalPrice}}</view>
          </view>
        </view>
        <view class="flex-1">&nbsp;</view>
        <view class="pr-20">
          <LockButton @submit="sendRequest">去结算</LockButton>
        </view>
      </view>
      <uni-popup ref="popup" type="bottom" @change="onPopUpChange">
        <view class="w-full bgc-white position-absolute"
              style="bottom: var(--sku-cart-popup-b);">
          <sku-cart
            @item_change="onCartChange"
          >
            <template v-slot:desc="scope">
              <view class="fs-32 mb-20">{{scope.extra.sku_id}}</view>
              <view  class="fs-32 mb-30">{{scope.extra.sku_tags ? scope.extra.sku_tags.join(',') : ''}}</view>
              <view>{{scope.extra.sku_price_display}}</view>
            </template>
          </sku-cart>
        </view>
      </uni-popup>

      <sku-page class="overflow-hidden" id="page1"
      @buy-sku="onChangeSku"
      ></sku-page>
    </view>
  </page-wrapper>
</template>

<script setup lang="ts">
import { $getStore } from "@/frame/app";
// import { checkLocationEnable } from "@/utils/permission";
import { sleep } from "@/utils/time";
import IconMask from "@/components/iconMask.vue";
import PageLoading from "@/components/pageLoading.vue";

import {createBaseListItemConfig} from "@/next/store/baseList";
import LockButton from "@/components/LockButton.vue";
import { forward } from "@/utils/router";

const {proxy} = getCurrentInstance()

let {ins: store, refs, getSubStore} = $getStore("Shop");
let {ins: partStore} = getSubStore('part')
// console.log(partStore);


let { longitude, latitude, showMap, shopStep,needGetLocation } = refs

let {ins: storeCart} = $getStore("Cart");

let isOpen = ref(false);
function onPopUpChange(e) {
  isOpen.value = e.show
}
function open(){
  // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
  proxy.$refs?.popup[isOpen.value ? 'close' : 'open']()
  // console.log(proxy.$refs?.popup);
}

function onChangeSku(item: any) {
  // console.log(item);
  storeCart.pushItem(item.sku_id, createBaseListItemConfig(item))
  proxy.$nextTick(() => {
    onCartChange()
  })
}

// 结算
async function sendRequest(e) {
  console.log('sendRequest', storeCart.getCollect(), e);
  await sleep(300);
  e.unLock()
  forward("order", {
    orderId: 'order000000001'
  })
}

let totalPrice = ref(0);
let totalCount = ref(0);

function onCartChange() {
  let {num, price_display} = storeCart.getCollect()
  // console.log('sssssssssssssssssss', num);
  if (num < 1) {
    proxy.$refs?.popup.close();
  }
  totalCount.value = num
  totalPrice.value = price_display
}


function onRegionchange(e) {
  // console.log('onRegionchange', e);
  if (e.type === 'end') {
    store.centerLocation = e.detail.centerLocation
  }
}

onShow(async () => {
  await sleep(300)
  store.shopStep = 'selected'
  proxy.$nextTick(() => {
    onCartChange()
  })
  // console.log(refs.needGetLocation, needGetLocation.value);
  // if (refs.needGetLocation.value) {
  //   store.shopStep = 'needSelect'
  //   checkLocationEnable(function() {
  //     uni.getLocation({
  //       type: 'gcj02',
  //       success: function (res) {
  //         store.longitude = res.longitude
  //         store.latitude = res.latitude
  //         // store.showMap = true
  //         console.log('当前位置的经度：' + res.longitude);
  //         console.log('当前位置的纬度：' + res.latitude);
  //         store.needGetLocation = false
  //       },
  //       fail: function(e) {
  //         console.log('getLocation：' + e.message);
  //         uni.showToast({
  //           title: '定位失败',
  //           duration: 2000
  //         });
  //       }
  //     });
  //   })
  // }
})
</script>

<style lang="scss">
.sku-sell {
  --sku-cart-action-h:80rpx;
  --sku-cart-popup-b: calc(var(--sku-cart-action-h) + var(--tabbar-height) + 40rpx);
}
.cart-action-dot {
  background-color: var(--color-success); transform: scale(.8) translateX(-40%) translateY(40%); text-align: center; width: 30rpx; height: 30rpx; color: #fff; border-radius: 1000px
}
.fz-less-webview .cart-action-dot {
  transform: scale(1);
  width: 20rpx;
  height: 20rpx;
  line-height: 20rpx;
}
</style>

