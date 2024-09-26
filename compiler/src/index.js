import Lexer from "./lexer.js"
const sourceCode = `
  let five = 5;
  let six = 6;
`
const lexer = new Lexer(sourceCode)
const tokens = lexer.lexing()
console.log(tokens)