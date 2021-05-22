<template>
  <p>
    <span style="color:red" v-if="rerender">rerender:{{ rerender }}</span>
    {{ comment.username }}:
    {{ comment.content }}
  </p>
</template>

<script>
export default {
  props: {
    comment: Object, // 评论
  },
  data() {
    return {
      rerender: 0, // 组件重渲染的次数
    };
  },
  beforeUpdate() {
    this.rerender++; // 组件重渲染时+1
  },
};
</script>

<style></style>
