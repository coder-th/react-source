import { addEvent } from "./event";

/**
 * 渲染元素
 * @param {*} vdom 虚拟DOM
 * @param {*} container 挂载的容器
 */
function render(vdom, container) {
  mount(vdom, container);
}
/**
 * vdom 变成真实DOM
 * @param {*} vdom
 */
export function createDOM(vdom) {
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  let { type, props } = vdom;
  let dom;
  // 如果要渲染的是自定义组件
  if (typeof type === "function") {
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
    updateProps(dom, props);
    // 处理子节点
    // 如果只有一个子节点，直接渲染子节点
    if (typeof props.children === "object" && props.children.type) {
      // 将子节点挂载到自己身上
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    } else {
      //子节点就是字符串或者数字
      dom.textContent = props.children.toString();
    }
  }

  return dom;
}
/**
 * 更新dom 上的属性
 * @param {*} dom
 * @param {*} props
 */
function updateProps(dom, props) {
  for (let key in props) {
    if (key === "children") continue;
    if (key === "style") {
      // 样式处理
      let styleObj = props.style;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      // 给dom添加事件处理
      addEvent(dom, key.toLocaleLowerCase(), props[key])
    } else {
      // 传的属性更新到dom 上
      dom[key] = props[key];
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
  const dom = createDOM(vdom);
  container.appendChild(dom);
  dom.componentDidMount && dom.componentDidMount()
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
  // 实例上有componentWillMount这个生命周期
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount.call(classInstance)
  }
  //调用实例的render方法返回要渲染的虚拟DOM对象
  let oldRenderVdom = classInstance.render();
  //把这个将要渲染的虚拟dom添加到类的实例上
  classInstance.oldRenderVdom = vdom.oldRenderVdom = oldRenderVdom;
  //根据虚拟DOM对象创建真实DOM对象
  let dom = createDOM(oldRenderVdom);
  //为以后类组件的更新,把真实DOM挂载到了类的实例上
  classInstance.dom = dom
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
const ReactDOM = { render, createDOM };
export default ReactDOM;
