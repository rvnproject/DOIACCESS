import * as types from './mutation-types';

export const setBaseUrlByIdType = ({ commit }, payload) => {
  commit(types.UPDATE_BASE_URL_BY_ID_TYPE, payload);
};

export const setCurrentUrl = ({ commit }, payload) => {
  commit(types.UPDATE_CURRENT_URL, payload);
};

export const setCurrentTabId = ({ commit }, payload) => {
  commit(types.UPDATE_CURRENT_TAB_ID, payload);
};

export const setStateByUrl = ({ commit }, payload) => {
  commit(types.UPDATE_STATE_BY_URL, payload);
};

export const setLockedUrlState = ({ commit }, payload) => {
  commit(types.UPDATE_LOCKED_URL_STATE, payload);
};

export const setIsVuexLoaded = ({ commit }, payload) => {
  commit(types.UPDATE_IS_VUEX_LOADED, payload);
};

export const setDoiCountByTabId = ({ commit }, payload) => {
  commit(types.UPDATE_DOI_COUNT_BY_TAB_ID, payload);
};

export const setErrorMessage = ({ commit }, payload) => {
  commit(types.UPDATE_ERROR_MESSAGE, payload);
};

export const setIsHighlighted = ({ commit }, payload) => {
  commit(types.UPDATE_IS_HIGHLIGHTED, payload);
};

export const setHighlightColor = ({ commit }, payload) => {
  commit(types.UPDATE_HIGHLIGHT_COLOR, payload);
};

export const setFontColor = ({ commit }, payload) => {
  commit(types.UPDATE_FONT_COLOR, payload);
};