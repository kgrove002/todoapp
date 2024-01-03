import React from "react";
import ReactDOM from "react-dom/client";
import About from "./About";
import "./css/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import ToDoList from "./ToDoList";
import GroceryList from "./GroceryList";
import Settings from "./Settings";

const router = createBrowserRouter([
  {
    path: "https://kgrove002.github.io/todolist/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "https://kgrove002.github.io/todolist/",
        element: <ToDoList />,
      },
      {
        path: "https://kgrove002.github.io/todolist/about",
        element: <About />,
      },
      {
        path: "https://kgrove002.github.io/todolist/groceryList",
        element: <GroceryList />,
      },
      {
        path: "https://kgrove002.github.io/todolist/settings",
        element: <Settings />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
