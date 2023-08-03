import __to from "await-to-js";
import __http from "@/utils/request";

let httpServiceModules = {};



/**
 * 
 * @param serviceName {string}
 * @param data 
 * @returns 
 */
export async function reqService(serviceName = '', data = {}) {
  if (httpServiceModules[serviceName]) {
    let def = new httpServiceModules[serviceName];
    // console.log(def);
    let [err, ret] = await __to(__http[def.method](def.url, data))
    // console.log(err, ret);

    let dataIsValidateStruct = true
    let structParseError = null
    if (def.resSchema) {
      let {error = null} = def.resSchema.safeParse(ret);
      if (error) {
        dataIsValidateStruct = false
        structParseError = error
      }
    }

    if (!dataIsValidateStruct) {
      console.log('error', structParseError)

      return undefined
    }

    if (err) {
      return undefined
    }
    return ret
  }
  return undefined
}

export function initServiceRes(modules) {
  Object.entries(modules).forEach(([_, module]) => {
    Object.entries(module).forEach(([key, target]) => {
      // console.log(target);
      if (target.__HTTP_SERVICE__) {
        httpServiceModules[key] = target
      }
    })
  })

  // console.log(httpServiceModules);
}

export function HttpService() {
  return function(target) {
    target.__HTTP_SERVICE__ = true
  }
}