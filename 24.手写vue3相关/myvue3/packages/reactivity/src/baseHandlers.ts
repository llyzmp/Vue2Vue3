import { isObject } from "@vue/shared";
import { reactive } from "./reactive";
import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  RAW = '__V_RAW'
}

export const mutableHandlers = {
  // receiver是proxy本身
  get(target, key, receiver) {
    console.log(`访问了${key as string}属性`);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    } else if(key === ReactiveFlags.RAW) {
      return target
    }
    // 收集依赖： 记录谁使用了当前属性值
    track(target, 'get', key) // 由哪个对象的什么属性来收集依赖，activeEffect
    // 当访问对象中存在函数的情况时，函数内访问了对象中的属性，需要这样映射处理
    let result =  Reflect.get(target, key, receiver)
    // 获取对象属性的值，如果还是对象，就进一步做响应式处理
    if(isObject(result)) {
      return reactive(result)
    }
    return result
  },
  set(target, key, newValue, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, newValue, receiver)
    // 触发更新, 让使用当前属性的代码再重新执行一遍
    trigger(target, 'set', key, newValue, oldValue)
    return result
  }  
}