// import Big from 'big.js';

let n1 = ((-~{}) + '');
let n2 = ((-~{})+(-~{}) + '');
let n3 = ((-~{})+(-~{})+(-~{})+'');
let n4 = ((-~{})+(-~{})+(-~{})+(-~{})+'');
let n5 = ((-~{})+(-~{})+(-~{})+(-~{})+(-~{})+'');
let n6 = ((-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+'');
let n7 = ((-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+'');
let n8 = ((-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+'');
let n9 = ((-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+(-~{})+'');


let s1 = String.fromCodePoint(Number(n4 + n3))
let s2 = String.fromCodePoint(Number(n4 + n5))
let s3 = String.fromCodePoint(Number(n4 + n2))
let s4 = String.fromCodePoint(Number(n4 + n7))


// 匹配加减乘除括号的正则
const operatorReg = /[()+\-/*]/g;

const isStringReg = /^['"]{1}([^'"]*)['"]{1}/;

const isConditionReg = /([^=\s]+)\s*([(==)(>=)(<=)><(!=)(&&)(||)]+)\s*([^=\s]+)/;

function getStringValue(key) {
    let matched = key.match(isStringReg)
    if (matched) {
        // console.log('is string', matched);
        return matched[1]
    }
    return key
}

let ConditionMapFun = {
    '==': function(left, right)  {
        return left === right
    },
    '>=':  function(left, right)  {
        return left >= right
    },
    '<=':  function(left, right)  {
        return left <= right
    },
    '>':  function(left, right)  {
        return left > right
    },
    '<':  function(left, right)  {
        return left < right
    },
    '!=':  function(left, right)  {
        return left !== right
    },
    '&&':  function(left, right)  {
        return left && right
    },
    '||':  function(left, right)  {
        return left || right
    },
}

/**
 * 将模板处理为 token 数组
 * @param {string} str 要计算的表达式模板
 */
const strToToken = str => {
    // 提取出所有操作数
    const keys = str.split(operatorReg);
    const tokens = [];
    let temp = str;
    // 解析模板
    while (temp.length > 0) {
        // 模板开头是操作数
        if (keys.length > 0 && temp.startsWith(keys[0])) {
            temp = temp.replace(keys[0], '');
            tokens.push(keys.shift().trim());
        }
        // 模板开头是操作符
        else {
            tokens.push(temp[0]);
            temp = temp.substr(1);
        }
    }

    // 把模板里的空白字符都丢掉
    return tokens.filter(token => token && token !== ' ');
}

/**
 * 中缀表达式转换成逆波兰表达式
 * @param {string[]} tokenList 中缀表达式 token 数组
 */
const tokenToRpn = tokenList => {
    if (!tokenList || tokenList.length <= 0) return [];
    const operators = [];

    // 指定操作符优先级是否高于栈中操作符的优先级
    const isTokenHighRank = token => {
        const operatorRand = { '+': 1, '-': 1, '*': 2, '/': 2 };
        const topOperator = operators[operators.length - 1];

        return operators.length === 0 ||
            topOperator === '(' ||
            operatorRand[token] > operatorRand[topOperator];
    }

    const outputs = tokenList.reduce((outputs, token) => {
    
        
        // 如果是变量，直接输出
        if (!token.match(operatorReg)) {
            if (token.match(isConditionReg)) {
                // console.log('s');
                let arr = token.match(isConditionReg)
                // console.log(arr);
                
                if ( Array.isArray(arr) && arr[2] && ConditionMapFun[arr[2]]) {
                    let val1 =  getStringValue(arr[1])
                    let val2 =  getStringValue(arr[3])

                    let val =  ConditionMapFun[arr[2]](val1, val2)
                    outputs.push(
                       val
                    );
                }
            }
            else {
                outputs.push(token);
            }
        }
        // 如果是左括号，入操作符栈
        else if (token === '(') {
            operators.push(token);
        }
        // 如果是右括号，把操作符弹出到遇见左括号
        else if (token === ')') {
            while (operators.length > 0) {
                const operator = operators.pop();
                if (operator === '(') break;
                outputs.push(operator);
            }
        }
        // 如果是运算符
        else {
            while (operators.length >= 0) {
                // 把优先级更高的推入结果
                if (isTokenHighRank(token)) {
                    operators.push(token);
                    break;
                }
                outputs.push(operators.pop());
            }
        }

        return outputs;
    }, []);

    return [...outputs, ...operators];
}

/**
 * 运算符到实际操作的映射
 */
const calculators = {
    // '+': (num1, num2) => (new Big(num1).plus(num2)),
    // '-': (num1, num2) => (new Big(num1).minus(num2)),
    // '*': (num1, num2) => (new Big(num1).times(num2)),
    // '/': (num1, num2) => (new Big(num1).div(num2))
    [s1]: (num1, num2) => (num1 + num2),
    [s2]: (num1, num2) => (num1 - num2),
    [s3]: (num1, num2) => (num1 * num2),
    [s4]: (num1, num2) => (num1 / num2)
}

/**
 * 从数据集里获取对应的数据
 */
const getValues = (key, values, {raw = false} = {}) => {
    if (raw) {
        return key
    }
    if (!key) return 0;    
    if (typeof key === 'boolean') {
        return Number(key) || 0;
    }
    if (typeof key === 'string') {
        // console.log(key, values);
        let parsedKey = getStringValue(key)
        return values[parsedKey] || Number(parsedKey) || 0;
    }
    return key;
}

/**
 * 填充并计算数据
 * @param {string[]} tokens rpn token 数组
 * @param {object} values 数据集
 * @returns 最终结果
 */
const calcRpn = function(tokens, values) {
    let numarr = []
    for (const token of tokens) {
        const calculator = calculators[token];

        if (!calculator) numarr.push(token);
        else {

            // 这两个值的创建顺序不能变，否则 pop 出来的值就反了
            let last = numarr.pop()
            let lastIsRaw = false
            if (isStringReg.test(last)) {
                console.log('isStr', last);
                lastIsRaw = true
                last = getStringValue(last)
            }
            
            const val2 = getValues(last, values, {raw: lastIsRaw});
            const val1 = getValues(numarr.pop(), values);
            const result = calculator(val1, val2);
            let resultVal = result;
            if (result.toNumber) {
                resultVal = result.toNumber()
            }

            numarr.push(resultVal);
        }
    }
    return numarr.pop();
};

export const templateCalc = (template, values) => {
    const tokens = strToToken(template)
    // console.log(tokens);

    const rpn = tokenToRpn(tokens)
    // console.log(rpn);    

    const result = calcRpn(rpn, values)

    return result
}
