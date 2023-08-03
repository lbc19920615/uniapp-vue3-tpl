/**
 * 
 * @returns 
 */
export function getCurPageOptions() {
    let lastPage: any = getCurrentPages().at(-1);
  // console.log(lastPage);
   return lastPage?.options || lastPage?.$page?.options;
}


