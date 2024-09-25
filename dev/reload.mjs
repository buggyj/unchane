const {html, render } = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs");

const {init} = await import ("$:/plugins/bj/tiddlywiki-preact/towidget.mjs")

const bjModuleLoader = await import ("$:/plugins/bj/tiddlywiki-preact/mimport.js");

export function start({__pwidget}) {
	const {dispatchEvent, invokeActionString} = init(__pwidget)//methods bound to widget instance 

	function resetWidgetTree() {return `<$action-setfield $tiddler="$:/temp/bj/tiddlywiki-preact/dev/resetTid" update="update"/>`}
	
	function doReset() {
		bjModuleLoader.bjModuleLoader.reset() 
		//touch the reset macro to make widget tree re-render
		invokeActionString(resetWidgetTree())	
	}	
	return  html`
	  <button onClick=${() => (doReset())}>
		reload
	  </button>`
}
export var psignals = []