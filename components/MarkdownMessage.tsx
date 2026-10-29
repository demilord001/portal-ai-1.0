"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-invert max-w-none text-[#e0e3eb] leading-relaxed text-[15px] space-y-3 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold font-heading text-white mt-5 mb-2 pb-1 border-b border-white/10" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold font-heading text-white mt-4 mb-2 pb-1 border-b border-white/10" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-medium font-heading text-white/95 mt-3 mb-1" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-medium text-white/90 mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-[#dcdfe8]" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1.5 text-[#dcdfe8]" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1.5 text-[#dcdfe8]" {...props} />,
          li: ({ node, ...props }) => <li className="pl-0.5 leading-relaxed" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-indigo-500/70 bg-indigo-950/20 px-4 py-2 my-3 rounded-r-lg text-indigo-200/90 italic"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
              <table className="w-full text-left text-sm border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-[#181a24] text-white/90 font-medium" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/5" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-white/[0.02] transition-colors" {...props} />,
          th: ({ node, ...props }) => <th className="px-3.5 py-2.5 font-semibold text-white/80" {...props} />,
          td: ({ node, ...props }) => <td className="px-3.5 py-2.5 text-white/70" {...props} />,
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#589cff] hover:text-[#8cb8ff] underline underline-offset-4 decoration-indigo-500/50 transition-colors inline-flex items-center gap-1 font-medium"
              {...props}
            >
              {children}
            </a>
          ),
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="bg-[#1e202b] text-[#ff8da1] px-1.5 py-0.5 rounded text-[13.5px] font-mono border border-white/5"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeText = String(children).replace(/\n$/, "");
            const language = match ? match[1] : "plaintext";

            return <CodeBlock language={language} code={codeText} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10 bg-[#12131a] shadow-xl">
      {/* Code block header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#171922] border-b border-white/5 text-xs text-white/60">
        <span className="font-mono uppercase tracking-wider font-semibold text-indigo-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code block body */}
      <div className="p-4 overflow-x-auto text-[13.5px] font-mono text-[#e6edf3] leading-relaxed selection:bg-indigo-600/40">
        <pre className="!m-0 !p-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
