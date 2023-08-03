import { getPageInfo } from "@/utils/pageInfo";

export function useInit() {
  // onShow(() => {
  //   // console.log('Page Show');
  // });
  // onHide(() => {
  //   // console.log('Page Hide');
  // });
  return getPageInfo()
}
