
const {html} = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs")

const {pushTop, each, getTiddler, addTiddler,  parseVersion, filterTiddlers,  Tiddler, parseJSONSafe, languageGetString, tiddlerExists, deleteTiddler} = await import ("$:/plugins/bj/tiddlywiki-preact/storeutils.js")

export function modApplet(title,adds,dels,comment){
		var additionalTiddlers = adds||"";
		var excludeTiddlers = dels||"" ;
		// Get the plugin tiddler
		var pluginTiddler = getTiddler(title);
		if(!pluginTiddler) {
			alert( "No such tiddler as " + title);
			return false
		}
		console.log(pluginTiddler)

		// Retrieve and bump the version number
		var pluginVersion = parseVersion(pluginTiddler.getFieldString("version") || "0.0.0") || {
				major: "0",	minor: "0",	patch: "0"
			};
		pluginVersion.patch++;
		var version = pluginVersion.major + "." + pluginVersion.minor + "." + pluginVersion.patch;
		if(pluginVersion.prerelease) {
			version += "-" + pluginVersion.prerelease;
		}
		if(pluginVersion.build) {
			version += "+" + pluginVersion.build;
		}

		additionalTiddlers=filterTiddlers(additionalTiddlers);
		excludeTiddlers=filterTiddlers(excludeTiddlers);

		var jsonPluginTiddler = parseJSONSafe(pluginTiddler.fields.text,null);
		if(!jsonPluginTiddler) {
			throw "Cannot parse plugin tiddler " + title + "\n" + languageGetString("Error/Caption") + ": " + e;
		}
		//console.log(jsonPluginTiddler)
		// Get the list of tiddlers
		var tiddlers = Object.keys(jsonPluginTiddler.tiddlers);
		// Add the additional tiddlers
		pushTop(tiddlers,additionalTiddlers);
		// Remove any excluded tiddlers
		for(var t=tiddlers.length-1; t>=0; t--) {
			if(excludeTiddlers.indexOf(tiddlers[t]) !== -1) {
				tiddlers.splice(t,1);
			}
		}
		// Pack up the tiddlers into a block of JSON
		var plugins = {};
		each(tiddlers,function(title) {
			var tiddler = getTiddler(title),
				fields = {};//console.log("--",title)
				if (!tiddler) {
					plugins[title] = jsonPluginTiddler.tiddlers[title];
					//bj recently added tids will not appear in the store until page reload (unpacks plugins)
					return;
				}
				each(tiddler.fields,function (value,name) {
				fields[name] = tiddler.getFieldString(name);
			});
			plugins[title] = fields;
		});
		if (plugins[title+"/log"] && !!comment) {
			plugins[title+"/log"].text+= "\n\n"+version + " " + comment;
		} 
		// Save the tiddler
		var removeFields = {adds:undefined,dels:undefined};
		addTiddler(new Tiddler(pluginTiddler,{text: JSON.stringify({tiddlers: plugins},null,4), version: version},removeFields));
		// Delete any non-shadow constituent tiddlers
		each(tiddlers,function(title) {
			if(tiddlerExists(title)) {
				deleteTiddler(title);
			}
		});
		return true;
	};
	

