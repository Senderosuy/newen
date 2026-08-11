import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RenderMarkdown } from "@/lib/markdown";
import { Bold, Italic, Heading2, Heading3, List, Link2, Eye, Pencil } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Editor de texto con formato simple (negrita, cursiva, subtítulos, listas,
 * enlaces) y vista previa. Guarda el texto con marcas tipo Markdown que el
 * sitio público renderiza formateado.
 */
export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  /** Envuelve la selección actual con marcas, o inserta un ejemplo. */
  const wrapSelection = (before: string, after: string, sample: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || sample;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  /** Inserta un prefijo al inicio de la línea actual (o de cada línea seleccionada). */
  const prefixLines = (prefix: string, sample: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const selected = value.slice(lineStart, end) || sample;
    const prefixed = selected
      .split("\n")
      .map((l) => (l.trim() === "" ? l : prefix + l.replace(/^(## |### |- )/, "")))
      .join("\n");
    const next = value.slice(0, lineStart) + prefixed + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + prefixed.length);
    });
  };

  const TOOLS = [
    { icon: Bold, label: "Negrita", action: () => wrapSelection("**", "**", "texto en negrita") },
    { icon: Italic, label: "Cursiva", action: () => wrapSelection("*", "*", "texto en cursiva") },
    { icon: Heading2, label: "Subtítulo", action: () => prefixLines("## ", "Subtítulo") },
    { icon: Heading3, label: "Subtítulo menor", action: () => prefixLines("### ", "Subtítulo menor") },
    { icon: List, label: "Lista", action: () => prefixLines("- ", "Elemento de lista") },
    { icon: Link2, label: "Enlace", action: () => wrapSelection("[", "](https://)", "texto del enlace") },
  ];

  return (
    <div className="border border-input rounded-md overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5 flex-wrap">
        {TOOLS.map(({ icon: Icon, label, action }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={label}
            disabled={preview}
            onClick={action}
          >
            <Icon size={15} />
          </Button>
        ))}
        <div className="flex-1" />
        <Button
          type="button"
          variant={preview ? "default" : "ghost"}
          size="sm"
          className="h-8 gap-1.5 px-2.5"
          onClick={() => setPreview(!preview)}
        >
          {preview ? <Pencil size={14} /> : <Eye size={14} />}
          {preview ? "Editar" : "Vista previa"}
        </Button>
      </div>

      {preview ? (
        <div className="p-4 min-h-[300px] bg-background text-sm">
          {value.trim() ? (
            <RenderMarkdown content={value} />
          ) : (
            <p className="text-muted-foreground">Nada para previsualizar todavía.</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] border-0 rounded-none focus-visible:ring-0 resize-y"
        />
      )}
    </div>
  );
}
