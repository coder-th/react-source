import { createDOM } from "./react-dom";
/**
 * 合成事件：
 *  1. 在react中，事件的更新可能是异步的也可能是同步的，是批量的
 *  调用setState之后，状态并没有立即更新，而是先缓存起来了
 *  等事件处理函数执行完成后，在进行批量更新，一次更新后重新渲染
 */
//更新队列
export let updateQueue = {
  isBatchingUpdate: false, //当前是否处于批量更新模式,默认值是false
  updaters: [],
  batchUpdate() {
    //批量更新
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.length = 0;
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []; //等待生效的状态,可能是一个对象，也可能是一个函数
    this.callbacks = [];
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState); ///等待更新的或者说等待生效的状态
    if (typeof callback === "function") this.callbacks.push(callback); //状态更新后的回调
    this.emitUpdate();
  }
  //一个组件不管属性变了，还是状态变了，都会更新,
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBatchingUpdate) {
      //如果当前的批量模式。先缓存updater
      updateQueue.updaters.push(this); //本次setState调用结束
    } else {
      this.updateComponent(); //直接更新组件
    }
  }
  updateComponent() {
    let { classInstance, pendingStates, callbacks } = this;
    // 如果有等待更新的状态对象的话
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
      callbacks.forEach(cb => cb())
      callbacks.length = 0
    }
  }
  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      // 如果setStatea第一个参数传过来的是一个函数
      if (typeof nextState === "function") {
        nextState = nextState.call(classInstance, state);
      }
      state = { ...state, ...nextState };
    });
    // 清空状态
    pendingStates.length = 0;
    return state;
  }
}
class Component {
  // 用来标识是不是一个类组件
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
  forceUpdate() {
    if (this.componentWillUpdate) {
      this.componentWillUpdate()
    }
    let newRenderVdom = this.render()
    // updateClassComponent(this, newRenderVdom)
    compareTwoVdom(this.oldRenderVdom.dom.parentNode,this.oldRenderVdom,newRenderVdom)
    if (this.componentDidUpdate) {
      this.componentDidUpdate()
    }
  }
}
function updateClassComponent(classInstance, newVdom) {
  let oldDOM = classInstance.dom; // 取到上一次渲染出的真实DOM
  // 得到新的真实dom
  let newDOM = createDOM(newVdom);
  // 替换原来的真实DOM
  oldDOM.parentNode.replaceChild(newDOM, oldDOM);
  // 保存新的真实DOM到实例中，方便下次进行调用
  classInstance.dom = newDOM;
}
/**
 * 判断组件是否需要更新
 * @param {*} classInstance 组件实例
 * @param {*} nextStates 新的状态
 */
function shouldUpdate(classInstance, nextStates) {
  // 不管组件要不要刷新，组件的state属性一定会改变
  classInstance.state = nextStates
  // 有shouldComponentUpdate，并且返回值是false
  if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(classInstance.props, classInstance.state)) return
  // 要进行更新
  classInstance.forceUpdate()
}

function compareTwoVdom() {

}

export default Component;
