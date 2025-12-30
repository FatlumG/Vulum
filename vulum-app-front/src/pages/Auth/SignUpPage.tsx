import React from "react";
import SignTable from "../../components/SignTable";
import salyPhone from "../../assets/figures/salyPhone.svg";
import salyMoto from "../../assets/figures/salyMoto.svg";
import logo from "../../assets/logos/vulumBlue.png";

const SignPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-primaryBlue relative overflow-hidden">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:block h-full w-1/2 bg-primary absolute z-0">
        <img
          src={logo}
          alt="Vulum Logo"
          className="w-[120px] lg:w-[150px] m-4 absolute left-5"
        />
      </div>

      {/* Mobile Logo - Shown only on mobile */}
      <div className="lg:hidden absolute top-4 left-4 z-20">
        <img src={logo} alt="Vulum Logo" className="w-[100px]" />
      </div>

      {/* Decorative Images - Hidden on mobile/tablet */}
      <img
        src={salyMoto}
        alt="Saly on Motorcycle"
        className="hidden xl:block absolute top-[140px] left-[5%] 2xl:left-[10%] z-10 max-w-[300px] 2xl:max-w-none"
      />
      <img
        src={salyPhone}
        alt="Saly with Phone"
        className="hidden xl:block absolute top-[100px] right-[2%] z-10 max-w-[280px] 2xl:max-w-none"
      />

      {/* Sign Up Form */}
      <SignTable SignIn={false} />
    </div>
  );
};

export default SignPage;
