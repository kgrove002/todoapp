import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import ToDoList from "./ToDoList";
import GroceryList from "./GroceryList";
import Settings from "./Settings";
import About from "./About";

export default function App() {
  return (
    <Router>
      <div>
        <nav className="mainNav">
          <ul>
            <li>
              <Link to="/todolist">To Do</Link>
            </li>
            <li>
              <Link to="/grocery">Grocery</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/todolist" element={<ToDoList />} />
          <Route path="/grocery" element={<GroceryList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
