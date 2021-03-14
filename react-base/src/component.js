class Component {
  // 用来标识是不是一个类组件
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
  render() {
    throw new Error("此方法是抽象方法,需要子类实现");
  }
}

export default Component;
