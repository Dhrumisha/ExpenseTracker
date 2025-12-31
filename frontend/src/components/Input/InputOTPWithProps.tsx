"use client";

import * as React from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { InputOTPProps } from "./types";

export const InputOTPWithProps: React.FC<InputOTPProps> = ({
  label,
  length = 6,
  value,
  onChangeOTP,
  disabled,
  autoFocus,
  className,
  labelClassName,
  inputClassName,
  wrapperClassName,
  isNumberInput = true,
}) => {
  const handleChange = (val: string) => {
    if (isNumberInput && /[^0-9]/.test(val)) return; // block non-numeric
    onChangeOTP(val);
  };

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {/* Label */}
      {label && <Label className={cn("text-sm font-medium", labelClassName)}>{label}</Label>}

      {/* OTP Input */}
      <InputOTP
        maxLength={length}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn("flex justify-center gap-2", className)}
      >
        <InputOTPGroup>
          {Array.from({ length }).map((_, idx) => (
            <InputOTPSlot key={idx} index={idx} className={inputClassName} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};
