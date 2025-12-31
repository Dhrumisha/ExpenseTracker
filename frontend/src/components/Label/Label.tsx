import { Label } from "@/components/ui/label";

import type { LabelHelperProps } from "./types";

export const LabelWithProps = ({ required, children, ...props }: LabelHelperProps) => {
  return (
    <Label {...props}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );
};

export default LabelWithProps;
