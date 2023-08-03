import { deepClone } from "@/utils/clone";
import { getObj } from "@/utils/collection";
import Nid from "nid";
import { isObject } from "@/utils/is";


let currentDef = {}
let cacheDefs = {}
let currentName = ''

// console.log(cacheDefs)

function commonFormat(formatType, value: any) {
  if (formatType === 'number') {
    return parseFloat(value)
  }
  else {
    return value
  }
}

export let Utils = {
  commonFormat
}

function createFormat(propertyKey, type) {
  currentDef[propertyKey].rules.push({
    format: type,
    errorMessage: `${currentDef[propertyKey].label}项应该为${type}类型`
  })
  currentDef[propertyKey].formatType = type
}


function createIsArray(propertyKey, {itemType = '', min = 0, max = Number.MAX_SAFE_INTEGER} = {} ) {
  currentDef[propertyKey].rules.push({
    validateFunction:function(rule,value,data,callback){
      if (value.length < min) {
        callback(`${currentDef[propertyKey].label}至少${min}个`)
      }
      if (value.length > max) {
        callback(`${currentDef[propertyKey].label}最多${max}个`)
      }
      return true
    }
  })
}

function createField(label = '', propertyKey, initValue, {dynamic = false, widgetType = 'text', props = {}, itemCls =  null} ={}) {
  currentDef[propertyKey] = {
    rules: [],
    label: label ?? propertyKey,
    initValue: initValue,
    widgetType,
    props,
    itemCls
  }
  if (dynamic) {
    currentDef[propertyKey].vmType = 'arrayVmTpl'
    // currentDef[propertyKey].vm.add()
  }
}

function createRequired(propertyKey) {
  currentDef[propertyKey].rules.push({
    'required': true,
    errorMessage: `${currentDef[propertyKey].label}项必填`
  })
}

function createValidateFunction(propertyKey, fun) {
  currentDef[propertyKey].rules.push({
    validateFunction: fun
  })
}

export function validateFunction(fun: Function, {} ={}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    createValidateFunction(propertyKey, fun)
  }
}

export function format(type = '', {} ={}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    createFormat(propertyKey, type)
  }
}

export function isArray(option) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    createIsArray(propertyKey, option)
  }
}

export let esObj: Record<any, any> = {
  field: null,
  required: null,
  format: null,
  validateFunction: null,
  isArray: null,
}


esObj.init = function(target) {

 let ret =  target()

  for (let v of ret) {
    // console.log(v);
    v.__formName__ = v.name
  }

}



esObj.field  = function(label = '', option) {
  return function(value, context) {
    // console.log(currentName);
    
    // console.log(value, context.access.get());    
    createField(label, context.name, context.access.get(), option)
  }
}

esObj.required  = function() {
  return function(value, context) {
    // console.log(value, context.access.get());
    createRequired(context.name)
  }
}

esObj.format = function(type) {
  return function(value, context) {
    createFormat(context.name, type)
  }
}

esObj.isArray = function(option) {
  return function(value, context) {
    createIsArray(context.name, option)
  }
}

esObj.validateFunction = function(fun) {
  return function(value, context) {
    createValidateFunction(context.name, fun)
  }
}


esObj.defForm  = function(name, context) {
  // console.log(context);
  initSimpleForm(name)
}


export function field(label = '', option) {
  // console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // console.log("first(): called", currentDef);
    createField(label, propertyKey, descriptor.get(), option)
  };
}

export function required() {
  // console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    createRequired(propertyKey)
  };
}

type MixinConfig = String | [String, any]

export function initForm(name) {
  return function(target, key) {
    // console.log('111', target.constructor, key);
    defineSimpleForm(name, target.constructor)
  }
}

/**
 *
 * class VeryBase {
 *   static {
 *     defineSimpleForm('VeryBase', this);
 *     // console.log('sdsdsd', this.FORM_NAME);
 *   }
 *   @required()
 *   @field('sssss')
 *   get name1() {
 *     return ''
 *   }
 * }
 *
 * class VeryBase2 {
 *   static {
 *     defineSimpleForm('VeryBase2', this);
 *     // console.log('sdsdsd', this.FORM_NAME);
 *   }
 *   @required()
 *   @field('sssss')
 *   get name2() {
 *     return ''
 *   }
 * }
 *
 * export class UserDef {
 *   static {
 *     defineSimpleForm('UserDef', this, {
 *       mixins: [
 *         'VeryBase',
 *         'VeryBase2'
 *       ]
 *     });
 *   }
 *   @required()
 *   @field('密码')
 *   get password() {
 *     return ''
 *   }
 * }
 *
 * @param name 暂存key
 * @param target 目标类
 * @param mixins 混合使用
 */
