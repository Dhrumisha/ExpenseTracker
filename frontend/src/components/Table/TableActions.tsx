"use client";

import React from "react";

import { Edit, Trash2, CheckCircle, XCircle, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

import CommonDialog from "./ActionDialog";

interface IActionConfig {
  show?: boolean;
  status?: string | boolean;
  onClick?: () => void; // Not used directly anymore, replaced by parent callbacks
  modalContent?: React.ReactNode; // ✅ ReactNode passed from parent
  confirmText?: string; // ✅ Button label (e.g., Delete, Activate, etc.)
  onConfirm?: () => void; // ✅ Parent's handler
  title?: string; // Optional dialog title
}

interface ITableActionPanelProps {
  edit?: IActionConfig;
  remove?: IActionConfig;
  status?: IActionConfig;
  clone?: IActionConfig;
}

const TableActionPanel: React.FC<ITableActionPanelProps> = ({ edit, remove, status, clone }) => {
  const [dialogConfig, setDialogConfig] = React.useState<{
    open: boolean;
    content?: React.ReactNode;
    title?: string;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    open: false,
  });

  const handleOpenDialog = (config: {
    content?: React.ReactNode;
    title?: string;
    confirmText?: string;
    onConfirm?: () => void;
  }) => {
    setDialogConfig({ open: true, ...config });
  };

  const handleCloseDialog = () => {
    setDialogConfig({ open: false });
  };
  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {/* Edit */}
        {edit?.show && (
          <Button
            variant="ghost"
            size="icon"
            onClick={
              // handleOpenDialog({
              //   content: edit.modalContent,
              //   title: edit.title || "Edit Item",
              //   confirmText: edit.confirmText || "Save",
              //   onConfirm: edit.onConfirm,
              // })
              edit.onConfirm
            }
            className="hover:bg-[#f3f4f6] rounded-[0.375rem] cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {/* clone */}
        {clone?.show && (
          <Button
            variant="ghost"
            size="icon"
            onClick={
              // handleOpenDialog({
              //   content: clone.modalContent,
              //   title: clone.title || "Clone Item",
              //   confirmText: clone.confirmText || "Clone",
              //   onConfirm: clone.onConfirm,
              // })
              clone.onConfirm
            }
            className="hover:bg-[#f3f4f6] rounded-[0.375rem] cursor-pointer"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}

        {/* Activate / Deactivate */}
        {status?.show && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleOpenDialog({
                content: status.modalContent,
                title: status.title || "Change Status",
                confirmText:
                  status.confirmText || status.status === "Active" ? "Inactive" : "Active",
                onConfirm: status.onConfirm,
              })
            }
            className="hover:bg-[#f3f4f6] rounded-[0.375rem] cursor-pointer"
          >
            {status.status === "Active" ? (
              <XCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </Button>
        )}

        {/* Delete */}
        {remove?.show && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleOpenDialog({
                content: remove.modalContent,
                title: remove.title || "Confirm Delete",
                confirmText: remove.confirmText || "Delete",
                onConfirm: remove.onConfirm,
              })
            }
            className="hover:bg-[#f3f4f6] rounded-[0.375rem] cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        )}
      </div>
      {/* 🔸 Common Modal */}
      <CommonDialog
        key={`${dialogConfig.title}-${dialogConfig.confirmText}`}
        open={dialogConfig.open}
        onClose={handleCloseDialog}
        title={dialogConfig.title}
        content={dialogConfig.content}
        confirmText={dialogConfig.confirmText}
        onConfirm={() => {
          dialogConfig.onConfirm?.();
          handleCloseDialog();
        }}
      />
    </>
  );
};

export default TableActionPanel;
