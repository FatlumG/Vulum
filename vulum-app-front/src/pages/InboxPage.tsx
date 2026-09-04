import React, { FC } from "react";

const InboxPage: FC = () => {
  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">
        Inbox
      </h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No messages</h3>
        <p className="text-sm text-muted-foreground">
          Your inbox is empty. New messages will appear here.
        </p>
      </div>
    </div>
  );
};

export default InboxPage;
