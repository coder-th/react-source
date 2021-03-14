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
function createDOM(vdom) {
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  let { type, props } = vdom;
  // 是一个虚拟dom 元素，也就是react元素,创建原生组件
  let dom = document.createElement(type);

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
      dom.textContent = props.children ? props.children.toString() : "";
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
const ReactDOM = { render };
export default ReactDOM;
