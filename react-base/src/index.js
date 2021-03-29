import ReactDOM from "./core/react-dom";
import React from "./core/react";
// import React from "react";
// import ReactDOM from "react-dom";
let withLoading = (loadingMessage) => {
  return (OldComponent) => {
    return class extends React.Component {
      show = () => {
        let loadingDIV = document.createElement("div");
        loadingDIV.innerHTML = `
        <p id='loading' style='color: grey;position:absolute;top:50%;left: 50%;'>${loadingMessage}</p>
        `;
        document.body.appendChild(loadingDIV);
      };
      hide = () => {
        document.getElementById("loading").remove();
      };
      render() {
        let extraArgs = {show: this.show,hide:this.hide}
        return <OldComponent {...this.props} {...extraArgs}></OldComponent>;
      }
    };
  };
};
// 使用方式一： 使用装饰器
@withLoading('加载中...')
class ClassCompoment extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => this.props.show()}>显示</button>
        <button onClick={() => this.props.hide()}>隐藏</button>
      </div>
    );
  }
}
// 使用方式二： 使用函数调用
// let newComponent = withLoading('加载中')
// let NewClassComponent = newComponent(ClassCompoment)

ReactDOM.render(
  <ClassCompoment></ClassCompoment>,
  // <NewClassComponent></NewClassComponent>,
  document.getElementById("root")
);
