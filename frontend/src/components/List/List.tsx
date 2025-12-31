import type { ListItemProps, ListHelperProps } from "./types";

export const ListItemWithProps = ({ children, className, onClick }: ListItemProps) => {
  return (
    <li className={className} onClick={onClick}>
      {children}
    </li>
  );
};

export const ListWithProps = ({
  children,
  className,
  wrapperClassName,
  ordered = false,
}: ListHelperProps) => {
  const ListComponent = ordered ? "ol" : "ul";

  return (
    <div className={wrapperClassName}>
      <ListComponent className={className}>{children}</ListComponent>
    </div>
  );
};

export default ListWithProps;
