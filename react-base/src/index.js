import ReactDOM from "./core/react-dom";
import React,{useState} from "./core/react";
// import React, { useState } from "react";
// import ReactDOM from "react-dom";

function App() {
  const [number, setNumber] = useState(0);
  const delayAdd = () => {
    setTimeout(()=> {
      // 异步无法获取最新的值，记录的是当时点击记录的state
      // setNumber(number+1)
      // 解决方案就是： setNumber中传入一个回调函数，可以拿到最新的值
      setNumber((number)=> number+1)
    },3000)
  }
  return (
    <div>
      <p>number:{number}</p>
      <button onClick={()=>{setNumber(number + 1)}}>+1</button>
      <button onClick={()=>{delayAdd()}}>delay+1</button>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
