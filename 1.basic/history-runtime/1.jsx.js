import React from 'react';
import ReactDOM from 'react-dom';

// ReactDOM.render(
//   <h1>hello</h1>,
//   document.getElementById('root')
// );

/** 上面是通过 babel preset转成下面的代码 
 * 通过createElement 生成 虚拟dom
 * ReactDOM.render(虚拟dom, 容器) 生成 dom并插入到容器中
ReactDOM.render( 
  React.createElement("h1", null, "hello"),
  document.getElementById('root')
);
 */
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

/** 
 * 参数1 标签的类型 h1 span div
 * 参数2 属性的JS对象
 * 参数3往后的都是儿子们
 */
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

// 一些用法
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