import Component,{PureComponent} from "./component";
import { wrapToVdom } from "../utils";
/**
 *
 * @param {*} type 元素的类型
 * @param {*} config 配置
 * @param {*} children 子节点
 */
function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref; // 添加ref
    delete config.ref;
    key = config.key; // 添加key
    delete config.key;
  }
  let props = { ...config };
  // 把额外的参数，拼接到子节点中
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    props.children = wrapToVdom(children);
  }

  return {
    type,
    props,
    ref,
    key,
  };
}

export function createRef() {
  return {
    current: null,
  };
}

function createContext(initialValue = {}) {
  let context = { Provider, Consumer };
  function Provider(props) {
    context._currentValue = context._currentValue || initialValue;
    Object.assign(context._currentValue, props.value);
    return props.children;
  }
  function Consumer(props) {
    return props.children(context._currentValue);
  }
  return context;
}
function cloneElement(oldElement, newProps, ...newChildren) {
  let children = oldElement.props.children;
  //有可能是一个undefined,一个对象，是一个数组
  if (children) {
    if (!Array.isArray(children)) {
      //如果一个儿子，独生子
      children = [children];
    }
  } else {
    children = [];
  }
  children.push(...newChildren);
  // 把子元素都变成数组的目的是，统一进行虚拟dom的包裹
  children = children.map(wrapToVdom);
  if (children.length === 0) {
    children = undefined;
  } else if (children.length === 1) {
    children = children[0];
  }
  newProps.children = children;
  let props = { ...oldElement.props, ...newProps };
  //oldElement type key ref props....
  return { ...oldElement, props };
}

const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  createContext,
  cloneElement,
};
export default React;
