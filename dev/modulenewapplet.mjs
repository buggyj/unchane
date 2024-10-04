
const {html} = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs")

const {pushTop, each, getTiddler, addTiddler,  parseVersion, filterTiddlers,  Tiddler, parseJSONSafe, languageGetString} = await import ("$:/plugins/bj/tiddlywiki-preact/storeutils.js")

export function newApplet(title,rename,source){

		var additionalTiddler = source||"";
		rename=title+"/"+rename
		if (!title) return ""
		// Get the plugin tiddler
		var pluginTiddler = getTiddler(title);
		if(!pluginTiddler) {
			throw "No such tiddler as " + title;
		}
		//console.log(pluginTiddler)
		additionalTiddler=filterTiddlers(additionalTiddler);

		var jsonPluginTiddler = parseJSONSafe(pluginTiddler.fields.text,null);
		if(!jsonPluginTiddler) {
			throw "Cannot parse plugin tiddler " + title + "\n" + getString("Error/Caption") + ": " + e;
		}
		//console.log(jsonPluginTiddler)
		
		// Get the list of tiddlers
		var tiddlers = Object.keys(jsonPluginTiddler.tiddlers);
		// Add the additional tiddlers
		pushTop(tiddlers,additionalTiddler)
		// Pack up the tiddlers into a block of JSON
		var plugins = {};
		
		plugins[title+"/log"]={title: title+"/log", text: "", type: "text/vnd.tiddlywiki"};
		each(tiddlers,function(title) {
			var tiddler = getTiddler(title),
				fields = {};
				//console.log("--",title)
				if (!tiddler) {
					plugins[title] = jsonPluginTiddler.tiddlers[title];
					//bj recently added tids will not appear in the store until page reload (unpacks plugins)
					return;
				}
				each(tiddler.fields,function (value,name) {
				fields[name] = tiddler.getFieldString(name);
			});
			plugins[rename] = fields;
		});
		// Retrieve and bump the version number
		var pluginVersion = parseVersion(pluginTiddler.getFieldString("version") || "0.0.0") || {
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
		addTiddler(new Tiddler(pluginTiddler,{text: JSON.stringify({tiddlers: plugins},null,4), version: version, list:"log"}));
		return true;

	}


