
const {html, render} = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs");

const { addInApplet } = await import ('$:/plugins/bj/tiddlywiki-preact/dev/module/newInApplet.mjs');
 
export function start(props) {

	return html`
	<${addInApplet} ...${props} />
	`
}
export var psignals = []
