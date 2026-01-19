import React from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0">
      {/* Lớp phủ mờ (Overlay) - Click vào đây sẽ đóng dialog */}
      <div className="absolute inset-0" onClick={() => onOpenChange?.(false)} />
      {/* Nội dung Dialog */}
      {children}
    </div>
  );
};

export const DialogContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative z-50 grid w-full max-w-lg gap-4 border bg-white text-gray-900 p-6 shadow-lg duration-200 sm:rounded-lg md:w-full max-h-[90vh] overflow-y-auto ${className}`}
      onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra overlay
    >
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    >
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
};

export const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    >
      {children}
    </div>
  );
};
