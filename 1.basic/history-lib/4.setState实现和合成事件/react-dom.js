import {addEvent} from './event';
/**
 * 虚拟DOM转换成真实DOM,并插入到容器里
 * @param {*} vdom 虚拟DOM
 * @param {*} container 插入到哪个容器里
 */
function render(vdom,container){
    const dom = createDOM(vdom);
    container.appendChild(dom);
}
/**
 * 把虚拟DOM变成真实DOM
 * @param {*} vdom null 数字 字符串 React元素 不能是数组
 */
export function createDOM(vdom){
    //如果vdom是一个字符串或者数字的话,创建一个文本的DOM节点返回
    if(typeof vdom === 'string'||typeof vdom === 'number'){
        return document.createTextNode(vdom);
    }
    if(!vdom){
        return '';
    }
    //否则就是一个React元素
    let {type,props} = vdom;
    let dom;
    //如果是一个组件的话,还要区分到底是类组件还是函数组件
    if(typeof type === 'function'){
        if(type.isReactComponent){//说明这个type是一个类组件的虚拟DOM元素
            return updateClassComponent(vdom);
        } else{
            return updateFunctionComponent(vdom);
        }
    }else{//如果是一个原生元素
        dom = document.createElement(type);//span div
    }
    updateProps(dom,props);//更新属性,把虚拟DOM上的属性设置到真实DOM上
    //处理子节点如果子节点就是一个单节点,并且是字符串或者数字的话
    if(typeof props.children === 'string'||typeof props.children === 'number'){
        dom.textContent = props.children;//dom.textContent = "hello"
    //说明是一个单React元素节点    
    }else if(typeof props.children=='object' && props.children.type){
        render(props.children,dom);
    //如果儿子是一个数组,说明有多个子节点
    }else if(Array.isArray(props.children)){
        reconcileChildren(props.children,dom);
    }else{//如果出现了其它的意外情况 null就是空串
        dom.textContent = props.children?props.children.toString():'';
    }
    return dom;
}
/**
 * 得到真实DOM
 * 1. 创建类组件的实例
 * 2. 调用实例的render方法得到将要渲染的React元素
 * 3. 把React元素转成真实DOM,挂载到父节点上就可以了
 * @param {*} vdom 类组件的虚拟DOM React元素 
 */
function updateClassComponent(vdom){
    let {type,props} = vdom;
    let classInstance = new type(props);// new Welcome({name:'zhufeng'})
    let renderVdom = classInstance.render();//<h1>hello,zhufeng</h1>;
    const dom = createDOM(renderVdom);
    //让类组件实例上挂一个dom,指向类组件的实例的真实DOM, setState会用到
    classInstance.dom = dom;//div
    return dom;
}
/**
 * 得到真实DOM
 * @param {*} vdom 函数组件的虚拟DOM React元素 
 * vdom {type:Welcome,props:{name:'zhufeng'}}
 * renderVdom {type:'h1',props:{children:'hello,zhufeng'}}
 */
function updateFunctionComponent(vdom){
    let {type,props} = vdom;
    let renderVdom = type(props);//可能是一个原生虚拟DOM,也可能还是一个组件虚拟DOM
    return createDOM(renderVdom);
}
/**
 * 把子节点从虚拟DOM全部转成真实DOM并且插入到父节点中去
 * @param {*} childrenVdom 子节点的虚拟DOM数组
 * @param {*} parentDOM 父节点的真实DOM
 */
function reconcileChildren(childrenVdom,parentDOM){
    childrenVdom.forEach(childVdom=>render(childVdom,parentDOM));
}
/**
 * 把属性对象中的属性设置到DOM元素上
 * @param {*} dom DOM元素
 * @param {*} props 属性对象
 */
function updateProps(dom,newProps){
    for(let key in newProps){
        if(key === 'children') continue;
        if(key === 'style'){
            let styleObj = newProps[key];
            for(let key in styleObj)
                dom.style[key]= styleObj[key];//dom.style.color='red'
        }else if(key.startsWith('on')){//onClick
            //dom.onclick=onClick函数
            //dom[key.toLocaleLowerCase()]=newProps[key];
            addEvent(dom,key.toLowerCase(),newProps[key]);
        }else{
            dom[key]=newProps[key];//dom.className = 'title';
        }
    }
}


let ReactDOM = {render}
export default ReactDOM;