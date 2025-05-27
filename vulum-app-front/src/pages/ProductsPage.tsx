import React from "react";
import Header from "../components/Header";
import DashboardSidebar from "../components/DashboardSidebar";

const ProductsPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-12">
        <DashboardSidebar classes="col-span-2" />
        <div className="col-span-10 py-5 px-10 font-NunitoSans">
          <h1>This is products page</h1>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
