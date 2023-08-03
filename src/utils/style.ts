import { templateCalc } from '@/utils/calc'
import { deepClone } from '@/utils/clone'

import JSON5 from 'json5'
import { sleep } from './time';

const varregexp = /\$([^\t\n\s\]\)'"])*/g;

/**
 * 
 * @param key 
 * @param query 
 * @returns 
 */
async function queryRect(key, query = uni.createSelectorQuery()) {
  return new Promise(resolve => {
    query.select('#some_div').fields({
      // dataset: true,
      size: true,
      // scrollOffset: true,
      // properties: ['scrollX', 'scrollY'],
      computedStyle: ['scale', 'fontSize', 'backgroundColor'],
    }, function (res: any): void {
      // console.log(res);

      resolve(parseFloat(res.scale))
    }).exec();
  })
}

function parseArgs(argStr, funContext = {}) {
  if (argStr) {
    if (typeof argStr === 'string') {
      let newVal;
      let newStr = argStr

      let vars = newStr.match(varregexp);
      if (Array.isArray(vars)) {
        // console.log(newStr);
        vars.forEach(varName => {
          let varPath = varName.slice(1)
          // console.log(varPath, funContext);

          newStr = newStr.replace(varName, funContext[varPath])
          // if (typeof funContext[varPath] === 'number') {
          //   newVal = parseFloat(newStr)
          // }
          newVal = newStr
        })
      } else {
        newVal = newStr
      }
      // console.log(newVal);

      return newVal
    }
  }
  return argStr
}

function regVal(val) {
  if (typeof val === 'string') {
    // console.log(`'${val}'`);
    return `'${val}'`
  }
  return val
}

function createFunc() {
  return  {
    lastArg(...args) {
      // console.log('fun');
      
      if (Array.isArray(args) && args.length > 0) {

        
        let val = args.at(-1)


        return regVal(val)
      }
      return 0
    },
    str_append(...args) {
      // console.log('str_append');
      let str = ''
      args.forEach(item => {
        str = str + item
      })
      return str
    },
    async fetch(...args) {
      await sleep(1000);
      return `fetch ${args}`
    }
  }
}

function makestyleCore(newCssCode = '', funContext = {}, context: any = {}) {

  let functions = createFunc() 

  let regexp = /@\(([^\)]*)\)/g

  // console.log(funContext);
  let match = newCssCode.match(regexp);


  if (Array.isArray(match)) {
    match.some( async (funcArgBody, funcIndex) => {
      let funcNameRe = funcArgBody.match(/@\(([^,)]*)/)
      let funcName = funcNameRe[1]
      let args = funcArgBody.slice(funcNameRe[0].length).slice(1).slice(0, -1);
      // console.log(funcArgBody);
      // console.log(funcName);
      // console.log(args);
      if (functions[funcName]) {
        // let parsedArgs = parseArgs(args, funContext)
        // console.log(args);
        if (context.run) {
          await context.run(functions[funcName], funcArgBody, args)
        }
      }

      if (funcIndex > match.length - 2) {
        if (context.done) {
          await context.done()
        }
        return true
      }
      return false
    });
    
  } 
}

function makestyle(cssCode = '', funContext = {}) {
  let newCssCode = parseArgs(cssCode, funContext)
  makestyleCore(newCssCode, funContext, {
    run(fun, funcArgBody, args) {
      let ret = fun.bind({})(...JSON5.parse(args));
      newCssCode = newCssCode.replace(funcArgBody, ret)
    }
  })
  // console.log(newCssCode);
  
  return newCssCode
}

function asyncmakestyle(cssCode = '', funContext = {}) {
  return new Promise(resolve => {
    let newCssCode = parseArgs(cssCode, funContext)
    makestyleCore(newCssCode, funContext, {
      async run(fun, funcArgBody, args) {
        let ret = await fun.bind({})(...JSON5.parse(args));
        newCssCode = newCssCode.replace(funcArgBody, ret)
      },
      async done() {
        resolve(newCssCode)
      }
    });
  })
}


let BreakFLagSymbol = Symbol('BreakFLag');
let VoidFLagSymbol = Symbol('VoidFlag');


let curRunCalcPoint = {
  context: null,
  name: ''
}


