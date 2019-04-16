/* eslint no-undef: 0 */

import ext from "./ext";

function internationalize() {
    /*
    ** Update popup content with
    */
    var elements = document.getElementsByClassName('i18n-content');
    for (var i = 0; i < elements.length; ++i) {
        var elementContent = elements[i].innerHTML.toString();
        var i18nContent = elementContent.replace(/__MSG_(\w+)__/g, function(match, v1) {
            return v1 ? ext.i18n.getMessage(v1) : "";
        });
        elements[i].innerHTML = i18nContent;
    }
}
module.exports = internationalize;
