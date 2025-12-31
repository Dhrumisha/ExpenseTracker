/* eslint-disable */
import Button from "@/components/Button/Button";
import { InputWithProps } from "@/components/Input/input";
import CommonModelComponent from "@/components/Modal/CommonModelComponent";
// import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types";
import { Editor } from "grapesjs";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodToFormikValidation } from "@/utils/validations/zodValidateHelper";

interface AddRdMacTabProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tabName: string) => void;
  formInitialValues?: string;
  handleDelete?: (tabName: string) => void;
  editor: Editor;
}

// Simple validation schema for tab name only
const addRdMacTabValidationSchema = z.object({
  tabName: z.string().trim().min(1, "Tab name is required"),
});

const AddRdMacTab = ({
  isOpen,
  onClose,
  onSubmit,
  formInitialValues,
  handleDelete,
  editor,
}: AddRdMacTabProps) => {
  const initialValues = {
    tabName: formInitialValues || "",
  };

  const handleSubmit = async (values: any) => {
    try {
      const trimmedTabName = values.tabName.trim();

      if (!trimmedTabName) {
        toast.error("Tab name is required");
        return;
      }

      onSubmit(trimmedTabName);
      onClose();
    } catch (err) {
      console.log(err, "<===err");
      toast.error("Something went wrong");
    }
  };

  const content = (
    <Formik
      initialValues={initialValues}
      validate={zodToFormikValidation(addRdMacTabValidationSchema)}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form id="addRdMacTabForm" className="flex flex-col flex-1 h-full">
          <div className="flex flex-col gap-4 mb-4 flex-1">
            <div className="flex-1">
              <Field
                as={InputWithProps}
                name="tabName"
                label="Tab Name"
                placeholder="Enter tab name"
                formik={true}
                autoFocus
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <CommonModelComponent
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`${formInitialValues ? "Update" : "Add"} Tab`}
      content={content}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          {formInitialValues && handleDelete && (
            <Button
              variant="secondary"
              onClick={() => {
                handleDelete(formInitialValues);
                onClose();
              }}
            >
              Delete
            </Button>
          )}
          <Button variant="default" type="submit" form="addRdMacTabForm">
            {`${formInitialValues ? "Update" : "Add"} Tab`}
          </Button>
        </div>
      }
    />
  );
};

export default AddRdMacTab;
