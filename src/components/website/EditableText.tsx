import { useState, useRef, useEffect } from "react";
import { Pencil, Check } from "lucide-react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  editable?: boolean;
}

const EditableText = ({
  value,
  onChange,
  as: Tag = "p",
  className = "",
  multiline = false,
  placeholder = "Click to edit...",
  editable = true,
}: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!editable) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  if (editing) {
    const handleSave = () => {
      onChange(draft);
      setEditing(false);
    };

    const commonProps = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline) handleSave();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      },
      onBlur: handleSave,
      className:
        "w-full bg-transparent border-b-2 border-primary outline-none " + className,
      placeholder,
    };

    return multiline ? (
      <textarea ref={inputRef as any} rows={4} {...commonProps} />
    ) : (
      <input ref={inputRef as any} type="text" {...commonProps} />
    );
  }

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => setEditing(true)}
    >
      <Tag className={className}>{value || placeholder}</Tag>
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-1">
        <Pencil className="h-3 w-3" />
      </span>
    </div>
  );
};

export default EditableText;
