import ext from "./utils/ext";

function replaceElementContent(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceElementContent(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                if (node.textContent.match(pattern) === null) {
                    break;
                }
                node.parentElement.innerHTML = node.parentElement.innerHTML.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                replaceElementContent(node, pattern, replacement);
        }
    }
}

function replace_dois(base_url) {
    /*
    ** Replace DOI numbers by clickable links to their articles on the base_url site and links to
    **  doi.org into links to the base_url site article.
    */
    if (base_url != "" && base_url != undefined) {
        // Search for DOI (ISO 263242) on the page  
        var DOINumberRegex = /([\s\>])(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+)\b/g;
        // Search Link for doi.org
        var DOIOrgRegex = /(((?:https?\:\/\/)|(?:\/\/))doi\.org\/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>])\S)+))\b/g;

        // If DOI are find on the page, add a clickable link to base_url on the DOI on the page
        replaceElementContent(
            document.body,
            DOINumberRegex,
            '$1<a target="_blank" rel="noopener noreferrer" href="' + base_url + '/$2">$2</a>'
        );
        // If doi.org link are find on the page, change them to base_url links
        replaceElementContent(
            document.body,
            DOIOrgRegex,
            base_url + '/$3'
        );
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
