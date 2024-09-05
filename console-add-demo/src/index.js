const parser = require('@babel/parser')
const traverser = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')

// const sourceCode = `console.log(1)`
const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;
const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
})

traverser(ast, {
  CallExpression(path, state) {
    // console.log(path)
    if (types.isMemberExpression(path.node.callee)
      // && types.isIdentifier(path.node.callee.property, { name: 'log' })
    && path.node.callee.object.name === 'console'
    && ['log', 'info', 'warn', 'error'].includes(path.node.callee.property.name)
    ) {
      const {line, column} = path.node.loc.start;
      path.node.arguments.unshift(types.stringLiteral(`add: [${line}:${column}]`))
    }
  }
})

const { code, map } = generate(ast);
console.log(code);