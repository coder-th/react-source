import { REACT_TEXT } from "../utils/constants";
import { addEvent } from "./event";
/**
 * 让函数可以使用状态
 * @param {*} initialState
 */
let hookStates = [];
//hook索引，表示当前的hook
let hookIndex = 0;
let scheduleUpdate;
/**
 * 渲染元素
 * @param {*} vdom 虚拟DOM
 * @param {*} container 挂载的容器
 */
function render(vdom, container) {
  mount(vdom, container);
  scheduleUpdate = () => {
    hookIndex = 0;
    compareTwoVdom(container, vdom, vdom);
  };
}
/**
 * vdom 变成真实DOM
 * @param {*} vdom
 */
export function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    // 如果要渲染的是自定义组件
    if (type.isReactComponent) {
      // 是一个类组件
      return mountClassComponent(vdom);
    } else {
      // 是一个函数组件
      return mountFunctionComponent(vdom);
    }
  } else {
    // 是一个虚拟dom 元素，也就是react元素,创建原生组件
    dom = document.createElement(type);
  }

  if (props) {
    updateProps(dom, {}, props);
    // 处理子节点
    // 如果只有一个子节点，直接渲染子节点
    if (typeof props.children === "object" && props.children.type) {
      // 将子节点挂载到自己身上
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  // 真实DOM保存到虚拟DOM上
  vdom.dom = dom;
  // 将真实dom保存在虚拟dom的ref上
  if (ref) {
    ref.current = dom;
  }
  return dom;
}
/**
 * 更新dom 上的属性
 * @param {*} dom
 * @param {*} props
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") continue;
    if (key === "style") {
      // 样式处理
      let styleObj = newProps.style;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      // 给dom添加事件处理
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      // 传的属性更新到dom 上
      dom[key] = newProps[key];
    }
  }
}
/**
 * 挂载元素
 * @param {*} vdom
 * @param {*} container
 */
function mount(vdom, container) {
  /**
   * 思路：
   * 1. VDOM 转换为 真实DOM
   * 2. VDOM上的属性更新同步到真实DOM
   * 3. 把虚拟DOM上的儿子变成真实DOM挂在到自己身上
   * 4. 把自己挂在到容器上
   */
  if (vdom) {
    const dom = createDOM(vdom);
    container.appendChild(dom);
    dom.componentDidMount && dom.componentDidMount();
  }
}
/**
 * 挂载子节点
 * @param {*} childrenVDOM 子节点的虚拟DOM
 * @param {*} parentDOM 父节点的真实DOM
 */
function reconcileChildren(childrenVDOM, parentDOM) {
  for (let i = 0; i < childrenVDOM.length; i++) {
    const childVDOM = childrenVDOM[i];
    mount(childVDOM, parentDOM);
  }
}
/**
 * 挂载函数组件
 * @param {*} vdom
 * @returns
 */
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let oldRenderVdom = type(props);
  vdom.oldRenderVdom = oldRenderVdom;
  return createDOM(oldRenderVdom);
}
/**
 * 挂载类组件
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  //解构类的定义和类的属性对象
  let { type, props } = vdom;
  //创建类的实例
  let classInstance = new type(props);
  // 在组件类的静态属性，如果没有这个属性，那么实例的context就取不到值
  if (type.contextType) {
    classInstance.context = type.contextType._currentValue;
  }
  // 保存当前实例到虚拟dom中
  vdom.classInstance = classInstance;
  // 实例上有componentWillMount这个生命周期
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount.call(classInstance);
  }
  // 实例上有getDerivedStateFromProps
  if (type.getDerivedStateFromProps) {
    let partialState = type.getDerivedStateFromProps(
      classInstance.props,
      classInstance.state
    );
    if (partialState) {
      classInstance.state = { ...classInstance.state, ...partialState };
    }
  }
  //调用实例的render方法返回要渲染的虚拟DOM对象
  let oldRenderVdom = classInstance.render();
  //把这个将要渲染的虚拟dom添加到类的实例上
  classInstance.oldRenderVdom = vdom.oldRenderVdom = oldRenderVdom;
  //根据虚拟DOM对象创建真实DOM对象
  let dom = createDOM(oldRenderVdom);
  //为以后类组件的更新,把真实DOM挂载到了类的实例上
  classInstance.dom = dom;
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
/**
 * 对当前组件进行DOM-DIFF
 * @param {*} parentDOM 父真实节点
 * @param {*} oldVdom
 * @param {*} newVdom
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  // 新旧节点都是Null
  if (!oldVdom && !newVdom) return;
  // 新的没有，老的有，则删除
  if (oldVdom && !newVdom) {
    // 找到虚拟dom对应的真实dom
    let currentdom = findDOM(oldVdom);
    if (currentdom) {
      console.log(parentDOM, currentdom, oldVdom);
      parentDOM.removeChild(currentdom);
    }
    // 执行组件的卸载
    if (oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
  } else if (!oldVdom && newVdom) {
    // 老的没有，新的有，则新建dom节点，并且插入
    let newDOM = createDOM(newVdom);
    if (nextDOM) {
      nextDOM.insertBefore(nextDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
    //在这里执行新的虚拟DOM节点的DidMount事件
    if (newVdom.classInstance && newVdom.classInstance.componentDidMount) {
      newVdom.classInstance.componentDidMount();
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    // 如果新旧都有，但是标签不一样
    let oldDOM = findDOM(oldVdom);
    let newDOM = createDOM(newVdom);
    parentDOM.replaceChild(newDOM, oldDOM);
    // 执行组件的卸载
    if (oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
    // 执行新组件的挂载操作
    if (newVdom.classInstance && newVdom.classInstance.componentDidMount) {
      newVdom.classInstance.componentDidMount();
    }
  } else {
    // 如果新旧都有，并且标签一样，就可以复用老的DOM节点，进行深度的DOM-DIFF
    updateElement(oldVdom, newVdom);
  }
}
/**
 * 根据虚拟dom查找对应的真实dom
 * @param {*} vdom
 */
