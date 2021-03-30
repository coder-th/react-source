import ReactDOM from "./core/react-dom";
import React, {
  useCallback,
  useMemo,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext
} from "./core/react";
// import React, {
//   useEffect,
//   useRef,
//   useLayoutEffect,
//   useReducer,
//   useContext,
// } from "react";
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
const CouterContext = React.createContext();
function Counter() {
  const { state, dispatch } = useContext(CouterContext);
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: ADD })}>+</button>
      <button onClick={() => dispatch({ type: MINUS })}>-</button>
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, { number: 0 });
  return (
    <CouterContext.Provider value={{ state, dispatch }}>
      <Counter></Counter>
    </CouterContext.Provider>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
