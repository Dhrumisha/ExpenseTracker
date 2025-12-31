export interface DndGridProps<T = any> {
  items: T[];
  setItems: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  sortableKey: keyof T;
  disableDragAndDrop?: boolean;
}

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}
