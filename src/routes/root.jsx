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
              <a href="/">To Do</a>
            </li>
            <li>
              {" "}
              <a href="/groceryList">Grocery</a>
            </li>
            <li>
              {" "}
              <a href="/settings">Settings</a>
            </li>
            <li>
              {" "}
              <a href="/about">About</a>
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
