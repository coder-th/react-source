import ReactDOM from "./core/react-dom";
import React,{ useCallback, useMemo, useState ,useReducer,useEffect}  from "./core/react";
// import React, { useEffect,useState } from "react";
// import ReactDOM from "react-dom";


function App() {
  const [number,setNumber] = useState(0)
  // useEffect会在组件渲染后执行，执行的是副作用，包括定时器，IO操作，dom操作等
  useEffect(()=> {
    const timer = setInterval(()=> {setNumber(number+1)},1000)
    return () => {
      clearInterval(timer)
    }
  })
  return (
    <div>
      <p>number: {number}</p>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
