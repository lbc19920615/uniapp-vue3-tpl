import { injectStore, partialStore, SubStore, useCache } from "@/frame/storeMan";
import { createBaseListItemConfig } from "@/next/store/baseList";

@partialStore("BasePart")
class BasePart {
  name = ""
}

@injectStore('Shop', {
  partials: [
    ['BaseList'],
  ]
})
export default class {

  // @ts-ignore
  @SubStore("BasePart", class extends BasePart {
    name = "商铺1"
  })
  part

  // @ts-ignore
  @useCache()
  longitude = 116.397486

  // @ts-ignore
  @useCache()
  latitude = 39.907013

  showMap = true

  needGetLocation = true

  shopStep = ""

  centerLocation = {}

  items = [
    ['shop0000001', createBaseListItemConfig({shop_name: "商铺1"})],
    ['shop0000001', createBaseListItemConfig({shop_name: "商铺1"})]
  ]
}
