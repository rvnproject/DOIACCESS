/* eslint no-undef: 0 */

import ext from "./ext";

function update_badge() {
  /*
  ** Update the extension icon badge with ON/OFF if the baseUrlState is True/False for the current page url
  */
  ext.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    if (!tabs) {
      return;
    }
    var current_url = new URL(tabs[0].url);  
    ext.storage.sync.get("baseUrlState", function(items) {
      if (!items.baseUrlState[current_url.origin]) {
        ext.browserAction.setBadgeText({text: "OFF"});
        ext.browserAction.setBadgeBackgroundColor({color: "#ff6961"})
      }
      else {
        ext.browserAction.setBadgeText({text: "ON"});
        ext.browserAction.setBadgeBackgroundColor({color: "#bada55"})
      }
    });
  });
}
module.exports = update_badge;
