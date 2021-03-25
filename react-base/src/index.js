import ReactDOM from "./react-dom";
import React from "./react";
class ClassCompoment extends React.Component {
  constructor(props) {
    // props是一个只读的对象
    super(props);
    // 能修改的状态
    this.state = {
      number: 0,
      name: "tianheng",
      count: 0
    };
  }
  handleClick() {
    this.setState({
      number: this.state.number + 1,
      count: this.state.count + 1 
    });
  }
  // componentWillMount() {
  //   console.log("组件即将挂载",this.state.number);
  // }
  // componentDidMount() {
  //   console.log("组件完成挂载",this.state.number);
  // }
  // shouldComponentUpdate() {
  //   console.log("是否要更新",this.state.number);
  //   return true
  // }
  // componentWillUpdate() {
  //   console.log("组件即将更新",this.state.number);
  // }
  // componentDidUpdate() {
  //   console.log("组件完成更新",this.state.number);
  // }
  render() {
    // console.log("组件挂载",this.state.number);
    return (
      <div
        className="hello-func"
        style={{ background: "red", color: "#fff", fontSize: "18px" }}
      >
        <div>
          {this.state.name}
          <span style={{ fontSize: "50px" }}>{this.state.number}</span>
          <button onClick={() => this.handleClick()}><span>+</span></button>
          {this.state.count % 3 === 0 ? null : <ChildCounter count={this.state.count}></ChildCounter>}
        </div>
      </div>
    );
  }
}
class ChildCounter extends React.Component {
  componentWillMount() {
    console.log("子组件即将挂载");
  }
  componentDidMount() {
    console.log("子组件完成挂载");
  }
  componentWillReceiveProps() {
    console.log("子组件将要接收到新的属性");
  }
  shouldComponentUpdate(nextProps,nextState) {
    console.log("子是否要更新",nextProps.count % 2 === 1 ,nextProps.count);
    return nextProps.count % 2 === 1
  }
  componentWillUpdate() {
    console.log("子组件即将更新");
  }
  componentDidUpdate() {
    console.log("子组件完成更新");
  }
  componentWillUnmount() {
    console.log("子组件将要被卸载");
  }
  render() {
    console.log("子组件计算虚拟DOM");
    return (
      <div>
        {this.props.count}
      </div>
    )
  }
}
ReactDOM.render(
  React.createElement(ClassCompoment),
  document.getElementById("root")
);
/**
 * 
子组件即将挂载
子组件计算虚拟DOM
子组件完成挂载
子组件将要接收到新的属性
子是否要更新 false 2
子组件将要被卸载
子组件即将挂载
子组件计算虚拟DOM
子组件完成挂载
子组件将要接收到新的属性
子是否要更新 true 5
子组件即将更新
子组件计算虚拟DOM
子组件完成更新
子组件将要被卸载
 */