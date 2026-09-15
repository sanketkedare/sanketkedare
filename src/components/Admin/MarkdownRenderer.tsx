'use client';

import React, { useState } from 'react';
import { FiCopy, FiCheck, FiExternalLink, FiTerminal } from 'react-icons/fi';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Format inline markdown tokens: bold, italic, code, links
 */
function renderInline(text: string): React.ReactNode {
  const tokens = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // 1. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-white/[0.08] border border-white/[0.12] text-indigo-200 font-mono text-xs font-semibold select-all"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 2. Bold text: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      tokens.push(
        <strong key={key++} className="font-bold text-white tracking-normal">
          {renderInline(boldMatch[2])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 3. Links: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith('http');
      tokens.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 decoration-indigo-500/40 hover:decoration-indigo-300 transition-colors"
        >
          {linkMatch[1]}
          {isExternal && <FiExternalLink size={11} className="shrink-0" />}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // 4. Italic text: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch && italicMatch[2].trim().length > 0) {
      tokens.push(
        <em key={key++} className="italic text-slate-300">
          {renderInline(italicMatch[2])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 5. Normal text chunk until next special char
    const nextSpecial = remaining.search(/[`*_\[]/);
    if (nextSpecial === -1) {
      tokens.push(<React.Fragment key={key++}>{remaining}</React.Fragment>);
      break;
    } else if (nextSpecial === 0) {
      tokens.push(<React.Fragment key={key++}>{remaining[0]}</React.Fragment>);
      remaining = remaining.slice(1);
    } else {
      tokens.push(<React.Fragment key={key++}>{remaining.slice(0, nextSpecial)}</React.Fragment>);
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
}

/**
 * Code Block Component with Copy Action
 */
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl bg-[#0a0c14] border border-white/[0.1] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.08] text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <FiTerminal className="text-indigo-400" size={13} />
          <span className="text-indigo-300 font-semibold uppercase text-[11px]">{language || 'code'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-all cursor-pointer text-[11px]"
        >
          {copied ? (
            <>
              <FiCheck className="text-emerald-400" size={12} />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-indigo-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Rich Native Markdown Parser & Renderer for Admin Portal
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];
  let codeBlockLang = '';

  let inList = false;
  let listItems: React.ReactNode[] = [];
  let isOrderedList = false;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (isOrderedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 pl-1 sm:pl-2 text-slate-200 list-none">
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-1 sm:pl-2 text-slate-200 list-none">
            {listItems}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle (```)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBlockBuffer.join('\n')}
            language={codeBlockLang}
          />
        );
        inCodeBlock = false;
        codeBlockBuffer = [];
        codeBlockLang = '';
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeBlockBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (trimmed === '') {
      flushList();
      continue;
    }

    // Horizontal Rule
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      elements.push(
        <hr key={`hr-${elements.length}`} className="my-3.5 border-t border-white/[0.08]" />
      );
      continue;
    }

    // Headings (#, ##, ###, ####)
    if (trimmed.startsWith('#')) {
      flushList();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];

        if (level === 1) {
          elements.push(
            <h1 key={`h1-${elements.length}`} className="text-base sm:text-lg font-black text-white mt-3.5 mb-1.5 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
              {renderInline(text)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={`h2-${elements.length}`} className="text-sm sm:text-base font-bold text-white mt-3 mb-1.5 tracking-tight">
              {renderInline(text)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h3-${elements.length}`} className="text-xs sm:text-sm font-bold text-indigo-300 mt-2.5 mb-1 flex items-center gap-1.5">
              <span className="text-indigo-400 font-mono text-[11px]">▸</span>
              {renderInline(text)}
            </h3>
          );
        } else {
          elements.push(
            <h4 key={`h4-${elements.length}`} className="text-xs font-semibold text-slate-200 mt-2 mb-1">
              {renderInline(text)}
            </h4>
          );
        }
        continue;
      }
    }

    // Blockquote (> text)
    if (trimmed.startsWith('>')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-2.5 pl-3 py-1.5 border-l-2 border-indigo-500 bg-indigo-500/[0.06] rounded-r-lg text-xs sm:text-sm text-slate-200"
        >
          {renderInline(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Unordered List (- item or * item)
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (!inList || isOrderedList) {
        flushList();
        inList = true;
        isOrderedList = false;
      }
      listItems.push(
        <li key={`li-${listItems.length}`} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
          <div className="flex-1 min-w-0">{renderInline(bulletMatch[1])}</div>
        </li>
      );
      continue;
    }

    // Ordered List (1. item, 2. item)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (!inList || !isOrderedList) {
        flushList();
        inList = true;
        isOrderedList = true;
      }
      listItems.push(
        <li key={`li-${listItems.length}`} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-slate-200">
          <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold mt-0.5 shrink-0">
            {numMatch[1]}
          </span>
          <div className="flex-1 min-w-0">{renderInline(numMatch[2])}</div>
        </li>
      );
      continue;
    }

    // Default Paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="my-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className={`markdown-content space-y-1 ${className}`}>{elements}</div>;
}
