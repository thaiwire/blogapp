import * as React from "react"
import type { FieldError as ReactHookFormFieldError } from "react-hook-form"

import { cn } from "@/lib/utils"

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-5", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-slate-800", className)} {...props} />
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />
}

type FieldErrorProps = React.ComponentProps<"div"> & {
  errors?: Array<ReactHookFormFieldError | undefined>
}

function FieldError({ className, errors, ...props }: FieldErrorProps) {
  const messages = (errors ?? []).flatMap((error) => {
    if (!error?.message) {
      return []
    }

    return [String(error.message)]
  })

  if (messages.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-1", className)} {...props}>
      {messages.map((message) => (
        <p key={message} className="text-sm text-rose-600">
          {message}
        </p>
      ))}
    </div>
  )
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel }