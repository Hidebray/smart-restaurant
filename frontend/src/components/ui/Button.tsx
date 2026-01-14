import * as React from "react";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",

          // Size
          size === "default" && "h-10 px-4 text-sm",
          size === "icon" && "h-9 w-9",

          // Variants (QUAN TRỌNG NHẤT)
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",

          variant === "outline" &&
            "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",

          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
