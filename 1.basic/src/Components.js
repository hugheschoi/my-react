import {createDOM} from './react-dom';
import { isFunction } from './util'
export let updateQueue = {
  updaters: [],
  isBatchingUpdate: false, // 批量更新
  add (updater) {
    this.updaters.push(updater)
  },
  batchUpdate () {
    this.updaters.forEach(updater => updater.updateComponent())
    this.isBatchingUpdate = false
  }
}

class Updater {
  constructor (classInstance) {
    this.classInstance = classInstance // 类组件的实例
    this.pendingStates = [] // 俄等待更新的状态
  }
  addState (partialState) {
    this.pendingStates.push(partialState)
    updateQueue.isBatchingUpdate ? updateQueue.add(this) : this.updateComponent()
  }
  updateComponent () {
    let { classInstance, pendingStates } = this
    if (pendingStates.length > 0) {
      classInstance.state = this.getState()
      classInstance.forceUpdate()
    }
    classInstance.state = {...classInstance.state,  ...this.pendingStates}
  }
  getState () {
    let { classInstance, pendingStates } = this
    let state = classInstance.state
    if (pendingStates.length > 0) {
      pendingStates.forEach(nextState => {
        if (isFunction(nextState)) {
          nextState = nextState(state)
        }
        state = {...state, ...nextState}
      })
      pendingStates.length = 0
    }
    return state
  }
}

class Component {
  static isReactComponent = true
  constructor (props) {
    this.props = props
    this.state = {}
    // 会为每个组件实例配一个updater
    this.updater = new Updater(this)
  }

  /**
   * 
   * @param {*} partialState 新的部分状态
   */
  setState (partialState) {
    this.updater.addState(partialState)
    // // 合并状态
    // this.state = {...this.state, ...partialState}
    // // 重新调用render
    // let renderVdom = this.render()
    // updateClassInstance(this, renderVdom)
  }
  forceUpdate () {
    let renderVdom = this.render()
    updateClassComponent(this, renderVdom)
  }
}

function updateClassComponent (classInstance, renderVdom) {
  let oldDOM = classInstance.dom
  let newDOM = createDOM(renderVdom)
  oldDOM.parentNode.replaceChild(newDOM, oldDOM)
  classInstance.dom = newDOM
}

export default Component