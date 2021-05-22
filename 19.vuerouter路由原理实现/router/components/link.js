// router-link组件内容

// 关于的地方就是默认插槽
// <router-link to="/about"> 关于</router-link>
export default {
  // link有两个属性to和tag自定义标签
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      // 默认为a标签
      default: "a",
    },
  },
  methods: {
    // 传入自定义标签时需要处理
    handleClick() {
      const mode = this.$router.mode;
      if(mode === 'hash') {
        location.hash = this.to;
      }else {
        history.pushState(null,null,this.to);
        this.$router.history.current.path = this.to;
      }
    },
  },
  render(h) {
    const to = this.to;
    const data = {};
    const mode = this.$router.mode;


    // 为默认a标签时需要href属性
    if(this.tag === 'a' && mode === 'hash') {
      data.attrs = { href: `#${to}` };
    }else {
      // tag自定义时,需要点击事件处理
      data.on = { click: this.handleClick };
    }

    // 将第二个参数抽离出来方便维护
    return h(
      this.tag,
      data,
      // 默认插槽,代指ruoter-link中间的文本
      this.$slots.default
    );
  },
};
