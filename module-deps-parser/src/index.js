const traverseModule 	= require('./traverseModule');

const path = require('path')
const fs = require('fs')

const dependencyGraph = traverseModule(path.resolve(__dirname, '../test-pro/index.js'))

fs.writeFileSync('graph.json', JSON.stringify(dependencyGraph, null, 2))


console.log(JSON.stringify(dependencyGraph, null, 2))