export function defineSimpleForm(name, target: any, { mixins= [] } = {}) {
  // console.log('entry', name, context);
  // if (cacheDefs[name]) {
  //   return
  // }
  // cacheDefs[name] = {}

  if (!cacheDefs[name]) {
    cacheDefs[name] = {}
  }
  

  let proto: any = Reflect.getPrototypeOf(target)

  if (proto.__formName__) {
    let base = deepClone(cacheDefs[proto.__formName__])
    // console.log(base);
    cacheDefs[name] = {...base, ...cacheDefs[name]}
  }

  if (Array.isArray(mixins)) {
    mixins.forEach((mixinConfig: any) => {
        if (typeof mixinConfig === 'string') {
          if (cacheDefs[mixinConfig]) {
            let base = deepClone(cacheDefs[mixinConfig])
            // console.log(base);
            cacheDefs[name] = {...base, ...cacheDefs[name]}
          }
        }
        if (Array.isArray(mixinConfig)) {
          let base = deepClone(cacheDefs[mixinConfig[0]])
          if (mixinConfig[1] && mixinConfig[1].transform) {
            base = mixinConfig[1].transform(base)
          }
          cacheDefs[name] = {...base, ...cacheDefs[name]}
        }
    })
  }

  currentDef = cacheDefs[name]
  currentName = name

  // target.FORM_NAME = name
  target.__formName__ = name

  return currentDef
}

export function initSimpleForm(name, { mixins= [] } = {}) {
  // console.log('entry', name, context);
  // if (cacheDefs[name]) {
  //   return
  // }
  // cacheDefs[name] = {}

  if (!cacheDefs[name]) {
    cacheDefs[name] = {}
  }

  if (Array.isArray(mixins)) {
    mixins.forEach((mixinConfig: any) => {
        if (typeof mixinConfig === 'string') {
          if (cacheDefs[mixinConfig]) {
            let base = deepClone(cacheDefs[mixinConfig])
            // console.log(base);
            cacheDefs[name] = {...base, ...cacheDefs[name]}
          }
        }
        if (Array.isArray(mixinConfig)) {
          let base = deepClone(cacheDefs[mixinConfig[0]])
          if (mixinConfig[1] && mixinConfig[1].transform) {
            base = mixinConfig[1].transform(base)
          }
          cacheDefs[name] = {...base, ...cacheDefs[name]}
        }
    })
  }

  currentDef = cacheDefs[name]
  currentName = name

  return currentDef
}

interface RuleOption extends Record<any, any> {
  rules: Array<any>,
  label: String,
  vmType: String | undefined,
  initValue: any,
  props: Array<any> | undefined
}

interface SimpleFormInf extends Record<any, any>{
  rules: Record<any, any>
  formData: Record<string, any>
  vmMap: Record<any, any>
  getFormData(): Record<any, any>
  reset(): Void<any>
  setFormData(data:Record<any, any>)
}

