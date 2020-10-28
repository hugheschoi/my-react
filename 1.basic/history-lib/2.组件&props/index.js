import React from './react';
import ReactDOM from './react-dom';
let root = document.getElementById('root');

/**
 * 定义一个函数组件，大写字母
 * @param {*} props 
 */

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
// 函数组件
let element = <Welcome name="title"/>
// console.log(element, JSON.stringify(element,null,2));
// ReactDOM.render(element,root);


class Welcome2 extends React.Component {
  render(){
      return <h1>Hello, {this.props.name}</h1>;
  }
}

let element2 = <Welcome2 name="title"/>
console.log(element2, JSON.stringify(element,null,2));
ReactDOM.render(element2,root);

/**
 * jsx=React.createElement
 * 在浏览器执行的时候,createElement方法的返回值才是React元素=虚拟DOM
 * jsx 是一种语法,或者是一种写代码的方法 ,打包的时候会进行编译,编译成React.createElement
 * React.createElement只是创建React元素的方法
 * React元素=虚拟DOM,也就是一个普通的JSX对象,描述了真实DOM的样子
 * 一直说的React元素，是不是写的jsx就是react元素 ?不是的

 */
