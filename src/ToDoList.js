import React from "react";
import { useEffect, useState } from "react";
import "./css/ToDoList.css";
import Footer from "./Footer";

export default function ToDoList() {
  const [day, setDay] = useState("Error");
  const [tasks, setTasks] = useState([]);
  const [progess, setProgress] = useState(0);

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

  useEffect(() => {
    setDay(daysOfWeek[date.getDay()]);
    const fetchData = async () => {
      const storedData = localStorage.getItem(day);
      if (storedData) {
        setTasks(JSON.parse(storedData));
        setProgress(setProgressBar());
      }
    };
    fetchData();
  }, [day]);

  useEffect(() => {
    setProgress(setProgressBar());
  }, [tasks]);

  const getColor = () => {
    if (progess < 50) {
      return "red";
    } else if (progess <= 99 && progess >= 50) {
      return "yellow";
    } else {
      return "green";
    }
  };
  const handleCheck = (id) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, taskChecked: !task.taskChecked } : task
      );
      localStorage.setItem(day, JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const setProgressBar = () => {
    if (!tasks || tasks.length === 0) {
      return 0;
    }

    const checkCount = tasks.filter((task) => task.taskChecked).length;
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
              style={{ width: `${progess}%`, backgroundColor: getColor() }}
            ></div>
            <div className="progressLabel">
              You are {progess}% done for today!
            </div>
          </div>
        </div>

        {tasks.length ? (
          <ul>
            {tasks.map((task) => (
              <li className="item">
                <input
                  type="checkbox"
                  onChange={() => handleCheck(task.id)}
                  checked={task.taskChecked}
                />
                <label
                  style={
                    task.taskChecked
                      ? { textDecoration: "line-through" }
                      : { textDecoration: "none" }
                  }
                >
                  {task.taskName}{" "}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: "2rem" }}>You have no tasks for this day.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
