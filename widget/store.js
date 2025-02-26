/*\
title: $:/plugins/bj/unchane/store.js
type: application/javascript
module-type: library
\*/


function twGetTextReference(ref, def){

    const	retval=$tw.wiki.getTextReference.call($tw.wiki,ref);
        if (typeof retval === 'undefined') {
            if (def === undefined ) throw new Error("tried to read missing textref")
            return def
        }
    //console.log('::',retval)
        return retval; 
    }
    
    
    const getTextReference = function(ref,def){var val= twGetTextReference(ref,def);return val};
    const setTextReference = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val)};

    const getBoolTxtRef = function(ref,def){
        var retval = twGetTextReference(ref,def);
		if ((retval==="true") || (retval==="false"))
			return (retval ==='true');
		throw new Error("Not bool")
    };
    const setBoolTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val.toString())};

    const getNumTxtRef = function(ref,def){
        var retval = twGetTextReference(ref,def)*1;
    if (isNaN(retval)) throw new Error("read NaN")
    return retval
    };
    const setNumTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val.toString())};
    
    const getJsonTxtRef = function(ref,def){return (JSON.parse(twGetTextReference(ref,def)))};
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
    
    const getTxtRef = function(typ, tid, def){ 
        var x;
        if (typ ==='?') {
           x= getBoolTxtRef(tid, def);
       } else if (typ ==='#') {
           x= getNumTxtRef(tid, def);
       } else if (typ ===':') {
           x= getJsonTxtRef(tid, def);
       } else {
           x = getTextReference(tid, def);
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