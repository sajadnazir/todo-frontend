import React, { Component } from "react";
import { Dropdown, DropdownButton, Toast } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import ApiCall from "./ApiCall";
import "./index.css";

class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setConditions: {},
      showLoader: true,
      dropDownOptions:[5,10,15,20,25],
    };
    this.getAllTasks();
  }

  componentDidMount() {}

  getAllTasks = (body) => {
    new ApiCall().call(
      "task-list",
      "POST",
      body ? body : null,
      true,
      function callBack(result) {
        if (result.data.success == true) {
          this.setState({
            taskList: result.data.data.records,
            showLoader: false,
          });
        }
      }.bind(this)
    );
  };

  addNewTask = () => {
    const body = { task_name: this.state.inputTask };

    new ApiCall().call(
      `task-add`,
      "POST",
      body,
      false,
      function callBack(result) {
        if (result.data.success == true) {
          this.getAllTasks();
          this.setState({
            responseSuccessMessage: result.data.message,
            inputTask: "",
            selectedTask: null,
          });
        }
        this.setState({
          responseErrorMessage: result.data.messages.task_name[0],
        });
      }.bind(this)
    );
  };

  updateTask = (id) => {
    const body = { task_name: this.state.inputTask };
    new ApiCall().call(
      `task-update/${id}`,
      "PUT",
      body,
      true,
      function callBack(result) {
        if (result.data.success == true) {
          this.getAllTasks();
          this.setState({
            responseSuccessMessage: result.data.message,
            inputTask: "",
            selectedTask: null,
          });
        }
        this.setState({
          responseErrorMessage: result.data.messages.task_name[0],
        });
      }.bind(this)
    );
  };

  changeTaskStatusApi = (id) => {
    new ApiCall().call(
      `task-status/${id}`,
      "PUT",
      null,
      false,
      function callBack(result) {
        if (result.data.success == true) {
          this.getAllTasks();
          this.setState({
            responseSuccessMessage: result.data.message,
          });
        }
        this.setState({ responseErrorMessage: result.data.message });
      }.bind(this)
    );
  };

  deleteTaskApi = (id) => {
    new ApiCall().call(
      `task-delete/${id}`,
      "DELETE",
      null,
      function callBack(result) {
        if (result.data.success == true) {
          this.getAllTasks();
          this.setState({
            responseSuccessMessage: result.data.message,
          });
        }
        this.setState({ responseErrorMessage: result.data.message });
      }.bind(this)
    );
  };

  renderTaskList = (task, index) => {
    return (
      <div className="task-list-row " key={index}>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            onChange={() => this.changeTaskStatus(task.id)}
          />
        </div>
        <div>{task.task_name}</div>
        <div>
          {task.is_completed == 1 ? (
            <div className="text-success"> Completed </div>
          ) : (
            <div className="text-warning"> Yet to Complete </div>
          )}
        </div>
        <div className="inline">
          <div>
            <i
              className="fa fa-pencil-square-o text-warning"
              onClick={() => this.editTask(task)}
            ></i>
          </div>
          <div>
            <i
              className="fa fa-trash-o"
              onClick={() => this.deleteTask(task.id)}
            ></i>
          </div>
        </div>
      </div>
    );
  };

  onInputChange = (data) => {
    this.setState({
      inputTask: data,
      responseSuccessMessage: null,
      responseErrorMessage: null,
    });
  };

  changeTaskStatus = (taskId) => {
    this.changeTaskStatusApi(taskId);
  };

  deleteTask = (taskId) => {
    this.deleteTaskApi(taskId);
  };

  editTask = (task) => {
    this.setState({ selectedTask: task, inputTask: task.task_name });
  };

  recordsToDisplay = (data) => {
    
    const body = {
        "records-per-page": Number(data),
      };
      this.getAllTasks(body)
  };

  render() {
    return (
      <div>
        <div className="loader">
          {this.state.showLoader ? (
            <Spinner animation="border" variant="warning" />
          ) : null}
        </div>

        <div class="input-group">
          <span class="input-group-text">Task Name</span>
          <textarea
            class="form-control"
            onChange={(event) => this.onInputChange(event.target.value)}
            value={this.state.inputTask}
          ></textarea>
          {!this.state.selectedTask ? (
            <button
              type="button"
              class="btn btn-outline-success btn-sm m-3"
              onClick={this.addNewTask}
            >
              Add Task
            </button>
          ) : (
            <button
              type="button"
              class="btn btn-outline-warning btn-sm m-3"
              onClick={() => this.updateTask(this.state.selectedTask.id)}
            >
              Update Task
            </button>
          )}
        </div>

        <div>
          <div className="mt-2">
            {this.state.responseSuccessMessage ? (
              <div className="text-success">
                {" "}
                {this.state.responseSuccessMessage}{" "}
              </div>
            ) : "" || this.state.responseErrorMessage ? (
              <div className="text-danger">
                {this.state.responseErrorMessage}
              </div>
            ) : (
              ""
            )}
          </div>

          <DropdownButton
            menuAlign="right"
            title="Records to display"
            id="dropdown-menu-align-right"
            onSelect={(value) => this.recordsToDisplay(value)}
          >
                {this.state.dropDownOptions.map((val,key)=>{
                    return <Dropdown.Item eventKey={val}>{val}</Dropdown.Item>
                })}
          </DropdownButton>

          <div className="task-list-head mt-2">
            <div>Change Status</div>
            <div>Task</div>
            <div>Status</div>
            <div className="inline">Action</div>
          </div>
          <div className="task-container">
            {this.state.taskList && this.state.taskList.length > 0 ? (
              this.state.taskList.map((task, index) => {
                return this.renderTaskList(task, index);
              })
            ) : (
              <div className="inline text-warning mt-3">
                <Toast>
                  <Toast.Body>
                    Seems you have No Task Yet ! Please add one above
                  </Toast.Body>
                </Toast>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Task;
