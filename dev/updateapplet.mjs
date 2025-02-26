
const {html, render} = await import ("$:/plugins/bj/unchane/preactsignal.mjs");

const { updateApplet } = await import ('$:/plugins/bj/unchane/dev/module/updateApplet.mjs');
 
export function start(props) {

	return html`
	<${updateApplet} ...${props} />
	`
}
export var psignals = []
