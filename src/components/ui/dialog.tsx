"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ModalProps {
  /** Controlled open state. Omit to use `trigger` for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog when clicked (uncontrolled usage). */
  trigger?: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Actions rendered in the dialog footer. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Modal dialog built on Base UI. Focus is trapped while open, page scroll is
 * locked, and Escape / outside-press dismiss the dialog. A title is required
 * so the dialog is always labelled.
 */
export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <BaseDialog.Trigger render={trigger} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm",
            "transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          )}
        />
        <BaseDialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-border bg-card p-6 text-card-foreground shadow-soft",
            "transition-[transform,opacity] duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <BaseDialog.Title className="text-lg font-semibold leading-tight">
                {title}
              </BaseDialog.Title>
              {description ? (
                <BaseDialog.Description className="text-sm text-muted-foreground">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            <BaseDialog.Close
              aria-label="Close dialog"
              className={cn(
                "shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </BaseDialog.Close>
          </div>

          {children ? <div className="mt-4">{children}</div> : null}
          {footer ? (
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {footer}
            </div>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
