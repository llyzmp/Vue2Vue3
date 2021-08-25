// import { createApp } from 'vue'
// import App from './App.vue'
// createApp(App).mount('#app')


import { reactive , readonly, ref} from 'vue'

const state = reactive({a: 1, b: 2});

window.state = state;

const imState = readonly({a:1, b:5})
window.imState = imState

const count = ref(1);
window.count = count;