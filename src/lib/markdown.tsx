import React from "react";

/**
 * Mini-renderizador de Markdown (subconjunto) sin dependencias.
 * Soporta: ## subtítulos, ### subtítulos menores, **negrita**, *cursiva*,
 * [texto](url), listas con "- " y párrafos separados por línea en blanco.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // enlaces, negrita, cursiva
  const regex = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      nodes.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          {match[2]}
        </a>,
      );
    } else if (match[4]) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{match[5]}</strong>);
    } else if (match[6]) {
      nodes.push(<em key={`${keyPrefix}-i${i}`}>{match[7]}</em>);
    }
    lastIndex = regex.lastIndex;
    i++;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function RenderMarkdown({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join("\n");
    blocks.push(
      <p key={`p${key++}`} className="leading-relaxed whitespace-pre-line mb-5">
        {renderInline(text, `p${key}`)}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul${key++}`} className="list-disc pl-6 mb-5 space-y-1.5">
        {list.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInline(item, `li${key}-${idx}`)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      flushParagraph();
      flushList();
    } else if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`h3${key++}`} className="text-xl font-bold mt-8 mb-3">
          {renderInline(trimmed.slice(4), `h3${key}`)}
        </h3>,
      );
    } else if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2 key={`h2${key++}`} className="text-2xl font-bold mt-10 mb-4">
          {renderInline(trimmed.slice(3), `h2${key}`)}
        </h2>,
      );
    } else if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <div>{blocks}</div>;
}
