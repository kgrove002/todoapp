import React from "react";
import { Outlet } from "react-router";
import Nav from "./Nav";

const Layout = (setUserData, setLogin) => {
  return (
    <div className="App">
      <Nav setUserData={setUserData} setLogin={setLogin}/>
      <Outlet />
    </div>
  );
};

export default Layout;
