/*\
title: $:/plugins/bj/tiddlywiki-preact/store.js
type: application/javascript
module-type: library
\*/

const getTextReference = function(ref){var val= $tw.wiki.getTextReference.call($tw.wiki,ref);return val};
const setTextReference = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val)};

const getNumTxtRef = function(ref){return ($tw.wiki.getTextReference.call($tw.wiki,ref))*1};
const setNumTxtRef = function(ref,val){return $tw.wiki.setTextReference.call($tw.wiki,ref,val.toString())};

const setTxtRef= function(typ, tid, val){
    if (typ ==='#') {
        return setNumTxtRef(tid, val);
    } else {
        return setTextReference(tid, val);
    }
}

const getTxtRef = function(typ, tid){ 
    var x;
    if (typ ==='#') {
       x= getNumTxtRef(tid);
   } else {
       x = getTextReference(tid);
   }
   return x;
}


exports.getTextReference = getTextReference;
exports.setTextReference = setTextReference;

exports.getNumTxtRef = getNumTxtRef;
exports.setNumTxtRef = setNumTxtRef;

exports.setTxtRef = setTxtRef;
exports.getTxtRef = getTxtRef;

//exports a string of 'types'


exports.typeChars='#?';