export interface RichTextEditorWithProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  editorClassName?: string;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
  toolbarButtons?: string[];
  onChange?: (html: string) => void;
}
