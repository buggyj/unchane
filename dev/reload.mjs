const {html, render } = await import ("$:/plugins/bj/unchane/preactsignal.mjs");

const {init} = await import ("$:/plugins/bj/unchane/towidget.mjs")

const bjModuleLoader = await import ("$:/plugins/bj/unchane/mimport.js");

export function start({__pwidget}) {
	const {dispatchEvent, invokeActionString} = init(__pwidget)//methods bound to widget instance 

	function resetWidgetTree() {return `<$action-setfield $tiddler="$:/temp/bj/unchane/dev/resetTid" update="update"/>`}
	
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