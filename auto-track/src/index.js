const {transformFromAstSync} = require('@babel/core')
const parser = require('@babel/parser')
const autoTrackPlugin = require('./plugin')

const fs = require('node:fs')
const path = require('node:path')

const sourceCode = fs.readFileSync(path.join(__dirname, 'sourceCode.js'), 'utf8')

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous'
})

const {code} = transformFromAstSync(ast, sourceCode, {
  plugins: [[autoTrackPlugin, {
    trackerPath: 'tracker'
  }]]
})
fs.writeFileSync(path.join(__dirname, 'outputCode.js'), code)
