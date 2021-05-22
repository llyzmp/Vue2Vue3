import Link from './components/link'
import View from './components/view'

export default function install(Vue) {
  Vue.mixin({
    beforeCreate() {
      // this 每个组件的实例
      // 只有根组件中有router
      if(this.$options.router) {
        this._router = this.$options.router;
        this._route = this._router.history.current;
        // Vue有一个方法,当值发生变化,页面重新渲染一遍
        Vue.util.defineReactive(this, '_route',this._route);
      }
    }
  })


  // $router方法
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      // 通过根实例拿到
      return this.$root._router
    },
  });

  // $route方法
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this.$root._route;
    },
  });

  // router-link组件
  Vue.component("router-link", Link);


  // router-view组件
  Vue.component("router-view", View);
}
