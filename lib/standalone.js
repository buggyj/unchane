const {Component,batch,cloneElement,computed,createContext,createRef,effect,h,htm,html,render,signal,toChildArray,useCallback,useComputed,useContext,useDebugValue,useEffect,useErrorBoundary,useImperativeHandle,useLayoutEffect,useMemo,useReducer,useRef,useSignal,useState} = await import ("$:/plugins/bj/tiddlywiki-preact/originalpreactsignal.mjs");


//guru meditation - why is this missing from preact signal api ?
export function useSignalEffect(cb) {
  const callback = useRef(cb);
  callback.current = cb;

  useEffect(() => {
     return effect(() => {
      return callback.current();
    });
  }, []);
}



export  {Component,batch,cloneElement,computed,createContext,createRef,effect,h,htm,html,render,signal,toChildArray,useCallback,useComputed,useContext,useDebugValue,useEffect,useErrorBoundary,useImperativeHandle,useLayoutEffect,useMemo,useReducer,useRef,useSignal,useState};
