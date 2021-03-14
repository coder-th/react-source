import React from "./react";
import ReactDOM from "./react-dom";
/* let element = (
  <div
    className="hello-test"
    style={{ background: "red", color: "#fff", fontSize: "18px" }}
  >
    <p>
      hello
      <span style={{ fontSize: "50px" }}>tianheng</span>
    </p>
  </div>
); */
/* function FuntionCmp() {
  return (
    <div
      className="hello-func"
      style={{ background: "red", color: "#fff", fontSize: "18px" }}
    >
      <p>
        函数：
        <span style={{ fontSize: "50px" }}>tianheng</span>
      </p>
    </div>
  );
} */
class ClassCompoment extends React.Component {
  constructor(props) {
    // props是一个只读的对象
    super(props);
    // 能修改的状态
    this.state = {
      number: 0,
    };
  }
  render() {
    return (
      <div
        className="hello-func"
        style={{ background: "red", color: "#fff", fontSize: "18px" }}
      >
        <p>
          类组件
          <span style={{ fontSize: "50px" }}>tianheng</span>
        </p>
      </div>
    );
  }
}
ReactDOM.render(React.createElement(ClassCompoment), document.getElementById("root"));
