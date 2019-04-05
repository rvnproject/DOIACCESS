import ext from "./ext";

function internationalize() {
    /*
    ** Update popup content with localized data
    */
    console.log('testi');
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++) {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
            return v1 ? ext.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH) {
            obj.innerHTML = valNewH;
        }
    }
}
module.exports = internationalize;