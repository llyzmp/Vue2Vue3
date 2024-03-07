export let activeEffect = undefined

class ReactiveEffect {
  public parent = null
  public deps = []
  public active = true
  constructor(public fn, public scheduler) {

  }
  run() {
    try {
      if(!this.active) return this.fn()
      this.parent = activeEffect
      activeEffect = this
      // 收集依赖之前先把依赖关系清空
      cleanupEffect(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
  stop() {
    if(this.active) {
      this.active = false
      cleanupEffect(this)
    }
  }
}



export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // // 立即调用一次
  // _effect.run()
  // 返回函数，自定义随时调用
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

/**
 * 
 * const depsMap = new Map() 原始对象
 * {
 *  属性1: new Set()
 *  属性2: new Set()
 *  ...
 *  属性n: new Set()
 * }
 * 
 * const targetMap = new WeakMap()
 * {
 *  原始对象1: new Map()
 *  原始对象2: new Map()
 *  ...
 *  原始对象n: new Map()
 * }
 */

const targetMap = new WeakMap()
export function track(target, type, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if(!dep) {
      dep  = new Set()
      depsMap.set(key, dep)
    }

    const shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
      dep.add(activeEffect)
      activeEffect.deps.push(dep)
    }
  }
}
// 清除依赖绑定关系
function cleanupEffect(effect) {
  const { deps } = effect
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}
export function trigger(target, type, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if(!target) return
  let effects = depsMap.get(key)
  if (effects) {
    effects = new Set(effects)
    effects.forEach(effect => {
      if (effect !== activeEffect) {
        if (effect.scheduler) {
          effect.scheduler()
        } else {
          effect.run()
        }
      }
    });
  }
}