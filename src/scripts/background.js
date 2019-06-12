import ext from "./utils/ext";
import update_badge from "./utils/badges";


ext.runtime.onInstalled.addListener(function() {
  ext.storage.sync.get("baseUrlState", function(items) {
    if (items.baseUrlState == undefined) {
      ext.storage.sync.set({ "baseUrlState": {} })
    }
    update_badge();
  });
});

// When tabs is active, save the base url of the current tab
ext.tabs.onActivated.addListener(function (activeInfo) {
  ext.tabs.get(activeInfo.tabId, function(tab) {
      var current_url = new URL(tab.url);
      ext.storage.sync.set({ "currentPageBaseUrl": current_url.origin });
    update_badge();
    });
});

// When tabs is update, save the base url of the current tab
ext.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.active === true) {
    var current_url = new URL(tab.url);
      ext.storage.sync.set({ "currentPageBaseUrl": current_url.origin });
    update_badge();
  }
});

ext.runtime.onMessage.addListener(function(message) {
  if (message.updateBaseUrlState) {
    update_badge();
  }
});

// Need improvement. See you in v1.1 !
// ext.webNavigation.onErrorOccurred.addListener(function(details) {
//   console.log(details);
//   if (details.error == "net::ERR_NAME_NOT_RESOLVED") {
//     var current_url = new URL(details.url);
//     chrome.runtime.sendMessage({dnsError: true});
//   }
// });
