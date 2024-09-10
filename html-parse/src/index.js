// import posthtml from 'posthtml'
const posthtml = require('posthtml')
const parser = require('posthtml-parser')

const html = `
  <component>
    <title style="font-size: 12px;">Super Title</title>
    <text>Awesome Text</text>
  </component>
`

const ast = parser.parser(html)
debugger
const result = posthtml()
  // .use(require('posthtml-custom-elements')())
  .process(html, { sync: true })
  .html

console.log(result)