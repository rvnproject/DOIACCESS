import ext from "./utils/ext";

window.onload = function() {
  // Get the stored current page base url
    ext.storage.sync.get("currentPageBaseUrl", function(items) {    
      var current_page_base_url = items.currentPageBaseUrl;
      ext.storage.sync.get("baseUrlState", function(items) {
        // If the current page is activated for RavenDOI
        if (items.baseUrlState[current_page_base_url] == true) {
        ext.storage.sync.get("baseUrl", function(items) {
            if (items.baseUrl != "") {
            // Search for DOI (ISO 263242) on the page  
                var DOIRegex = /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+)\b/g;
              // If DOI are find on the page, add a clickable link on the DOI on the page
            if (document.body.innerHTML.match(DOIRegex)) {
                document.body.innerHTML = document.body.innerHTML.replace(DOIRegex, '<a target="_blank" rel="noopener noreferrer" href="' + items.baseUrl + '/$1">$1</a>');
              }
            }
        });
      };
    });
  });
}