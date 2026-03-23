import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:ring-4 focus-visible:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-400 aria-invalid:ring-4 aria-invalid:ring-rose-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }