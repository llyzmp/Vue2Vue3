// 判断一个数据是否为对象

export function isObject(value) {
  return typeof value === 'object' && value !== null
}

export const isFunction = (value) => {
  return typeof value === 'function'
}