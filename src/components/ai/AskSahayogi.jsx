import React, { useState } from "react";
import { Sparkles, Loader2, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "I want to start a dairy business and need ₹5 lakh. My annual family income is ₹3 lakh.",
  "Mujhe chhota business start karna hai aur financial help chahiye.",
  "I need financial assistance for education.",
];

export default function AskSahayogi({
  onSubmit,
  loading = false,
  error = "",
  compact = false,
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || loading) return;

    onSubmit(text.trim());

    if (compact) {
      setText("");
    }
  };

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Ask Sahayogi AI
            </h3>
            <p className="text-sm text-slate-500">
              Tell Sahayogi what you need.
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-6 text-slate-600">
          Describe your financial requirement in your own words.
          Sahayogi will understand your needs and help you find suitable
          financial support.
        </p>

        {/* Input */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={compact ? 2 : 4}
            placeholder="Example: I want to start a dairy business and need ₹5 lakh. My annual family income is ₹3 lakh..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-transparent px-4 py-4 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.metaKey || e.ctrlKey)
              ) {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Button */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="hidden text-xs text-slate-400 sm:block">
            Press Ctrl + Enter to ask
          </p>

          <Button
            onClick={submit}
            disabled={!text.trim() || loading}
            className="ml-auto gap-2 rounded-xl bg-indigo-600 px-5 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ask Sahayogi
              </>
            )}
          </Button>
        </div>

        {/* Examples */}
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setText(example)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {index === 0
                ? "🥛 Dairy"
                : index === 1
                ? "🇮🇳 Hindi Business"
                : "🎓 Education"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}