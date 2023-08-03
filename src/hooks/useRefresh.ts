import { sleep } from "@/utils/time";

/**
 *
 * let obj = useRefresh(getData)
 * let { triggered } = obj
 *
 * 配合scroll-view 下拉刷新
 * @param getData
 * @param sleepTime
 */
export function useRefresh(getData: () => any, {sleepTime = 300}={}) {
  let freshing = false;
  let triggered: any = ref(false);
  return {
    triggered,
    async onRefresh(e) {
      if (freshing) {
        return;
      }
      // console.log("onRefresh", e);
      freshing = true;
      await sleep(sleepTime)
      await getData();
      triggered.value = false;
      freshing = false;
    },

    async onRestore(e) {
      triggered.value = "restore";
      // console.log('onRestore', e);
    },

    onAbort(e) {
      // console.log('onAbort', e);
      freshing = false;
    },

    onPulling(e) {
      // console.log("onpulling", e);
      if (e.detail.deltaY < 0) return;  // 防止上滑页面也触发下拉
      if (!freshing) {
        triggered.value = true;
      }
      // console.log('onPulling', e);
    }
  }
}
