/*\
title: $:/plugins/bj/tiddlywiki-preact/mimport.js
type: application/javascript
module-type: library
\*/

const createModuleLoader=require("$:/plugins/bj/tiddlywiki-preact/moduleloader.js").createModuleLoader;

exports.bjModuleLoader = createModuleLoader((module)=>{
	if ($tw.wiki.tiddlerExists(module)) throw new Error('unexpected mjs file!');
	return  $tw.modules.types['library'][module].definition;
},true);
