import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import google from "../assets/icons/google.svg";
import facebook from "../assets/icons/facebook.svg";
import apple from "../assets/icons/apple.svg";
import { RootState } from "../app/store";

interface SignTableProps {
  SignIn: boolean;
}

const SignTable: React.FC<SignTableProps> = ({ SignIn = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white px-8 py-10 h-[600px] w-[500px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 shadow-2xl rounded-[40px]">
      <div className="flex justify-between items-center">
        <p>Welcome to Vulum</p>
        {SignIn ? (
          <div>
            <p className="text-lightGray text-sm">No Account?</p>
            <p
              className="text-darkBlue text-sm cursor-pointer"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lightGray text-sm">Have an Account?</p>
            <p
              className="text-darkBlue text-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              Sign In
            </p>
          </div>
        )}
      </div>
      <h1 className="text-[40px] font-[600]">
        {SignIn ? "Sign In" : "Sign Up"}
      </h1>

      <div className="mt-7 w-full">
        <label htmlFor="email" className="text-[14px]">
          Enter your email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email Address"
          className="w-full mt-2 p-4 border-[1px] border-gray-200 rounded-xl text-sm text-lightGray font-thin text-[13px] focus:outline-secondary focus:text-gray-900"
        />
      </div>

      {SignIn ? (
        <div className="mt-7 w-full">
          <label htmlFor="password" className="text-[14px]">
            Enter your password
          </label>
          <div className="relative border-[1px] border-gray-200 rounded-xl flex items-center">
            <input
              id="password"
              type={!showPassword ? "password" : "text"}
              placeholder="Password"
              className="w-full p-4 text-sm text-lightGray font-thin text-[13px] rounded-xl focus:outline-secondary focus:text-gray-900"
            />
            {!showPassword ? (
              <FaEyeSlash
                onClick={togglePassword}
                className="absolute right-5 text-lightGray"
              />
            ) : (
              <FaEye
                onClick={togglePassword}
                className="absolute right-5 text-lightGray"
              />
            )}
            <span className="pt-3 absolute top-[100%] right-[0] text-[12px] text-darkBlue cursor-pointer">
              Forgot Password?
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-5 flex gap-9">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-[14px]">
                First Name
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                className="w-[110%] mt-2 p-4 border-[1px] border-gray-200 rounded-xl text-sm text-lightGray font-thin text-[13px] focus:outline-secondary focus:text-gray-900"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-[14px]">
                Last Name
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                className="w-[110%] mt-2 p-4 border-[1px] border-gray-200 rounded-xl text-sm text-lightGray font-thin text-[13px] focus:outline-secondary focus:text-gray-900"
              />
            </div>
          </div>
          <div className="mt-5 w-full">
            <label htmlFor="password" className="text-[14px]">
              Enter your password
            </label>
            <div className="relative border-[1px] border-gray-200 rounded-xl flex items-center">
              <input
                id="password"
                type={!showPassword ? "password" : "text"}
                placeholder="Password"
                className="w-full p-4 text-sm text-lightGray font-thin text-[13px] rounded-xl focus:outline-secondary focus:text-gray-900"
              />
              {!showPassword ? (
                <FaEyeSlash
                  onClick={togglePassword}
                  className="absolute right-5 text-lightGray"
                />
              ) : (
                <FaEye
                  onClick={togglePassword}
                  className="absolute right-5 text-lightGray"
                />
              )}
              {SignIn && (
                <span className="pt-3 absolute top-[100%] right-[0] text-[12px] text-darkBlue cursor-pointer">
                  Forgot Password?
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-[100px] flex flex-col items-center gap-4">
        <button className="w-full mt-9 py-4 bg-darkBlue text-white rounded-xl shadow-xl active:relative top-[1px]">
          Sign In
        </button>

        {SignIn && (
          <>
            <span className="text-lightGray">OR</span>
            <div className="w-full flex justify-between items-center">
              <div className="flex justify-center items-center gap-5 bg-lightBlue py-3 px-8 rounded-xl cursor-pointer">
                <img src={google} alt="Google Icon" />
                <p className="text-darkBlue text-[15px]">
                  Countinue with Google
                </p>
              </div>
              <div className="bg-[#F6F6F6] py-3 px-5 rounded-xl cursor-pointer">
                <img src={facebook} alt="Google Icon" />
              </div>
              <div className="bg-[#F6F6F6] py-3 px-5 rounded-xl cursor-pointer">
                <img src={apple} alt="Google Icon" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignTable;
