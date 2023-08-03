<template>
  <view style="position: relative; height: fit-content; width: fit-content">
    <view style="position: absolute; right: 0; top: 0; transform: translateX(50%) translateY(-50%)"><slot name="mask"></slot></view>
    <slot></slot>
  </view>
</template>

<script lang="ts">
export default {
}
</script>
