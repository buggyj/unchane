/*\
title: $:/plugins/bj/tiddlywiki-preact/store.js
type: application/javascript
module-type: library
\*/

const getTextReference = function(ref){var val= $tw.wiki.getTextReference.call($tw.wiki,ref);return val};
const setTextReference = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val)};

const getNumTxtRef = function(ref){return ($tw.wiki.getTextReference.call($tw.wiki,ref))*1};
const setNumTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val.toString())};

const getJsonTxtRef = function(ref){return (JSON.parse($tw.wiki.getTextReference.call($tw.wiki,ref)))};
const setJsonTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,JSON.stringify(val))};

const setTxtRef= function(typ, tid, val){
    if (typ ==='#') {
        return setNumTxtRef(tid, val);
    } else if (typ ===':') {
        return setJsonTxtRef(tid, val);
    } else {
        return setTextReference(tid, val);
    }
}

const getTxtRef = function(typ, tid){ 
    var x;
    if (typ ==='#') {
       x= getNumTxtRef(tid);
   } else if (typ ===':') {
       x= getJsonTxtRef(tid);
   } else {
       x = getTextReference(tid);
   }
   return x;
}


exports.getTextReference = getTextReference;
exports.setTextReference = setTextReference;

exports.getNumTxtRef = getNumTxtRef;
exports.setNumTxtRef = setNumTxtRef;

exports.getJsonTxtRef = getJsonTxtRef;
exports.setJsonTxtRef = setJsonTxtRef;

exports.setTxtRef = setTxtRef;
exports.getTxtRef = getTxtRef;

//exports a string of 'types'


exports.typeChars='#?:';