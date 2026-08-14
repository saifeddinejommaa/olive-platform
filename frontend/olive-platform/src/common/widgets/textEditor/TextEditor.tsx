import { useRef } from "react";
import "./TextEditor.css";

type TextEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  maxLength?: number;
};

export default function TextEditor({
  label,
  value,
  onChange,
  placeholder = "Écrire quelque chose...",
  disabled = false,
  required = false,
  error,
  maxLength,
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string) => {
    if (disabled) return;

    editorRef.current?.focus();

    document.execCommand(command, false);

    handleChange();
  };

  const handleChange = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;

    onChange(html);
  };

  const handleInput = () => {
    if (!editorRef.current) return;

    if (
      maxLength &&
      editorRef.current.innerText.length > maxLength
    ) {
      editorRef.current.innerText =
        editorRef.current.innerText.substring(0, maxLength);
    }

    handleChange();
  };

  return (
    <div className="text-editor-field">

      {label && (
        <label className="text-editor-label">
          {label}

          {required && (
            <span className="text-editor-required">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={[
          "text-editor",
          error ? "text-editor-error" : "",
          disabled ? "text-editor-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >

        {/* Toolbar */}

        <div className="text-editor-toolbar">

          <button
            type="button"
            className="editor-tool"
            onClick={() => executeCommand("bold")}
            disabled={disabled}
            title="Gras"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className="editor-tool"
            onClick={() => executeCommand("italic")}
            disabled={disabled}
            title="Italique"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className="editor-tool"
            onClick={() => executeCommand("underline")}
            disabled={disabled}
            title="Souligné"
          >
            <u>U</u>
          </button>

          <span className="editor-divider" />

          <button
            type="button"
            className="editor-tool"
            onClick={() =>
              executeCommand("insertUnorderedList")
            }
            disabled={disabled}
            title="Liste à puces"
          >
            ☷
          </button>

          <button
            type="button"
            className="editor-tool"
            onClick={() =>
              executeCommand("insertOrderedList")
            }
            disabled={disabled}
            title="Liste numérotée"
          >
            ≡
          </button>

          <span className="editor-divider" />

          <button
            type="button"
            className="editor-tool"
            onClick={() => executeCommand("undo")}
            disabled={disabled}
            title="Annuler"
          >
            ↶
          </button>

          <button
            type="button"
            className="editor-tool"
            onClick={() => executeCommand("redo")}
            disabled={disabled}
            title="Rétablir"
          >
            ↷
          </button>

          <button
            type="button"
            className="editor-tool"
            onClick={() =>
              executeCommand("removeFormat")
            }
            disabled={disabled}
            title="Effacer le formatage"
          >
            Tx
          </button>

        </div>

        {/* Content */}

        <div
          ref={editorRef}
          className="text-editor-content"
          contentEditable={!disabled}
          data-placeholder={placeholder}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{
            __html: value,
          }}
          onInput={handleInput}
        />

      </div>

      <div className="text-editor-footer">

        {error ? (
          <span className="text-editor-error-message">
            {error}
          </span>
        ) : (
          <span />
        )}

        {maxLength && (
          <span className="text-editor-counter">
            {editorRef.current?.innerText.length ?? 0} / {maxLength}
          </span>
        )}

      </div>

    </div>
  );
}