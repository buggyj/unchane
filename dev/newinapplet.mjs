
const {html, render} = await import ("$:/plugins/bj/unchane/preactsignal.mjs");

const { addInApplet } = await import ('$:/plugins/bj/unchane/dev/module/newInApplet.mjs');
 
export function start(props) {

	return html`
	<${addInApplet} ...${props} />
	`
}
export var psignals = []
