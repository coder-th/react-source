import ReactDOM from "./core/react-dom";
import React,{ useCallback, useMemo, useState ,useReducer,useEffect,useLayoutEffect,useRef}  from "./core/react";
// import React, { useEffect,useRef,useLayoutEffect} from "react";
// import ReactDOM from "react-dom";


function App() {
  let style = {
    width: '200px',
    height: '200px',
    backgroundColor: 'red'
  }
  const divRef = useRef()
/*   有动画效果，因为，useEffect是宏任务实现的，在浏览器渲染后执行的，
  所以DOM元素在浏览器渲染后会进行更新 */
  useEffect(()=> {
    divRef.current.style.webkitTransform = 'translateX(500px)'
    divRef.current.style.transition = 'all 5000ms'
  },[])
  /* 没有动画效果，因为useLayoutEffect是微任务实现的，在浏览器渲染之前就会执行，
  所以dom元素在浏览器进行渲染之前就已经进行更新操作了 */
/*   useLayoutEffect(()=> {
    divRef.current.style.webkitTransform = 'translateX(500px)'
    divRef.current.style.transition = 'all 5000ms'
  },[]) */
  return (
    <div style={style} ref={divRef}>
      <p>我是内容</p>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
