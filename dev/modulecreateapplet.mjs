
const {html,useState} = await import ("$:/plugins/bj/unchane/preactsignal.mjs")

const{newApplet} = await import ("$:/plugins/bj/unchane/dev/module/newApplet.mjs")

const{newTiddler} = await import ("$:/plugins/bj/unchane/utils.mjs")

const handleButtonClick = (basetitle,source,dev) => {
	let fields={"plugin-type":"plugin", type:"application/json", tags:"preact-applet", text:'{"tiddlers":{}}'}
	if (!!dev) dev+='/'
	let title =	newTiddler({basetitle:"$:/plugins/"+dev+basetitle,fields})
	let rename= title.split("$:/plugins/"+dev)[1]+".mjs";
	
	newApplet(title,rename,source)
}
const source="[[$:/plugins/bj/unchane/dev/blankstart.mjs]]"
export function createApplet({dev}){
const [title,setTitle]= useState("")
const [devname,setDevname]= useState(dev)
	return html`
	<button onClick=${()=>{handleButtonClick(title,source,devname)}}>
         create New Applet
    </button><br/>
	$:/plugins/<input type="text" placeholder="developer" value=${devname} onInput=${(e) => {setDevname( e.target.value);}} />/<input type="text" placeholder="app name" value=${title} onInput=${(e) => {setTitle( e.target.value);}} />
	`
}
export var psignals = []