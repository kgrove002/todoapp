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
              <a href="/todolist">To Do</a>
            </li>
            <li>
              {" "}
              <a href="/todolist/grocery">Grocery</a>
            </li>
            <li>
              {" "}
              <a href="/todolist/settings">Settings</a>
            </li>
            <li>
              {" "}
              <a href="/todolist/about">About</a>
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
