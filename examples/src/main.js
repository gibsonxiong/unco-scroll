import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import VConsole from "vconsole";
// new VConsole();


Vue.config.productionTip = false;

// 引入vant ui
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
