import React from "react";
import SideItem from "./SideItem";
import { AiOutlineDashboard } from "react-icons/ai";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { IoMailOpenOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";
import { LiaDatabaseSolid } from "react-icons/lia";
import { IoGiftOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { IoPeopleOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { CiSettings } from "react-icons/ci";
import { AiOutlinePoweroff } from "react-icons/ai";

interface DashboardSidebarProps {
  classes?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  classes = "",
}) => {
  return (
    <div
      className={`bg-white py-4 w-[250px] flex flex-col items-center border-r-2 ${classes}`}
    >
      <SideItem
        icon={<AiOutlineDashboard />}
        title="Dashboard"
        path="/dashboard"
      />
      <SideItem icon={<AiOutlineProduct />} title="Products" path="/products" />
      <SideItem
        icon={<MdOutlineFavoriteBorder />}
        title="Favorite"
        path="/favorites"
      />
      <SideItem icon={<IoMailOpenOutline />} title="Inbox" path="/inbox" />
      <SideItem
        icon={<CiCircleList />}
        title="Orders List"
        path="/order-lists"
      />
      <SideItem
        icon={<LiaDatabaseSolid />}
        title="Products Stock"
        path="/products-stock"
      />
      <div className="h-[1px] w-full bg-gray-300 mt-2" />
      <p className="block w-full ms-10 mt-4 text-[12px] font-bold text-gray-500 text-left ">
        PAGES
      </p>
      <SideItem icon={<IoGiftOutline />} title="Pricing" path="/pricing" />
      <SideItem
        icon={<IoCalendarOutline />}
        title="Calendar"
        path="/calendar"
      />
      <SideItem icon={<RiTodoLine />} title="To Do" path="/todo" />
      <SideItem icon={<IoPeopleOutline />} title="Contact" path="/contact" />
      <SideItem
        icon={<LiaMoneyBillWaveSolid />}
        title="Invoices"
        path="/invoices"
      />
      <div className="h-[1px] w-full bg-gray-300 mt-2 mb-4" />
      <SideItem icon={<CiSettings />} title="Settings" path="/settings" />
      <SideItem icon={<AiOutlinePoweroff />} title="Log Out" path="/" />
    </div>
  );
};

export default DashboardSidebar;
