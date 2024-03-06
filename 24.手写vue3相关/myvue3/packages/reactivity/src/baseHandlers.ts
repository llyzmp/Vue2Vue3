import { isObject } from "@vue/shared";
import { reactive } from "./reactive";

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
  // receiver是proxy本身
  get(target, key, receiver) {
    console.log(`访问了${key as string}属性`);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 当访问对象中存在函数的情况时，函数内访问了对象中的属性，需要这样映射处理
    let result =  Reflect.get(target, key, receiver)
    // 获取对象属性的值，如果还是对象，就进一步做响应式处理
    if(isObject(result)) {
      return reactive(result)
    }
    return result
  },
  set(target, key, newValue, receiver) {
    return Reflect.set(target, key, newValue, receiver)
  }  
}