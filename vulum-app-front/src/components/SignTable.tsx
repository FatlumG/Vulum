import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import google from "../assets/icons/google.svg";
import facebook from "../assets/icons/facebook.svg";
import apple from "../assets/icons/apple.svg";
import api from "../auth/api";
import { useDispatch } from "react-redux";
import { login } from "../features/store/authSlice";
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
    <div className="glass px-6 sm:px-8 py-8 sm:py-10 max-h-[85vh] overflow-y-auto scrollbar-hide w-[95%] sm:w-[90%] md:w-[480px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-2xl">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-muted-foreground">Welcome to Vulum</p>
        {SignIn ? (
          <div className="text-right">
            <p className="text-muted-foreground text-xs">No Account?</p>
            <p
              className="text-primaryBlue text-xs font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-muted-foreground text-xs">
              Have an Account?
            </p>
            <p
              className="text-primaryBlue text-xs font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </p>
          </div>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-6">
        {SignIn ? "Sign In" : "Sign Up"}
      </h1>

      <form onSubmit={SignIn ? handleSignIn : handleSignUp}>
        <div className="flex flex-col gap-4">
          {!SignIn ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 border border-border rounded-xl text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                    value={signUpData.username}
                    name="username"
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, username: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-3 border border-border rounded-xl text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                    value={signUpData.email}
                    name="email"
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-3 border border-border rounded-xl text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                    value={signUpData.first_name}
                    name="first_name"
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, first_name: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-3 border border-border rounded-xl text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                    value={signUpData.last_name}
                    name="last_name"
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, last_name: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-border rounded-xl text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                value={signInData.email}
                name="email"
                onChange={(e) =>
                  setSignInData({ ...signInData, email: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={!showPassword ? "password" : "text"}
                placeholder="Password"
                className="w-full p-3 pr-12 border border-border rounded-xl text-sm bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                value={SignIn ? signInData.password : signUpData.password}
                onChange={(e) =>
                  SignIn
                    ? setSignInData({ ...signInData, password: e.target.value })
                    : setSignUpData({ ...signUpData, password: e.target.value })
                }
                name="password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {!showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {SignIn && (
              <span className="text-xs text-primaryBlue cursor-pointer hover:underline mt-1 block text-right">
                Forgot Password?
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"              className="w-full mt-6 py-3.5 bg-primaryBlue text-white rounded-xl font-medium shadow-lg shadow-primaryBlue/25 hover:bg-darkBlue hover:shadow-primaryBlue/40 transition-all duration-200 active:scale-[0.98]"
        >
          {SignIn ? "Sign In" : "Sign Up"}
        </button>

        {SignIn && (
          <>
            <span className="text-muted-foreground text-xs block text-center mt-5">
              OR
            </span>
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                type="button"
                className="flex items-center gap-2 bg-primaryBlue/5 border border-primaryBlue/10 text-foreground py-2.5 px-5 rounded-xl cursor-pointer hover:bg-primaryBlue/10 transition-colors"
              >
                {/* @ts-ignore */}
                <img src={google} alt="" className="w-5 h-5" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="bg-muted/50 border border-border py-2.5 px-4 rounded-xl cursor-pointer hover:bg-muted transition-colors"
              >
                {/* @ts-ignore */}
                <img src={facebook} alt="" className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="bg-muted/50 border border-border py-2.5 px-4 rounded-xl cursor-pointer hover:bg-muted transition-colors"
              >
                {/* @ts-ignore */}
                <img src={apple} alt="" className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SignTable;
