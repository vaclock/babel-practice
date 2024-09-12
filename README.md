
# babel

[toc]

## 原理

> babel是一个转译器，可以将高级的语法转换为低级的语法

1. parse: code -> ast, 词法分析转出token, 语法分析将token转出ast
2. transform: modify ast
3. generate: ast -> code

### AST节点

- [babel ast](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)

1. Literal: 字面量, StringLiteral, BooleanLiteral...
2. Identifier: 标识符, 各种声明和引用的名字, 如变量名、函数名、参数名
3. Statement: 语句, 可独立执行的最小单位, 如`while() {};break;`
4. Declaration: 声明语句, 特殊的语句, 如`var a = 1;`
5. Expression: 表达式, **特点是执行完以后有返回值**,  用于赋值、运算等, 如`1 + 2; a;super`
6. Class: 类, 类整体内容是`classBody`, 方法是`MethodDefinition`, 普通方法和构造函数`kind`不同, 属性是`PropertyDefinition`
7. Module: 模块语句
8. Program: 程序, body代码程序体, 存放`statement`数组, 其中`directive`是解释器指令, 如`use strict;`
9. File: 文件, 最外层节点, 存放`program`、`comments`、`tokens`

## 配置

1. 预设
2. 插件

## 案例

- [ ] 函数插桩
- [ ] 国际化
- [ ] api文档生成
- [ ] linter
- [ ] 类型检查
- [ ] 代码压缩
- [ ] js解释器
- [ ] 模块遍历
