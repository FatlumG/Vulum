import React, { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import google from "../assets/icons/google.svg";
import facebook from "../assets/icons/facebook.svg";
import apple from "../assets/icons/apple.svg";
import { RootState } from "../app/store";
import api from "../auth/api";
import { useDispatch } from "react-redux";
import { login } from "../features/store/authSlice";
import { toast } from "sonner";
import { notify } from "../utils/notify";

interface SignTableProps {
  SignIn: boolean;
}

const SignTable: React.FC<SignTableProps> = ({ SignIn = false }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(signInData, "signInData");
      const res = await api.post("/login", signInData);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      dispatch(login({ token, user: res.data.user }));
      notify.success("Login successful!");
      if (token) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (err: any) {
      console.error(err.response.data, "err");

      notify.error(err.response.data.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", signUpData);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      dispatch(login({ token, user: res.data.user }));
      notify.success("Registration successful!");
      navigate("/dashboard");
    } catch (err: any) {
      notify.error(err.response.data.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="bg-white px-6 sm:px-8 py-8 sm:py-10 h-[550px] sm:h-[600px] overflow-y-auto scrollbar-hide w-[95%] sm:w-[90%] md:w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-2xl rounded-[24px] sm:rounded-[40px]">
      <div className="flex justify-between items-center">
        <p className="text-sm sm:text-base">Welcome to Vulum</p>
        {SignIn ? (
          <div className="text-right">
            <p className="text-lightGray text-xs sm:text-sm">No Account?</p>
            <p
              className="text-darkBlue text-xs sm:text-sm cursor-pointer hover:underline"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-lightGray text-xs sm:text-sm">
              Have an Account?
            </p>
            <p
              className="text-darkBlue text-xs sm:text-sm cursor-pointer hover:underline"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </p>
          </div>
        )}
      </div>
      <h1 className="text-[28px] sm:text-[40px] font-semibold mt-2">
        {SignIn ? "Sign In" : "Sign Up"}
      </h1>
      <form onSubmit={SignIn ? handleSignIn : handleSignUp}>
        <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row gap-4 sm:gap-6">
          {!SignIn ? (
            <>
              <div className="flex-1">
                <label
                  htmlFor="signup-username"
                  className="text-[13px] sm:text-[14px]"
                >
                  Enter your username
                </label>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="Username"
                  className="w-full mt-2 p-3 sm:p-4 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-secondary focus:border-secondary"
                  value={signUpData.username}
                  name="username"
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, username: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="signup-email"
                  className="text-[13px] sm:text-[14px]"
                >
                  Enter your email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full mt-2 p-3 sm:p-4 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-secondary focus:border-secondary"
                  value={signUpData.email}
                  name="email"
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                />
              </div>
            </>
          ) : (
            <div className="w-full">
              <label
                htmlFor="signin-email"
                className="text-[13px] sm:text-[14px]"
              >
                Enter your email address
              </label>
              <input
                id="signin-email"
                type="email"
                placeholder="Email Address"
                className="w-full mt-2 p-3 sm:p-4 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-secondary focus:border-secondary"
                value={signInData.email}
                name="email"
                onChange={(e) =>
                  setSignInData({ ...signInData, email: e.target.value })
                }
              />
            </div>
          )}
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
                value={signInData.password}
                onChange={(e) =>
                  setSignInData({ ...signInData, password: e.target.value })
                }
                name="password"
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
                  type="text"
                  placeholder="Email Address"
                  className="w-[110%] mt-2 p-4 border-[1px] border-gray-200 rounded-xl text-sm text-lightGray font-thin text-[13px] focus:outline-secondary focus:text-gray-900"
                  value={signUpData.first_name}
                  name="first_name"
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[14px]">
                  Last Name
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Email Address"
                  className="w-[110%] mt-2 p-4 border-[1px] border-gray-200 rounded-xl text-sm text-lightGray font-thin text-[13px] focus:outline-secondary focus:text-gray-900"
                  value={signUpData.last_name}
                  name="last_name"
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, last_name: e.target.value })
                  }
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
                  value={signUpData.password}
                  name="password"
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
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
            {SignIn ? "Sign In" : "Sign Up"}
          </button>

          {SignIn && (
            <>
              <span className="text-lightGray">OR</span>
              <div className="w-full flex justify-between items-center">
                <div className="flex justify-center items-center gap-5 bg-lightBlue py-3 px-8 rounded-xl cursor-pointer">
                  {/* @ts-ignore */}
                  <img src={google} alt="" />
                  <p className="text-darkBlue text-[15px]">
                    Countinue with Google
                  </p>
                </div>
                <div className="bg-[#F6F6F6] py-3 px-5 rounded-xl cursor-pointer">
                  {/* @ts-ignore */}
                  <img src={facebook} alt="" />
                </div>
                <div className="bg-[#F6F6F6] py-3 px-5 rounded-xl cursor-pointer">
                  {/* @ts-ignore */}
                  <img src={apple} alt="" />
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignTable;
