const parser = require('@babel/parser')
const traverser = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')
const template = require('@babel/template').default

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

const targetCalleeName = ['log', 'info', 'warn', 'error'].map(item => `console.${item}`)
traverser(ast, {
  CallExpression(path, state) {
    if (path.node.isNew) return
    const calleeName = generate(path.node.callee).code;
    if (targetCalleeName.includes(calleeName)) {
      const {line, column} = path.node.loc.start;
      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)()
      // const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true

      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]));
        path.skip()
      } else {
        path.insertBefore(newNode);
      }
    }
  }
})

const { code, map } = generate(ast);
console.log(code);