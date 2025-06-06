import { FC } from "react";
import vulum from "../assets/logos/vulumBlue.png";
// import profile from "../assets/figures/profilep.png";
import ukFlag from "../assets/figures/UK Flag.png";
import { FaChevronDown } from "react-icons/fa6";

interface HeaderProps {
  userInitials: string;
  FullName: string;
  RoleName: string;
}

const Header: FC<HeaderProps> = ({ userInitials, FullName, RoleName }) => {
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
            <h3>{FullName}</h3>
            <p className="text-[12px] text-grayText cursor-pointer">
              {RoleName}
            </p>
          </div>
          <FaChevronDown className="size-[15px] text-grayText cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Header;
