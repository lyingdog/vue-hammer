import Vue from 'vue'
import App from './App.vue'
import VueHammer from "yyh-vue-hammer";

const hammer = new VueHammer()
Vue.use(hammer, {
  bubbles: false
})
Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
}).$mount('#app')
