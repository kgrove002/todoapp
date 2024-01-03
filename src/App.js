import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ToDoList from "./ToDoList";
import GroceryList from "./GroceryList";
import Settings from "./Settings";
import About from "./About";
import Layout from "./Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          index
          path="/"
          element={
            <Layout>
              <ToDoList />{" "}
            </Layout>
          }
        />
        <Route
          path="/grocery"
          element={
            <Layout>
              <GroceryList />{" "}
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />{" "}
            </Layout>
          }
        />
        <Route
          path="/aboutpage"
          element={
            <Layout>
              <About />{" "}
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
