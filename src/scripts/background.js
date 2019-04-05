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

ext.tabs.onActivated.addListener(function (activeInfo) {
	ext.tabs.get(activeInfo.tabId, function(tab) {
    	var current_url = new URL(tab.url);
	    ext.storage.sync.set({ "currentPageBaseUrl": current_url.origin });	
		update_badge();
  	});
});

ext.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.active == true) {
		var current_url = new URL(tab.url);
	    ext.storage.sync.set({ "currentPageBaseUrl": current_url.origin });	
		update_badge();
	}
});

ext.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.updateBaseUrlState) {
		console.log(update_badge);
		update_badge();
	}
});
