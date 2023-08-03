<template>
  <view class="p-20" :class="{'sku-cart--empty': store.items.length < 1}">
    <view  v-if="store.items && store.items.length > 0">
      <view class="flex items-center pb-20" >
        <radio @click="onChangeCheckAll" :checked="store.checkedLen > 0" />
        <view>共{{refs.checkedLen}}件</view>
        <Spacer class="flex-1"></Spacer>
        <view @click="clearAllItems">清空</view>
      </view>
    </view>
    <scroll-view style="max-height: 560rpx" scroll-y>
      <view v-if=" store.items.length > 0" class="pb-20">剩余能买{{refs.curMaxNum}}  最多一次购买{{maxSkuBuyTotalNum}}件</view>
      <view class="flex items-end mb-20" v-for="(item, index) in store.items" :key="item[0]">
        <view class="flex items-center">
          <view>
<!--            {{item[1].checked + ''}}-->
            <radio @click="onChangeCheck(item)" :checked="item[1].checked" />
          </view>
          <view>
            <slot name="desc" :shop_id="item[0]" :extra="item[1].extra"></slot>
          </view>
        </view>
        <view class="flex-1">&nbsp;</view>
        <NumberBox
          @change="onChangeBox(item, index)"
          :min="0"
          :disabledMax="store.curMaxNum < 1"
          v-model="item[1].num"
        ></NumberBox>
      </view>
    </scroll-view>
  </view>
</template>

<style>
.sku-cart--empty {
  padding: 0 !important;
}
</style>

<script setup lang="ts">
import NumberBox from "@/components/NumberBox.vue";

let {proxy} = getCurrentInstance()
let maxSkuBuyTotalNum = getApp().globalData.shopConfig.maxSkuBuyTotalNum;


defineEmits(['item_change'])

let {ins: store, refs} = $getStore("Cart");

// function onInputBox(e) {
//   console.log('onInputBox',e);
// }

function clearAllItems() {
  store.clearAllItems()
  proxy.$emit("item_change")
}

function onChangeCheckAll() {
  store.toggleCheckAll()
  proxy.$emit("item_change")
}

function onChangeCheck(item) {
  store.toggleItemChecked(item)
  proxy.$emit("item_change")
}

function onChangeBox(item, index) {
  if (item[1].num < 1) {
    store.delItem(index)
  }
  console.log('curMaxNum', store.curMaxNum);
  proxy.$emit("item_change")
}
</script>
