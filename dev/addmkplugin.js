
/*\
title: $:/plugins/bj/tiddlywiki-preact/dev/addtopluginmacro.js
type: application/javascript
module-type: macro

\*/
(function(){

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";
	
	/*
	Repack a plugin, and then delete any non-shadow payload tiddlers
	*/
	exports.name = "addtopluginmacro";
	
	exports.params = [
		{name: "title"},{name: "rename"},{name: "source"}
	];
	
	/*
	Run the macro
	*/
	exports.run = function(title,rename,source) {
		var additionalTiddler = source||"";
		var rename=title+"/"+rename
		if (!title) return ""
		// Get the plugin tiddler
		var pluginTiddler = $tw.wiki.getTiddler(title);
		if(!pluginTiddler) {
			throw "No such tiddler as " + title;
		}
		console.log(pluginTiddler)
		additionalTiddler=$tw.wiki.filterTiddlers(additionalTiddler);

		var jsonPluginTiddler = $tw.utils.parseJSONSafe(pluginTiddler.fields.text,null);
		if(!jsonPluginTiddler) {
			throw "Cannot parse plugin tiddler " + title + "\n" + $tw.language.getString("Error/Caption") + ": " + e;
		}console.log(jsonPluginTiddler)
		// Get the list of tiddlers
		var tiddlers = Object.keys(jsonPluginTiddler.tiddlers);
		// Add the additional tiddlers
		$tw.utils.pushTop(tiddlers,additionalTiddler);

		// Pack up the tiddlers into a block of JSON
		var plugins = {};
		$tw.utils.each(tiddlers,function(title) {
			var tiddler = $tw.wiki.getTiddler(title),
				fields = {};console.log("--",title)
				if (!tiddler) {
					plugins[title] = jsonPluginTiddler.tiddlers[title];
					//bj recently added tids will not appear in the store until page reload (unpacks plugins)
					return;
				}
				$tw.utils.each(tiddler.fields,function (value,name) {
				fields[name] = tiddler.getFieldString(name);
			});
			plugins[rename] = fields;
		});
		// Retrieve and bump the version number
		var pluginVersion = $tw.utils.parseVersion(pluginTiddler.getFieldString("version") || "0.0.0") || {
				major: "0",
				minor: "0",
				patch: "0"
			};
		pluginVersion.patch++;
		var version = pluginVersion.major + "." + pluginVersion.minor + "." + pluginVersion.patch;
		if(pluginVersion.prerelease) {
			version += "-" + pluginVersion.prerelease;
		}
		if(pluginVersion.build) {
			version += "+" + pluginVersion.build;
		}
		// Save the tiddler
		$tw.wiki.addTiddler(new $tw.Tiddler(pluginTiddler,{text: JSON.stringify({tiddlers: plugins},null,4), version: version}));
		// Trigger an autosave
		$tw.rootWidget.dispatchEvent({type: "tm-auto-save-wiki"});
		// Return a heartwarming confirmation
		console.log("Plugin " + title + " successfully saved");
		return "";
	};
	
	})();
	