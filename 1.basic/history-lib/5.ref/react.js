import Component from './Components'
/**
 * 
 * @param {*} type 元素的类型, 看可能是一个字符串（原生），也可能是一个函数（组件）
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
  let ref
  if (config) {
    delete config._owner
    delete config._store
    ref = config.ref
    delete config.ref
  }
  let props = {...config}
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2)
  }
  // children 可能是很多类型的元素，数组、字符 number null
  props.children = children
  return {
    type, props, ref
  }
}

function createRef() {
  return { current: null }
}

let React = {
  createElement,
  Component,
  createRef
}
export default React