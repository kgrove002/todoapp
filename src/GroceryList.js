import React from "react";
import "./css/GroceryList.css";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import Footer from "./Footer";

export default function GroceryList() {
  const [listItems, setListItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("shoppingList");
    if (storedData) {
      setListItems(JSON.parse(storedData));
    }
  }, [listItems]);

  const addItem = (item) => {
    const id = listItems.length ? listItems[listItems.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const items = [...listItems, myNewItem];
    localStorage.setItem("shoppingList", JSON.stringify(items));
    setListItems(items);
  };

  const handleDelete = (id) => {
    const items = listItems.filter((item) => item.id !== id);
    localStorage.setItem("shoppingList", JSON.stringify(items));
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

  const handleCheck = (id) => {
    const items = listItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    localStorage.setItem("shoppingList", JSON.stringify(items));
    setListItems(items);
  };

  return (
    <div className="App">
      <div className="GroceryList">
        <h1>Items for you to buy!</h1>

        <form className="addForm" onSubmit={handleSubmit}>
          <label htmlFor="addItem">Add Item</label>
          <input
            autoFocus
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

        {listItems.length ? (
          <ul>
            {listItems.map((item) => (
              <li className="item">
                <input
                  type="checkbox"
                  onChange={() => handleCheck(item.id)}
                  checked={item.checked}
                />
                <label
                  style={
                    item.checked
                      ? { textDecoration: "line-through" }
                      : { textDecoration: "none" }
                  }
                  onDoubleClick={() => handleCheck(item.id)}
                >
                  {item.item}{" "}
                </label>
                <FaTrashAlt
                  role="button"
                  tabIndex="0"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.item}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: "2rem" }}>Your list is empty.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
