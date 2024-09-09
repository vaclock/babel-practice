const acorn = require('acorn')

const Parser = acorn.Parser
const TokenType = acorn.TokenType

Parser.acorn.keywordTypes['lee'] = new TokenType('lee', {
  keyword: 'lee'
})

const modifyPlugin = (Parser) => {
  return class extends Parser {
    parse(program) {
      this.keywords = /^(?:lee|break|case|catch|continue|debugger|default|do|else|finally|for|function|if|return|switch|throw|try|var|while|with|null|true|false|instanceof|typeof|void|delete|new|in|this|const|class|extends|export|import|super)$/
      return (super.parse(program))
    }

    parseStatement(context, topLevel, exports) {
      var starttype = this.type
      // console.log(starttype, 'starttype')

      if (starttype == Parser.acorn.keywordTypes['lee']) {
        var node = this.startNode()
        return this.parseModifyStatement(node)
      }
      else {
        return(super.parseStatement(context, topLevel, exports))
      }
    }
    parseModifyStatement() {
      this.next()
      return this.finishNode({value: 'lee'}, 'ModifyStatement')
    }
  }
}

const modifyParser = Parser.extend(modifyPlugin)

const ast = modifyParser.parse('lee a = 1;const a = 1;console.log(a)', {
  ecmaVersion: 2020,
})
console.log(ast)

// console.log(Parser.acorn.keywordTypes['const'])
// console.log(new TokenType('test', {keyword: 'test'}))