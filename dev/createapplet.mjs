
const {html, render} = await import ("$:/plugins/bj/unchane/preactsignal.mjs");

const { createApplet } = await import ('$:/plugins/bj/unchane/dev/module/createApplet.mjs');
 
export function start(props) {

	return html`
	<${createApplet} ...${props} />
	`
}
export var psignals = []
