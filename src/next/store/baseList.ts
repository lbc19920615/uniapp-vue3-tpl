import { partialStore } from "@/frame/storeMan";
import { deepClone } from "@/utils/clone";

export interface BaseListItemConfig {
  checked: boolean,
  num: number,
  extra: Record<any, any>
}

@partialStore("BaseList")
class BaseList {
  // items = []
  items = []

  get checkedLen() {
    let count = 0;
    if(!this.items || this.items.length <1){
      return 0;
    }
    this.items.forEach((item: [String, BaseListItemConfig]) => {
      if (item[1].checked) {
        count = item[1].num + count
      }
    })
    return count
  }

  clearAllItems() {
    this.items.splice(0)
  }

  pushItem(skuId, {num = 1, checked = true, extra = {}} = {}) {
    this.items.push([skuId, { num:num, checked, extra }])
  }

  delItem(index) {
    this.items.splice(index,1)
  }

  toggleItemChecked(item) {
    item[1].checked = !item[1].checked
  }

  toggleCheckAll() {
    let checked =  this.checkedLen <= 0
    this.items.forEach(item => {
      item[1].checked =checked
    })
  }

  getSelectedItems() {
    let res = deepClone(unref(this.items))
    return res.filter(v => {
      return v[1].checked
    })
  }
}

export function createBaseListItemConfig(extra = {}):BaseListItemConfig {
  return {
    checked: true,
    num: 1,
    extra
  }
}
