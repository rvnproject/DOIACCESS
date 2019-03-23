function update_badge() {
	/*
	** Update the extension icon badge with ON/OFF if the baseUrlState is True/False for the current page url
	*/

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		console.log(tabs);
		current_url = new URL(tabs[0].url);	
		chrome.storage.sync.get("baseUrlState", function(items) {
			if (!items.baseUrlState[current_url.origin]) {
				chrome.browserAction.setBadgeText({text: "OFF"});
				chrome.browserAction.setBadgeBackgroundColor({color: "#ff6961"})
			}
			else {
				chrome.browserAction.setBadgeText({text: "ON"});
				chrome.browserAction.setBadgeBackgroundColor({color: "#bada55"})
			}
		});
	});	
}