import Vue from 'vue';
import App from './App.vue';
import router from './router';

import './assets/icons'

Vue.config.productionTip = false;

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-undef
  require('./vconsole');
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
