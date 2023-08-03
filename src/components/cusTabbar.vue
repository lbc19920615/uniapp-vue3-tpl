<template>
  <view class="cus-tabbar"
  :style="{'--tabbar-selected-color': tabbar.selectedColor, '--tabbar-fz': tabbar.fontSize}"
  >
    <view v-for="(tabbar, index) in tabbarList" :key="index"
          :class="tabbarItemCls(index)"
          class="cus-tabbar__item" @click="selectItem(index)">
      <uni-icons color="var(--tabbar-item-color)" :type="tabbar.icon" size="30"></uni-icons>
      <view>{{tabbar.text}}</view>
    </view>
  </view>
</template>

<style lang="scss">
.cus-tabbar {
  display: flex;
  align-items: center;
  height: var(--tabbar-height);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #ffff;
}
.cus-tabbar__item {
  flex: 1;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size:  var(--tabbar-fz);
}
.cus-tabbar-selected {
  color: var(--tabbar-selected-color);
  --tabbar-item-color:  var(--tabbar-selected-color)
}
</style>

<script  lang="ts">
import pageJson from "../pages.json"
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
// import { parseUrl } from "@/utils/shared";

// console.log(pageJson);

let tabbarList = pageJson.tabBar.list
// console.log(tabbarList);

export default {
  components: { UniIcons },
  data() {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    let pagePath = page.route;
    // if (page.$page) {
    //   let { fullPath } = page.$page;
    //   pagePath = parseUrl(fullPath).pagePath;
    // }
    // console.log('tabbar onShow', page.$page);
    let isSelected = tabbarList.findIndex(v => pagePath.startsWith(v.pagePath))
    // console.log(pagePath, 'pagePath');
    return {
      tabbar: pageJson.tabBar,
      isSelected,
      tabbarList
    }
  },
  methods: {
    tabbarItemCls(index) {
      return this.isSelected === index ? 'cus-tabbar-selected' : ''
    },
    onTabItemTap(e) {
      console.log("onTabItemTap", e);
    },
    selectItem(index) {
      // this.isSelected = index
      uni.switchTab({
        url: '/' + this.tabbarList[index].pagePath
      })
    }
  }
}
</script>
