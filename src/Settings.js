import React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import "./css/Settings.css";
import Footer from "./Footer";

export default function Settings() {
  const [day, setDay] = useState("Sunday");
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem(`${day}`);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [day]);

  const validEntry = /[a-z]/i;

  const addItem = (item) => {
    const id = data.length ? data[data.length - 1].id + 1 : 1;
    const myNewTask = { id: id, taskName: item, taskChecked: false };
    const newData = [...data, myNewTask];
    localStorage.setItem(`${day}`, JSON.stringify(newData));
    setData(newData);
  };

  const handleDelete = (id) => {
    const tasks = data.filter((taskName) => taskName.id !== id);
    setData(tasks);
    localStorage.setItem(`${day}`, JSON.stringify(tasks));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validEntry.test(newTask) === false) {
      setNewTask("");
      return;
    } else {
      addItem(newTask);
      setNewTask("");
    }
  };

  const changeData = (dayText) => {
    console.log(`changing data to ${dayText}`);
    setDay(dayText);
  };
  return (
    <div className="App">
      <div className="settings">
        <nav className="settingsNav">
          <ul>
            <li onClick={() => changeData("Sunday")}>Sunday</li>
            <li onClick={() => changeData("Monday")}>Monday</li>
            <li onClick={() => changeData("Tuesday")}>Tuesday</li>
            <li onClick={() => changeData("Wednesday")}>Wednesday</li>
            <li onClick={() => changeData("Thursday")}>Thursday</li>
            <li onClick={() => changeData("Friday")}>Friday</li>
            <li onClick={() => changeData("Saturday")}>Saturday</li>
          </ul>
        </nav>
        <div className="settingsContent">
          <h1 className="dayTitle">{day}</h1>
          <form className="addForm" onSubmit={handleSubmit}>
            <label htmlFor="addTask">Add New Task</label>
            <input
              autoFocus
              id="addItem"
              type="text"
              placeholder="Add New Task"
              required
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />

            <button type="submit" aria-label="Add Item">
              <FaPlus />
            </button>
          </form>

          {data.length ? (
            <ul>
              {data.map((task) => (
                <li className="item">
                  <label>{task.taskName} </label>
                  <FaTrashAlt
                    role="button"
                    tabIndex="0"
                    onClick={() => handleDelete(task.id)}
                    aria-label={`Delete ${task.taskName}`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: "2rem" }}>You have no tasks for this day.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
