/*\
title: $:/plugins/bj/tiddlywiki-preact/mimport.js
type: application/javascript
module-type: library
\*/

const createModuleLoader=require("$:/plugins/bj/tiddlywiki-preact/moduleloader.js").createModuleLoader;

exports.bjModuleLoader = createModuleLoader((module)=>{
	return  $tw.modules.types['library'][module].definition;
},true);
