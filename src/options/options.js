import Vue from 'vue';
import App from './App';
import BootstrapVue from 'bootstrap-vue';
import store from '../store';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

Vue.use(BootstrapVue);
// Vue.use(vmodal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
