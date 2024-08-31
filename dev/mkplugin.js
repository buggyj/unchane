
/*\
title: $:/bj/modules/macro/mkpluginmacro.js
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
	exports.name = "mkpluginmacro";
	
	exports.params = [
		{name: "title"},{name: "adds"},{name: "dels"}
	];
	
	/*
	Run the macro
	*/
	exports.run = function(title,adds,dels) {
		var additionalTiddlers = adds||"";
		var excludeTiddlers = dels||"" ;
		// Get the plugin tiddler
		var pluginTiddler = $tw.wiki.getTiddler(title);
		if(!pluginTiddler) {
			throw "No such tiddler as " + title;
		}
		console.log(pluginTiddler)
		additionalTiddlers=$tw.wiki.filterTiddlers(additionalTiddlers);
		excludeTiddlers=$tw.wiki.filterTiddlers(excludeTiddlers);
		var jsonPluginTiddler = $tw.utils.parseJSONSafe(pluginTiddler.fields.text,null);
		if(!jsonPluginTiddler) {
			throw "Cannot parse plugin tiddler " + title + "\n" + $tw.language.getString("Error/Caption") + ": " + e;
		}console.log(jsonPluginTiddler)
		// Get the list of tiddlers
		var tiddlers = Object.keys(jsonPluginTiddler.tiddlers);
		// Add the additional tiddlers
		$tw.utils.pushTop(tiddlers,additionalTiddlers);
		// Remove any excluded tiddlers
		for(var t=tiddlers.length-1; t>=0; t--) {
			if(excludeTiddlers.indexOf(tiddlers[t]) !== -1) {
				tiddlers.splice(t,1);
			}
		}
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
			plugins[title] = fields;
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
		var removeFields = {adds:undefined,dels:undefined};
		$tw.wiki.addTiddler(new $tw.Tiddler(pluginTiddler,{text: JSON.stringify({tiddlers: plugins},null,4), version: version},removeFields));
		// Delete any non-shadow constituent tiddlers
		$tw.utils.each(tiddlers,function(title) {
			if($tw.wiki.tiddlerExists(title)) {
				$tw.wiki.deleteTiddler(title);
			}
		});
		// Trigger an autosave
		$tw.rootWidget.dispatchEvent({type: "tm-auto-save-wiki"});
		// Return a heartwarming confirmation
		console.log("Plugin " + title + " successfully saved");
		return "";
	};
	
	})();
	