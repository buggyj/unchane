/*\
title: $:/plugins/bj/tiddlywiki-preact/mimport.js
type: application/javascript
module-type: library
\*/
const createModuleLoader=require("$:/plugins/bj/tiddlywiki-preact/moduleloader.js").createModuleLoader;

exports.bjModuleLoader = createModuleLoader((module)=>{
	if ($tw.wiki.tiddlerExists(module)) return $tw.wiki.getTiddler(module).fields.text;
	return  $tw.modules.types['library'][module].definition;
});