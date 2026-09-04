import React from "react"
import { cn } from "../../lib/utils"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = ({ className, children, required, ...props }: LabelProps) => (
  <label
    className={cn("block text-sm font-medium text-foreground mb-1.5", className)}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-0.5">*</span>}
  </label>
)
