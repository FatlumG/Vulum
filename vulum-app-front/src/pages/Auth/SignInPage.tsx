import React from "react";
import SignTable from "../../components/SignTable";
import salyPhone from "../../assets/figures/salyPhone.svg";
import salyMoto from "../../assets/figures/salyMoto.svg";
import logo from "../../assets/logos/vulumBlue.png";
const SignPage: React.FC = () => {
  return (
    <div className="h-[100vh] w-[full] bg-primaryBlue">
      <div className="h-[100vh] w-[50%] bg-primary absolute z-0">
        <img
          src={logo}
          alt="Vulum Dark Orange"
          className="w-[150px] m-4 absolute left-5"
        />
      </div>
      <img
        src={salyMoto}
        alt="Saly in Motorcycle"
        className="absolute top-[140px] left-[10%] z-10"
      />
      <img
        src={salyPhone}
        alt="Saly in Motorcycle"
        className="absolute top-[100px] right-[2%] z-10"
      />
      <SignTable SignIn={true} />
    </div>
  );
};

export default SignPage;
