import { isConstructor } from "@/utils/is";
import { reactive, computed } from "vue";


let cachedDefs = {}

let modelContext = {
    
}

let currentModelContext = null


export function creteProxyControl(appContext) {
    return new Proxy(appContext, {
        get(proxyObj, name) {
            // console.log(proxyObj, name);
            return proxyObj.getControl(name)
        }
    })
}

export function initModelContext(contextName) {
    modelContext[contextName] = {
        defs: {}
    }
    currentModelContext = modelContext[contextName]

    let host =  modelContext[contextName];

    let cached = {}

    function getControl(controlName) {
        // console.log(host.defs);
        if (host.defs[controlName]) {
            let obj = null;
            if (!cached[controlName]) {
                // console.log('111');
                
                obj = useControl(controlName)
                cached[controlName] = obj
            } else {
                obj =  cached[controlName]
            }
            return obj
        }
    }

    // let controls = useAllControl(name)

    return {
        // host,
        getControl
        // controls
    }
}

// function useAllControl(name) {

//     // console.log( Object.keys[modelContext[name].defs]);
    
//     let ret = new Map()

//     Object.keys(modelContext[name].defs).forEach(key =>{
//         ret.set(key, useControl(key))
//     })

//     return ret
// }

export function runModelContext() {
    // 
}

function scanCls(ret, cls, { handleKey = null } = {}) {
    let obj = new cls()
    let keys = Reflect.ownKeys(obj)
    let parentKeys = []


    // console.log('keys', keys);


    if (!handleKey) {
        handleKey = function (key) { return key }
    }
    // console.log('sssssssssssss', parentKeys);
    keys.forEach(key => {
        if (!parentKeys.includes(key)) {
            let parsedKey = handleKey(key)
            ret.state[parsedKey] = obj[key]
        }
    })

    // console.log(ret.state);

    let p = Object.getOwnPropertyDescriptors(cls.prototype);
    Object.entries(p).forEach(([key, item]) => {
        if (key !== 'constructor') {
            let parsedKey = handleKey(key)
            if (typeof item.set === 'undefined' && item.get) {
                ret.getters[parsedKey] = function () {
                    return item.get.bind(this)()
                }
            }
            if (typeof item.value === 'function') {
                ret.actions[parsedKey] = item.value
            }
        }
    })
}


export function createModel(cls) {
    let obj = new cls()
    let model = reactive(obj)

    return {
        reset() {
            Object.entries(obj).forEach(([key, value]) => {
                model[key] = value
            })
        },
        model
    }
}

let symbol = Symbol('BaseControl')

export class BaseVmControl {
  static [symbol] = 1
  constructor() {
    this[symbol] = 1
  }
}


export function injectControl(name = '') {
    return function(target) {

        
        let clsDef = {
            state: {},
            getters: {},
            actions: {}
        }

        let extendCls = Reflect.getPrototypeOf(target)
        // console.log(extendCls);
        
        if (isConstructor(extendCls)) {
            let symbols = Object.getOwnPropertySymbols(new extendCls())
            if (symbols.includes(symbol)) {
                // console.log('good', Object.getOwnPropertySymbols(new extendCls()));
                scanCls(clsDef, extendCls)
            }
        }
        // console.log(Object.getOwnPropertySymbols(Reflect.getPrototypeOf(extendCls)))

        scanCls(clsDef, target);
    
        if (!target.__def__) {
            target.__def__ = clsDef;

            currentModelContext.defs[name] = clsDef;

            cachedDefs[name] = clsDef

        }
        // console.log(clsDef);
    }
}

export function useControl(cls) {
    let clsDef = null
    if (typeof cls === 'string') {
        clsDef = cachedDefs[cls]
    }
    else {
        clsDef = cls.__def__
    }
    if (clsDef) {
        let def = clsDef
        let obj = reactive(def.state)

        Object.keys(def.getters).forEach(key => {
            obj[key] =  computed(function() {
                // console.log( def.getters[key]);
                return def.getters[key].bind(obj)()
            })
        });


        Object.keys(def.actions).forEach(key => {
            obj[key] = def.actions[key].bind(obj)
        })

        // console.log(obj);
        return obj
    }
    return null
}

export function modelControl(cls, methods = {}) {
    let model = createModel(cls);

    let ret = {
        state: model.model,
    }

    Object.keys(methods).forEach(key => {
        ret[key] = methods[key].bind(model.model)
    })

    return ret
}