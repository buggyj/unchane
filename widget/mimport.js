/*\
title: $:/plugins/bj/unchane/mimport.js
type: application/javascript
module-type: library
\*/

const createModuleLoader=require("$:/plugins/bj/unchane/moduleloader.js").createModuleLoader;

exports.bjModuleLoader = createModuleLoader((module)=>{
	return  $tw.modules.types['library'][module].definition;
},true);
