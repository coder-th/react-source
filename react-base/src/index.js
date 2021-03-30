import ReactDOM from "./core/react-dom";
import React, {
  useCallback,
  useMemo,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
  useImperativeHandle
} from "./core/react";
/* import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useReducer,
  useContext,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom"; */

function Child(props, childRef) {
  const inputRef = React.createRef();
  // useImperativeHandle 向外部自定义暴露对应的方法或者属性，提高组件的安全性
  useImperativeHandle(childRef, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));
  return (
    <input ref={inputRef} {...props}/> // ref.current.focus
  );
}
let ForwardedChild = React.forwardRef(Child);
function App() {
  const childRef = React.createRef();
  const getChildFocus = () => {
    childRef.current.focus();
  };
  return (
    <div>
      <ForwardedChild ref={childRef}></ForwardedChild>
      <button onClick={() => getChildFocus()}>获取焦点</button>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
