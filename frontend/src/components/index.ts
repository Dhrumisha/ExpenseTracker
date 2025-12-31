// src/components/common/index.ts

/**
 * Barrel export file for all common components
 * Import components using: import { CommonInput, CommonButton } from "@/components/common"
 */

// export { CommonInput } from "./Input/input";
export { ButtonWithProps } from "./Button/Button";
export { CheckboxWithProps } from "./Checkbox/Checkbox";
export { ButtonGroupWithProps } from "./ButtonGroup/ButtonGroup";
export { Imagewithprops } from "./ShowImage/Image";
export { default as CommonUpload } from "./Upload/Upload";

export { ImageWithProps } from "./Upload/Upload";

// Export new display components
export { AccordionWithProps } from "./Accordion/Accordian";
export { CommonAvatar, CommonAvatarGroup } from "./Avatar/Avatar";
export { CommonBadge, CommonBadgeGroup } from "./Badge/Badge";
export { CommonDropdown } from "./Dropdown-menu/Dropdown";
export { CommonCollapsible, CommonCollapsibleGroup } from "./Collapsible/Collapsible";
export { StatusBadge } from "./Badge/StatusBadge";
//export { AccordionWithProps } from "./Accordion/Accordion.type";
export { CommonScatterChart } from "./ScatterChart/ScatterChart";
// export { RichTextEditorWithProps } from "./RichtextEditor/RichtextEditor";
// export { CommonDivider, CommonDividerWithContent, CommonSectionDivider } from "./Divider/Divider";
export { SwitchWithProps } from "./Switch/Switch";

// Export Breadcrumb
export { Breadcrumb } from "./Breadcrumb/Breadcrumb";

// Re-export form component types
