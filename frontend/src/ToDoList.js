import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import axios from 'axios';
import "./css/ToDoList.css";
import "./css/App.css";

export default function ToDoList({id, login}) {
  const [day, setDay] = useState("Error");
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const date = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const loadTasksForDay = useCallback(async (table, id) => {
    try {
      const response = await axios.post('http://73.216.67.101:5000/loadTasks', {
        table,
        id,
      });
      return response.data;
    } catch (err) {
      setError('Error loading tasks');
      return null;
    }
  }, []);
    const navigate = useNavigate();

    useEffect(() => {
      if(!login) {
        navigate("/")};
    })

    useEffect(() => {
      setDay(daysOfWeek[date.getDay()]);
      const dayTable = day.toLowerCase();
      const fetchTasks = async () => {
        const tasks = await loadTasksForDay(dayTable, id);
        if (tasks) {
          setTasks(tasks);
          setProgress(setProgressBar(tasks));
        }
      };      
      fetchTasks();
    // eslint-disable-next-line
    }, [day, id, loadTasksForDay]);

  useEffect(() => {
    setProgress(setProgressBar(tasks));
  }, [tasks]);

  const getColor = () => {
    if (progress < 50) {
      return "red";
    } else if (progress <= 99 && progress >= 50) {
      return "yellow";
    } else {
      return "green";
    }
  };

  const adjustCheckOnDatabase = async (table, id, task, check) => {
    try {
      const response = await axios.post('http://73.216.67.101:5000/alterCheckTasks', {
        table,
        id,
        item: task,  // Ensure that the server expects "item" as the key
        check,
      });
      return response.data; // Return the response data to the caller
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(`Invalid table name: ${table}`);
        console.log(error);
      } else {
        setError('Server error');
      }
      return null; // Return null in case of an error
    }
  };

  const handleCheck = async (task_id, task) => {
    const newCheckedState = !task.is_checked;

    // Optimistically update the UI
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.task_id === task_id ? { ...t, is_checked: newCheckedState } : t
      )
    );

    // Wait for the database update
    const result = await adjustCheckOnDatabase(day.toLowerCase(), id, task.task_desc, newCheckedState);

    if (!result) {
      // Rollback the change in UI if the database update fails
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.task_id === id ? { ...t, is_checked: !newCheckedState } : t
        )
      );
    }
  };


  const setProgressBar = (tasks) => {
    if (!tasks || tasks.length === 0) {
      return 0;
    }

    const checkCount = tasks.filter((task) => task.is_checked).length;
    const total = tasks.length;
    const percentage = (checkCount / total) * 100;

    return isNaN(percentage) ? 0 : Math.round(percentage);
  };

  return (
    <div className="App">
      <div className="toDo">
        <h1>{day}'s Tasks</h1>

        <div className="container">
          <div className="progressBar">
            <div
              className="progressBarFill"
              style={{ width: `${progress}%`, backgroundColor: getColor() }}
            ></div>
            <div className="progressLabel">
              You are {progress}% done for today!
            </div>
          </div>
        </div>

        {tasks.length ? (
          <ul>
            {tasks.map((task) => (
              <li className="item" key={task.task_id}>
                <input
                  type="checkbox"
                  onChange={() => handleCheck(task.task_id, task)}
                  checked={task.is_checked}
                />
                <label
                  style={
                    task.is_checked
                      ? { textDecoration: "line-through" }
                      : { textDecoration: "none" }
                  }
                >
                  {task.task_desc}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: "2rem" }}>You have no tasks for this day.</p>
        )}
      </div>
    </div>
  );
}
