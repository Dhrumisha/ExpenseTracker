export interface DatePickerHelperProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  id?: string;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  onSelect?: (date: Date | undefined) => void;
}
