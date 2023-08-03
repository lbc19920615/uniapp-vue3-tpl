<template>
  <view>
    {{scrollLeft}}
<!--    <view style="width: 360px; overflow: auto">-->
      <scroll-view
        class="scroll-view_H" :scroll-left="goodLeft"
                  style="display: block;"
                   scroll-x >
        <view class="scroll-item">t1</view>
        <view  class="scroll-item">t2</view>
        <view  class="scroll-item">t3</view>
      </scroll-view>
<!--    </view>-->

    <swiper scroll-x @change="onChange" @animationfinish="onAnimationfinish" @transition="onScroll">
      <swiper-item  class="scroll-item">11</swiper-item>
      <swiper-item class="scroll-item">22</swiper-item>
      <swiper-item  class="scroll-item">33</swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">

let sys = uni.getSystemInfoSync()
let winWidth = sys.windowWidth

let goodLeft = ref(0)
let scrollLeft = ref(0)
let curIndex = 0
let oldIndex = 0

let lock = false;
function onChange(e) {
  // goodLeft.value = 0
  // scrollLeft.value = e.detail.current * 360
  curIndex = e.detail.current
  goodLeft.value =  (curIndex * winWidth)
  console.log('onChange', goodLeft.value);
  lock = true
}
function onScroll(e) {
  // if (!lock) {
    let detail = e.detail;
    // var process = detail.scrollLeft / 1080
   // scrollLeft.value = (detail.dx) + (curIndex * 360);
    goodLeft.value = (detail.dx) + (oldIndex * winWidth);
    // console.log('scroll', goodLeft.value);
  // }
}

function onAnimationfinish() {
  lock = false
  console.log('onAnimationfinish');
  oldIndex = curIndex
}
</script>

<style scoped lang="scss">
.scroll-view_H {
  white-space: nowrap;
  display: block;
}

.scroll-view_H {
  .scroll-item {
    height: 50px;
  }
}

.scroll-item {
  display: inline-block;
  width: 100%;
  height: 150px;
}
</style>