export function useSimpleForm(name) {

  let record:Record<any, any> = {}
  let obj: SimpleFormInf = {
    rules: {},
    formData: reactive(record),
    vmMap: {},
    optMap: {},
    // @ts-ignore
    getFormData(){},
    reset(){},
    setFormData(){}
  }

  let defs = deepClone(cacheDefs[name])

  Object.entries(defs).forEach(([key, def]: [string, RuleOption]) => {
    obj.optMap[key] = def;
    if (def?.vmType === 'arrayVmTpl') {
      
      obj.vmMap[key] = (function() {
        let list = reactive([])

        function $item(def) {
          // console.log(obj);
          let ret = {}
          if (Array.isArray(def.props)) {
            def.props.forEach(([propName, propDef]: [string, RuleOption]) => {
              ret[propName] = propDef.initValue
            })
          }
          return ret;
        }

        function $add(item, afterCb: Function) {
          let newDef: Record<any, any> = {
            label:  def.label,
            rules:  def.rules,
            props:  def.props ?? []
          }
          if (def?.itemCls) {
            let clsName = def?.itemCls
            let clsDef = cacheDefs[clsName]
            newDef.props = Object.entries(clsDef) 
          }
          newDef.id = Nid(10);
          list.push(newDef);

          /**
           * init data
           */
    
            let target = getObj(obj.formData, [key]);
            if (target) {
              if (def.itemCls) {
                target.push(item ?? $item(newDef))
              }
              else {
                // console.log(def);
                
                target.push(item ?? commonFormat(def.formatType, item) ?? '')
              }
            }
          
          if (afterCb) {
            afterCb(newDef, ctx, list)
          }
        }

        function $del(id,  afterCb: Function) {
          let index = list.findIndex(v => v.id === id);
          // console.log(index, id, list);
          
          if (index > -1) {
            list.splice(index, 1);
            let target = getObj(obj.formData, [key]);
            // console.log(id, list, target, index);
            
            if (target) {
              target.splice(index, 1)
            }
            if (afterCb) {
              afterCb()
            }
          }

        }

        var ctx = {
          list,
          $item,
          $add,
          $del,
        }

        return ctx;
      })();
    }
  })

  obj.rules = defs;

  obj.getItemClsDef = function(key) {
    if (defs[key]?.itemCls) {
      return cacheDefs[defs[key]?.itemCls]
    }
    return null
  }

  obj.getItemClsDefProp = function(key, propName) {
    let itemClsDef = obj.getItemClsDef(key);
    // console.log(itemClsDef);
    
    if (itemClsDef) {
      return itemClsDef[propName]
    }
    return ''
  }

  obj.reset = function() {
    Object.entries(defs).forEach(([key, def]: [string, RuleOption]) => {
      obj.formData[key] = def.initValue;
    })
  }

  /**
   * 获取
   */
  obj.getFormData = function() {
    // @ts-ignore
    let formData = deepClone(unref(obj.formData))
    Object.entries(formData).forEach(([key, item]: [string, any]) => {
        let formatType = defs[key].formatType
        formData[key] = commonFormat(formatType, formData[key])

        if (Array.isArray(formData[key])) {
          // console.log(cacheDefs, defs[key]);
          let itemClsDef = obj.getItemClsDef(key);
          if (itemClsDef) {
            console.log(itemClsDef);
            
            let arr = formData[key];
           arr.forEach((item, index) => {
              if (isObject(item)) {
               arr[index] = formatObjData(item, itemClsDef)
              }
            });

            console.log(arr);
            
          }
        
        }

        
    })
    return formData
  }
  

  function formatObjData(originItem: Record<any, any>, itemDef: RuleOption) {
    let newObj = {}
    Object.entries(originItem).forEach(([key, item]: [string, any]) => {
      let formatType = itemDef[key].formatType
      newObj[key] = commonFormat(formatType, item)
    })
    return newObj;
  }

  /**
   * 设置
   * @param data
   */
  obj.setFormData = function(data) {
    Object.entries(data).forEach(([key, item]: [string, any]) => {
      let formatType = defs[key].formatType
     
      // console.log(defs[key]);
      
      if (defs[key].vmType === "arrayVmTpl") {
        if (defs[key].itemCls) {
          let itemDef = cacheDefs[defs[key].itemCls]
          // console.log(itemDef);
          data[key].forEach(item => {
            obj.vmMap[key].$add(formatObjData(item, itemDef))
          })
        }
        else {
          data[key].forEach(item => {
            obj.vmMap[key].$add(item, function() {
              
            })
          })
        }

      } else {
        obj.formData[key] = commonFormat(formatType, data[key])
      }
      // console.log( defs[key], obj);
    })
  }

  obj.reset()
  return obj
}

export function createFormContext(formName = '', cb: Function) {
  let context = {
    cls: null,
    init(mixins) {
      initSimpleForm(formName, mixins)
    },
    start(target) {
      target.__formName__ = formName
    }
  }

 let cls = cb({ field, required, defineSimpleForm, useSimpleForm, isArray, format, validateFunction, context })

// console.log(context.cls);
  context.start(cls)

 return useSimpleForm(formName);
}