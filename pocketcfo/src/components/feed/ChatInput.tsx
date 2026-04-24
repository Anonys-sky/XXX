"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Chat Input Component
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Loader2,
  FileText,
  X,
  Sparkles,
} from "lucide-react";

interface ChatInputProps {
  onSubmit: (input: string) => Promise<void>;
  isProcessing: boolean;
}

export default function ChatInput({ onSubmit, isProcessing }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if ((!input.trim() && !attachedFile) || isProcessing) return;

    const message = attachedFile
      ? `[Attachment: ${attachedFile.name}] ${input}`
      : input;

    setInput("");
    setAttachedFile(null);
    await onSubmit(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
  };

  return (
    <div className="border-t border-border p-4 bg-surface-warm/30">
      {/* Attached file preview */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface text-xs">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-mist truncate flex-1">
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                className="p-0.5 hover:bg-surface-hover rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-mist" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="flex items-end gap-2">
        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2.5 rounded-xl hover:bg-surface-hover transition-colors text-mist hover:text-navy"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste invoice, describe a transaction, or drop a receipt..."
            className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-sm text-navy placeholder:text-mist-light resize-none max-h-32 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            rows={1}
            disabled={isProcessing}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={(!input.trim() && !attachedFile) || isProcessing}
          className="flex-shrink-0 p-2.5 rounded-xl bg-navy text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-navy/85 transition-all active:scale-95"
          aria-label="Analyze"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-mist">
        <Sparkles className="w-3 h-3" />
        <span>Powered by Z.AI GLM-5 · Decision Intelligence Engine</span>
      </div>
    </div>
  );
}
