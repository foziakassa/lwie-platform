import React from "react";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: string; size?: string }
>((props, ref) => {
  const { asChild, variant, size, ...rest } = props;
  return <button ref={ref} {...rest} />;
});

Button.displayName = "Button";
