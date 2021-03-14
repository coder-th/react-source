import {createDOM} from "./react-dom"
class Component {
  // 用来标识是不是一个类组件
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
  setState(partialState) {
    let state = this.state
    this.state = {...state,...partialState}
    let newVdom = this.render();
    updateClassComponent(this,newVdom)
  }
  render() {
    throw new Error("此方法是抽象方法,需要子类实现");
  }
}
function updateClassComponent(classInstance,newVdom) {
    let oldDOM = classInstance.dom;// 取到上一次渲染出的真实DOM
    // 得到新的真实dom
    let newDOM = createDOM(newVdom)
    // 替换原来的真实DOM
    oldDOM.parentNode.replaceChild(newDOM,oldDOM)
    // 保存新的真实DOM到实例中，方便下次进行调用
    classInstance.dom = newDOM;
}

export default Component;
