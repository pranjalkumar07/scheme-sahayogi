import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";
import { explainScheme } from "@/lib/schemeMatcher";

export default function SchemeExplain({ scheme }) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const exp = explainScheme(scheme, lang);
  const rows = [
    { q: lang === 'hi' ? 'यह क्या है?' : 'What is this scheme?', a: exp.what },
    { q: lang === 'hi' ? 'कौन उपयोग कर सकता है?' : 'Who can use it?', a: exp.who },
    { q: lang === 'hi' ? 'कितना ऋण मिल सकता है?' : 'How much can I borrow?', a: exp.borrow },
    { q: lang === 'hi' ? 'ब्याज क्या होगा?' : 'What interest may apply?', a: exp.interest },
    { q: lang === 'hi' ? 'कौन-से दस्तावेज़ चाहिए?' : 'What documents are needed?', a: exp.documents },
    { q: lang === 'hi' ? 'कहाँ आवेदन करें?' : 'Where do I apply?', a: exp.where },
  ];

  return (
    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-indigo-700">
          <BookOpen className="w-4 h-4" /> {t('explainSimply')}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-indigo-500" /> : <ChevronDown className="w-4 h-4 text-indigo-500" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2.5">
          {rows.map((r, i) => (
            <div key={i}>
              <p className="text-xs font-semibold text-slate-700">{r.q}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{r.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}