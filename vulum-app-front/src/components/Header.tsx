import React, { FC, useEffect, useState } from "react";
import vulum from "../assets/logos/vulumBlue.png";
// import profile from "../assets/figures/profilep.png";
import ukFlag from "../assets/figures/UK Flag.png";
import { FaChevronDown } from "react-icons/fa6";
import api from "../auth/api";
import { userInterface } from "../interfaces/UserInterface";

const Header: FC = () => {
  const [user, setUser] = useState<userInterface>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
        // console.log(res.data, "res.data");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const userInitials = `${user?.FName?.[0].toUpperCase() ?? ""}${
    user?.LName?.[0].toUpperCase() ?? ""
  }`;

  return (
    <div className="h-[90px] px-12 w-full flex items-center justify-between bg-white relative shadow-md">
      <img src={vulum} alt="Vulum Logo" className="w-36 " />
      <div className="flex items-center justify-center gap-8">
        <div className="flex items-center justify-center gap-2">
          <img src={ukFlag} alt="UK Flag" className="w-8" />
          <span className="text-grayText">English</span>
          <FaChevronDown className="size-[15px] text-grayText" />
        </div>
        <div className="flex items-center justify-center gap-4">
          {/* <img src={profile} alt="Profile Photo" /> */}
          <div className="bg-sky-700 text-white w-12 h-12 grid place-items-center rounded-[50%] cursor-pointer">
            {userInitials}
          </div>
          <div className="cursor-pointer">
            <h3>{user?.FullName}</h3>
            <p className="text-[12px] text-grayText cursor-pointer">
              {user?.role.RoleName}
            </p>
          </div>
          <FaChevronDown className="size-[15px] text-grayText cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Header;
