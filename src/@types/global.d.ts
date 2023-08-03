
declare namespace Types {
  type Query = {
    replace?: boolean
    [propName: string]: any
  }
}

declare type Class = { new(...args: any[]): any; };

type ExtStore  = import("pinia").StoreGeneric

declare function $getStore(key: String): {
  STORE_NAME: String,
  ins: ExtStore,
  refs: Record<any, any>,
  getSubStore: Function
} | undefined;

declare let $app: {globalData: AnyObject} & Record<any, any>;
