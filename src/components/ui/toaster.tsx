"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"

export function Toaster() {
  const { toasts } = useToast()
  const { t } = useTranslation()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const translatedTitle = typeof title === 'string' ? t(title) : title;
        const translatedDescription = typeof description === 'string' ? t(description) : description;

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{translatedTitle}</ToastTitle>}
              {description && (
                <ToastDescription>{translatedDescription}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
