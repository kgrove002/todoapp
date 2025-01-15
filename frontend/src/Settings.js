import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import "./css/Settings.css";
import "./css/App.css";
import { useNavigate } from "react-router";

export default function Settings({ login, cusId }) {
  const [day, setDay] = useState("Sunday");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [reloadFlag, setReloadFlag] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      navigate("/");
    }
  }, [login, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      let tasks = null;

      switch (day) {
        case "Sunday":
          tasks = await loadSundayTasks(cusId);
          break;
        case "Monday":
          tasks = await loadMondayTasks(cusId);
          break;
        case "Tuesday":
          tasks = await loadTuesdayTasks(cusId);
          break;
        case "Wednesday":
          tasks = await loadWednesdayTasks(cusId);
          break;
        case "Thursday":
          tasks = await loadThursdayTasks(cusId);
          break;
        case "Friday":
          tasks = await loadFridayTasks(cusId);
          break;
        case "Saturday":
          tasks = await loadSaturdayTasks(cusId);
          break;
        default:
          setError("Invalid day");
          return;
      }

      if (tasks) {
        setData(tasks);
      }
    };

    fetchData();
  }, [day, cusId, reloadFlag]);

  const loadTasksForDay = async (table, id) => {
    try {
      const response = await axios.post(
        "https://kgtodoappbackend.onrender.com/loadTasks",
        {
          table,
          id,
        }
      );
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`Tasks not found for ${table}`);
      } else {
        setError("Server error");
      }
      return null;
    }
  };

  const addItemToDatabase = async (table, id, task) => {
    try {
      await axios.post("https://kgtodoappbackend.onrender.com/addTasks", {
        table,
        id,
        item: task,
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(`Invalid table name: ${table}`);
        alert(error);
      } else {
        setError("Server error");
      }
    }
  };

  const deleteItemToDatabase = async (table, id, task) => {
    try {
      await axios.post("https://kgtodoappbackend.onrender.com/deleteTasks", {
        table,
        id,
        item: task,
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(`Invalid table name: ${table}`);
      } else {
        setError("Server error");
      }
    }
  };

  const loadSundayTasks = async (id) => loadTasksForDay("sunday", id);
  const loadMondayTasks = async (id) => loadTasksForDay("monday", id);
  const loadTuesdayTasks = async (id) => loadTasksForDay("tuesday", id);
  const loadWednesdayTasks = async (id) => loadTasksForDay("wednesday", id);
  const loadThursdayTasks = async (id) => loadTasksForDay("thursday", id);
  const loadFridayTasks = async (id) => loadTasksForDay("friday", id);
  const loadSaturdayTasks = async (id) => loadTasksForDay("saturday", id);

  const validEntry = /[a-z]/i;

  const addItem = async (item) => {
    try {
      await addItemToDatabase(day.toLowerCase(), cusId, item);
      setReloadFlag((prev) => !prev); // Trigger reload only after the operation
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const handleDelete = async (id, task) => {
    try {
      await deleteItemToDatabase(day.toLowerCase(), id, task);
      setReloadFlag((prev) => !prev); // Trigger reload only after the operation
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validEntry.test(newTask)) {
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
                <li key={task.task_id} className="item">
                  <label>{task.task_desc}</label>
                  <FaTrashAlt
                    role="button"
                    tabIndex="0"
                    onClick={() => handleDelete(task.task_id, task.task_desc)}
                    aria-label={`Delete ${task.task_desc}`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: "2rem" }}>You have no tasks for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}
