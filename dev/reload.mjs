const {html, render } = await import ("$:/plugins/bj/unchane/preactsignal.mjs");

const {init} = await import ("$:/plugins/bj/unchane/towidget.mjs")
const bjModuleLoader = await import ("$:/plugins/bj/unchane/mimport.js");
const {setModuleP} = await import ("$:/plugins/bj/unchane/modulep.js");

const {filterTiddlers} = await import ("$:/plugins/bj/unchane/storeutils.js")
const {getTextReference,setTextReference} = await import ("$:/plugins/bj/unchane/store.js")


export function start({__pwidget}) {
	const {invokeActionString} = init(__pwidget)//methods bound to widget instance 

	function resetWidgetTree() {return `<$action-setfield $tiddler="$:/temp/bj/unchane/dev/resetTid" update="update"/>`}
	
	function doReset() {
		let modulesfiles = filterTiddlers("[all[shadows+tiddlers]suffix[.mjs]!prefix[$:/plugins/bj/unchane]!prefix[$:/plugins/bj/simplifai]]")
		for (const element of modulesfiles) {
			bjModuleLoader.bjModuleLoader.del(element) 
			console.log(element);
		}
		
		setModuleP(null) 
		//touch the reset macro to make widget tree re-render
		//invokeActionString(resetWidgetTree())	
		let story = getTextReference("$:/StoryList!!list")
		setTextReference("$:/StoryList!!list","")
		
		setTimeout(() => {
			setTextReference("$:/StoryList!!list",story)
		}, 500)
	}	
	return  html`
	  <button onClick=${() => (doReset())}>
		reload
	  </button>`
}
export var psignals = []


