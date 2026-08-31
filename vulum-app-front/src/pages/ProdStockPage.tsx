import React, { FC } from "react";

const ProdStockPage: FC = () => {
  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">
        Product Stock
      </h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Stock overview</h3>
        <p className="text-sm text-muted-foreground">
          Product stock information will appear here.
        </p>
      </div>
    </div>
  );
};

export default ProdStockPage;
