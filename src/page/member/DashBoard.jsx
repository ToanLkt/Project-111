import React from "react";
import { Outlet } from "react-router";
import NavBar from "../../components/NavBar";

export default function DashBoard() {
  return (
    <>
      <h1>DashBoard</h1>
      <NavBar />
      <Outlet />
    </>
  );
}
