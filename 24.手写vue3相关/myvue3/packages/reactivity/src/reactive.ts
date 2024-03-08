import { isObject } from "@vue/shared";
import { ReactiveFlags, mutableHandlers } from './baseHandlers'

// 3.用于缓存，{ 原始对象： 代理对象 }
const reactiveMap = new WeakMap()
export function reactive(target) {
  // 1. 如果不是对象，直接返回，不做处理
  if(!isObject) return
  // 5. 如果缓存中有，直接返回缓存中的内容
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) return existingProxy
  // 6. 如果target已经是代理对象了，就原封不动的返回
  if (target[ReactiveFlags.IS_REACTIVE]) return target
  // 2. 为目标对象生成一个代理对象
  const proxy = new Proxy(target, mutableHandlers)
  // 4.把原始对象和代理对象成对缓存
  reactiveMap.set(target, proxy)
  // 返回代理对象
  return proxy
}


// 根据代理对象，获取其原始对象
export function toRaw(proxy) {
  return proxy && proxy[ReactiveFlags.RAW]
}

// 把数据转换为reactive
export function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}

