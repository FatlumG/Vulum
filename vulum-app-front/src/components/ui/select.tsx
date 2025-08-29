import React from "react";
import { CategoryInterface } from "@/interfaces/CategoryInterface";

interface SelectProps {
  label: string;
  options?: CategoryInterface[];
  value: number | undefined;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-lg ">{label}</label>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        {Array.isArray(options) &&
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.category_name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;
