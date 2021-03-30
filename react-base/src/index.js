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
} from "./core/react";
// import React, {
//   useEffect,
//   useRef,
//   useLayoutEffect,
//   useReducer,
//   useContext,
// } from "react";
// import ReactDOM from "react-dom";

function Child(props, ref) {
  return (
    <input ref={ref} /> // ref.current.focus
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
