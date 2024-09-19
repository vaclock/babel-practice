const parser = require('@babel/parser')
const traverse = require("@babel/traverse").default

const fs = require("fs")
const path = require('path')
const DependencyNode = require("./dependencyNode")

const IMPORT_TYPE = {
  deconstruct: 'deconstruct',
  default: 'default',
  namespace: 'namespace'
}

const EXPORT_TYPE = {
  all: 'all',
  default: 'default',
  named: 'named'
}

const visitedModules = new Set();


function isDirectory(filePath) {
  try {
      return fs.statSync(filePath).isDirectory()
  }catch(e) {}
  return false;
}

function completeModulePath (modulePath) {
  const EXTS = ['.tsx','.ts','.jsx','.js'];
  if (modulePath.match(/\.[a-zA-Z]+$/)) {
      return modulePath;
  }
  debugger

  function tryCompletePath (resolvePath) {
      for (let i = 0; i < EXTS.length; i ++) {
          let tryPath = resolvePath(EXTS[i]);
          if (fs.existsSync(tryPath)) {
              return tryPath;
          }
      }
  }

  function reportModuleNotFoundError (modulePath) {
      throw 'module not found: ' + modulePath;
  }

  if (isDirectory(modulePath)) {
    const tryModulePath = tryCompletePath((ext) => path.join(modulePath, 'index' + ext));
    if (!tryModulePath) {
        reportModuleNotFoundError(modulePath);
    } else {
        return tryModulePath;
    }
  } else if (!EXTS.some(ext => modulePath.endsWith(ext))) {
    const tryModulePath = tryCompletePath((ext) => modulePath + ext);
    if (!tryModulePath) {
        reportModuleNotFoundError(modulePath);
    } else {
        return tryModulePath;
    }
  }
  return modulePath;
}

function moduleResolver (curModulePath, requirePath) {

  debugger
  requirePath = path.resolve(path.dirname(curModulePath), requirePath);

  debugger
  // 过滤掉第三方模块
  if (requirePath.includes('node_modules')) {
      return '';
  }

  requirePath =  completeModulePath(requirePath);

  if (visitedModules.has(requirePath)) {
      return '';
  } else {
      visitedModules.add(requirePath);
  }
  return requirePath;
}

function traverseModule(modulePath, dependencyGraph, allModules) {
  const moduleFileContent = fs.readFileSync(modulePath, {
    encoding: "utf8",
  })

  dependencyGraph.path = modulePath

  const ast = parser.parse(moduleFileContent, {
    sourceType: "unambiguous",
    plugins: ["jsx", "tsx"],
  })


  traverse(ast, {
    ImportDeclaration: (path) => {
      const moduleFileContent = fs.readFileSync(modulePath, {
        encoding: 'utf-8'
      });
      dependencyGraph.path = modulePath;

      const sourcePath = path.get('source.value').node
      const subModulePath = moduleResolver(modulePath, sourcePath);
      debugger
      if (!subModulePath) {
          return;
      }

      const specifierPaths = path.get('specifiers');
      dependencyGraph.imports[subModulePath] = specifierPaths.map(specifierPath => {
        if (specifierPath.isImportSpecifier()) {
          return {
            type: IMPORT_TYPE.deconstruct,
            imported: specifierPath.get('imported').node.name,
            local: specifierPath.get('local').node.name
          }
        } else if (specifierPath.isImportDefaultSpecifier()) {
          return {
            type: IMPORT_TYPE.default,
            local: specifierPath.get('local').node.name
          }
        } else {
          return {
            type: IMPORT_TYPE.namespace,
            local: specifierPath.get('local').node.name
          }
        }
      })
      debugger
      const subModule = new DependencyNode();
      traverseModule(subModulePath, subModule, allModules)
      dependencyGraph[subModule.path] = subModule;
      debugger;
    },
    ExportDeclaration: (path) => {
      debugger
      if (path.isExportNamedDeclaration()) {
        const specifiers = path.get('specifiers');
        dependencyGraph.exports = specifiers.map(specifier => {
          return {
            type: IMPORT_TYPE.deconstruct,
            imported: specifier.get('exported').node.name,
          }
        })
      } else if (path.isExportDefaultDeclaration()) {
        let exportName;
        const declarationPath = path.get('declaration');
        if(declarationPath.isAssignmentExpression()) {
          exportName = declarationPath.get('left').toString();
        } else {
          exportName = declarationPath.toString()
        }
        dependencyGraph.exports.push({
          type: EXPORT_TYPE.default,
          exported: exportName
        });
      } else {
        dependencyGraph.exports.push({
          type: EXPORT_TYPE.all,
          exported: path.get('exported').node.name,
          source: path.get('source').node.value
        });
        debugger
      }
    },
  })
  allModules[modulePath] = dependencyGraph

}

module.exports = function(modulePath) {
  const dependencyGraph = {
    root: new DependencyNode(),
    allModules: {}
  }

  traverseModule(modulePath, dependencyGraph.root, dependencyGraph.allModules)
  debugger;
  return dependencyGraph
}