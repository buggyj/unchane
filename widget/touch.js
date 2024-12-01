/*\
title: $:/bj/modules/macros/touch.js
type: application/javascript
module-type: macro



\*/
(function(){

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    
    /*
    Information about this macro
    */
    
    exports.name = "bj-touch";
    
    exports.params = [
        {name: "title"},{name: "init"}
    ];
    
    /*
    Run the macro
    */
    exports.run = function(title,init) {
    
        if (!$tw.wiki.getTiddler(title)) $tw.wiki.setTextReference(title,init);
        return "";
    }
    })();
    