import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import electron from 'electron'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$electron = electron

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
