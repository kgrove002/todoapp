import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import "./css/Settings.css";
import "./css/App.css";
import { useNavigate } from "react-router";

export default function Settings({login, cusId}) {
  const [day, setDay] = useState("Sunday");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState("");

  const navigate = useNavigate();

    useEffect(() => {
      if(!login) {
        navigate("/")};
    },[login, navigate])

  useEffect(() => {
    const fetchData = async () => {
      let tasks = null;

      switch (day) {
        case "Sunday":
          tasks = await loadSundayTasks(cusId);// userData.customer_id. put this back after login system is implemented
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
  // eslint-disable-next-line
  }, [day, cusId]);

  const loadTasksForDay = async (table, id) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/loadTasks', {
        table,
        id,
      });
  
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`Tasks not found for ${table}`);
      } else {
        setError('Server error');
      }
      return null;
    }
  };

  const addItemToDatabase = async (table, id, task) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/addTasks', {
        table,
        id,
        item: task,  // Ensure that the server expects "item" as the key
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(`Invalid table name: ${table}`);
        alert(error);
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  };

  const deleteItemToDatabase = async (table, id, task) => {
    try {
      const response = await axios.post('https://73.216.67.101:5000/deleteTasks', {
        table,
        id,
        item: task,  // Ensure that the server expects "item" as the key
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(`Invalid table name: ${table}`);
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  };
  
  
  const loadSundayTasks = async (id) => loadTasksForDay("sunday", cusId);
  const loadMondayTasks = async (id) => loadTasksForDay("monday", cusId);
  const loadTuesdayTasks = async (id) => loadTasksForDay("tuesday", cusId);
  const loadWednesdayTasks = async (id) => loadTasksForDay("wednesday", cusId);
  const loadThursdayTasks = async (id) => loadTasksForDay("thursday", cusId);
  const loadFridayTasks = async (id) => loadTasksForDay("friday", cusId);
  const loadSaturdayTasks = async (id) => loadTasksForDay("saturday", cusId);

  const validEntry = /[a-z]/i;

  const addItem = (item) => {
    const myNewTask = { customer_id: cusId, is_checked: false, task_desc: item};
    const newData = [...data, myNewTask];
    addItemToDatabase(day.toLocaleLowerCase(), cusId, item);
    setData(newData);
  };

  const handleDelete = (id, task) => {
    const tasks = data.filter((tasklist) => tasklist.task_id !== id);
    setData(tasks);
    deleteItemToDatabase(day.toLocaleLowerCase(), id, task);
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
                  <label>{task.task_desc} </label>
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
