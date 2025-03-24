/*\
title: $:/plugins/bj/unchane/towidget.mjs
type: application/javascript
module-type: library
\*/
export const init = (pwidget) => {

    function getVariable(x) 
    {
    return pwidget.getVariable(x)
    };
    function dispatchEvent(x) 
    {
    pwidget.dispatchEvent(x)
    };
    
    function invokeActionString(action, vars=`{}`,lastevent=null) {
    //bj - convert to async?
        vars = JSON.parse(vars);
        window.setTimeout(function () {
            try{
                pwidget.invokeActionString(action,pwidget,lastevent,vars);
            }catch(e){console.log(e)}
        },0);
    }
  
	function sendmessage({$message,$param,$name,$value,$names,$values,...attributes}) {
		// Get the string parameter
		var param = $param;
		// Assemble the parameters as a hashmap
		var paramObject = Object.create(null);
		// Add names/values pairs if present
		if($names && $values) {
			var names =  pwidget.wiki.filterTiddlers(pwidget.actionNames,pwidget),
				values = pwidget.wiki.filterTiddlers($values,pwidget);
			names.map((name,index) => {
				paramObject[name] = values[index] || "";
			});
		}
		// Add raw parameters
   		  for (const key in attributes) {
			if (attributes.hasOwnProperty(key) && key.charAt(0) !== "$") { 
				paramObject[key] = attributes[key];
			}
		};
		// Add name/value pair if present
		if($name) {
			paramObject[$name] = $value;
		}
		// Dispatch the message
		var params = {
			type: $message,
			param: param,
			paramObject: paramObject,
			event: event,
			tiddlerTitle: pwidget.getVariable("currentTiddler"),
			navigateFromTitle: pwidget.getVariable("storyTiddler")
		};
		pwidget.dispatchEvent(params);
		return true; // Action was invoked
	};    
		
    
    
    
    
    
    
    
    
    
    return {
        getVariable,
        dispatchEvent,
        invokeActionString,
        sendmessage
    };
};
    