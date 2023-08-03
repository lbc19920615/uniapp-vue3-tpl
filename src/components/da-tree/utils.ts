/** 未选 */
export const unCheckedStatus = 0
/** 半选 */
export const halfCheckedStatus = 1
/** 选中 */
export const isCheckedStatus = 2

/**
 * 深拷贝内容
 * @param originData 拷贝对象
 * @author crlang(https://crlang.com)
 */
export function deepClone(originData) {
  const type = Object.prototype.toString.call(originData)
  let data
  if (type === '[object Array]') {
    data = []
    for (let i = 0; i < originData.length; i++) {
      data.push(deepClone(originData[i]))
    }
  } else if (type === '[object Object]') {
    data = {}
    for (const prop in originData) {
      // eslint-disable-next-line no-prototype-builtins
      if (originData.hasOwnProperty(prop)) { // 非继承属性
        data[prop] = deepClone(originData[prop])
      }
    }
  } else {
    data = originData
  }
  return data
}

/**
 * 获取所有指定的节点
 * @param type
 * @param value
 * @author crlang(https://crlang.com)
 */
export function getAllNodes(list, type, value, packDisabledkey = true) {
  if (!list || list.length === 0) {
    return []
  }

  const res = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item[type] === value) {
      if ((packDisabledkey && item.disabled) || !item.disabled) {
        res.push(item)
      }
    }
  }

  return res
}

/**
 * 获取所有指定的key值
 * @param type
 * @param value
 * @author crlang(https://crlang.com)
 */
export function getAllNodeKeys(list, type, value, packDisabledkey = true) {
  if (!list || list.length === 0) {
    return []
  }

  const res = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item[type] === value) {
      if ((packDisabledkey && item.disabled) || !item.disabled) {
        res.push(item.key)
      }
    }
  }

  return res
}
