import Vue from 'vue';
import Clipboard from 'v-clipboard';

import router from './router';
import store from './store';
import App from './App';

Vue.config.productionTip = false;
Vue.use(Clipboard);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
