/**
 *
 * parser:
 * Node = {
 *  type: 'comment', // element
 *  tagName: 'DIV',
 *  attr: [{name: 'type', value: 'comment'}],
 *  content: 'this is a comment',
 *  children: [Node, Node]
 * }
 *
 * traverse
 * 钩子函数
 *
 * {
 *  attr: (node) => {}
 *  content: (node) => {}
 * }
 * 
 * generate
 */

let htmlStr = `
  <div class="container"><span>children</span></div>
`
function parser(htmlStr) {
  let stack = []
  let index = 0
  while(index < htmlStr.length) {
    if(htmlStr[index] === '<') {
      let tag = ''
      let str = htmlStr[index]
      while(str !== '>' && str.trim() !== '') {
        tag += htmlStr[++index]
        str = htmlStr[index]
      }
    }
  }
}
