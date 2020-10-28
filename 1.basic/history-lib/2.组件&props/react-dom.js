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
  let dom
  // 
  if (typeof type === 'function') {
    if (type.isReactComponent) {
      // 说明是类组件的虚拟dom元素
      return updateClassComponent(vdom)
    }
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
 * 函数组件，得到真实dom
 * @param {*} vdom 函数组件的虚拟dom React元素
 */
function updateFunctionComponent (vdom) {
  let { type, props } = vdom
  let renderVdom = type(props)
  return createDOM(renderVdom)
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