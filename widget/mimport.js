/*\
title: $:/plugins/bj/tiddlywiki-preact/mimport.js
type: application/javascript
module-type: library
\*/
const createModuleLoader = (getModule) => {
    const moduleCache = new Map();


    function replaceImports(code) {
        subst = '__privateLoadModule($1$2$1)';
        return code.replace(
            /(?<![a-zA-Z0-9_$\.])import\s*\(\s*(['"`])(.*?)\1\s*\)/g,
            subst
        );
    }

    async function loadModule(id) {
        //replaces import() for internal modules
        if (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('file://')) {
            return await import(id);// external files can use native import()
        }
        if (id.endsWith('.js')) {
            return (require(id));
        }
        if (moduleCache.has(id)) {
            return moduleCache.get(id);
        }

        let codeAsDataURL;
        try { 
            let code = getModule(id);
            code = replaceImports(code);
            const name = id;
            //add name to make globalThis.__privateLoadModule unique to avoid being deleted before used (due to race condition?)
            code = `const __privateLoadModule = globalThis["__privateLoadModule${name}"];${code}`;

            const blob = new Blob([code], { type: 'application/javascript' });
            codeAsDataURL = URL.createObjectURL(blob);

            // globalize loader so that it can be compiled in with the modules to override their import()s
            globalThis[`__privateLoadModule${name}`] = loadModule;
            try{const module = await import(codeAsDataURL);//compile into a module
				delete globalThis[`__privateLoadModule${name}`];
				moduleCache.set(id, module);
				return module;
			}catch(e) {console.log("failed at import ",id,e);return moduleCache.get(id);}
        
        } catch (error) {
            console.error(`Error loading module ${id}: ${error}`);
            throw error;
        } finally {
            if (codeAsDataURL) {
                URL.revokeObjectURL(codeAsDataURL);
            }
        }
    }
    function allkeys() {
        const iter = moduleCache.keys();
        for (var i = 0; i< moduleCache.size;i++) console.log(i, iter.next().value);
    }

    return {
        loadModule,
        //reset: () => moduleCache.clear(),
        //numModules: () => moduleCache.size,
        //allkeys
    };
};

exports.bjModuleLoader = createModuleLoader((module)=>{
	if ($tw.wiki.tiddlerExists(module)) throw new Error('unexpected mjs file!');
	return $tw.wiki.getTiddler(module).fields.text;
});
