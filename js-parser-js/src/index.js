const parser = require('@babel/parser')
const chalk = require('chalk')

const {codeFrameColumns} = require('@babel/code-frame')

class Scope {
  constructor(parent) {
    this.parent = parent
    this.declarations = {}
  }
  set(name, value) {
    this.declarations[name] = value
  }
  getLocal(name) {
    return this.declarations[name]
  }
  get(name) {
    let res = this.getLocal(name)
    let parent = this.parent
    while (!res && parent) {
      res = parent.getLocal(name)
      parent = parent.parent
    }
    return res
  }
  has(name) {
    return !!this.getLocal(name)
  }
}


const sourceCode = `
  let a = 1 + 2;
  console.log(a);
  function add(a, b) {
    console.log(a, b)
    return a + b;
  }
  console.log(add(11, 12))
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous'
})
debugger
const evaluator = (function() {
  function getIdentifierValue(node, scope) {
    if (node.type === 'Identifier') {
        return scope.get(node.name);
    } else {
        return evaluate(node, scope);
    }
  }
  const astInterpreters = {
    'Program': (node, scope) => {
      node.body.forEach(item => {
        evaluate(item, scope)
      })
    },
    'ReturnStatement': (node, scope) => {
      const value = evaluate(node.argument, scope)
      return value
    },
    'BlockStatement': (node, scope) => {
      for (let i = 0; i < node.body.length; i++) {
        if (node.body[i].type === 'ReturnStatement') {
        // 函数体中有返回语句，直接返回，不执行后续代码
          return evaluate(node.body[i], scope)
        }
        evaluate(node.body[i], scope)
      }
    },
    'FunctionDeclaration': (node, scope) => {
      const funName = evaluate(node.id)
      if (scope.get(funName)) {
        throw new Error('duplicate function declare: ' + funName)
      } else {
        // 函数形参 实参 赋值
        scope.set(funName, function (...args) {
          const funcScope = new Scope(scope)
          node.params.forEach((param, index) => {
            const name = evaluate(param, funcScope)
            funcScope.set(name, args[index])
          })

          funcScope.set('this', this)
          return evaluate(node.body, funcScope)
        })
      }
    },
    'MemberExpression': (node, scope) => {
      // 返回函数
      const obj = scope.get(evaluate(node.object, scope))
      return obj[evaluate(node.property, scope)]
    },
    'CallExpression': (node, scope) => {
      // 优先取当前作用域里的参数
      const args = node.arguments.map(item => {
        if (item.type === 'Identifier') {
          return scope.get(item.name)
        }
        return evaluate(item, scope)
      })
      if(node.callee.type === 'MemberExpression') {
        // 函数调用
        const fn = evaluate(node.callee, scope)
        // const obj = evaluate(node.callee.object, scope);
        const obj = evaluate(node.callee.object, scope)
      debugger
        return fn.apply(obj, args);
      } else {
        const fn = scope.get(evaluate(node.callee, scope))
        debugger
        return fn.apply(null, args);
      }
    },
    'ExpressionStatement': (node, scope) => {
      // evaluate(node.expression, scope)
      return evaluate(node.expression, scope)
    },
    'VariableDeclaration': (node, scope) => {
      node.declarations.forEach(item => {
        evaluate(item, scope)
      })
    },
    'VariableDeclarator': (node, scope) => {
      const declareName = evaluate(node.id, scope)
      if (scope.get(declareName)) {
        throw new Error('duplicate variable declare:' + declareName)
      } else {
        // scope[declareName] = evaluate(node.init)
        scope.set(declareName, evaluate(node.init, scope))
      }
    },
    'Identifier': (node, scope) => {
      return node.name
    },
    'BinaryExpression': (node, scope) => {
      let leftValue = getIdentifierValue(node.left, scope)
      let rightValue = getIdentifierValue(node.right, scope)
      switch(node.operator) {
        case '+': {
          return leftValue + rightValue
        }
        case '-': {
          return leftValue - rightValue
        }
        case '*': {
          return leftValue * rightValue
        }
        case '/': {
          return leftValue / rightValue
        }
        default: {
          throw new Error('invalid operator: ' + node.operator)
        }
      }
    },
    'NumericLiteral': (node, scope) => {
      return node.value
    }
  }

  const evaluate = function(node, scope) {
    try {
      return astInterpreters[node.type](node, scope)
    } catch (error) {
      if (error?.message && error.message.indexOf('astInterpreters[node.type] is not a function') !== -1) {
        console.error('unsupported type is ' + node.type)
        console.error(codeFrameColumns(sourceCode, node.loc, {
          highlight: true
        }))
      } else {
        console.error(error)
        console.error(codeFrameColumns(sourceCode, node.loc, {
          highlight: true
        }))
      }
    }
  }
  return {
    evaluate
  }
})()

const globalScope = new Scope()
globalScope.set('console', {
  log: (...args) => {
    console.log(chalk.green(...args))
  },
  error: (...args) => {
    console.log(chalk.red(...args))
  },
  warn: (...args) => {
    console.log(chalk.yellow(...args))
  }
})

evaluator.evaluate(ast.program, globalScope)
// console.log(globalScope)
debugger