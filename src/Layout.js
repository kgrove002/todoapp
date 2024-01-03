import React from "react";
import { Outlet } from "react-router";
import Nav from "./Nav";

const Layout = () => {
  return (
    <div className="app">
      <Nav />
      <Outlet />
    </div>
  );
};

export default Layout;
