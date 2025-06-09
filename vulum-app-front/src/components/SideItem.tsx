import React from "react";
import { NavLink } from "react-router-dom";

interface SideItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  onClick?: any | null;
}

const SideItem: React.FC<SideItemProps> = ({ icon, title, path, onClick }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `bg-primaryBlue text-white flex items-center gap-3 w-[200px] h-[60px] px-3 rounded-[5px]`
      : "bg-white flex items-center gap-3 w-[200px] h-[60px] px-3 rounded-[5px]";

  return (
    <NavLink className={linkClass} to={path} onClick={onClick}>
      <span className={`scale-125`}>{icon}</span>
      <p>{title}</p>
    </NavLink>
  );
};

export default SideItem;
