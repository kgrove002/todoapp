import React from "react";
import { Route, Routes } from "react-router-dom";
import ToDoList from "./ToDoList";
import GroceryList from "./GroceryList";
import Settings from "./Settings";
import About from "./About";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ToDoList />} />
        <Route path="grocery" element={<GroceryList />} />
        <Route path="settings" element={<Settings />} />
        <Route path="aboutpage" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
