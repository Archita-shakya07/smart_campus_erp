import React, { useState } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    if (asChild) return children as React.ReactElement;
    return <button ref={ref} {...props}>{children}</button>;
  }
);

DialogTrigger.displayName = "DialogTrigger";

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${className}`} {...props} />
);

export const DialogTitle = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`text-lg font-bold text-gray-800 ${className}`} {...props} />
);

export const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button
      ref={ref}
      className="text-gray-400 hover:text-gray-600 transition-colors"
      {...props}
    >
      <X size={20} />
    </button>
  )
);

DialogClose.displayName = "DialogClose";