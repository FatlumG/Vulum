import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

function TotalStats({
  img,
  alt,
  title,
  quantity,
  percentage,
  descr,
  up,
}) {
  return (
    <div className="h-[180px] w-[350px] flex flex-col justify-between py-5 px-6 mt-5 bg-white rounded-3xl relative">
      <img src={img} alt={alt} className="size-[65px] absolute right-5" />
      <p className="text-[14px]">{title}</p>
      <p className="text-[30px] font-semibold">{quantity}</p>
      <div className="flex items-center gap-2 text-[14px]">
        <FaArrowTrendUp
          className={`scale-105 ${
            up ? "text-green-500" : "text-red-500"
          }`}
        />
        <span className={`${up ? "text-green-500" : "text-red-500"}`}>
          {percentage}
        </span>
        {descr}
      </div>
    </div>
  );
}

export default TotalStats;
