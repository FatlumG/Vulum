import React, { FC } from "react";
import { Button } from "../ui/button";

const Invoice: FC = () => {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="px-10 bg-gray-300 w-full h-24 rounded-lg flex items-center justify-between">
        <div className="w-36 h-14 bg-slate-100 rounded-lg"></div>
        <h2 className="">Some invoice name</h2>
        <div className="flex gap-5">
          <Button variant="outline">Preview</Button>
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
