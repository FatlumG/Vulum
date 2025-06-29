// components/ui/Label.tsx
import React from "react"
import { cn } from "../../lib/utils"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = ({ className, children, required, ...props }: LabelProps) => (
  <label
    className={cn("block text-sm font-medium text-foreground", className)}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)
