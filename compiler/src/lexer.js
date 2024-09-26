/**
 * 词法解析的基本办法是，先把字符一个个读出来，判断一下读到的单个字符是否是特殊符号，例如’;’, ‘+’等
 * 如果是，那么直接生成对应的Token对象，如果不是，那么就把字符攒起来，直到遇到空格，回车换行为止，
 * 接着判断一下攒起来的字符串是关键字，还是变量，还是整形数值，根据不同情况生成不同Token对象
 */
class Token {
	constructor(type, literal, line) {
    this.tokenType = type
    this.literal = literal
    this.line = line
	}

	type() {
    return this.tokenType
	}

};

class Lexer {
  constructor(sourceCode) {
    // this.sourceCode = sourceCode
    this.initTokenType()
    this.sourceCode = sourceCode
    this.position = 0
    this.readPosition = 0
    this.lineCount = 0
    this.ch = ''
  }

  initTokenType() {
    this.ILLEGAL = -2
    this.EOF = -1
    this.LET = 0
    this.IDENTIFIER = 1
    this.EQUAL_SIGN = 2
    this.PLUS_SIGN = 3
    this.INTEGER = 4
    this.SEMICOLON = 5
  }
  readChar() {
    if (this.readPosition >= this.sourceCode.length) {
      this.ch = 0
    } else {
      this.ch = this.sourceCode[this.readPosition]
    }

    this.position = this.readPosition
    this.readPosition++
  }

  skipWhiteSpaceAndNewLine() {
    /*
    忽略空格
    */
    while (this.ch === ' ' || this.ch === '\t' ||
      this.ch === '\n') {
      if (this.ch === '\t' || this.ch === '\n') {
        this.lineCount++;
      }
      this.readChar()
    }
  }
  lexing() {
    this.readChar()

		var tokens = []
		var token = this.nextToken()
		while(token && token.type() !== this.EOF) {
			tokens.push(token)
			token = this.nextToken()
		}
    return tokens
  }
  nextToken() {
    var tok
    this.skipWhiteSpaceAndNewLine()
    var lineCount = this.lineCount

    switch (this.ch) {
      case '=':
        tok = new Token(this.EQUAL_SIGN, "=", lineCount)
        break
      case ';':
        tok = new Token(this.SEMICOLON, ";", lineCount)
        break;
      case '+':
        tok = new Token(this.PLUS_SIGN, "+", lineCount)
        break;
      case 0:
        tok = new Token(this.EOF, "", lineCount)
        break;

      default:
        var res = this.readIdentifier()
        if (res !== false) {
          tok = new Token(this.IDENTIFIER, res, lineCount)
        } else {
          res = this.readNumber()
          if (res !== false) {
            tok = new Token(this.INTEGER, res, lineCount)
          }
        }

        if (res === false) {
          tok = undefined
        }

    }

    this.readChar()
    return tok
  }
  isLetter(ch) {
    return ('a' <= ch && ch <= 'z') ||
      ('A' <= ch && ch <= 'Z') ||
      (ch === '_')
  }

  readIdentifier() {
    var identifier = ""
    while (this.isLetter(this.ch)) {
      identifier += this.ch
      this.readChar()
    }

    if (identifier.length > 0) {
      return identifier
    } else {
      return false
    }
  }

  isDigit(ch) {
    return '0' <= ch && ch <= '9'
  }

  readNumber() {
    var number = ""
    while (this.isDigit(this.ch)) {
      number += this.ch
      this.readChar()
    }

    if (number.length > 0) {
      return number
    } else {
      return false
    }
  }
  // let a = 1;
}

export default Lexer