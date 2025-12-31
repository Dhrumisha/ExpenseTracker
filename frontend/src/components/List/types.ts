export interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ListHelperProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  ordered?: boolean;
}
