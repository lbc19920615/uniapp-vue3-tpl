import { injectStore, useCache } from "@/frame/storeMan";

import pageConfig from "../../pages.json"

@injectStore('Home')
export default class {
  // @ts-ignore
  @useCache()
  a = 1
  // @ts-ignore
  @useCache()
  b = 2

  get arr() {
    // console.log(pageConfig.subPackages[0].pages);
    return pageConfig.subPackages[0].pages
}
  get c() { return this.a + this.b }
  action1() {
    this.a = this.a + 1
  }
}
