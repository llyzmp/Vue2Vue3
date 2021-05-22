<template>
  <div id="app">
    <button @click="show = !show">横跳</button>
    <h1 v-show="show">来回横跳的标题</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
};
</script>
