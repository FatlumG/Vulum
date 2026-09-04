import React, { FC } from "react";

const OListPage: FC = () => {
  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">
        Order List
      </h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No orders yet</h3>
        <p className="text-sm text-muted-foreground">
          Orders will appear here once customers start purchasing.
        </p>
      </div>
    </div>
  );
};

export default OListPage;
