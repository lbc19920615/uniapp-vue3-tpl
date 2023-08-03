<template>
  <view class="list-page h-full p-20">
    <!--    {{ triggered }}-->
    <view class="flex h-full">
      <view class="list-page__categorys">
<!--        <view @click="goToIndex(2)">滚动到第2个</view>-->
        <view v-for="category in categories"
              class="list-page__category pl-10"
              @click="goToIndex(category.APP_SKU_INDEX)">
          <view>跳 <view>{{category?.category_name}}</view></view>
        </view>
      </view>
      <scroll-view
        id="scroll-con"
        :scroll-into-view="scrollTop"
        :scroll-with-animation="enableAnimation"
        class="list-scroll-con" scroll-y="true"
        :refresher-enabled="false"
        :refresher-triggered="triggered"
        :refresher-threshold="100"
        refresher-background="transparent"
        @refresherpulling="obj.onPulling"
        @refresherrefresh="obj.onRefresh"
        @refresherrestore="obj.onRestore"
        @refresherabort="obj.onAbort">
        <view style="height: var(--list-con-height)"
              v-if="items.length < 1">empty</view>
        <view class="list-card-item box-border"
              :id="'item-' + index"
              :class="{['item-' + index]: true}"
              v-for="(item, index) in items">
          <view class="pb-20" v-if="item.needShowCategory">
            种类介绍栏 {{item.category_id}}
          </view>              
          <view class="flex gap-20">
            <view class="w-150 h-150 bgc-text-fourth bdrs-10">&nbsp;</view>
            <view class="flex-1">
              <view class="flex h-180 gap-20">
                <view class="flex-1">
                  <view>{{ item.sku_id }}</view>
                  <view>{{index + 1}} </view>
                </view>
                <view class="flex items-center gap-10">
                  <view>{{ getItemCartDetail(item, 'num') }}</view>
                  <com-sku-calc @sku-calc-submit="onSkuCalcSubmit($event, item)"></com-sku-calc>
                </view>
              </view>
            </view>
          </view>
          <view class="h-150" v-if="index > items.length - 2">&nbsp;</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { sleep } from "@/utils/time";
import { useRefresh } from "@/hooks/useRefresh";
import apiTest from "@/api/apiTest";
import { deepClone } from "@/utils/clone";
import get from "lodash/get"

defineEmits(['buy-sku'])

let {ins: cartStore} = $getStore("Cart");


let items = reactive([]);
let categories = reactive([]);

let { proxy } = getCurrentInstance()
let observer;

function reset(newItems = []) {
  if (observer) {
    observer.disconnect();
  }
  observer = uni.createIntersectionObserver(proxy)

  // console.log(' Record<any, any>', newItems);
  items.splice(0);
  newItems.slice(0, 20).forEach((item, index) => {
    items.push(item);
    // setTimeout(() => {
    //   observer.relativeTo(".list-scroll-con", { bottom: 50 })
    //     .observe(".item-" + item.id, (res) => {
    //       console.log(res.intersectionRatio, item.id, index);
    //       if (res.intersectionRatio > 0) {
    //         item.hide.value = true
    //       } else {
    //         item.hide.value = false
    //       }
    //     });
    // }, 300)
  });
  setTimeout(() => {
    newItems.slice(20).forEach(item => {
      // item.hide = ref(false);
      items.push(item);
    });

  }, 300);
}


function onSkuCalcSubmit(e, item: any) {
  let newItem = deepClone(unref(item))
  newItem.extra = deepClone(unref(e));

  let somePriceTotal = 0;
  let somePrice = []
  let someGood = []
  e.some.map(v => {
      let arr = v.split(':')
      let price =  parseFloat(arr.at(-1));
      if (!Number.isNaN(price)) {
        // // 转换成分
        // price = price * 100
        somePriceTotal = somePriceTotal + price;
      } else {
        price = 0
      }
      somePrice.push(price)
      someGood.push(arr[0])
  })

  if (!newItem.sku_tags) {
    newItem.sku_tags = []
  }

  newItem.sku_tags.push(e.name)
  newItem.sku_tags.push(e.age)

  if (somePrice.length > 0) {
    newItem.sku_price = newItem.sku_price + somePriceTotal   
    newItem.sku_price_display =  newItem.sku_price / 100
    newItem.sku_tags = newItem.sku_tags.concat(someGood)
  }

  // console.log(e, somePrice, newItem);
  proxy.$emit('buy-sku', newItem)
}

function getItemCartDetail(newItem, path = '') {
  let items =  cartStore.filterItems([
    ['0', 'eq', newItem.sku_id]
  ])
  if (items.length > 0) {
    let [item] = items
    if (item) {
      return get(item[1], path)
    }
  }
  return ''
}

// list 跳转
let scrollTop = ref('')
let enableAnimation = ref(false)
async function goToIndex(index) {
  enableAnimation.value = true
  scrollTop.value = 'item-' + index
  await sleep(1000)
  scrollTop.value = ''
  enableAnimation.value = false
}


function transformSeverData(obj = {}) {
  let str = JSON.stringify(obj);
  return JSON.parse(str, function(key, value) {
    // console.log(key);
    // console.log(key, value, this);
    if (key === 'create_time') {
      return new Date(value);
    }
    if (key === 'update_time') {
      return new Date(value);
    }
    if (key == 'category_skus') {
      return value.split(',')
    }
    if (key.startsWith("sku_price")) {
      // console.log('sssssssssssssssssssss', value);
      if (!value || value === 'null') {
        return 0
      }
      return parseFloat(value)
    }
    return value
  })
}

async function fetchItems(): Promise<any> {
  let data = await apiTest.getShopSkus();
  let newData: Record<any, any> = transformSeverData(data)
  let skus = newData.skus

  // console.log('newData', newData);

  let items = []
  newData.categories.forEach(category => {
    category.category_skus.forEach((skuId, skuIdIndex) => {
      let sku = skus.find(item => item.sku_id === skuId);
      sku.category_id = category.category_id
      if (skuIdIndex === 0) {
        sku.needShowCategory = true
        category.APP_SKU_INDEX = items.length
      }
      items.push(sku)
    })
  })

  // items = items.concat(mockListData())

  return {items, newData}
}

async function getData() {
  let {items, newData} = await fetchItems()
  categories.splice(0)
  newData.categories.forEach(v => {
    categories.push(v)
  })
  // console.log(categories);
  reset(items);

  await sleep(300)
  uni.stopPullDownRefresh();
}

onPullDownRefresh(() => {
  console.log('onPullDownRefresh');
  goToIndex(0)
  getData()
})


let obj = useRefresh(getData);
let { triggered } = obj;


// console.log("sssssssssssssssssssssssssssssssss");

setTimeout(() => {
  uni.startPullDownRefresh();
}, 50);

</script>


<style lang="scss">
.list-page {
  --list-con-height: calc(100%);
  --list-item-height: 150upx;
  &__categorys {
    width: 150upx;
  }
  &__category {
    height:120upx;
    //line-height:120upx;
  }
}

.list {
  &-scroll-con {
    height: var(--list-con-height);
  }
}
</style>
