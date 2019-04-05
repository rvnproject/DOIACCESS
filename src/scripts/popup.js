import ext from "./utils/ext";
import internationalize from "./utils/custom_i18n"


function get_base_url_content() {
  /*
  ** Get base_url field content and store it as baseUrl. The base_url field is the URL
  **  get to build the DOI URL
  ** For example, www.sci-hub.tw is a valid base_url because of the DOI URL build:
  **  www.sci-hub.tw/Here_is_the_DOI
  */

  // The base_url field content must be a valid url, there is no verification about that
  ext.storage.sync.set({ "baseUrl": document.getElementById("base_url").value });
}

function set_base_url_content() {
  /*
  ** Set the base_url field content with the baseUrl stored value
  */

  ext.storage.sync.get("baseUrl", function(items) {
    document.getElementById("base_url").value = (items.baseUrl == undefined ? "" : items.baseUrl)
  });
}

function set_current_url_info() {
  /*
  ** Set the currentPageBaseUrl on the current_page_base_url field wich is the URL.origin and
  **  set the url_activation with its corresponding stored value 
  */

  // Find the current browser tab 
  ext.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var current_url = new URL(tabs[0].url);
    document.getElementById("current_page_base_url").textContent = current_url.origin;
    document.getElementById("current_page_base_url").title = current_url.origin;

    ext.storage.sync.set({ "currentPageBaseUrl": current_url.origin }, function() {
      // Set the url_activation switch to the current page state stored position
    set_url_activation();
    });
  });
}

function set_url_activation() {
  /*
  ** Set the url_activation with its corresponding baseUrlState
  */

  ext.storage.sync.get("currentPageBaseUrl", function(items) {
    var current_page_base_url = items.currentPageBaseUrl;

    ext.storage.sync.get("baseUrlState", function(items) {
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

  ext.storage.sync.get("currentPageBaseUrl", function(items) {
    var current_page_base_url = items.currentPageBaseUrl;

    ext.storage.sync.get("baseUrlState", function(items) {
      items.baseUrlState[current_page_base_url] = document.getElementById("url_activation").checked;
      ext.storage.sync.set({ "baseUrlState": items.baseUrlState });

      // Message for the update of the badge
      ext.runtime.sendMessage({updateBaseUrlState: true});
    });
  });
}

function reload_page() {
  /*
  ** Reload the current page
  */

  ext.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      ext.tabs.reload(tabs[0].id);
  });
}

function open_options_page() {
  /*
  ** Open in a new tab the options page
  */

  ext.runtime.openOptionsPage();
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
  // NEED TO BE FIRST ACTION ON LOAD
  internationalize();
  
  // Apply in the base_url field the baseUrl stored value
  set_base_url_content();
  // Apply in the current_base_url field the currentBaseUrl stored value and set the switch (url_activation field)
  //  on its stored position (baseUrlState value)
  set_current_url_info();

  // Add all listeners
  add_listeners();
}