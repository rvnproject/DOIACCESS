import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    base_url_by_id_type: {'doi': null, 'isbn': null},
    current_url: null,
    current_tab_id: null,
    doi_count_by_tab_id: {},
    state_by_url: {},
    locked_url_state: null, // null = unset; true = lock to true; false = lock to false
    is_vuex_loaded: false,
    error_message: null,
    is_highlighted: false,
    highlight_color: '#ffaa00',
    font_color: 'black'
  },
  getters,
  mutations,
  actions,
  plugins: [
    VuexWebExtensions({
      persistentStates: ['base_url_by_id_type', 'url_enable', 'state_by_url', 'locked_url_state', 'is_highlighted', 'highlight_color', 'font_color'],
    }),
  ],
});
