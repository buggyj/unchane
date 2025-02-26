/*\
title: $:/plugins/bj/unchane/mimport.js
type: application/javascript
module-type: library
\*/

const createModuleLoader=require("$:/plugins/bj/unchane/moduleloader.js").createModuleLoader;

exports.bjModuleLoader = (() => { 
	//expose globally to allow console commands
	$tw.mimportdbg =createModuleLoader((module)=>{
		if ($tw.wiki.tiddlerExists(module)) return $tw.wiki.getTiddler(module).fields.text;
		return  $tw.modules.types['library'][module].definition;
	});
	return $tw.mimportdbg
})()