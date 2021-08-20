<template>
  
<p>
  <button @click="add">count: {{countRef}}</button>
</p>



</template>


<script>
import { ref } from 'vue'
  export default {
    // setup函数运行在所有生命周期钩子函数之前
    setup() {
      // this是指向undefined
      // 使用ref包着这个数据,就具有响应式了
      // 此处有bug
      let countRef = ref(1);
      const add = ()=>{
        countRef.value++
      }
      console.log(countRef);
      // setup中, count是一个对象
      // 实例代理中, count是一个count.value  number类型

      // 返回出去,才能挂载到组件实例上
      return {
        countRef,
        add
      }
    }
  }
</script>

<style>

</style>
