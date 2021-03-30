import ReactDOM from "./core/react-dom";
import React,{ useCallback, useMemo, useState ,useReducer}  from "./core/react";
// import React, { useReducer } from "react";
// import ReactDOM from "react-dom";
const ADD = "ADD";
const MINUS = "MINUS";
/**
 * 处理器，传入老状态，返回新状态
 * @param {*} state
 * @param {*} action
 */
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { ...state, number: state.number + 1 };
    case MINUS:
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { number: 0 });
  const [count,setCount] = useState(0)
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: ADD })}>+</button>
      <button onClick={() => dispatch({ type: MINUS })}>-</button>
      <button onClick={() => setCount(count+1)}>{count}</button>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
