<template>
  <div id="app">
    <button @click="loadNormalDatas">load normal datas</button>
    <button @click="loadFrozenDatas">load frozen datas</button>
    <h1>normal datas count: {{ normalDatas.length }}</h1>
    <h1>freeze datas count: {{ freezeDatas.length }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      normalDatas: [], // 普通数组
      freezeDatas: [], // 将来会被冻结的数组
    };
  },
  methods: {
    // 加载普通数据
    loadNormalDatas() {
      this.normalDatas = this.getDatas();
      console.log('normalDatas', this.normalDatas);
    },
    // 加载冻结数据
    loadFrozenDatas() {
      this.freezeDatas = Object.freeze(this.getDatas());
      console.log('freezeDatas', this.freezeDatas);
    },
    getDatas() {
      const result = [];
      for (var i = 0; i < 1000000; i++) {
        result.push({
          id: i,
          name: `name${i}`,
          address: {
            city: `city${i}`,
            province: `province${i}`,
          },
        });
      }
      return result;
    },
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>
