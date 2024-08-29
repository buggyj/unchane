
/*\
title: $:/bj/modules/tiddlywiki-preact/pwidget.js
type: application/javascript
module-type: widget

\*/
(function(){

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    
    var modname = "pwidget";
    var Widget = require("$:/core/modules/widgets/widget.js").widget;
    const {setTxtRef,getTxtRef,typeChars} =  require("$:/plugins/bj/tiddlywiki-preact/store.js");
    let bjModuleLoader = require("$:/plugins/bj/tiddlywiki-preact/mimport.js").bjModuleLoader;
    var preactWidget = function(parseTreeNode,options) {
        this.initialise(parseTreeNode,options);
    };

    /*
    Inherit from the base widget class
    */
    preactWidget.prototype = new Widget();    
    
    preactWidget.prototype.setTypedTxtRef= function(key){
        return setTxtRef(this.typ[key],this.toTiddlers[key],this.state[key].value);     
    }
    preactWidget.prototype.getTypedTxtRef = function(tid){     
        return getTxtRef(this.typ[this.fromTiddlers[tid]],tid);
    }

    
    /*
    Render this widget into the DOM
    */
    
    preactWidget.prototype.render = function(parent,nextSibling) {
        var self = this;
        this.parentDomNode = parent;
        this.computeAttributes();
        this.execute();
        if (!this.domid) {
            this.domNode = this.document.createElement("div");
            this.domNodes.push(this.domNode);
            parent.insertBefore(this.domNode,nextSibling);
        }
        else this.domNode = document.getElementById(this.domid);
        //don't wait for preact to start app - it is a leaf node and therefore doesn't have children
        (async () => {
            try {
            const {start} = await bjModuleLoader.loadModule(this.app);
            const {html, render, signal, effect} =  await bjModuleLoader.loadModule ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs");


	
            // Initialize an object with signals
			try {
            this.state = {};
            this.tiddlers.forEach(tid => {
            var valin = self.getTypedTxtRef(tid);    
            this.valin[this.fromTiddlers[tid]] = valin;    
            this.state[this.fromTiddlers[tid]] = signal(valin);
    
            });
            Object.keys(this.state).forEach(key => {
                effect(function () {        
                    //watch for udates from preact
                    //mapping to tids
                    if (self.valin[key]!=self.state[key].value) { 
                    self.valin[key]=self.state[key].value
                    self.setTypedTxtRef(key); 
                
                }
                });
            });
       		}catch (e){console.log(e)

					   this.makeChildWidgets(this.getErrorMessage());
		this.renderChildren(this.domNode,null);

			return;	
		}     
            render(html`<${start} __state=${this.state} __toTiddlers=${this.toTiddlers} ...${this.params}/ >`,this.domNode);
            console.log(`Cache size: ${bjModuleLoader.numModules()}`);
            } catch (error) {
                console.error('Error in main execution:', error);
            } finally {
                //bjModuleLoader.allkeys();
                //console.log(`Cache size after clearing: ${bjModuleLoader.numModules()}`);
            }
          })();
    };
    
    preactWidget.prototype.makeTidMaps = function() {
        const tds = [];
        this.toTiddlers = {};
        this.fromTiddlers = {};
        this.typ ={};
        this.valin = {};

        this.tiddlers.forEach(tid => {
            if (tid.includes('|')) {
              let typ = "";
              let [state, td] = tid.split('|');
              //first char can indicate type of state -eg number
              if (typeChars.indexOf(state[0]) !== -1){ 
                typ = state[0];
                state = state.substring(1);
              } 
              
              this.typ[state] = typ;
              this.toTiddlers[state] = td;
              this.fromTiddlers[td] = state;
              tds.push(td);
            }
            else {
                this.typ[tid] = "";
                this.toTiddlers[tid] = tid;
                this.fromTiddlers[tid] = tid;
                tds.push(tid);
            }
          });
          this.tiddlers =tds;
    }


	preactWidget.prototype.getErrorMessage = function() {
		var parser,
			errorMessage = this.getAttribute("errorMessage","");

		if (errorMessage === "") {console.log("error without a name")
			return [];
		}
		parser = this.wiki.parseText("text/vnd.tiddlywiki",errorMessage,{parseAsInline: true});
		if(parser) {
			return parser.tree;
		} else {
			return [];
		}
	};
	/*
    Compute the internal state of the widget
    */
    preactWidget.prototype.execute = function() {
        let self =this;
        this.app = this.getAttribute("$app");
        //list of tiddlers to bind to
        this.domid = this.getAttribute("$domid");
        this.tids = this.getAttribute("$tids");
        this.tiddlers=$tw.utils.parseStringArray(this.tids)||[];
        this.makeTidMaps();
        this.params = [];
        $tw.utils.each(this.attributes,function(attribute,name) {
            if(name.charAt(0) !== "$") {
                self.params[name]=attribute;
            }
        });
        

    };

    /*
    Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
    */
    preactWidget.prototype.refresh = function(changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        // Completely rerender if any of our attributes have changed
        if($tw.utils.count(changedAttributes) > 0) {
            // Rerender ourselves
            this.refreshSelf();
            return true;
        } else if(this.updatedTids(changedTiddlers)) {
            return true;
        }
        return false;
    };
    
    preactWidget.prototype.updatedTids = function( changedTiddlers) {
        const arr1=this.tiddlers||[];
        const updates = arr1.filter(item => changedTiddlers[item.split("!!")[0]]);
		try {
        this.updateSignals(updates);
        return updates.length;
		}catch (e){console.log(e)
			this.refreshSelf();
			return 1;	
		}
    }
    preactWidget.prototype.updateSignals= function(updates){
        self=this;
        updates.forEach(tid => {
            var valin = self.getTypedTxtRef(tid);    
            this.valin[this.fromTiddlers[tid]] = valin;    
            self.state[this.fromTiddlers[tid]].value = valin;

        });
    }

    preactWidget.prototype.destroy = function() {

        //don't wait for preact to destroy app
        var domNode =this.domNode;
        (async () => {
            try {
            const {html, render, signal, effect} =  await bjModuleLoader.loadModule ("$:/plugins/bj/tiddlywiki-preact/preactsignal.mjs");
            // preact are 'leaf' nodes and so don't have children, so no need to call destroy on children
            // this.destroyChildren();
            // remove our resources
            render(null, domNode);
            domNode.parentNode.removeChild(domNode);
            //this.children = [];
            //this.removeLocalDomNodes();	
            }catch (e){console.log(e)}
    })();
    };
    exports[modname] = preactWidget;

    })();
    










