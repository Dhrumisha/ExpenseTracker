export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  isHeader?: boolean;
  subItems?: MenuItem[];
}

export interface SidebarWithProps {
  menuItems: MenuItem[];
  isSideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: (menuItems: MenuItem[]) => React.ReactNode;
  contentWrapperClassName?: string;
  onItemSelect?: (itemId: string, href?: string) => void;
}
