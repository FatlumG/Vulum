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
      <label className="mb-1 text-sm font-medium text-foreground">{label}</label>
      <select
        className="border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
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
