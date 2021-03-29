import ReactDOM from "./core/react-dom";
import React from "./core/react";
// import React from "react";
// import ReactDOM from "react-dom";
function getStyle(color) {
  return {
    width: "200px",
    border: `solid 2px ${color}`,
    padding: "5px",
    margin: "5px",
  };
}
let colorContext = React.createContext();
class ClassCompoment extends React.Component {
  state = { color: "red" };
  changeColor = (color) => {
    this.setState({ color });
  };
  render() {
    let contextValue = {
      color: this.state.color,
      changeColor: this.changeColor,
    };
    return (
      <colorContext.Provider value={contextValue}>
        <div>
          <Head></Head>
          <Body></Body>
        </div>
      </colorContext.Provider>
    );
  }
}
// 使用Context的值方式一：使用静态属性 contextType，只能是类使用
class Head extends React.Component {
  static contextType = colorContext;
  render() {
    return <div style={getStyle(this.context.color)}>Head</div>;
  }
}
// 使用Context的值方式二：使用Consumer 传递一个回调函数，类和函数都能使用
class Body extends React.Component {
  render() {
    return (
      <colorContext.Consumer>
        {(currentValue) => (
          <div style={getStyle(currentValue.color)}>
            <button onClick={() => currentValue.changeColor("green")}>
              绿色
            </button>
            <button onClick={() => currentValue.changeColor("red")}>
              红色
            </button>
          </div>
        )}
      </colorContext.Consumer>
    );
  }
}
ReactDOM.render(
  <ClassCompoment></ClassCompoment>,
  document.getElementById("root")
);
