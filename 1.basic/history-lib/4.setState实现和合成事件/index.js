import React from './react';
import ReactDOM from './react-dom';
//import {updateQueue} from './Component';
let root = document.getElementById('root');
/**
 * 1.如何绑定事件
 * 2.如何实现组件更新
 * 3.如何实现组件的异步更新
 */
class Counter extends React.Component{
    constructor(props){
        super(props);
        this.state = {number:0};
    }
    //event是事件对象,但是它并不是DOM原生的,而是经过React封装的
    handleClick = (event)=>{
       /*      
       console.log(event);
        event.persist();//把这个event进行持久化
        setTimeout(()=>{
            console.log(event);
        }); */
        //updateQueue.isBatchingUpdate=true;
        this.setState({number: this.state.number+1}); 
        console.log(this.state.number);//0
        this.setState({number: this.state.number+1}); 
        console.log(this.state.number);//0
        setTimeout(()=>{
            this.setState({number: this.state.number+1}); 
            console.log(this.state.number);//2
            this.setState({number: this.state.number+1}); 
            console.log(this.state.number);//3
        });
        //这个异步指的是执行顺序,并非语法意义上的异步,只是延迟更新的意思
        //updateQueue.batchUpdate();
    }
    clickDiv = ()=>{
        console.log('clickDiv');
    }
    clickButtonA = ()=>{
        console.log('clickButtonA');
    }
    clickButtonB = ()=>{
        console.log('clickButtonB');
    }
    render(){
        return (
            <div onClick={this.clickDiv}>
                <p>{this.state.number}</p>
                <button onClick={this.clickButtonA}>buttonA</button>
                <button onClick={this.clickButtonB}>buttonB</button>
            </div>
        )
    }
}

ReactDOM.render(<Counter/>,root);