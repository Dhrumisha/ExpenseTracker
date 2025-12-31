"use client";

import React from "react";

import { Trash2, CheckCircle, XCircle, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

import CommonDialog from "./ActionDialog";

interface IActionConfig<T> {
  show?: boolean;
  onClick?: () => void; // Not used directly anymore, replaced by parent callbacks
  modalContent?: React.ReactNode;
  confirmText?: string;
  onConfirm?: (selectedRows: T[]) => void;
  title?: string;
}

interface IBulkActionPanelProps<T> {
  selectedRows: T[];
  selectedCount: number;

  // Four fixed actions
  cloneAll?: IActionConfig<T>;
  activateAll?: IActionConfig<T>;
  deactivateAll?: IActionConfig<T>;
  deleteAll?: IActionConfig<T>;
}

const BulkActionPanel = <T,>({
  selectedRows,
  selectedCount,
  cloneAll,
  activateAll,
  deactivateAll,
  deleteAll,
}: IBulkActionPanelProps<T>) => {
  const [dialogConfig, setDialogConfig] = React.useState<{
    open: boolean;
    title?: string;
    content?: React.ReactNode;
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
    setDialogConfig((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <div className="flex items-center justify-start gap-2  p-1">
        <span className="text-sm font-medium text-gray-700">{selectedCount} selected</span>

        <div className="flex items-center gap-2">
          {/* Clone All */}
          {cloneAll?.show && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleOpenDialog({
                  content:
                    cloneAll.modalContent ||
                    `Are you sure you want to clone all ${selectedCount} selected records?`,
                  title: cloneAll.title || "Clone All Selected",
                  confirmText: cloneAll.confirmText || "Clone All",
                  onConfirm: () => cloneAll.onConfirm?.(selectedRows),
                })
              }
              className="hover:bg-gray-100 rounded-md"
            >
              <Copy className="h-4 w-4 mr-1" />
              Clone
            </Button>
          )}

          {/* Activate All */}
          {activateAll?.show && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleOpenDialog({
                  content:
                    activateAll.modalContent ||
                    `Are you sure you want to activate all ${selectedCount} selected records?`,
                  title: activateAll.title || "Activate All Selected",
                  confirmText: activateAll.confirmText || "Activate All",
                  onConfirm: () => activateAll.onConfirm?.(selectedRows),
                })
              }
              className="hover:bg-gray-100 rounded-md"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Activate
            </Button>
          )}

          {/* Deactivate All */}
          {deactivateAll?.show && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleOpenDialog({
                  content:
                    deactivateAll.modalContent ||
                    `Are you sure you want to deactivate all ${selectedCount} selected records?`,
                  title: deactivateAll.title || "Deactivate All Selected",
                  confirmText: deactivateAll.confirmText || "Deactivate All",
                  onConfirm: () => deactivateAll.onConfirm?.(selectedRows),
                })
              }
              className="hover:bg-gray-100 rounded-md"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Deactivate
            </Button>
          )}

          {/* Delete All */}
          {deleteAll?.show && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleOpenDialog({
                  content:
                    deleteAll.modalContent ||
                    `Are you sure you want to delete all ${selectedCount} selected records?`,
                  title: deleteAll.title || "Delete All Selected",
                  confirmText: deleteAll.confirmText || "Delete All",
                  onConfirm: () => deleteAll.onConfirm?.(selectedRows),
                })
              }
              className="hover:bg-gray-100 rounded-md "
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Common Modal */}
      <CommonDialog
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

export default BulkActionPanel;
