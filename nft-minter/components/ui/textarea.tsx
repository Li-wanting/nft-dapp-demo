import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border-2 border-purple-100 bg-white px-4 py-3 text-base transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-purple-400 focus-visible:ring-4 focus-visible:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-purple-900 dark:bg-zinc-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:border-purple-600 dark:focus-visible:ring-purple-900",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

