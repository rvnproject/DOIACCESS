import ext from "./utils/ext";

function replace_dois(base_url) {
    /*
    ** Replace DOI numbers by clickable links to their articles on the base_url site and links to
    **  doi.org into links to the base_url site article.
    */

    if (base_url != "" && base_url != undefined) {
        // Search for DOI (ISO 263242) on the page  
        var DOINumberRegex = /([^\/])(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+)\b/g;
        // Search Link for doi.org
        var DOIOrgRegex = /(\/\/doi\.org\/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+))\b/g;

        // If DOI are find on the page, add a clickable link to base_url on the DOI on the page
        if (document.body.innerHTML.match(DOINumberRegex)) {
            document.body.innerHTML = document.body.innerHTML.replace(
                DOINumberRegex,
                '$1<a target="_blank" rel="noopener noreferrer" href="' + base_url + '/$2">$2</a>'
            );
        }
        // If doi.org link are find on the page, change them to base_url links
        if (document.body.innerHTML.match(DOIOrgRegex)) {
            document.body.innerHTML = document.body.innerHTML.replace(
                DOIOrgRegex,
                base_url + '/$2'
            );
        }
    }
}

window.onload = function() {
    // Get the stored current page base url
    ext.storage.sync.get("currentPageBaseUrl", function(items) {    
        var current_page_base_url = items.currentPageBaseUrl;
        ext.storage.sync.get("baseUrlState", function(items) {
            // If the current page is activated for RavenDOI
            if (items.baseUrlState[current_page_base_url] === true) {
                ext.storage.sync.get("baseUrl", function(items) {
                    replace_dois(items.baseUrl)
                });
            };
        });
    });
}
