import React from "react";
import ReactDOM from "./react-dom";
// let element = (
//   <div
//     className="hello-test"
//     style={{ background: "red", color: "#fff", fontSize: "18px" }}
//   >
//     <p>
//       hello
//       <span style={{ fontSize: "50px" }}>tianheng</span>
//     </p>
//   </div>
// );
function FuntionCmp() {
  return (
    <div
      className="hello-func"
      style={{ background: "red", color: "#fff", fontSize: "18px" }}
    >
      <p>
        函数：
        <span style={{ fontSize: "50px" }}>tianheng</span>
      </p>
    </div>
  );
}
ReactDOM.render(<FuntionCmp/>, document.getElementById("root"));
