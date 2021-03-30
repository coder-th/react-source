import ReactDOM from "./core/react-dom";
import React from "./core/react";
// import React from "react";
// import ReactDOM from "react-dom";

// render props 可以想象成插槽，是有逻辑，扩展内容， 而HOC是有内容，扩展逻辑
// render Props写法一
// 将内容添加在children中，children是一个函数
/* class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };
  }
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}
ReactDOM.render(
  <MouseTracker>
    {(props) => (
      <p>
        鼠标移动的位置: x: {props.x},y: {props.y}
      </p>
    )}
  </MouseTracker>, document.getElementById("root")
); */

// render Props写法二
// 将内容添加在属性中，属性是一个函数
/* class MouseTracker2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };
  }
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}
ReactDOM.render(
  <MouseTracker2
    render={(props) => (
      <p>
        鼠标移动的位置: x: {props.x},y: {props.y}
      </p>
    )}
  ></MouseTracker2>,
  document.getElementById("root")
); */

// render Props写法三
// 通过HOC组件进行包裹
function withTracker(OldComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
      };
    }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state}></OldComponent>
        </div>
      );
    }
  };
}
function Show(props) {
  return (
    <p>
      鼠标移动的位置: x: {props.x},y: {props.y}
    </p>
  );
}
let MouseTracker3 = withTracker(Show);

ReactDOM.render(
  <MouseTracker3></MouseTracker3>,
  document.getElementById("root")
);
