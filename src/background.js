/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import store from './store';
import { isAppActivatedHere, updateCurrentState } from './utils/app-status';
import { updateBadge } from './utils/badges';

global.browser = require('webextension-polyfill');

store.dispatch('setIsVuexLoaded', { is_vuex_loaded: true });

async function runContentScript(tabId) {
  store.dispatch('setErrorMessage', {error_message: null})  
  if (isAppActivatedHere() === true) {
    try {
      await browser.tabs.executeScript(tabId, {
        file: 'replace-in-page.js',
      });
    } catch (err) {
      store.dispatch('setErrorMessage', {error_message: err.message})
    }
  }
}

// When tab is active
browser.tabs.onActivated.addListener(async tabInfo => {
  await updateCurrentState();
  await runContentScript(tabInfo.id);
  updateBadge();
});

// When tabs are updated
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active === true) {
    await updateCurrentState(tab);
	  updateBadge();
  }
  if (changeInfo.status === 'complete') {
  	store.dispatch('setDoiCountByTabId', {tab_id: store.getters.currentTabId, doi_count: 0})
    await runContentScript(tabId)
  }
});

browser.runtime.onMessage.addListener(async request => {
  if (request.switchState === true) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    await runContentScript(tabs[0].id);
	  updateBadge();
  } else if (request.doiHighlightColor === true) {
  	return
  }
});

updateCurrentState().then(() => {
  // We need a delay because the trick of the isVuexLoaded does not work here
  //  and I don't have a better way to handle the non-loaded store.
  setTimeout(() => {
    updateBadge();
  }, 500);
});
