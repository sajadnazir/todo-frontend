import React,{ Component } from "react";
import './App.css';
import Task from "./Task";

class App extends Component {
  render(){
  return (
    <div className="container">
      <div className="alert alert-secondary text-center mt-3" role="alert">
         Todo Reminder
      </div>
      <Task />
    </div>
  )
  }
}

export default App;
