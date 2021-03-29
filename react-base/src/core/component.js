import { compareTwoVdom, findDOM } from "./react-dom";
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
    let { classInstance, pendingStates, callbacks, nextProps } = this;
    // 如果有等待更新的状态对象的话或者新的属性时
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState(nextProps));
      callbacks.forEach((cb) => cb());
      callbacks.length = 0;
    }
  }
  getState(nextProps) {
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
    if (classInstance.constructor.getDerivedStateFromProps) {
      let partialState = classInstance.constructor.getDerivedStateFromProps(
        nextProps,
        classInstance.state
      );
      if (partialState) {
        state = { ...state, ...partialState };
      }
    }
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
  // 强制更新操作
  //一般来说组件的属性和状态变化了才会更新组件
  //如果属性和状态没变，我们也想更新怎么办呢？就可以调用forceUpdate
  forceUpdate() {
    let nextState = this.state;
    let nextProps = this.props;
    if (this.constructor.getDerivedStateFromProps) {
      let partialState = this.constructor.getDerivedStateFromProps(
        nextProps,
        nextState
      );
      if (partialState) {
        nextState = { ...nextState, ...partialState };
      }
    }
    this.state = nextState;
    this.updateComponent();
  }
  // 更新组件
  updateComponent() {
    let newRenderVdom = this.render();
    let oldRenderVdom = this.oldRenderVdom;
    let oldDOM = findDOM(oldRenderVdom);
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
  }
}
/**
 * 判断组件是否需要更新
 * @param {*} classInstance 组件实例
 * @param {*} nextStates 新的状态
 */
function shouldUpdate(classInstance, nextProps, nextStates) {
  let willUpdate = true; //是否要更新
  // 有shouldComponentUpdate，并且返回值是false
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextStates)
  ) {
    willUpdate = false;
  }
  // 如果需要更新，执行更新的生命周期
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  // 不管组件要不要刷新，组件的state属性一定会改变
  classInstance.state = nextStates;
  // 要进行更新
  if (willUpdate) {
    classInstance.updateComponent();
  }
}

export default Component;
