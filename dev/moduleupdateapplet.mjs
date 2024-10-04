
const {html,useState} = await import ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs")

const{modApplet} = await import ("$:/plugins/bj/tiddlywiki-preact/dev/module/modApplet.mjs")

const {setTextReference} = await import ('$:/plugins/bj/tiddlywiki-preact/store.js')
 
const handleButtonClick = (title,adds,dels,comment) => {
	if(modApplet(title,adds,dels,comment)) setTextReference("$:/status/RequireReloadDueToPluginChange","yes")
}
export function updateApplet({title}){
	const [adds,setAdds]= useState("")
	const [dels,setDels]= useState("")
	const [comment,setComment]= useState("")
	return html`
	<button onClick=${()=>{if (!!title)handleButtonClick(title,adds,dels,comment);else alert("add title")}}>
         update Applet
    </button><br/>
	<input type="text" value=${adds} onInput=${(e) => {setAdds( e.target.value);}} /> adds<br/>
	<input type="text" value=${dels} onInput=${(e) => {setDels( e.target.value);}} /> dels<br/>
	<input type="text" value=${comment} onInput=${(e) => {setComment( e.target.value);}} /> comment
	`
}