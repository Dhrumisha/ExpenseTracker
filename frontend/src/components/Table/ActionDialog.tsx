"use client";

import type { ReactNode } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ICommonDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  hideFooter?: boolean;
}

const CommonDialog: React.FC<ICommonDialogProps> = ({
  open,
  title,
  description,
  content,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  hideFooter = false,
}) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-full sm:max-w-md lg:max-w-lg xl:max-w-xl p-6 rounded-xl">
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className="py-3">{content}</div>

        {!hideFooter && (
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
