import React from "react";
import Header from "../components/Header";
import DashboardSidebar from "../components/DashboardSidebar";
const SettingsPage: React.FC = function () {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-12">
        <DashboardSidebar classes="col-span-2" />
        <div className="col-span-10 py-5 px-10 font-NunitoSans">
          <h1>This is settings page</h1>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
