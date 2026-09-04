import React from "react";
import SignTable from "../../components/SignTable";
import salyPhone from "../../assets/figures/salyPhone.svg";
import salyMoto from "../../assets/figures/salyMoto.svg";
import logo from "../../assets/logos/vulumBlue.png";

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-primaryBlue via-blue-600 to-indigo-700">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:block h-full w-1/2 absolute z-0">
        <img
          src={logo}
          alt="Vulum Logo"
          className="w-[120px] lg:w-[150px] m-4 absolute left-5 top-4 brightness-0 invert"
        />
      </div>

      {/* Mobile Logo */}
      <div className="lg:hidden absolute top-4 left-4 z-20">
        <img src={logo} alt="Vulum Logo" className="w-[100px] brightness-0 invert" />
      </div>

      {/* Decorative Images */}
      <img
        // @ts-ignore
        src={salyMoto}
        alt="Saly on Motorcycle"
        className="hidden xl:block absolute top-[140px] left-[5%] 2xl:left-[10%] z-10 max-w-[300px] 2xl:max-w-none opacity-80"
      />
      <img
        // @ts-ignore
        src={salyPhone}
        alt="Saly with Phone"
        className="hidden xl:block absolute top-[100px] right-[2%] z-10 max-w-[280px] 2xl:max-w-none opacity-80"
      />

      {/* Sign Up Form */}
      <SignTable SignIn={false} />
    </div>
  );
};

export default SignUpPage;
