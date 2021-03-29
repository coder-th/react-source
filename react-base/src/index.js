import ReactDOM from "./core/react-dom";
import React from "./core/react";
// import React from "react";
// import ReactDOM from "react-dom";

class ClassCompoment extends React.Component {
  componentWillUpdate() {
    console.log("父组件即将更新");
  }
  componentDidUpdate() {
    console.log("父组件完成更新");
  }
  render() {
    return (
      <button></button>
    );
  }
}

let withLoading = (OldComponent) => {
  return class extends OldComponent {
    state = {
      count: 0
    }
    add = () => {
      this.setState({
        count: this.state.count + 1
      })
    }
    componentWillUpdate() {
      console.log("子组件即将更新");
      super.componentWillUpdate()
    }
    componentDidUpdate() {
      console.log("子组件完成更新");
      super.componentDidUpdate()
    }
    render() {
      let superRenderDOM = super.render()
      let renderElement = React.cloneElement(superRenderDOM,{onClick: this.add},this.state.count)
      return renderElement
    }
  };
};
let NewClassComponent = withLoading(ClassCompoment)
ReactDOM.render(
  <NewClassComponent></NewClassComponent>,
  document.getElementById("root")
);