export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      // 类组件
      dom = findDOM(vdom.oldRenderVdom);
    } else {
      // 函数组件
      dom = findDOM(vdom.oldRenderVdom);
    }
  } else {
    dom = vdom.dom;
  }
  return dom;
}
/**
 * 深度比较新旧的虚拟dom
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateElement(oldVdom, newVdom) {
  // 二者都是文本节点
  if (oldVdom.type === REACT_TEXT) {
    // 原生组件，复用老的
    let currentDOM = (newVdom.dom = oldVdom.dom);
    currentDOM && (currentDOM.textContent = newVdom.props.content); // 直接修改文本内容
  } else if (typeof oldVdom.type === "string") {
    // 原生组件，复用老的
    let currentDOM = (newVdom.dom = oldVdom.dom);
    // 更新自身的属性
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    // 更新子节点
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom); //老的和新的都是类组件，进行类组件更新
    } else {
      updateFunctionComponent(oldVdom, newVdom); //老的和新的都是函数组件，进行函数数组更新
    }
  }
}
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode; //div#counter
  let { type, props } = newVdom; //FunctionCounter {count:2,children:[div]}
  let oldRenderVdom = oldVdom.oldRenderVdom; //老的渲染出来的vdom div#counter-function>0
  let newRenderVdom = type(props); //新的vdom div#counter-function>2
  compareTwoVdom(parentDOM, oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  //因为children可能是对象，也可能是数组,为了方便按索引比较，全部格式化为数组
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    //在儿子们里查找，找索引是大于当前索引的
    let nextDOM = oldVChildren.find(
      (item, index) => index > i && item && item.dom
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextDOM && nextDOM.dom
    );
  }
}
/**
 * 如果新旧节点都是类组件
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance); //类的实例需要复用。类的实例不管更新多少只有一个
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom; //上一次的这个类组件的渲染出来的虚拟DOM
  if (classInstance.componentWillReceiveProps) {
    //组件将要接收到新的属性
    classInstance.componentWillReceiveProps();
  }

  classInstance.updater.emitUpdate(newVdom.props);
}

export function useState(initialState) {
  if (typeof initialState === "function") {
    initialState = initialState();
  }
  // 把老的指取出来
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  let currentIndex = hookIndex;
  function setState(newState) {
    if (typeof newState === "function") {
      // 拿到最新的值
      newState = newState(hookStates[currentIndex]);
    }
    hookStates[currentIndex] = newState;
    scheduleUpdate();
  }
  return [hookStates[hookIndex++], setState];
}

export function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDeps] = hookStates[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = factory();
      hookStates[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    // 第一次渲染
    let newMemo = factory();
    hookStates[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
export function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDeps] = hookStates[hookIndex];
    let same = deps.every((item, index) => item === lastDeps[index]);
    if (same) {
      //每一个hook都要占用一个索引
      hookIndex++;
      return lastCallback;
    } else {
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    // 第一次渲染
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}
const ReactDOM = { render, createDOM };
export default ReactDOM;
