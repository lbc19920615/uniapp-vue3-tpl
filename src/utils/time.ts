/**
 * @description 进行延时，以达到可以简写代码的目的 比如: await sleep(20)将会阻塞20ms
 * @param {number} value 堵塞时间 单位ms 毫秒
 * @returns {Promise} 返回promise
 */
export function sleep(value = 30) {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve()
    }, value)
  })
}
