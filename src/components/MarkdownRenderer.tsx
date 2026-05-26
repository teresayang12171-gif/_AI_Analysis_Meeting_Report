import React from "react";
import { Check, Square, Clipboard, CheckCircle2 } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = "";

  let inList = false;
  let listItems: { text: string; checked?: boolean }[] = [];
  let listType: "bullet" | "number" | "check" = "bullet";

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  // Helper to purge markdown bold/italic/code inside lists or table cells
  const parseInlineMarkdown = (text: string) => {
    let result: React.ReactNode[] = [];
    let currentText = text;

    // A very simple but effective parser for bold (**text**), italics (*text*), and inline code (`code`)
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const parts = currentText.split(regex);

    parts.forEach((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        result.push(
          <strong key={i} className="font-semibold text-slate-900 border-b border-indigo-100/45">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        result.push(
          <em key={i} className="italic text-slate-700">
            {part.slice(1, -1)}
          </em>
        );
      } else if (part.startsWith("`") && part.endsWith("`")) {
        result.push(
          <code key={i} className="bg-indigo-50/60 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-xs font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      } else {
        result.push(part);
      }
    });

    return result.length > 0 ? result : text;
  };

  const flushCodeBlock = (key: number) => {
    const codeText = codeBlockContent.join("\n");
    elements.push(<CodeBlockRenderer key={`code-${key}`} code={codeText} lang={codeBlockLang} />);
    codeBlockContent = [];
    codeBlockLang = "";
    inCodeBlock = false;
  };

  const flushList = (key: number) => {
    if (listItems.length === 0) return;
    if (listType === "check") {
      elements.push(
        <ul key={`list-${key}`} className="space-y-2.5 my-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed text-[15px]">
              {item.checked ? (
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm transition-all duration-200 hover:scale-105">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-300">
                  <Square className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
              )}
              <span className={item.checked ? "text-slate-400 line-through decoration-slate-300" : ""}>
                {parseInlineMarkdown(item.text)}
              </span>
            </li>
          ))}
        </ul>
      );
    } else if (listType === "number") {
      elements.push(
        <ol key={`list-${key}`} className="space-y-2 my-4 list-decimal pl-6 text-slate-700 text-[15px] leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1">
              {parseInlineMarkdown(item.text)}
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul key={`list-${key}`} className="space-y-2 my-4 list-disc pl-6 text-slate-700 text-[15px] leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1">
              {parseInlineMarkdown(item.text)}
            </li>
          ))}
        </ul>
      );
    }
    listItems = [];
    inList = false;
  };

  const flushTable = (key: number) => {
    if (tableHeaders.length === 0 && tableRows.length === 0) return;
    elements.push(
      <div key={`table-${key}`} className="overflow-x-auto my-5 border border-slate-200 rounded-xl shadow-sm bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-[14px]">
          <thead className="bg-slate-50/70">
            <tr>
              {tableHeaders.map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left font-medium text-slate-800 tracking-wider">
                  {parseInlineMarkdown(header.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {parseInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  };

  let keyIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    keyIndex++;

    // Code Block detection
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(keyIndex);
      } else {
        if (inList) flushList(keyIndex);
        if (inTable) flushTable(keyIndex);
        inCodeBlock = true;
        codeBlockLang = line.replace("```", "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // List detection
    const checklistMatch = line.match(/^(\s*)([-*])\s+\[([ xX])\]\s+(.*)$/);
    const bulletMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);
    const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);

    if (checklistMatch) {
      if (inTable) flushTable(keyIndex);
      if (inList && listType !== "check") {
        flushList(keyIndex);
      }
      inList = true;
      listType = "check";
      listItems.push({
        text: checklistMatch[4],
        checked: checklistMatch[3].toLowerCase() === "x",
      });
      continue;
    } else if (numberMatch) {
      if (inTable) flushTable(keyIndex);
      if (inList && listType !== "number") {
        flushList(keyIndex);
      }
      inList = true;
      listType = "number";
      listItems.push({ text: numberMatch[3] });
      continue;
    } else if (bulletMatch) {
      // Avoid matching horizontal rules (e.g. --- or ***)
      if (bulletMatch[2] === "-" && line.trim().match(/^-{3,}$/)) {
        if (inList) flushList(keyIndex);
        if (inTable) flushTable(keyIndex);
        elements.push(<hr key={keyIndex} className="my-6 border-t border-slate-200" />);
        continue;
      }

      if (inTable) flushTable(keyIndex);
      if (inList && listType !== "bullet") {
        flushList(keyIndex);
      }
      inList = true;
      listType = "bullet";
      listItems.push({ text: bulletMatch[3] });
      continue;
    }

    // Table detection: starts or contains '|'
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (inList) flushList(keyIndex);
      
      // Check if it's separator row (e.g. |---|---|)
      if (line.includes("-") && !line.match(/[a-zA-Z0-9\u4e00-\u9fa5]/)) {
        // Just separator, skip
        continue;
      }

      const cells = line.split("|").slice(1, -1);
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    }

    // Other matches, first terminate current running blocks
    if (inList) flushList(keyIndex);
    if (inTable) flushTable(keyIndex);

    // Headings
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, "");
      const parsedText = parseInlineMarkdown(text);

      if (level === 1) {
        elements.push(
          <h1 key={keyIndex} className="text-2xl md:text-3xl font-bold text-slate-900 mt-6 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2 tracking-tight">
            {parsedText}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={keyIndex} className="text-xl md:text-2xl font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2 border-l-4 border-indigo-600 pl-3 tracking-tight">
            {parsedText}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3 key={keyIndex} className="text-lg font-semibold text-slate-800 mt-5 mb-2 tracking-tight">
            {parsedText}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={keyIndex} className="text-base font-semibold text-slate-700 mt-4 mb-2">
            {parsedText}
          </h4>
        );
      }
      continue;
    }

    // Blockquote
    if (line.trim().startsWith(">")) {
      const text = line.replace(/^\s*>\s*/, "");
      elements.push(
        <div key={keyIndex} className="border-l-4 border-indigo-200 bg-indigo-50/20 px-4 py-3 rounded-r-xl my-4 text-slate-600 leading-relaxed italic text-[15px]">
          {parseInlineMarkdown(text)}
        </div>
      );
      continue;
    }

    // Spacing
    if (line.trim() === "") {
      continue;
    }

    // Paragraph
    elements.push(
      <p key={keyIndex} className="text-[15px] text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  // Flush remaining at end of file
  if (inCodeBlock) flushCodeBlock(keyIndex);
  if (inList) flushList(keyIndex);
  if (inTable) flushTable(keyIndex);

  return <div className="space-y-1">{elements}</div>;
}

// Subcomponent to render a beautiful code block with simple copy logic
interface CodeBlockRendererProps {
  key?: string;
  code: string;
  lang?: string;
}

function CodeBlockRenderer({ code, lang }: CodeBlockRendererProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-5 bg-slate-950/95 border border-slate-800 shadow-lg text-[13px] font-mono">
      {/* Top action bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-slate-400 capitalize text-xs select-none">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs"
          title="複製代碼"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">已複製</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span>複製</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-4 overflow-x-auto text-slate-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
