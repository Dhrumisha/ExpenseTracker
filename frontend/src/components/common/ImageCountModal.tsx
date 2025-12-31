/* eslint-disable */
import { useState } from "react";
import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import { ButtonWithProps } from "../Button/Button";
import { InputWithProps } from "../Input/input";
import { toast } from "react-toastify";

interface ImageCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (count: number) => void;
  title: string;
  onDelete: (tabName: string) => void;
  tabName: string;
}

const ImageCountModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  onDelete,
  tabName,
}: ImageCountModalProps) => {
  const [count, setCount] = useState<number>(1);

  const handleSubmit = () => {
    if (count > 0) {
      onSubmit(count);
      onClose();
    } else {
      toast.error("Please enter a valid number");
    }
  };

  return (
    <CommonModelComponent
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={title}
      content={
        <div className="flex flex-col gap-4">
          <InputWithProps
            value={count.toString()}
            onChange={(e: any) => setCount(parseInt(e.target.value) || 1)}
            type="number"
            min={1}
            allowNegative={false}
            label="Image Count"
          />
        </div>
      }
      footer={
        <div className="flex gap-2">
          <ButtonWithProps
            onClick={() => {
              onDelete(tabName);
              onClose();
            }}
            variant="secondary"
          >
            {`Delete ${tabName}`}
          </ButtonWithProps>
          <ButtonWithProps onClick={onClose} variant="secondary">
            Cancel
          </ButtonWithProps>
          <ButtonWithProps onClick={handleSubmit} variant="default">
            Add Images
          </ButtonWithProps>
        </div>
      }
    />
  );
};

export default ImageCountModal;
