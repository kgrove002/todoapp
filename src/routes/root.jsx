import React from "react";
import { Outlet } from "react-router";

export default function Root() {
  return (
    <>
      <main>
        <nav className="mainNav">
          <ul>
            <li>
              {" "}
              <a href="https://kgrove002.github.io/todolist/">To Do</a>
            </li>
            <li>
              {" "}
              <a href="https://kgrove002.github.io/todolist/groceryList">
                Grocery
              </a>
            </li>
            <li>
              {" "}
              <a href="https://kgrove002.github.io/todolist/">Settings</a>
            </li>
            <li>
              {" "}
              <a href="https://kgrove002.github.io/todolist/about">About</a>
            </li>
          </ul>
        </nav>

        <div>
          <Outlet />
        </div>
      </main>
    </>
  );
}
