import { ComponentInternalInstance } from "vue"

export class PageMethod {
    $page = null

    constructor(ins: ComponentInternalInstance) {
        this.$page = ins.proxy
    }

    getMethods(): Record<any, Function> {
        let self = this
        let ret = {}
        let obj = Reflect.getPrototypeOf(this)
        Reflect.ownKeys(obj).forEach((key: string)=> {
            // console.log(key);
            
            if (key.startsWith('$')) {
                ret[key] = self[key].bind(self)
            }
        })
        // console.log(obj, ret);
        
        return ret
    }

    /**
     * 
     * @param name 
     * @returns 
     */
    $sel(name) {
        console.log(this);
        
        return this.$page.$refs[name]
    }

/**
 * 
 * @param refName 
 * @param method 
 * @param args 
 * @returns 
 */
    $callCom(refName, method, args = []) {
        let methodArr = method.split('.')
        if (methodArr.length === 1) {
            return this.$sel(refName)[methodArr[0]](...args)
        }
        return this.$sel(refName)?.run(methodArr[0], methodArr.slice(1).join('.'), args);
    }

    $submitForm(ref = '') {
        return new Promise(resolve => {
            this.$sel(ref).validate().then(res => {
                // uni.showToast({
                //   title: '校验通过'
                // })
                resolve()
            }).catch(err => {
                console.log('err', err);
            })
        })
    }
}