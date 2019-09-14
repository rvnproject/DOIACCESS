import store from '../store';

export function isAppActivatedHere() {
  if (store.getters.baseUrl !== null) {
    if (store.getters.lockedUrlState !== null) {
      return store.getters.lockedUrlState;
    }
    if (store.getters.currentUrl in store.getters.stateByUrl) {
      return store.getters.stateByUrl[store.getters.currentUrl];
    }
  }
  return false;
}

export async function updateCurrentState(activeTab) {
  if (activeTab === undefined) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    activeTab = tabs[0];
  }
  store.dispatch('setCurrentUrl', { current_url: new URL(activeTab.url).hostname });
  store.dispatch('setCurrentTabId', { current_tab_id: `${activeTab.windowId}-${activeTab.id}` });
}
