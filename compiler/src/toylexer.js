
let string = `
  let a = 1;
  let b = 2;
`

function isWord(ch) {
  return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch === '_'
}

function isNumber(ch) {
  return ch >= '0' && ch <= '9'
}

function lexer() {
  let index = 0
  let tokens = []
  let ch = string[index]
  while(index < string.length) {
    ch = string[index]
    if (ch === '=') {
      tokens.push({
        type: 'OPERATOR',
        value: '='
      })
      index++
    } else if (ch === ';') {
      tokens.push({
        type: 'SEMICOLON',
        value: ';'
      })
      index++
    } else {
      if (isWord(ch)) {
        let word = ''
        while (isWord(ch)) {
          word += ch
          ch = string[++index]
        }
        tokens.push({
          type: 'IDENTIFIER',
          value: word
        })
      }
      else if (isNumber(ch)) {
        let num = ''
        while (isNumber(ch)) {
          num += ch
          ch = string[++index]
        }
        tokens.push({
          type: 'NUMBER',
          value: +num
        })
      } else if (ch === ' ' || ch === '\n' || ch === '\t') {
        ch = string[++index]
      }
    }
  }
  return tokens
}
const tokens = lexer()
console.log(tokens)