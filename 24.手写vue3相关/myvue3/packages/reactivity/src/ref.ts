import { isArray } from "@vue/shared"
import { activeEffect, trackEffects, triggerEffects } from "./effect"
import { toReactive } from "./reactive"

class Refimpl {
  public _rawValue
  public _value
  public dep = new Set()
  constructor(value) {
    this._rawValue = value
    this._value = toReactive(value)
  }
  get value() {
    // 收集依赖
    if(activeEffect) {
      trackEffects(this.dep)
    }
    return this._value
  }
  set value(newValue) {
    if (newValue !== this._rawValue) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      triggerEffects(this.dep)
    }
  }
}

// 对普通类型值处理，使其变成响应式
export function ref(value) {
  return new Refimpl(value)
}

class ObjectRefImpl {
  constructor(public object, public key) {

  }
  get value() {
    return this.object[this.key]
  }
  set value(newValue) {
    this.object[this.key] = newValue
  }
}

// 使代理对象解构出来的值，依赖具有响应式
export function toRef(object, key) {
  return new ObjectRefImpl(object, key)
}

// 
export function toRefs (object) {
  let ret = isArray(object) ? new Array(object.length) : {}
  for(let key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}