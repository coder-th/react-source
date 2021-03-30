import ReactDOM from "./core/react-dom";
import React,{ useCallback, useMemo, useState }  from "./core/react";
// import React, { useCallback, useMemo, useState } from "react";
// import ReactDOM from "react-dom";
function Child({book,handleClick}) {
  console.log("Child");
  return (
    <div>
      <button onClick={handleClick}>{book.count}</button>
    </div>
  )
}
let MemorizeChild = React.memo(Child)
function App() {
  const [name,setName] = useState('tianheng')
  const [count,setCount] = useState(0)
  let book = useMemo(() => ({count}),[count])
  const handleClick = useCallback(() => {
    setCount(count+1)
  },[count])
  console.log("App");
  const handleChange = () => {
    setName(name + '22322')
  }
  return (
    <div>
      <button onClick={handleChange}>+Name</button>
      <div>{name}</div>
      <MemorizeChild book={book} handleClick={handleClick}></MemorizeChild>
    </div>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
