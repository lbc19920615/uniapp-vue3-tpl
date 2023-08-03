<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';

onLaunch(async () => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
})
</script>

<script lang="ts">
import { initFrame } from "@/frame/app";
// import { tabbarList } from "@/config/app";
import pageJson from "./pages.json"
import appConfig from "./config.json"
import * as $glo from './glo'

let globalData = {
    version: '1.0.1',
    infoSync: uni.getSystemInfoSync(),
    cacheSync: false,
    tabbar: pageJson.tabBar,
    ...appConfig
  }

  let callbacks = {}
  // #ifdef MP-WEIXIN
  function createNewWorker() {
    const worker = wx.createWorker('static/workers/index.js', {
      useExperimentalWorker: true
    })
    // 监听worker被系统回收事件
    worker.onProcessKilled(() => {
      // 重新创建一个worker
      createNewWorker()
    })
 
    worker.onMessage((e) => {
      callbacks[e.name](e.detail)
    })
    globalData.worker = worker;
    globalData.sendMsg = function(detail, callback) {
      let name = 'functest'
      callbacks[name] = callback
      globalData.worker.postMessage({
        name: name,
        detail: detail
      })
    }
  }
  // 创建实验worker
  createNewWorker();
  // #endif

  // #ifdef H5
  let worker = new Worker('/static/webworkers/index.js');
  worker.onmessage = function(e) {
    let data = e.data
    if (callbacks[data.name]) {
      callbacks[data.name](data.detail)
    }
  }
  globalData.worker = worker;
  globalData.sendMsg = function(detail, callback) {
    let name = 'functest'
    callbacks[name] = callback
    globalData.worker.postMessage({
      name: name,
      detail: detail
    })
  }
  // #endif

// const {App} = $glo
// console.log(App);


  if ($glo.App) {
    $glo.App({globalData})
  }

export default {
  onLaunch() {
    // console.log("Launch");
    initFrame({
      context: this
    })
  },
  onUnload() {
    if (globalData.worker) {
      globalData.worker.terminate()
    }
  },
  globalData: globalData,

}
</script>

<style lang="scss">


html, page {
  --navigation-bar-height: 80rpx;
  --navigation-bar-bg-color: #fff;
  --navigation-bar-text: var(--color-text-primary);
  --tabbar-height: 100upx;
  --primary-color: #{$uni-color-primary};
  --color-primary: #{$uni-color-primary};
  --color-success: #{$uni-color-success};
  --color-warning: #{$uni-color-warning};
  --color-error: #{$uni-color-error};
  --color-text-primary: #{$uni-text-primary}; // 一级信息，标题，主内容文字等
  --color-text-secondary: #{$uni-text-secondary}; // 辅助文字，次要信息等
  --color-text-thirdly: #{$uni-text-thirdly};
  --color-text-fourth: #{$uni-text-fourth};
  --color-background: #{$uni-bg-color-grey};
  --color-defimage: #{$uni-text-color-defimage};
  --color-white: #fff;
  --color-black: #000;
  --text-primary: #{$uni-text-primary}; // 一级信息，标题，主内容文字等
  --text-secondary: #{$uni-text-secondary}; // 辅助文字，次要信息等
  --text-thirdly: #{$uni-text-thirdly};
  --text-fourth: #{$uni-text-fourth};
  --def-padding: 20upx;
  --def-bgc-color: #fff;
}

.page-wrapper {
  --font-def-size: 28upx;
  font-size: var(--font-def-size);
  button {
    font-size: var(--font-def-size);
    &:after {
      border: none;
    }
  }

  button[type=primary] {
    background-color: var(--primary-color);
  }

  uni-button[disabled] {
    color: rgba(120, 120, 120, 0.6);
  }
}

<!-- #ifdef H5 -->
uni-page-head {
  view-transition-name: head;
}

uni-page-body {
  height: 100%;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: .5s;
}

::view-transition-old(head),
::view-transition-new(head) {
  animation-duration: .1s;
}

.uni-tabbar-bottom {
  display: none !important;
}

html {
  --tab-bar-height: 0px !important;
}


<!-- #endif -->

<!-- #ifdef MP-WEIXIN -->
page {
  height: 100%;
}

page-wrapper {
  height: 100%;
}

button:after {
  border: none;
}

radio .wx-radio-input {
  border-color: var(--color-primary);
}
radio .wx-radio-input.wx-radio-input-checked {
  border-color: var(--color-primary) !important;
}
radio  .wx-radio-input.wx-radio-input-checked {
  border-radius: 50%;
  content: "";
  background-color: var(--color-primary);
}
<!-- #endif -->


@import "@/frame/zx/index.scss";


.text-thirdly {
  color: var(--text-thirdly)
}

.text-fourth {
  color: var(--text-fourth)
}

.arrow {
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 2px;
  position: relative;
  top: -3rpx;
  &-right {
    transform: rotate(-45deg);
  }

  &-left {
    transform: rotate(135deg);
  }

  &-up {
    transform: rotate(-135deg);
  }

  &-down {
    transform: rotate(45deg);
  }
}


</style>


