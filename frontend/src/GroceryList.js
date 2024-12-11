import React from "react";
import "./css/GroceryList.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function GroceryList({id, login}) {
  const [listItems, setListItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

    useEffect(() => {
      if(!login) {
        navigate("/")};
    })

  const loadTasksGroceryList = async (table, id) => {
    try {
      const response = await axios.post('http://10.0.0.129:5000/loadTasks', {
        table,
        id,
      });
  
      setListItems(response.data);
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
      const response = await axios.post('http://10.0.0.129:5000/addTasks', {
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

  const deleteItemToDatabase = async (table, id, task) => {
    try {
      const response = await axios.post('http://10.0.0.129:5000/deleteTasks', {
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

  const adjustCheckOnDatabase = async (table, id, task, check) => {
    try {
      const response = await axios.post('http://10.0.0.129:5000/alterCheckTasks', {
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

  loadTasksGroceryList('grocery_list', id);

  const addItem = (item) => {
    const item_id = listItems.length ? listItems[listItems.length - 1].item_id + 1 : 1;
    const myNewItem = { item_id, checked: false, item };
    const items = [...listItems, myNewItem];
    addItemToDatabase("grocery_list", id, item);
    setListItems(items);
  };

  const handleDelete = (item_id, item) => {
    const items = listItems.filter((item) => item.item_id !== item_id);
    deleteItemToDatabase("grocery_list", id, item);
    setListItems(items);
  };

  const validEntry = new RegExp(/[a-z]/);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validEntry.test(newItem) === false) {
      setNewItem("");
      return;
    } else {
      addItem(newItem);
      setNewItem("");
    }
  };

  const handleCheck = (item_id, task) => {

    const newCheckedState = !task.is_checked;

    setListItems((prevTasks) =>
      prevTasks.map((t) =>
        t.task_id === item_id ? { ...t, is_checked: newCheckedState } : t
      )
    );
    adjustCheckOnDatabase('grocery_list', id, task.task_desc, newCheckedState);
  };

  useEffect(() => {
    setProgress(setProgressBar(listItems));
  }, [listItems]);

  const getColor = () => {
    if (progress < 50) {
      return "red";
    } else if (progress <= 99 && progress >= 50) {
      return "yellow";
    } else {
      return "green";
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
      <div className="GroceryList">
        <h1>Items for you to buy!</h1>

        <form className="addForm" onSubmit={handleSubmit}>
          <label htmlFor="addItem">Add Item</label>
          <input
            id="addItem"
            type="text"
            placeholder="Add Item"
            required
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />

          <button
            type="submit"
            aria-label="Add Item"
            // onClick={() => inputRef.current.focus()}
          >
            <FaPlus />
          </button>
        </form>

        <div className="container">
          <div className="progressBar">
            <div
              className="progressBarFill"
              style={{ width: `${progress}%`, backgroundColor: getColor() }}
            ></div>
            <div className="progressLabel">
              You have {progress}% of your item(s)!
            </div>
          </div>
        </div>

        {listItems.length ? (
          <ul>
            {listItems.map((item) => (
              <li className="item" key={item.task_id}>
                <input
                  type="checkbox"
                  onChange={() => handleCheck(item.task_id, item)}
                  checked={item.is_checked}
                />
                <label
                  style={
                    item.is_checked
                      ? { textDecoration: "line-through" }
                      : { textDecoration: "none" }
                  }
                  onDoubleClick={() => handleCheck(item.task_id)}
                >
                  {item.task_desc}{" "}
                </label>
                <FaTrashAlt
                  role="button"
                  tabIndex="0"
                  onClick={() => handleDelete(item.task_id, item.task_desc)}
                  aria-label={`Delete ${item.task_desc}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: "2rem" }}>Your list is empty.</p>
        )}
      </div>
    </div>
  );
}
