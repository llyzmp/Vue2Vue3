// 判断一个数据是否为对象

export function isObject(value) {
  return typeof value === 'object' && value !== null
}