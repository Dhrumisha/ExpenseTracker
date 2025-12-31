export interface IToggleButtonProps {
  label?: string; // lable text for the switch
  asterisk?: boolean; // show asterisk next to label
  defaultValue?: boolean; // default value of the switch
  onChange?: (checked: boolean) => void; // callback when switch value changes
  name?: string; // name attribute for the switch
  id?: string; // id attribute for the switch
  disabled?: boolean; // Disable switch manually //
  isUsedWithoutPermission?: boolean; // Whether this can be used even without permission */
  isInline?: boolean; // whether label and switch are inline
  labelClassName?: string; // additional class for label
  wrapperClassName?: string;
  on?: string; // label for on state on the switch
  off?: string; // label for off state on the switch
}
