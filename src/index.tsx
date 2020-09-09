import ReactDom from "react-dom";
import React from "react";
import App from "./App";

ReactDom.render(<App />, document.getElementById("root"));

if (process.env.NODE_ENV === 'development') {
    console.log("It's a development!");
}