const parser = require('@babel/parser')

const fs = require("fs")
const { DependencyNode } = require("./dependencyNode")


function traverseModule(modulePath, dependencyGraph, allModules) {
  const moduleFileContent = fs.readFileSync(modulePath, {
    encoding: "utf8",
  })

  dependencyGraph.path = modulePath

  const ast = parser.parse(moduleFileContent, {
    sourceType: "unambiguous",
    plugins: ["jsx", "tsx"],
  })

}

module.exports = function(modulePath) {
  const dependencyGraph = {
    root: new DependencyNode(),
    allModules: {}
  }

  traverseModule(modulePath, dependencyGraph.root, dependencyGraph.allModules)
  return dependencyGraph
}