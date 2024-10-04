
const {html, render} = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs");

const { updateApplet } = await import ('$:/plugins/bj/tiddlywiki-preact/dev/module/updateApplet.mjs');
 
export function start(props) {

	return html`
	<${updateApplet} ...${props} />
	`
}
export var psignals = []
