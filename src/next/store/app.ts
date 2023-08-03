import { injectStore } from "@/frame/storeMan";

type SystemInfoType = UniApp.GetSystemInfoResult | {}
let systemInfo: SystemInfoType

@injectStore('App')
export default class {
  getSystemInfo(): SystemInfoType {
    if (systemInfo && Object.keys(systemInfo).length > 0) {
      return systemInfo;
    }
    let sys = uni.getSystemInfoSync();
    if (!systemInfo) {
      systemInfo = {}
    }
    Object.assign(systemInfo, sys);
    return systemInfo;
  }
}