export function initCssContainer({ cssMap = {}, cssHack = null } = {}) {
  async function runCalc(name = 'main', funContext = {}) {

    if (!cssMap[name]) {
      throw new Error(`no fun ${name}`)
    }

    curRunCalcPoint = {
      context: funContext,
      name: name
    }

    let curFun = cssMap[name]
    let assignMents = curFun?.assignMents
    let outVars = curFun.outVars ?? []
    let hasBreak = false;


    async function* __run() {

      for (let i = 0; i < assignMents.length; i++) {    
        
        // console.log(funContext);
        let type = assignMents[i][0]
        if (type === 'assign') {
          let [type, key, item] = assignMents[i]
          let val = undefined;
          // console.log(item);
          // let newCssStr: any = await makestyle(item, funContext);
          let newCssStr: any = makestyle(item, funContext);

          // console.log(newCssStr);
          
          if (cssHack) {
            val = await cssHack(newCssStr, funContext)
          } else {
            // console.log(newCssStr);
            
            val = templateCalc(newCssStr, {})
          }

          yield [key, val];
        }

        else if (type === 'await:assign') {
          let [type, key, item] = assignMents[i]
          let val = undefined;
          // console.log(item);
          // let newCssStr: any = await makestyle(item, funContext);
          let newCssStr: any = await asyncmakestyle(item, funContext);

          if (cssHack) {
            val = await cssHack(newCssStr, funContext)
          } else {
            val = templateCalc(newCssStr, {})
          }

          if (key) {
           
             yield [key, val]; 
          } else {
            yield VoidFLagSymbol
          }
        }
        else if (type === 'fun') {
          let [type, key, item] = assignMents[i]
          let inlineContext = {}
          let fun = cssMap[item[0]]
          let params = fun.params ?? [];
          // console.log(params);

          params.forEach((paramName, index) => {
            inlineContext[paramName] = funContext[item[1][index]]
          })


          let val = await runCalc(item[0], inlineContext)
          // funContext[key] = val
          yield [key, val]
        }
        else if (type === 'worker') {
          let [type, conditions, ...functions] = assignMents[i]
          let funNameIndex = -1;
          conditions.some((condition, index) => {
            let newStr = parseArgs(condition, funContext);
            // console.log(newStr);
            
            if (templateCalc(newStr, {})) {
              funNameIndex = index;
              return true
            }
            return false
          });

          // console.log(funNameIndex);
          

          let funName = functions.at(funNameIndex)


          // console.log(assignMents[i]);
          let objfunContext = deepClone(funContext)
                  // let val = await runCalc(funName, objfunContext)
          let fun = cssMap[funName]


          // #ifdef MP-WEIXIN
          getApp().globalData.sendMsg({some: 1}, function(e) {  
              let outVars = fun.outVars ?? [];
              outVars.forEach(key => {
                funContext[key] = 1
              });
              console.log('sendMsg', funContext);
          })
          // #endif
   

          // if (val === BreakFLagSymbol) {
          //   hasBreak = true
          // }
        }
        else if (type === 'if') {
          let [type, conditions, ...functions] = assignMents[i]
          let funNameIndex = -1;
          conditions.some((condition, index) => {
            let newStr = parseArgs(condition, funContext);
            console.log(newStr);
            
            if (templateCalc(newStr, {})) {
              funNameIndex = index;
              return true
            }
            return false
          });

          // console.log(funNameIndex);
          

          let funName = functions.at(funNameIndex)


          // console.log(assignMents[i]);
          let objfunContext = deepClone(funContext)
          let val = await runCalc(funName, objfunContext)
          let fun = cssMap[funName]
          let outVars = fun.outVars ?? [];
          outVars.forEach(key => {
            funContext[key] = objfunContext[key]
          });

          // console.log(val);

          if (val === BreakFLagSymbol) {
            hasBreak = true
          }
        }
        else if (type === 'for') {
          let [type, max, loopArg, funName] = assignMents[i]
          let [valueName = 'LOOP_ITEM', indexName = 'LOOP_INDEX'] = loopArg
          let fun = cssMap[funName]
          let objfunContext: any = deepClone(funContext)
          let outVars = fun.outVars ?? [];

          let len = max
          if (max.length) {
            len = max.length
          }

          for (let i = 0; i < len; i++) {
            objfunContext[indexName] = i;
            objfunContext[valueName] = max[i]; 
            let val = await runCalc(funName, objfunContext);
            outVars.forEach(key => {
              objfunContext[key] = objfunContext[key]
            })

            // console.log(val);
            
            if (val === BreakFLagSymbol) {
               console.log('for break');
              //  throw new Error(`no fun ${curRunCalcPoint.name}`)
              //  return Promise.reject('sss')
               break;
            }
          }

          outVars.forEach(key => {
            funContext[key] = objfunContext[key]
          })
        }
        else if (type === 'log') {
          let [type, ...args] = assignMents[i];
          let result = args.map(argStr => {
            let newStr = parseArgs(argStr, funContext)
            // let vars = argStr.match(varregexp)
            // vars.forEach(varName => {
            //   let varPath = varName.slice(1)
            //   newStr = newStr.replace(varName, funContext[varPath])
            // })
            return newStr
          })

          console.log(...result);
        }
        else if (type === 'break') {
          // console.log(funContext, curRunCalcPoint);
          
          yield BreakFLagSymbol
        }
        else {
          yield undefined
        }
      }
    }


    // let ret;
    try {
      for await (const ret of __run()) {
        // console.log(`yield ${name}`, num);
        // Expected output: 1
        // ret = num
        if (Array.isArray(ret)) {
          let [key, val] = ret
          funContext[key] = val
        }
        else if (ret === BreakFLagSymbol) {
          hasBreak = true
        }
        else if (ret === VoidFLagSymbol) {
          // 
        }
        else {}
      }
    } catch(e) {
      console.log('error', e);      
      throw e;
    }

    if (hasBreak) {
      return BreakFLagSymbol
    }

    if (name == 'main') {

      console.log('main', funContext);
    } else {
      // console.log('other', funContext);
      
    }

    return funContext[outVars[0]]
  }

  return {
    runCalc
  }
}






