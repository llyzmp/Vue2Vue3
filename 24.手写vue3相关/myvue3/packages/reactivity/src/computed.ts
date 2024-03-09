import { isFunction } from "@vue/shared"
import { ReactiveEffect, activeEffect, trackEffects, triggerEffects } from "./effect"

class ComputerRefImpl {
  public _value
  public effect
  public _dirty = true
  public dep = new Set()
  constructor(getter, public setter) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffects(this.dep)
      }
    })
  }
  get value() {
    if (this._dirty) {
      this._value = this.effect.run()
    }
    if (activeEffect) {
      trackEffects(this.dep)
    }
    return this._value
  }
  set value(newValue) {
    this.setter(newValue)
  }
}


/**
  * 
  * @param getterOrOptions 参数可能是函数，也可能是getter和setter对象
  * 
  */
export function computed(getterOrOptions) {
  let getter
  let setter
  const onlyGetter = isFunction(getterOrOptions)
  // 如果是函数，其实就是只有getter
  if(onlyGetter) {
    getter = getterOrOptions
    setter = () => { console.warn('没有set方法');}
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputerRefImpl(getter, setter)

}