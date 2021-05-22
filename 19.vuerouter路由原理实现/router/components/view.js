
// router-view 组件内容
export default {
  // 变为函数式组件
  functional: true,
  render(h,context) {
    // context可以拿到this实例
    const routeMap = context.parent.$router.routeMap;
    const path = context.parent.$route.path;
    return h(routeMap[path]);
  },
}