import 'uno.css';
import './extend.js'
// @ts-ignore
import { createSSRApp } from 'vue';
import zx from "./frame/zx";
import App from './App.vue';
import store from '@/store';
// #ifdef MP-WEIXIN
import "./polyfill.js"
// #endif



// 路由格式化
import { spaNavigate } from '@/utils/navigate';

const _oldnavigateBack = uni.navigateBack;
uni.navigateBack = function (args, ...rest) {
  spaNavigate(function(){
    _oldnavigateBack(args);
  });
};

const _oldredirectTo = uni.redirectTo;
uni.redirectTo = function (args, ...rest) {
  spaNavigate(function(){
    _oldredirectTo(args);
  });
};

const _oldnavigateTo = uni.navigateTo;
uni.navigateTo = function (args, ...rest) {
  spaNavigate(function(){
    _oldnavigateTo(args);
  });
};

const _oldswitchTab = uni.switchTab;
uni.switchTab = function (args, ...rest) {
  spaNavigate(function(){
    _oldswitchTab(args);
  });
};

export function createApp() {
  const app = createSSRApp(App).use(store);
  app.use(zx)

  // #ifdef H5
  document.addEventListener("login-success", function(e: CustomEvent) {
    let arg = e.detail?.arg ?? '{}'
    let obj = JSON.parse(arg);
    console.log(obj);
  })

  function callBack() {
    // console.log("geo-fail")
    uni.showToast({
      title: '请打开定位开关',
      duration: 2000
    });
  }
  document.addEventListener("geo-fail", callBack)

  globalThis.Lib = {

  }
  // #endif


  // app.use(uvUI);
  return {
    app
  };
}
