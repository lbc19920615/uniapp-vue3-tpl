import { BaseVmControl } from "./frame/model";
import { $filterArr, $deepClone} from "@/frame/app";

// export function App({globalData}) {
//     console.log(globalData);   
// }

export function isDefined(v) {
  return typeof v !== 'undefined'
}

export class BaseShopVm extends BaseVmControl {
  cachedItems = []
  items = []
  categorys = []
  curId = ''
  setCatorys(newItems = []){
     this.categorys.splice(0, this.categorys.length)
     this.categorys = newItems
  }
  onCatSet(scope) {
    // console.log(scope.item.originItem)
    this.setCur(scope.item.originItem)
  }
  setCur({category_id} = {}) {
    this.items.splice(0, this.items.length)
    let items = $filterArr($deepClone(this.cachedItems), [
      ['category_id', 'eq', category_id]
    ]);
    // console.log(items, category_id)
    this.items = items
    this.curId = category_id
  }
  get initId() {
    if (!this.categorys[0]) {
      return ''
    }
    return this.categorys[0].category_id
  }
}