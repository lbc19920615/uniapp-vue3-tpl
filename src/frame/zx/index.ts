import ZxModal from "./components/zx-modal/zx-modal.vue";
import ZxTab from "./components/zx-tab/zx-tab.vue";

// Modal
export * from './components/zx-modal'


// 常用的校验方法
export * from './libs/functions/reg'
// 常用工具类
export * from './libs/utils/CommonUtil'


const install = (app) => {
  app.component('ZxModal', ZxModal);
  app.component('ZxTab', ZxTab)
}

export default {
  install
}
