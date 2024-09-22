/*\
title: $:/plugins/bj/tiddlywiki-preact/towidget.mjs
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

function invokeActionString(action, vars={},lastevent=null) {
//bj - convert to async?
    vars = JSON.parse(vars);
    window.setTimeout(function () {
        try{
            pwidget.invokeActionString(action,pwidget,lastevent,vars);
        }catch(e){console.log(e)}
    },0);
}

    return {
        getVariable,
        dispatchEvent,
        invokeActionString
    };
};


