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

## 虚拟DOM实现
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
