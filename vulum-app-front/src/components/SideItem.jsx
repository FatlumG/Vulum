import React from "react";
import { NavLink } from "react-router-dom";

function SideItem({ icon, title, path }) {
  const linkClass = ({ isActive }) =>
    isActive
      ? `bg-secondary text-white flex items-center gap-3 w-[200px] h-[60px] px-3 rounded-[5px]`
      : "bg-white flex items-center gap-3 w-[200px] h-[60px] px-3 rounded-[5px]";

  return (
    <NavLink className={linkClass} to={path}>
      <span className={`scale-125`}>{icon}</span>
      <p>{title}</p>
    </NavLink>
  );
}

export default SideItem;
