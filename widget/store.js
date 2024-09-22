/*\
title: $:/plugins/bj/tiddlywiki-preact/store.js
type: application/javascript
module-type: library
\*/


function twGetTextReference(ref){

    const	retval=$tw.wiki.getTextReference.call($tw.wiki,ref);
        if (typeof retval === 'undefined') throw new Error("tried to read missing textref")
    //console.log('::',retval)
        return retval; 
    }
    
    
    const getTextReference = function(ref){var val= twGetTextReference(ref);return val};
    const setTextReference = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val)};

    const getBoolTxtRef = function(ref){
        var retval = twGetTextReference(ref);
		if ((retval==="true") || (retval==="false"))
			return (retval ==='true');
		throw new Error("Not bool")
    };
    const setBoolTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val.toString())};

    const getNumTxtRef = function(ref){
        var retval = twGetTextReference(ref)*1;
    if (isNaN(retval)) throw new Error("read NaN")
    return retval
    };
    const setNumTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val.toString())};
    
    const getJsonTxtRef = function(ref){return (JSON.parse(twGetTextReference(ref)))};
    const setJsonTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,JSON.stringify(val))};
    
    const setTxtRef= function(typ, tid, val){
        if (typ ==='?') {
            return setBoolTxtRef(tid, val);
        } else if (typ ==='#') {
            return setNumTxtRef(tid, val);
        } else if (typ ===':') {
            return setJsonTxtRef(tid, val);
        } else {
            return setTextReference(tid, val);
        }
    }
    
    const getTxtRef = function(typ, tid){ 
        var x;
        if (typ ==='?') {
           x= getBoolTxtRef(tid);
       } else if (typ ==='#') {
           x= getNumTxtRef(tid);
       } else if (typ ===':') {
           x= getJsonTxtRef(tid);
       } else {
           x = getTextReference(tid);
       }
       return x;
    }
    exports.filterTiddlers = $tw.wiki.filterTiddlers;
    
    exports.getTextReference = getTextReference;
    exports.setTextReference = setTextReference;
    
    exports.getBoolTxtRef = getBoolTxtRef;
    exports.setBoolTxtRef = setBoolTxtRef;

    exports.getNumTxtRef = getNumTxtRef;
    exports.setNumTxtRef = setNumTxtRef;
    
    exports.getJsonTxtRef = getJsonTxtRef;
    exports.setJsonTxtRef = setJsonTxtRef;
    
    exports.setTxtRef = setTxtRef;
    exports.getTxtRef = getTxtRef;
    
    //exports a string of 'types'
    
    
    exports.typeChars='#?:';