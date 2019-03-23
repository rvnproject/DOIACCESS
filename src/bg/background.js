chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.get("baseUrlState", function(items) {
		if (items.baseUrlState == undefined) {
			chrome.storage.sync.set({ "baseUrlState": {} })
		}
		update_badge();
	});
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		console.log(tab);
    	current_url = new URL(tab.url);
	    chrome.storage.sync.set({ "currentPageBaseUrl": current_url.origin });	
		update_badge();
  	});
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	console.log(tab);
	if (tab.active == true) {
		current_url = new URL(tab.url);
	    chrome.storage.sync.set({ "currentPageBaseUrl": current_url.origin });	
		update_badge();
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.updateBaseUrlState) {
		update_badge();
	}
});
