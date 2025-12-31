/* eslint-disable */
import { useState } from "react";
import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import { ButtonWithProps } from "../Button/Button";
import { InputWithProps } from "../Input/input";
import { toast } from "react-toastify";

interface BrandTabNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
}

const BrandTabNameModal = ({ isOpen, onClose, onSubmit, title }: BrandTabNameModalProps) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    if (name.trim().length > 0) {
      onSubmit(name.trim());
      onClose();
    } else {
      toast.error("Please enter a valid brand tab name");
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
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Enter brand tab name"
            name="brandTabName"
            formik={false}
          />
        </div>
      }
      footer={
        <div className="flex gap-2">
          <ButtonWithProps onClick={onClose} variant="secondary">
            Cancel
          </ButtonWithProps>
          <ButtonWithProps onClick={handleSubmit} variant="default">
            Submit
          </ButtonWithProps>
        </div>
      }
    />
  );
};

export default BrandTabNameModal;
