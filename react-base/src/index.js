import ReactDOM from "./core/react-dom";
import React from "./core/react";
// import React from "react";
// import ReactDOM from "react-dom";
class ClassCompoment extends React.Component {
  constructor(props) {
    // props是一个只读的对象
    super(props);
    // 能修改的状态
    this.state = {
      number: 0,
      name: "tianheng",
      count: 0,
    };
  }
  handleClick() {
    this.setState({
      number: this.state.number + 1,
      count: this.state.count + 1,
    });
  }
  render() {
    return (
      <div
        className="hello-func"
        style={{ background: "red", color: "#fff", fontSize: "18px" }}
      >
        <div>
          {this.state.name}
          <span style={{ fontSize: "50px" }}>{this.state.number}</span>
          <button onClick={() => this.handleClick()}>
            <span>+</span>
          </button>
          <ChildCounter count={this.state.count}></ChildCounter>
        </div>
      </div>
    );
  }
}
class ChildCounter extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      name: "tianheng",
      number: 0,
    };
  }
  /**
   * 
   * getDerivedStateFromProps 从组件映射出一个状态 相当于componentWillRecieveProps
   * 这个函数是静态方法，意味着无法访问this,避免出现用户使用this.setState,导致死循环
   * @param {*} nextProps 
   * @param {*} preState 
   * @returns 
   */
  static getDerivedStateFromProps(nextProps, preState) {
    console.log('getDerivedStateFromProps',nextProps, preState);
    const { count } = nextProps;
    if (count % 2 === 0) {
      return { number: count * 2 };
    } else if (count % 3 === 0) {
      return { number: count * 3 }; // 返回的是分状态，会与之前的状态进行合并而不是替换
    }
    return null;// 代表不修改状态
  }
  render() {
    return (
      <div>
        {this.state.name} : {this.state.number}
      </div>
    );
  }
}
ReactDOM.render(
  <ClassCompoment></ClassCompoment>,
  document.getElementById("root")
);
