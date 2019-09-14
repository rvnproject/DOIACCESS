import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import ToggleButton from 'vue-js-toggle-button';
import PrettyCheckbox from 'pretty-checkbox-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import router from './router';
import store from '../store';
import App from './App';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faLock);
library.add(faLockOpen);

Vue.use(BootstrapVue);
Vue.use(ToggleButton);
Vue.use(PrettyCheckbox);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
