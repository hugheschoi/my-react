# React basic
## JSX
JSX 通过 babel preset转成 createElement方法，createElement方法会生成 虚拟dom。浏览器执行，用 ReactDOM.render 生成真实的DOM，并插入到容器中
```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>hello</h1>,
  document.getElementById('root')
);

/** 
 * 上面是通过 babel preset转成下面的浏览器识别的代码 
 * 通过createElement 生成 虚拟dom
 * ReactDOM.render(虚拟dom, 容器) 生成 dom并插入到容器中
 * */
ReactDOM.render( 
  React.createElement("h1", null, "hello"),
  document.getElementById('root')
);

```
我们打印一下createElemnt产生的虚拟dom，看看他的结构
```js
var element = React.createElement("h1", null, "Hello");
console.log(JSON.stringify(element,null,2));
/*
{
  "type": "h1",
  "key": null,
  "ref": null,
  "props": {
    "children": "Hello"
  },
  "_owner": null,
  "_store": {}
}
*/
```
createElement 有有三个参数
1. 参数1 标签的类型 h1 span div
2. 参数2 属性的JS对象
3. 参数3往后的都是儿子们
```js
var element = (
  <h1 className="title" style={{color:'red'}}>
    <span>hello</span>world
  </h1>
)
// babel react reset 转换成
var element = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, React.createElement("span", null, "hello"), "world");
/**
 * 你以前在写JS
 * jsx很像html,更像js,而非html  里面的写法更多的是JS写法   document.getElementById('root').className='title'
 * 
 * <h1>hello</h1> 非常直观
 *  createElement不是那么直观
 * JSX在webpack打包的时候,会走babel-loader,babel-loader会把jsx转义成createElement
 * 真正浏览器跑的时候就是createElement,在浏览器里运行的时候,才会执行createElement方法得到虚拟DOM
 * React元素=虚拟DOM
 */
```
### JSX的执行过程
1. 我们写代码的时候写的JSX `<h1>hello</h1>`
2. 打包的时候,会调用webpack中的babel-loader把JSX写法转换成JS写法 createElement
3. 我们在浏览器里执行createElement,得到虚拟DOM,也就是React元素,它是一个普通的JS对象,描述了你在界面上想看到的DOM元素的样式
4. 把React元素(虚拟DOM)给了ReactDOM.render,render会把虚拟DOM转成真实DOM,并且插入页面

### jsx表达式
jsx表达式 可以把一些表达式放在大括号里。

- jsx表达式 可以把一些表达式放在大括号里
表达式就是变量、常量和运算符的组合 1+2  a+b
属性名不能是JS的关键字 class=>className for=>htmlFor style=对象而字符串

- jsx也是对象 if for 中使用
```js
let element = <h1 className={title} style={{color:'red'}} htmlFor="username">{title}</h1>


let names = ['大毛','二毛','三毛'];
//把一个字符串的数组映射为一个li的数组
let lis = names.map(name=><li>{name}</li>);
ReactDOM.render(
  <ul>
    {lis}
  </ul>,
  document.getElementById('root')
);
```
### 更新元素渲染
- React 元素都是immutable不可变的。当元素被创建之后，你是无法改变其内容或属性的。一个元素就好像是动画里的一帧，它代表应用界面在某一时间点的样子
- 更新界面的唯一办法是创建一个新的元素，然后将它传入ReactDOM.render()方法
```js
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');
function tick() {
    // element是immutable不可变的
    const element = (
        <div>
            {new Date().toLocaleTimeString()}
        </div>
    );
    ReactDOM.render(element, root);
}
setInterval(tick, 1000);
```
只会更新必要的部分: React DOM 首先会比较元素内容先后的不同，而在渲染过程中只会更新改变了的部分

React 的domdiff，是一层一层全量地比较
Vue 的dom-diff 是有监听的watcher，监听变量关联的元素进行domdiff（domdiff 部分元素） 
所以react 的domdiff比 vue 的性能要差， 所以react需要fiber提高性能

## 虚拟DOM的初步实现
react的虚拟DOM结构如下：
```js
{
  "type": "h1",
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": "span",
        "props": {
          "children": "hello"
        }
      },
      "world"
    ]
  }
}
```

```js
// react.js
/**
 * 
 * @param {*} type 元素的类型
 * @param {*} config  配置的对象，一般来说就是属性对象
 * @param {*} children 儿子元素 可能很多 Array.prototype.slice.call(arguments, 2)
 */
// let element = React.createElement("h1", {
//   className: "title",
//   style: {
//     color: 'red'
//   }
// }, React.createElement("span", null, "hello"), "world");
function createElement (type, config, children) {
  if (config) {
    delete config._owner
    delete config._store
  }
  let props = {...config}
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2)
  }
  // children 可能是很多类型的元素，数组、字符 number null
  props.children = children
  return {
    type, props
  }
}

let React = {
  createElement
}
export default React
```
```js
// react-dom.js
/**
 * 虚拟dom转换成真实dom，并插入到容器里
 * @param {*} vdom 虚拟dom
 * @param {*} container 插入的容器
 */
function render (vdom, container) {
  const dom = createDOM(vdom)
  container.appendChild(dom)
}
/**
 * 虚拟dom转换成真实dom
 * @param {*} vdom null 数字 字符串 react元素
 */
function createDOM(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom)
  }
  if (!vdom) return ''
  // 否则是一个react元素
  let {type, props} = vdom
  let dom = document.createElement(type)
  updateProps(dom, props) // 更新属性
  // 处理子节点
  if (typeof vdom.props.children === 'string' || typeof vdom.props.children === 'number' ) {
    dom.textContent = props.children
  } else if (typeof props.children === 'object' && props.children.type) {
    // 如果是单元素节点
    render(props.children, dom)
  } else if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom)
  } else { // 其他意外情况
    dom.textContent = props.children ?  props.children.toString() : ''
  }
}

/**
 * 把属性对象设置到dom上
 * @param {*} dom dom
 * @param {*} props 属性对象
 */
function updateProps (dom, props) {
  for (let key in props) {
    if (key === 'children') continue
    if (key === 'style') {
      let styleObj = props[key]
      for (let key in styleObj) {
        dom.style[key] = styleObj[key] // dom.style.color = 'red
      }
    } else {
      dom.style[key] = props[key] // dom.className = 'title'
    }
  }
}

/**
 * 把子节点从虚拟dom全部转成真实dom并插入父节点中去
 * @param {*} childrenVdom 子节点虚拟dom数组
 * @param {*} parentDOM 父节点的真实dom
 */
function reconcileChildren(childrenVdom, parentDOM) {
  childrenVdom.forEach(childVdom => render(childVdom, parentDOM))
}

let ReactDOM = { render }
export default ReactDOM
```
