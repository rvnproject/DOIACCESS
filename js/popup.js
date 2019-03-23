function get_base_url_content() {
	/*
	** Get base_url field content and store it as baseUrl. The base_url field is the URL
	**  get to build the DOI URL
	** For example, www.sci-hub.tw is a valid base_url because of the DOI URL build:
	**  www.sci-hub.tw/Here_is_the_DOI
	*/

	// The base_url field content must be a valid url, there is no verification about that
	chrome.storage.sync.set({ "baseUrl": document.getElementById("base_url").value });
}

function set_base_url_content() {
	/*
	** Set the base_url field content with the baseUrl stored value
	*/

	chrome.storage.sync.get("baseUrl", function(items) {
		document.getElementById("base_url").value = (items.baseUrl == undefined ? "" : items.baseUrl)
	});
}

function set_current_url_info() {
	/*
	** Set the currentPageBaseUrl on the current_page_base_url field wich is the URL.origin and
	**  set the url_activation with its corresponding stored value 
	*/

	// Find the current chrome tab 
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		current_url = new URL(tabs[0].url);
		document.getElementById("current_page_base_url").textContent = current_url.origin;
		document.getElementById("current_page_base_url").title = current_url.origin;

	    chrome.storage.sync.set({ "currentPageBaseUrl": current_url.origin }, function() {
	    	// Set the url_activation switch to the current page state stored position
			set_url_activation();
		});
	});
}

function set_url_activation() {
	/*
	** Set the url_activation with its corresponding baseUrlState
	*/

	chrome.storage.sync.get("currentPageBaseUrl", function(items) {
		current_page_base_url = items.currentPageBaseUrl;

		chrome.storage.sync.get("baseUrlState", function(items) {
			// If the baseUrlState of the current_page_base_url is undefined or false, set the
			//  url_activation switch (checked attribute) on false else, set the switch on true
			document.getElementById("url_activation").checked = (!items.baseUrlState[current_page_base_url] ? false : true);
		});
	});
}

function update_url_activation() {
	/*
	** Update the baseUrlState of the currentPageBaseUrl with the state of the url_activation switch state
	*/

	chrome.storage.sync.get("currentPageBaseUrl", function(items) {
		current_page_base_url = items.currentPageBaseUrl;

		chrome.storage.sync.get("baseUrlState", function(items) {
			items.baseUrlState[current_page_base_url] = document.getElementById("url_activation").checked;
			chrome.storage.sync.set({ "baseUrlState": items.baseUrlState });

			// Message for the update of the badge
			chrome.runtime.sendMessage({updateBaseUrlState: true});
		});
	});
}

function reload_page() {
	/*
	** Reload the current page
	*/

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	chrome.tabs.reload(tabs[0].id);
	});
}

function open_options_page() {
	/*
	** Open in a new tab the options page
	*/

	chrome.runtime.openOptionsPage();
}

function add_listeners() {
	document.getElementById("url_activation").addEventListener("change", update_url_activation);	
	document.getElementById("reload_button").addEventListener("click", reload_page);
	document.getElementById("raven_parameters").addEventListener("click", open_options_page);
	
	// Add get_base_url_content event on each modification of the base_url field to be sure to get the user input base_url
	//  stored as BaseUrl
	document.getElementById("base_url").addEventListener("change", get_base_url_content);
	document.getElementById("base_url").addEventListener("keyup", get_base_url_content);
	document.getElementById("base_url").addEventListener("paste", get_base_url_content);
}

window.onload = function() {
	// Apply in the base_url field the baseUrl stored value
	set_base_url_content();
	// Apply in the current_base_url field the currentBaseUrl stored value and set the switch (url_activation field)
	//  on its stored position (baseUrlState value)
	set_current_url_info();

	// Add all listeners
	add_listeners();
}