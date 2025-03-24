/*\
title: $:/plugins/bj/unchane/utils.mjs
type: application/javascript
module-type: library
\*/
const {	generateNewTitle, getCreationFields, getModificationFields, getTiddler, addTiddler, 
		Tiddler, setText, deleteTiddler, filterTiddlers} = await import ("$:/plugins/bj/unchane/storeutils.js")

const {getTextReference} =  await import("$:/plugins/bj/unchane/store.js");

// modified from tiddlywiki's $:/core/modules/widgets/action-createtiddler.js
export function newTiddler({basetitle,timestamp="yes",override="no",template,fields}){
	let actionOverwrite=override,actionTimestamp=timestamp,
		actionBaseTitle=basetitle,hasBase=!!basetitle,actionTemplate=template,useTemplate=!!actionTemplate
	
	let title = getTextReference("$:/language/DefaultNewTiddlerTitle"), // Get the initial new-tiddler title
		creationFields,
		modificationFields;
	
	if(actionTimestamp) {
		creationFields = getCreationFields();
		modificationFields = getModificationFields();
	}
	if(hasBase && actionOverwrite === "no") {
		title = generateNewTitle(actionBaseTitle);
	} else if (hasBase && actionOverwrite === "yes") {
		title = actionBaseTitle
	}

	if (!hasBase && useTemplate) {
		title = generateNewTitle(actionTemplate);
	} else if (!hasBase && !useTemplate) {
		// If no $basetitle and no $template then use initial title
		title = generateNewTitle(title);
	}
	var templateTiddler = getTiddler(actionTemplate) || {};
	addTiddler(new Tiddler(templateTiddler.fields,creationFields,fields,modificationFields,{title: title}));
	return title
	}
		
export function createtiddler({$basetitle,$template,$override="no",$timestamp="yes", ...attributes}) {
	return newTiddler({basetitle:$basetitle,template:$template,override:$override,timestamp:$timestamp, fields:attributes}); 
}

//deletes if value is null (or undefined)
export function setfield({$tiddler,$field,$index,$value,$timestamp="yes", ...attributes}) {
	var actionTimestamp = ($timestamp === "yes"),
		options = {};
	if($tiddler) {
		options.suppressTimestamp = !actionTimestamp;
		if((typeof $field == "string") || (typeof $index == "string")  || (typeof $value == "string")) {
			setText($tiddler,$field,$index,$value,options);
		}
		  for (const key in attributes) {
			if (attributes.hasOwnProperty(key) && key.charAt(0) !== "$") { 
			  setText($tiddler,key,undefined,attributes[key],options);
			}
		  }
	}
	return true; // Action was invoked
};


export function deletetiddler({$filter,$tiddler}) {
	var tiddlers = [];
	if($filter) {
		tiddlers = filterTiddlers($filter);
	}
	if($tiddler) {
		tiddlers.push($tiddler);
	}
	for(var t=0; t<tiddlers.length; t++) {
		deleteTiddler(tiddlers[t]);
	}
	return true; // Action was invoked
};