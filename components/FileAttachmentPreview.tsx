"use client";

import React from "react";
import { X, FileText, Image as ImageIcon, FileCode, Paperclip } from "lucide-react";
import { AttachmentItem } from "@/db/schema";

interface FileAttachmentPreviewProps {
  attachments: AttachmentItem[];
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

export function FileAttachmentPreview({
  attachments,
  onRemove,
  readOnly = false,
}: FileAttachmentPreviewProps) {
  if (!attachments || attachments.length === 0) return null;

  const getIcon = (type: string, name: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4 text-pink-400" />;
    }
    if (
      type.includes("javascript") ||
      type.includes("typescript") ||
      type.includes("json") ||
      type.includes("python") ||
      name.endsWith(".ts") ||
      name.endsWith(".tsx") ||
      name.endsWith(".js") ||
      name.endsWith(".py")
    ) {
      return <FileCode className="w-4 h-4 text-emerald-400" />;
    }
    if (type.includes("pdf") || type.includes("text") || type.includes("document")) {
      return <FileText className="w-4 h-4 text-sky-400" />;
    }
    return <Paperclip className="w-4 h-4 text-amber-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-wrap gap-2 py-1.5">
      {attachments.map((att) => {
        const isImage = att.type.startsWith("image/") && att.data?.startsWith("data:image");

        return (
          <div
            key={att.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b1d28] border border-white/10 text-xs text-white/90 shadow-sm transition-all hover:border-white/20"
          >
            {isImage ? (
              <img
                src={att.data}
                alt={att.name}
                className="w-6 h-6 object-cover rounded-md border border-white/10"
              />
            ) : (
              getIcon(att.type, att.name)
            )}

            <div className="flex flex-col">
              <span className="font-medium truncate max-w-[140px] text-white/90">
                {att.name}
              </span>
              <span className="text-[10px] text-white/40">{formatSize(att.size)}</span>
            </div>

            {!readOnly && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(att.id)}
                className="ml-1 p-0.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
