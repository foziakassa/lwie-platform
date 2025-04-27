declare module "components/ui/select" {
  import * as React from "react";

  export const Select: React.ForwardRefExoticComponent<React.SelectHTMLAttributes<HTMLSelectElement> & React.RefAttributes<HTMLSelectElement>>;
  export const SelectTrigger: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
  export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const SelectItem: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const SelectValue: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
}
