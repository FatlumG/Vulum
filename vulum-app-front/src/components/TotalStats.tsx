import { FaArrowTrendUp } from "react-icons/fa6";
import React, { ComponentType, SVGProps } from "react";

interface TotalStatsProps {
  img: string | ComponentType<SVGProps<SVGSVGElement>>;
  alt: string;
  title: string;
  quantity: number | undefined;
  percentage: string;
  descr: string;
  up: boolean;
}

const TotalStats: React.FC<TotalStatsProps> = ({
  img,
  alt,
  title,
  quantity,
  percentage,
  descr,
  up,
}) => {
  const renderImg = () => {
    if (typeof img === "string") {
      return <img src={img} alt={alt} className="w-5 h-5 opacity-80" />;
    }
    const Icon = img;
    return <Icon className="w-5 h-5 opacity-80" />;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 sm:p-6 hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="w-10 h-10 rounded-lg bg-primaryBlue/5 flex items-center justify-center group-hover:bg-primaryBlue/10 transition-colors">
          {renderImg()}
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {quantity?.toLocaleString() ?? 0}
      </p>
      <div className="flex items-center gap-1.5 text-sm">
        <FaArrowTrendUp
          className={`w-3.5 h-3.5 ${
            up ? "text-emerald-500" : "text-red-500"
          }`}
        />
        <span
          className={`font-medium ${
            up ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {percentage}
        </span>
        <span className="text-muted-foreground text-xs">{descr}</span>
      </div>
    </div>
  );
};

export default TotalStats;
