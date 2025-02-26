
/*\
title: $:/bj/modules/unchane/pwidget.js
type: application/javascript
module-type: widget

\*/
(function(){

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    var loadModuleP = null;
    var modname = "pwidget";
    var Widget = require("$:/core/modules/widgets/widget.js").widget;
    const {setTxtRef,getTxtRef,typeChars} =  require("$:/plugins/bj/unchane/store.js");
    let bjModuleLoader = require("$:/plugins/bj/unchane/mimport.js").bjModuleLoader;
    var preactWidget = function(parseTreeNode,options) {
        this.initialise(parseTreeNode,options);
    };

    /*
    Inherit from the base widget class
    */
    preactWidget.prototype = new Widget();    
    
    preactWidget.prototype.libpath = "$:/plugins/bj/unchane/preactsignal.mjs";
    
    preactWidget.prototype.setTypedTxtRef= function(key){
        return setTxtRef(this.typ[key],this.toTiddlers[key],this.state[key].value);     
    }
    preactWidget.prototype.getTypedTxtRef = function(tid,deflt){     
        return getTxtRef(this.typ[this.fromTiddlers[tid]],tid,deflt);
    }

    
    /*
    Render this widget into the DOM
    */
    
    preactWidget.prototype.render = function(parent,nextSibling) {
        var self = this,error=false;
        this.parentDomNode = parent;
		this.loaded=false;
        this.computeAttributes();
        error = this.execute();
        if (!this.selector) {
            this.domNode = this.document.createElement("div");
            this.domNode.className =this["class"]|| ""
            this.domNodes.push(this.domNode);
            parent.insertBefore(this.domNode,nextSibling);
        }
        else this.domNode = document.querySelector(this.selector);
		if (error) {
			this.makeChildWidgets(this.getErrorMessage('missing app module'));
			this.renderChildren(this.domNode,null);
			return;
		}
        //don't wait for preact to start app - it is a leaf node and therefore doesn't have children
		//this.loaded is used in the updates() to check that component is load before it updates
        ;(async () => {
            try {
            const {start, psignals} = await bjModuleLoader.loadModule(this.app);
			//psignals are used to check that the correct 2waybinding (params) are given before the component is mounted
			if (!loadModuleP) loadModuleP = await bjModuleLoader.loadModule (`${this.libpath}`);
            const {html, render, signal, effect} = loadModuleP 
	        var psignalsX,stateX,keyX,index,valin 
			//psignals is optional - only check params when it exists
			if (psignals) psignalsX=Array.from(psignals) 
            // Initialize an object with signals
			try {
	            this.state = {};
	            this.tiddlers.forEach(tid => {
					if (psignals) {
						stateX = this.fromTiddlers[tid]
						keyX =  this.typ[stateX] + stateX
						index = psignalsX.indexOf(keyX);
						if (index === -1) {console.log(`unexpected ${keyX}`);throw (`Param error: unexpected ${keyX}`)}
						psignalsX.splice(index, 1);
					}
		            valin = self.getTypedTxtRef(tid,null);  
		            if (valin === null) {console.log(`missing tid ${tid}`);throw (`Param error: missing tid ${tid}`)}  
		            this.valin[this.fromTiddlers[tid]] = valin;    
		            this.state[this.fromTiddlers[tid]] = signal(valin);  
	            });
				if (psignals && psignalsX.length !==0) {console.log(`missing param`);throw ("missing param")}
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
       		}catch (e){
				console.log(e)
				this.makeChildWidgets(this.getErrorMessage(e));
				this.renderChildren(this.domNode,null);
				return;	
			}     
            render(html`<${start} __state=${this.state} __toTiddlers=${this.toTiddlers} __pwidget=${this} ...${this.params}/ >`,this.domNode);
            //console.log(`Cache size: ${bjModuleLoader.numModules()}`);
            } catch (error) {
                console.error('Error in main execution:', error);
				this.makeChildWidgets(this.getErrorMessage('Error in main execution'));
				this.renderChildren(this.domNode,null);
				return;	
            } finally {
                //bjModuleLoader.allkeys();
                //console.log(`Cache size after clearing: ${bjModuleLoader.numModules()}`);
            }
		this.loaded = true;
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


	preactWidget.prototype.getErrorMessage = function(e) {
		var parser,
			errorMessage = this.getAttribute("errorMessage","");

		if (errorMessage === "" ) {
			if (e) errorMessage = e
			else return [];
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
		if (!this.wiki.tiddlerExists(this.app) && !this.wiki.isShadowTiddler(this.app)){
			console.error(`missing tiddler ${this.app}`)
			return true
		}
        //list of tiddlers to bind to
        this.selector = this.getAttribute("$selector");
        this.tids = this.getAttribute("$tids","");
        this["class"] = this.getAttribute("class","");
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
	if (!this.loaded){ console.log ("refesh called early") ;return;}
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
        for (const val of updates) {
         //is the source of a signal is deleted refresh the widget, and deal with error there  
			if (changedTiddlers[val.split("!!")[0]]["deleted"]){
				this.refreshSelf();
			return 1;	
			}
		}
        
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
		var domNode =this.domNode
		this.removeLocalDomNodes()
		;(async () => {
			try {
				if (!loadModuleP) loadModuleP = await bjModuleLoader.loadModule (`${this.libpath}`);
				const {render} =  loadModuleP;
				// preact are 'leaf' nodes and so don't have children, so no need to call destroy on children
				render(null, domNode);
			}catch (e){console.log(e)}
	    })()
    };
    exports[modname] = preactWidget;

    })();
    




