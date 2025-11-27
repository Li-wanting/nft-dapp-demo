import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-purple-100 bg-white px-4 py-2 text-base transition-colors focus-visible:outline-none focus-visible:border-purple-400 focus-visible:ring-4 focus-visible:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-purple-900 dark:bg-zinc-900 dark:text-gray-100 dark:focus-visible:border-purple-600 dark:focus-visible:ring-purple-900",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }

