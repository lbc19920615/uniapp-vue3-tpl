import { parseUrl } from "@/utils/shared";

/**
 *
 */
export function getPageInfo() {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  // @ts-expect-error
  let { fullPath, meta } = page.$page;
  const {
    name: pageName,
    path: pagePath,
    query: pageQuery
  } = parseUrl(fullPath);
  // console.log(pagePath);


  //#ifdef MP-WEIXIN
  let key = `${pagePath.slice(1)}.html`
  // console.log( key);
  meta = {
    navigationBar: {}
  }
  let __wxConfig = globalThis.__wxConfig

  if (__wxConfig) {

  }
  let _pageObj = __wxConfig?.page ?? {}
  meta.window = _pageObj[key]?.window
  meta.tabBar = __wxConfig?.tabBar
  meta.isTabBar = false
  if (__wxConfig?.tabBar?.list) {
    let index = __wxConfig?.tabBar?.list.findIndex(v => v.pagePath === key)
    // console.log(index);
    meta.isTabBar = index > -1
  }
  //#endif

  let navigationBarTitleText = meta.navigationBar.titleText ?? meta.window.navigationBarTitleText

  return {
    navigationBarTitleText,
    meta,
    pageName,
    pagePath,
    pageQuery
  };
}
