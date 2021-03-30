import ReactDOM from "./core/react-dom";
import React from "./core/react";
// import React from "react";
// import ReactDOM from "react-dom";

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number1: 0,
      number2: 0,
    };
  }
  handleNumber1 =  () => {
    this.setState({
      number1: this.state.number1 + 1
    })
  }
  handleNumber2 =  () =>  {
    this.setState({
      number2: this.state.number2 + 1
    })
  }
  render() {
    console.log("Parent");
    return (
      <div>
        <Child1 number= {this.state.number1}></Child1>
        <Child2 number= {this.state.number2}></Child2>
        <button onClick={this.handleNumber1}>number1+1</button>
        <button onClick={this.handleNumber2}>number2+1</button>
      </div>
    );
  }
}
class Child1 extends React.PureComponent {
  render() {
    console.log("child1");
    return (
      <p>{this.props.number}</p>
    )
  }
}

class Child2 extends React.PureComponent {
  render() {
    console.log("child2");
    return (
      <p>{this.props.number}</p>
    )
  }
}

ReactDOM.render(<Parent></Parent>, document.getElementById("root"));
