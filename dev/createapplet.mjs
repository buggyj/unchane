
const {html, render} = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs");

const { createApplet } = await import ('$:/plugins/bj/tiddlywiki-preact/dev/module/createApplet.mjs');
 
export function start(props) {

	return html`
	<${createApplet} ...${props} />
	`
}
export var psignals = []
