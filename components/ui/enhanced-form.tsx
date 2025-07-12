"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodSchema } from "zod"
import { cn } from "@/lib/utils"
import { EnhancedButton } from "./enhanced-button"
import { toast } from "sonner"

interface EnhancedFormProps<T extends Record<string, any>> {
  schema: ZodSchema<T>
  onSubmit: (data: T) => Promise<void> | void
  defaultValues?: Partial<T>
  children: React.ReactNode
  className?: string
  submitText?: string
  resetOnSubmit?: boolean
  showResetButton?: boolean
  loading?: boolean
}

export function EnhancedForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  submitText = "Submit",
  resetOnSubmit = false,
  showResetButton = false,
  loading = false,
}: EnhancedFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  })

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)

      if (resetOnSubmit) {
        form.reset()
      }

      toast.success("Form berhasil disubmit!", { duration: 2000 })
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Terjadi kesalahan saat submit form", { duration: 2000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-6", className)}>
        {children}

        <div className="flex gap-4 pt-4">
          <EnhancedButton
            type="submit"
            variant="satria"
            loading={isSubmitting || loading}
            loadingText="Submitting..."
            className="flex-1"
          >
            {submitText}
          </EnhancedButton>

          {showResetButton && (
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting || loading}
            >
              Reset
            </EnhancedButton>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

// Enhanced Form Field Component
interface EnhancedFormFieldProps {
  name: string
  label: string
  description?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function EnhancedFormField({
  name,
  label,
  description,
  required = false,
  children,
  className,
}: EnhancedFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
