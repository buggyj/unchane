/*\
title: $:/plugins/bj/unchane/css.js
type: application/javascript
module-type: macro



\*/
  exports.importcss = function(url) {
    // Check if the stylesheet is already loaded
    if (document.head.querySelector(`link[href="${url}"]`)) {
        console.log(`Stylesheet already loaded: ${url}`);
        return;
    }
	var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}