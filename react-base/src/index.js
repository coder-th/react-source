import React from "react";
import ReactDOM from "./react-dom";
let element = (
  <div
    className="hello-test"
    style={{ background: "red", color: "#fff", fontSize: "18px" }}
  >
    <p>
      hello
      <span style={{ fontSize: "50px" }}>tianheng</span>
    </p>
  </div>
);
ReactDOM.render(element, document.getElementById("root"));
