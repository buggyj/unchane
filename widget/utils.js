/*\
title: $:/plugins/bj/tiddlywiki-preact/utils.mjs
type: application/javascript
module-type: library
\*/
// modified from tiddlywiki's $:/core/modules/widgets/action-createtiddler.js
const {generateNewTitle, getCreationFields, getModificationFields, getTiddler, addTiddler, Tiddler} = await import ("$:/plugins/bj/tiddlywiki-preact/storeutils.js")

const {getTextReference} =  await import("$:/plugins/bj/tiddlywiki-preact/store.js");

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


