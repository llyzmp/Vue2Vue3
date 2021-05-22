<template>
  <div id="app">
    <button @click="show = !show">toggle</button>
    <h1 v-if="show" @click="handleClick">hello vue</h1>
  </div>
</template>

<script>
// vue组件的配置对象
export default {
  data() {
    return {
      show: true,
    };
  },
  methods: {
    handleClick() {
      console.log('click!');
    },
  },
  render(h) {
    return h('div', { attrs: { id: 'app' } }, [
      h(
        'button',
        {
          on: {
            click: () => {
              this.show = !this.show;
            },
          },
        },
        'toggle'
      ),
      this.show
        ? h('h1', { on: { click: this.handleClick } }, 'hello vue')
        : undefined,
    ]);
  },
};
</script>
