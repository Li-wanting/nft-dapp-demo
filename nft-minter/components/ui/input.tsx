import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-purple-100 bg-white px-4 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-950 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-purple-400 focus-visible:ring-4 focus-visible:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-purple-900 dark:bg-zinc-900 dark:text-gray-100 dark:file:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:border-purple-600 dark:focus-visible:ring-purple-900",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

