import React from "react";
import SignTable from "../../components/SignTable";
import SalyPhone from "../../assets/figures/salyPhone.svg";
import SalyMoto from "../../assets/figures/salyMoto.svg";
import logo from "../../assets/logos/vulumBlue.png";
const SignPage: React.FC = () => {
  return (
    <div className="h-[100vh] w-[full] bg-secondary">
      <div className="h-[100vh] w-[50%] bg-primary absolute z-0">
        <img
          src={logo}
          alt="Vulum Dark Orange"
          className="w-[150px] m-4 absolute left-5"
        />
      </div>
      <img
        src={SalyMoto}
        alt="Saly in Motorcycle"
        className="absolute top-[140px] left-[10%] z-10"
      />
      <img
        src={SalyPhone}
        alt="Saly in Motorcycle"
        className="absolute top-[100px] right-[2%] z-10"
      />
      <SignTable SignIn={true} />
    </div>
  );
};

export default SignPage;
