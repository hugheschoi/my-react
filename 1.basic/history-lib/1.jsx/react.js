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