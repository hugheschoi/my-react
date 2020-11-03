import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');

/**
 * 当你在事件处理函数中执行setState,组件并不会立刻渲染,而是先把更新存起来,等事件处理函数执行完了再会批量更新（执行完，你取的值才会变）
 * 1.在事件处理函数中或生命周期函数中批量更新的 异步的
 * 2.其它地方都是直接同步更新的,比如说setTimeout
 * 3.要谨慎处理this问题
 *    1.用箭头函数 首选方案
 *    2.如果不使用箭头函数,普通函数中的this=undefined,可在render使用匿名函数
 *    3.可以在构造函数中重写this.handleClick,绑死this指针
 *    4.如何要传参数,只能使用匿名函数
 */

class Counter extends React.Component{
  constructor (props) {
    super(props)
    this.state = {
      number: 0,
      name: 'xxx' // 当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state, Object.assign或扩展运算符 只改number不会删掉你name
    }
    this.handleClick1 = this.handleClick1.bind(this)
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
  handleClick1 () {
    // setState可以放函数, 函数的参数是上一个的状态state
    this.setState((state) => ({ number: state.number + 1 }), () => {
      console.log('x', this.state.number) // 2 setState第二个参数是回调，可以拿到最后更新的state
    })
    console.log(this.state.number) // 0
    this.setState((state) => ({ number: state.number + 1 }))
    console.log(this.state.number) // 0
    // render的结果是2
  }
  handleReduce(){
    console.log('handleReduce')
    this.setState({ number: this.state.number - 1 })
  }

  handleTest (key) {
    console.log(key)
  }

  render(){
    return (
        <div>
            <h1>{ this.state.number }</h1>
            <button onClick={this.handleClick1}>+</button>
            <button onClick={() => this.handleReduce()}>-</button>
            <button onClick={() => this.handleTest('test')}>test</button>
        </div>
    )
  }
}
let element = <Counter />
ReactDOM.render(element, root)
