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
  return dom
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
      dom[key] = props[key] // dom.className = 'title'
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

## 组件 & Props
### 函数组件
写法：
```js
function Welcome(props){
  return <h1>Hello, {props.name}</h1>;
  // return React.createElement("h1", {
  //   className: props.className,
  //   style: {
  //     color: 'red'
  //   }
  // }, React.createElement("span", null, "hello"), "world");
}

// let element = React.createElement(Welcome, { className: "title" });
let element = <Welcome name="title"/>
console.log(element, JSON.stringify(element,null,2));
ReactDOM.render(element,root);
```
函数组件渲染过程：
1. 定义一个React元素,也就 虚拟DOM,它的type=Welcome
2. render方法会执行这个Welcome函数,并传入props对象,得到返回的虚拟DOM
3. 把返回的虚拟DOM转成真实DOM并插入到页面中去

```js
function Hello(props){
  //return <h1>hello,{props.name}</h1>;
  //return React.createElement('h1',null,`hello,${props.name}`);
  return (
    <h1>
      <span>111</span>
      <span>hello，{props.name}</span>
    </h1>
  )
}
function Welcome(props){
  return <Hello name={props.name}/>
}
//type=字符串的话说明是一个原生DOM类型 span h1 div
//type=函数的话 说明它是一个函数组件的元素
//let element = React.createElement(Welcome,{name:'zhufeng'});
let element = <Welcome name="zhufeng"/>
console.log(element);
ReactDOM.render(element,root);
```
实现处理函数组件：
1. jsx 
```js
let element = <Welcome name="zhufeng"/>
console.log(element)
// 打印会得到下面的结果，我们发现函数组件赋值在type上
$$typeof: Symbol(react.element)
key: null
props: {name: "title"}
ref: null
type: ƒ Welcome(props)
_owner: null
_store: {validated: false}
```
```js
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
  let {type, props} = vdom // type可以是函数，值为函数组件
  let dom
  if (typeof type === 'function') {
    return updateFunctionComponent(vdom)
  } else {
    dom = document.createElement(type)
  }
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
  return dom
}
/**
 * 处理函数组件，得到真实dom
 * @param {*} vdom 组件的虚拟dom React元素
 */
function updateFunctionComponent (vdom) {
  let { type, props } = vdom
  let renderVdom = type(props)
  return createDOM(renderVdom)
}
```
### 类组件
1. React元素可能是字符串(原生DOM类型),也可能一个函数(函数组件),也可能是一个类(类组件)
2. 在定义组件元素的时候,会把JSX所有的属性封装成一个props对象传递给组件
3. 组件的名称一定要首字母大写,React是通过首字母来区分原生还是自定义组件
4. 组件要先定义,再使用
5. 组件要返回并且只能返回一个React根元素 JSX expressions must have one parent element

#### 类组件是如何渲染的?
- element定义一个类组件React元素
- render
1. 先创建类组件的实例 new Welcome(props) this.props = props
2. 调用实例的render方法得到一个react元素
3. 把这个React元素转换成真实的DOM元素并插入到页面中去

#### 使用
```js

class Welcome2 extends React.Component {
  render(){
      return <h1>Hello, {this.props.name}</h1>;
  }
}
let element2 = <Welcome2 name="title"/>
console.log(element2, JSON.stringify(element,null,2));
ReactDOM.render(element2,root);

// 打印element2得到这样的结果
{
  $$typeof: Symbol(react.element)
  key: null
  props: {name: "title"}
  ref: null
  type: class Welcome2
  _owner: null
  _store: {validated: false}
}
```
#### 类组件的实现
```js
// React.component
class Component {
  static isReactComponent = true
  constructor (props) {
    this.props = props
  }
}

export default Component
```
```js
// react-dom
if (typeof type === 'function') {
  if (type.isReactComponent) {
    // 说明是类组件的虚拟dom元素
    return updateClassComponent(vdom)
  }
  return updateFunctionComponent(vdom)
} else {
  dom = document.createElement(type)
}
/**
 * 类组件，得到真实dom
 * 1. 
 * @param {*} vdom 类组件的虚拟dom React元素
 */
function updateClassComponent (vdom) {
  let { type, props } = vdom
  let classInstance =  new type(props)
  let renderVdom = classInstance.render()
  const dom = createDOM(renderVdom)
  classInstance.dom = dom // 让类组件实例上挂一个dom，指向类组件的实例的真实dom，setState会用到
  return dom
}
```

## 状态

### 使用

```react
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');

class Clock extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      date: new Date()
    }
    setInterval(this.tick,1000)
  }
  tick = () => {
    this.setState({
      date: new Date()
    })
  }
  render () {
    return (
    	<div>
        <h1>hello</h1>
        <h2>当前时间： {this.state.date.toLocaleTimeString()}</h2>
      </div>
    )
  }
}

ReactDOM.render(<Clock/>, root>
                
```

```react
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');

/**
 * 当你在事件处理函数中执行setState,组件并不会立刻渲染,而是先把更新存起来,等事件处理函数执行完了再会批量更新（执行完，你取的值才会变）
 */

class Counter extends React.Component{
  constructor (props) {
    super(props)
    this.state = {
      number: 0,
      name: 'xxx' // 当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state, Object.assign或扩展运算符 只改number不会删掉你name
    }
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number) // 0
    this.setState({ number: this.state.number + 1 }, () => {
      console.log('x', this.state.number) // x 1
    })
    console.log(this.state.number) // 0
    // render的结果是1
  }
  handleClick1 = () => {
    // setState可以放函数, 函数的参数是上一个的状态state
    this.setState((state) => ({ number: state.number + 1 }), () => {
      console.log('x', this.state.number) // 2 setState第二个参数是回调，可以拿到最后更新的state
    })
    console.log(this.state.number) // 0
    this.setState((state) => ({ number: state.number + 1 }))
    console.log(this.state.number) // 0
    // render的结果是2
  }
  render(){
    return (
        <div>
            <h1>{ this.state.number }</h1> // 1
            <button onClick={this.handleClick}>+</button>
        </div>
    )
  }
}
let element = <Counter />
ReactDOM.render(element, root)

```

 ** 当你在事件处理函数中执行setState,组件并不会立刻渲染,而是先把更新存起来,等事件处理函数执行完了再会批量更新（执行完，你取的值才会变）*

 ** 1.在事件处理函数中或生命周期函数中批量更新的 异步的*

 ** 2.其它地方都是直接同步更新的,比如说setTimeout*

#### 事件处理

 * .要谨慎处理this问题*

 **    1.用箭头函数 首选方案*

```js
handleClick = () => {} // 高级语法 es7
```

 **    2.如果不使用箭头函数,普通函数中的this=undefined,可在render使用匿名函数*

```react
render(){
    return (
        <div>
            <h1>{ this.state.number }</h1>
            <button onClick={this.handleClick}>+</button>
            <button onClick={() => this.handleReduce()>-</button>
        </div>
    )
  }
```



 **    3.可以在构造函数中重写this.handleClick,绑死this指针*

```js
constructor (props) {
  super(props)
  this.handleClick1 = this.handleClick1.bind(this)
}
```



 **    4.如何要传参数,只能使用匿名函数*

```react
render(){
    return (
        <div>
            <h1>{ this.state.number }</h1>
            <button onClick={this.handleClick}>+</button>
            <button onClick={() => this.handleReduce(3)}>-</button>
        </div>
    )
  }
```

** 5. render中bind，性能不好

```react
<button onClick={this.handleClick.bind(this,3)}>+</button>
```



### setState的实现

