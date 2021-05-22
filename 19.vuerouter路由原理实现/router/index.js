
import install from './install'
import History from './history'
// 定义一个VueRouter类
class VueRouter {
  constructor(options) {
    // 传入的路由 routes是一个路由数组[{path: '/xxx',component: 'xxxx'}]
    // 例如const router = new VueRouter({routes})
    this.routes = this.createRouteMap(options.routes || []);
    this.history = new History();
    this.mode = options.mode || 'hash';
    this.init();
  }

  // 把routes数组处理为{'/xxx':xxxx}
  createRouteMap(routes) {
    const routeMap = {}
    routes.forEach(ele => {
      routeMap[ele.path] = ele.component;
    })
    return routeMap;
  }

  init() {
    if(this.mode === 'hash') {
      // 判断页面hash是否存在,不存在默认设为/
      location.hash ? '' : location.hash = '/'
      // 监听页面加载完毕
      document.addEventListener('DOMContentLoaded',() => {
        // 拿到hash路径
        const path = location.hash.slice(1);
        // 赋值给
        this.history.current.path = path;
      })
  
      // 监听hash路径变化重新赋值
      window.addEventListener('hashchange',() => {
        // 拿到hash路径
        const path = location.hash.slice(1);
        // 赋值给
        this.history.current.path = path;
      })
    }else {
      document.addEventListener('DOMConentLoaded', ()=> {
        this.history.current.path = location.pathname;
      })
      // 监听hash路径变化重新赋值
      window.addEventListener('popstate',() => {
        this.history.current.path = location.pathname;
      })
    }

  }
}

// vue中使用VueRouter必须使用use方法,  必须体统一个install方法
VueRouter.install = install


// 导出VueRouter
export default VueRouter