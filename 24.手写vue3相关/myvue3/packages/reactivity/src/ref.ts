import { activeEffect } from "./effect"
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
      const shouldTrack = !this.dep.has(activeEffect)
      if(shouldTrack) {
        //  相互收集
        this.dep.add(activeEffect)
        activeEffect.deps.push(this.dep)
      }
    }
    return this._value
  }
  set value(newValue) {
    if (newValue !== this._rawValue) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      // 改变引用关系
      const effects: any = new Set(this.dep)
      effects.forEach(effect => {
        if(effect !== activeEffect) {
          if(effect.scheduler) {
            effect.scheduler()
          } else {
            effect.run()
          }
        }
      })
    }
  }
}

// 对普通类型值处理，使其变成响应式
export function ref(value) {
  return new Refimpl(value)
}