
<template>


  <pageWrapper :show-nav="false"   >


    <view class="h-full overflow-hidden" >


      <scroll-view class="h-full" scroll-y>
       <view class="bgc-black  height-750">
        <video id="myVideo"
               ref="myVideo"
               src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4"
               :muted="true"
               :controls="false"
               class="w-full mt-30"
               @loadedmetadata="onWaiting"
               @ended="onEnd"
        ></video>
      </view>

      <view class="position-absolute w-full p-40 pt-0"

            style="left: 0; top:650rpx; box-sizing: border-box; z-index: 100">

<!--            <view style="height: 650rpx; pointer-events: none">&nbsp;</view>-->
            <view class="bgc-background rounded-3xl pb-30 mb-20"
            >

              <view class="flex items-center justify-between w-full p-20" style=" box-sizing: border-box;">
                <view>微信用户</view>
                <view>优惠券&nbsp;10张</view>
                <view>1111</view>
              </view>
              <view class="flex items-center  height-120">
                <view class="flex-1 text-center">门店自取</view>
                <view>|</view>
                <view class="flex-1 text-center">外卖点单</view>
              </view>
              <view class="flex items-center">
                <view class="flex-1 text-center">活动1</view>
                <view class="flex-1 text-center">活动2</view>
                <view class="flex-1 text-center">活动3</view>
                <view class="flex-1 text-center">活动4</view>
              </view>
            </view>

            <view class="shop-act-section bgc-background height-240 mb-20" 
            @click="goToAct('act1')"
            style="border-radius: 30rpx;">
              <view class="p-20">活动专区1</view>
            </view>

            <view class="shop-act-section bgc-background height-240 mb-20" style="border-radius: 30rpx;">
              <view class="p-20">活动专区1</view>
            </view>

            <!--  #ifdef H5    -->
            <view class="fs-32 text-left">APP能力</view>
            <button @click="openTest">打开webview</button>

            <view class="grid grid-cols-3">
              <view  v-for="(item,index) in store.arr" :key="index">
                <view class="text-center h-60 lh-60" @click="goPage(item)">{{ item.name }}</view>
              </view>
            </view>
            <!--  #endif    -->
      </view>


      </scroll-view>
    </view>


  </pageWrapper>
</template>

<script setup lang="ts">
import { $getStore } from "@/frame/app";
import pageWrapper from "@/components/pageWrapper.vue"
import { forward } from '@/utils/router';
import { useModal } from '@/frame/zx'
import { openWebview } from "@/utils/navigate";


let {ins: store, refs} = $getStore("Home")
const {proxy} = getCurrentInstance()


let videoContext = uni.createVideoContext('myVideo')

function onWaiting(e) {
  videoContext.play()
}

function onEnd(e) {
  // console.log('e',   proxy.$refs.myVideo);
  videoContext.play()
}

function openTest() {
  openWebview("http://192.168.2.64:3100/#/folder")
}

function goPage(item) {
  forward(item.path, {})
}

function goToAct(name) {
  forward('act', {name})
  // uni.navigateTo({
  //   url: '/pages/test/act'
  // });
  
}

</script>

<style lang="scss">

</style>
