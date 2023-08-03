
import gt from "lodash/gt";
import gte from "lodash/gte";
import lt from "lodash/lt";
import lte from "lodash/lte";
import eq from "lodash/eq";
import get from "lodash/get"

function not(v1, v2) {
    return v1 != v2
}

function notAndType(v1, v2) {
    return v1 !== v2
}

function or(v1, v2) {
    return v1 || v2
}


let funMap = {
    gt,
    gte,
    lt,
    lte,
    eq,
    or,
    not
}

export function con(item, index, key, funName, ...args) {
    let fun = funMap[funName];
    return fun(get(item, key), ...args);
}


/**
 * 
 * @param items {[]}
 * @param conditions  {[]}
 * @returns 
 */
export function findAll(items: Array<any>, conditions = []) {
    return items.filter(function (item, index) {
        return conditions.every((condition: Array<any>) => {
            return con(item, index, ...condition.slice(0));
        });
    });
}