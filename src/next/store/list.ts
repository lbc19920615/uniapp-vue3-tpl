import { injectStore, partialStore, useCache } from "@/frame/storeMan";
import { mockShops } from "@/frame/mock";

@partialStore("Current")
class Current {
  current = 0

  onSwiperChange(e) {
    // console.log('onSwiperChange', e, this);
    this.current = e.detail.current
  }

  setCurrent(index: Number) {
    // @ts-ignore
    this.current = index
  }
}

@injectStore('List', {
  partials: [
    [ 'Current',
      {
        cachedKeys: ['current']
      }
    ],
  ]
})
export default class {
  items = []

  setItems() {
    this.items =  mockShops()
  }
}
