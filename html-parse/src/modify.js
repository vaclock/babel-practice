class HTMLParser {
  constructor(html) {
    this.html = html;
    this.index = 0; // 当前解析位置
    this.root = { type: 'root', children: [] }; // 根节点
    this.currentParent = this.root; // 当前父节点
    this.stack = [this.root]; // 栈用来管理父子关系
  }

  // 主解析方法
  parse() {
    while (this.index < this.html.length) {
      if (this.html[this.index] === '<') {
        if (this.html[this.index + 1] === '/') {
          // 解析结束标签
          this.parseEndTag();
        } else {
          // 解析开始标签
          this.parseStartTag();
        }
      } else {
        // 解析文本节点
        this.parseText();
      }
    }
    return this.root;
  }

  // 解析开始标签 <tagname>
  parseStartTag() {
    const startTagMatch = this.html.slice(this.index).match(/^<([\w-]+)/);
    if (startTagMatch) {
      const tagName = startTagMatch[1];
      const element = {
        type: 'element',
        tagName,
        attributes: {},
        children: [],
      };

      // 将当前元素加入到父节点的 children 中
      this.currentParent.children.push(element);

      // 更新解析位置到标签结束
      this.index += startTagMatch[0].length;

      // 解析标签内的属性
      element.attributes = this.parseAttributes();

      // 如果不是自闭合标签，入栈并设置为当前父节点
      if (!this.isSelfClosingTag(tagName)) {
        this.stack.push(element);
        this.currentParent = element;
      }
    }
  }

  // 解析结束标签 </tagname>
  parseEndTag() {
    const endTagMatch = this.html.slice(this.index).match(/^<\/([\w-]+)>/);
    if (endTagMatch) {
      const tagName = endTagMatch[1];
      if (this.currentParent.tagName === tagName) {
        // 出栈，回到上一级父节点
        this.stack.pop();
        this.currentParent = this.stack[this.stack.length - 1];
      }
      // 更新解析位置
      this.index += endTagMatch[0].length;
    }
  }

  // 解析文本节点
  parseText() {
    const textEnd = this.html.indexOf('<', this.index);
    const textContent = this.html.slice(this.index, textEnd !== -1 ? textEnd : this.html.length).trim();
    if (textContent) {
      this.currentParent.children.push({
        type: 'text',
        content: textContent,
      });
    }
    this.index = textEnd !== -1 ? textEnd : this.html.length;
  }

  // 解析标签中的属性
  parseAttributes() {
    const attributes = {};
    let attrMatch;
    // 正则表达式匹配属性名和属性值
    const attrRegex = /([\w-]+)(?:="([^"]*)")?/g;

    while ((attrMatch = attrRegex.exec(this.html.slice(this.index))) && this.html[this.index] !== '>' && this.html[this.index] !== '/') {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2] || '';
      attributes[attrName] = attrValue;
    }

    // 移动解析位置到属性结束位置（即 '>' 或 '/>' 之后）
    this.index += this.html.slice(this.index).indexOf('>') + 1;
    return attributes;
  }

  // 判断是否为自闭合标签
  isSelfClosingTag(tagName) {
    return ['br', 'img', 'input', 'hr', 'meta', 'link'].includes(tagName);
  }
}

// 示例 HTML 字符串
const htmlString = `<div class="container">
  <h1>Hello, World!</h1>
  <img src="image.jpg" alt="An image">
  <p>This is a paragraph</p>
</div>`;

// 解析 HTML
const parser = new HTMLParser(htmlString);
const parsedHTML = parser.parse();

// 输出解析结果
console.log(JSON.stringify(parsedHTML, null, 2));
