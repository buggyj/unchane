/*\
title: $:/plugins/bj/unchane/storeutils.js
type: application/javascript
module-type: library
\*/

exports.generateNewTitle = $tw.wiki.generateNewTitle.bind($tw.wiki);exports.stringifyList = $tw.utils.stringifyList.bind($tw.wiki);
exports.parseStringArray = $tw.utils.parseStringArray.bind($tw.wiki);
exports.Tiddler = $tw.Tiddler;
exports.tiddlerExists = $tw.wiki.tiddlerExists.bind($tw.wiki);
exports.deleteTiddler = $tw.wiki.deleteTiddler.bind($tw.wiki);
exports.getCreationFields = $tw.wiki.getCreationFields.bind($tw.wiki);
exports.getModificationFields = $tw.wiki.getModificationFields.bind($tw.wiki);
exports.getTiddlerData = $tw.wiki.getTiddlerData.bind($tw.wiki);
exports.setText = $tw.wiki.setText.bind($tw.wiki);
exports.getTiddler =function (title){
    const	retval=$tw.wiki.getTiddler.call($tw.wiki,title);
        //if (typeof retval === 'undefined') throw new Error("undefined from getTiddler")
    //console.log('getTiddler::',title)
    return retval; 
}

exports.parseJSONSafe =function(text,defaultJSON){
    const	retval=$tw.utils.parseJSONSafe.call($tw.utils,text,defaultJSON);
        //if (typeof retval === 'undefined') throw new Error("undefined from parseJSONSafe")
    //console.log('parseJSONSafe::',retval)
    return retval; 
}

exports.languageGetString =function (str){
    const	retval=$tw.language.getString.call($tw.language,str);
        //if (typeof retval === 'undefined') throw new Error("undefined from langstring")
    //console.log('languageGetString::',retval)
    return retval; 
}

exports.filterTiddlers = function (filter){
    const	retval=$tw.wiki.filterTiddlers.call($tw.wiki,filter);
        //if (typeof retval === 'undefined') throw new Error("undefined from filter")
    //console.log('filterTiddlers::',retval)
    return retval; 
}

exports.parseVersion =function (version){
    const	retval=$tw.utils.parseVersion.call($tw.utils,version);
        //if (typeof retval === 'undefined') throw new Error("undefined from parseVersion")
    //console.log('parseVersion::',retval)
    return retval; 
}

exports.addTiddler =function (ref){
    const	retval=$tw.wiki.addTiddler.call($tw.wiki,ref);
    //console.log('addTiddler::')
}

exports.each =function (object,callback){
    const	retval=$tw.utils.each.call($tw.utils,object,callback);
    //console.log('each::')
}

exports.pushTop =function (array,value){
    const	retval=$tw.utils.pushTop.call($tw.utils,array,value);
        //if (typeof retval === 'undefined') throw new Error("undefined from pushTop")
    //console.log('pushTop::',retval)
    return retval; 
}