import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

function traverse(value, set = new Set()) {
  if(!isObject(value)) return value
  if(set.has(value)) return value
  set.add(value)
  for(let key in value) {
    traverse(value[key], set)
  }
  return value
}


export function watch(source, cb) {
  let getter
  if(isFunction(source)) {
    getter = source
  } else if (isReactive(source)) {
    getter = () => traverse(source)
  }
  let oldValue
  const job = () => {
    let newValue = effect.run()
    cb(newValue, oldValue)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(getter, job)
  oldValue = effect.run()
}