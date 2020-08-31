import React from "react";
import Signup from "./components/Signup";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h4> Register to become a member </h4>

        <Signup />
      </header>
    </div>
  );
}

export default App;
