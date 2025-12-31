import { useMemo, useRef } from "react";

import dynamic from "next/dynamic";

import Loader from "../common/Loader";
import FormErrorMessage from "../FormErrorMessage/FormErrorMessage";
import LabelWithProps from "../Label/Label";

import type { Jodit } from "jodit";
import type { InsertMode } from "jodit/types/types";

// Dynamically import Jodit to avoid SSR issues
const Editor = dynamic(async () => import("jodit-react"), {
  ssr: false,
  loading: () => <Loader />,
});

export interface JoditEditorProps {
  initialData?: string;
  onChange?: (data: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  asterisk?: boolean;
  useInlineEditor?: boolean;
  theme?: "light" | "dark";
}

const RichTextEditor = ({
  placeholder = "Start typing...",
  initialData = "",
  onChange,
  disabled = false,
  className = "bg-body-light dark:bg-body-dark border border-gray-light dark:border-gray-dark",
  label = "",
  error = false,
  errorMessage = "",
  asterisk = false,
  useInlineEditor = false,
  theme = "light",
}: JoditEditorProps) => {
  const editor = useRef<Jodit | null>(null);

  // Memoize config to prevent re-renders
  const config = useMemo(
    () => ({
      readonly: disabled,
      placeholder: placeholder,
      toolbar: true,
      height: 400,
      inline: useInlineEditor, // Enable inline mode when useInlineEditor is true
      toolbarInline: true, // Show inline toolbar on selection
      toolbarInlineForSelection: true, // Show toolbar only when text is selected
      showPlaceholder: !useInlineEditor, // Hide placeholder in inline mode
      uploader: {
        insertImageAsBase64URI: true,
      },

      // Toolbar configuration with source button
      buttons: [
        // Full toolbar for regular mode
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "fontsize",
        "paragraph",
        "lineHeight",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "|",
        "fullsize",
      ],

      // TODO: Source editor configuration
      //   sourceEditor: {
      //     aceOptions: {
      //       theme: "dark",
      //       mode: "ace/mode/html",
      //       wrap: true,
      //       showGutter: true,
      //       highlightActiveLine: true,
      //       fontSize: 14
      //     }
      //   },

      // Clean HTML configuration - Allow SVG
      theme: theme,
      cleanHTML: {
        fillEmptyParagraph: false,
        removeEmptyElements: false,
        removeEmptyAttributes: false,
        allowTags: false, // Allow all tags
        denyTags: "script|style", // Deny only script and style tags
      },

      // Additional options
      askBeforePasteHTML: false,
      useDefaultPInlineForEmptyContainer: false,
      disablePlugins: "powered-by-jodit",
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_only_text" as InsertMode | undefined,
      showCharsCounter: !useInlineEditor, // Hide counters in inline mode
      showWordsCounter: !useInlineEditor,
      showXPathInStatusbar: false,
      statusbar: false, // Hide statusbar
      // Allow resizing for these elements
      // allowResizeTags: ["img", "iframe", "table", "svg"],
      // Enter configuration
      // NOTE: If we use "p" then it is taking some default value like <p></p> so we are using br
      enter: "br", // or "div"
      defaultMode: "div",
      // Additional security
      safeMode: false,

      // Inline specific options
      toolbarAdaptive: useInlineEditor,
      toolbarSticky: !useInlineEditor,
      // Events
      events: {
        afterInit: function (editorInstance: Jodit) {},
      },
    }),
    [disabled, placeholder, useInlineEditor, theme]
  );

  // Handle change event
  const handleChange = (newContent: string) => {
    //NOTE: For optimization purpose we are not calling onChange here
    // if (onChange) {
    //   onChange(newContent);
    // }
  };

  // Handle blur event
  const handleBlur = (newContent: string) => {
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <LabelWithProps>
          {label}
          {asterisk && <span className="text-danger">*</span>}
        </LabelWithProps>
      )}

      <div
        className={`rich-text-editor-wrapper ${className} ${useInlineEditor ? "inline-editor-wrapper" : ""}`}
      >
        <Editor
          ref={editor}
          value={initialData}
          // @ts-expect-error
          config={config}
          tabIndex={1}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>

      {error && errorMessage && <FormErrorMessage error={errorMessage} />}
    </div>
  );
};

export default RichTextEditor;
