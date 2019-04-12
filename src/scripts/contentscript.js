import ext from "./utils/ext";

window.onload = function() {
    // Get the stored current page base url
    ext.storage.sync.get("currentPageBaseUrl", function(items) {    
        var current_page_base_url = items.currentPageBaseUrl;
        ext.storage.sync.get("baseUrlState", function(items) {
            // If the current page is activated for RavenDOI
            if (items.baseUrlState[current_page_base_url] == true) {
                ext.storage.sync.get("baseUrl", function(items) {
                    if (items.baseUrl != "" && items.baseUrl != undefined) {
                        // Search for DOI (ISO 263242) on the page  
                        var DOINumberRegex = /\b((?<!\/)10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+)\b/g;
                        // Search Link for doi.org
                        var DOIOrgRegex = /\b(http(?:s)?\:\/\/doi\.org\/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+))\b/g
                        
                        // If DOI are find on the page, add a clickable link on the DOI on the page
                        if (document.body.innerHTML.match(DOINumberRegex)) {
                            document.body.innerHTML = document.body.innerHTML.replace(DOINumberRegex, '<a target="_blank" rel="noopener noreferrer" href="' + items.baseUrl + '/$1">$1</a>');
                        }
                        // If doi.org link are find on the page, change them to sci-hub links
                        if (document.body.innerHTML.match(DOIOrgRegex)) {
                            document.body.innerHTML = document.body.innerHTML.replace(DOIOrgRegex, items.baseUrl + '/$2');
                        }
                    }
                });
            };
        });
    });
}