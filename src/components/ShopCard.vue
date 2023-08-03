<template>
  <view class="p-20 pb-0 shop-card">
    <view class="p-20 shop-card__content">
      <view class="flex shop-card__desc">
          <view>
            <view class="font-bold fs-30 mb-10">{{item.shop_name}}</view>
            <view class="fs-24 mb-30 text-thirdly">{{item.create_time}}</view>
          </view>
          <view class="flex-1">&nbsp;</view>
          <view class="fs-30">已完成 <view class="arrow arrow-right"></view></view>
      </view>
      <order-sku></order-sku>
      <view class="shop-card__action"><slot name="action"></slot></view>
    </view>
  </view>
</template>

<script lang="ts">
import OrderSku from "@/components/OrderSku.vue";

export default {
  components: { OrderSku },
  props:{
    item: Object
  }
}
</script>

<style>
.shop-card__content {
  background-color: #fff;
  border-radius: 10rpx;
}
</style>
