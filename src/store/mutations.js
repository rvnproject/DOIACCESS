import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.UPDATE_BASE_URL_BY_ID_TYPE](state, payload) {
    Vue.set(state.base_url_by_id_type, payload.id_type, payload.base_url);
  },
  [types.UPDATE_CURRENT_URL](state, payload) {
    state.current_url = payload.current_url;
  },
  [types.UPDATE_CURRENT_TAB_ID](state, payload) {
    state.current_tab_id = payload.current_tab_id;
  },
  [types.UPDATE_STATE_BY_URL](state, payload) {
    Vue.set(state.state_by_url, payload.url, payload.enable);
  },
  [types.UPDATE_LOCKED_URL_STATE](state, payload) {
    state.locked_url_state = payload.locked_url_state;
  },
  [types.UPDATE_IS_VUEX_LOADED](state, payload) {
    state.is_vuex_loaded = payload.is_vuex_loaded;
  },
  [types.UPDATE_DOI_COUNT_BY_TAB_ID](state, payload) {
    Vue.set(state.doi_count_by_tab_id, payload.tab_id, payload.doi_count);
  },
  [types.UPDATE_ERROR_MESSAGE](state, payload) {
    state.error_message = payload.error_message;
  },
  [types.UPDATE_IS_HIGHLIGHTED](state, payload) {
    state.is_highlighted = payload.is_highlighted;
  },
  [types.UPDATE_HIGHLIGHT_COLOR](state, payload) {
    state.highlight_color = payload.highlight_color;
  },
  [types.UPDATE_FONT_COLOR](state, payload) {
    state.font_color = payload.font_color;
  },
};
