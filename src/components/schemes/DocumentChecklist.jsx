import React, { useState, useEffect } from "react";
import { FileCheck2, CheckCircle2, Circle, XCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";

export default function DocumentChecklist({ scheme }) {
  const { t } = useLanguage();
  const storageKey = `docs:${scheme.id}`;
  const [status, setStatus] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setStatus(saved ? JSON.parse(saved) : {});
    } catch {
      setStatus({});
    }
  }, [storageKey]);

  const setStatusFor = (doc, val) => {
    setStatus((prev) => {
      const next = { ...prev, [doc]: prev[doc] === val ? undefined : val };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const docs = scheme.documents || [];
  const readyCount = docs.filter((d) => status[d] === "ready").length;
  const total = docs.length;
  const pct = total ? Math.round((readyCount / total) * 100) : 0;
  const allDone = total > 0 && readyCount === total;
  const nextDoc = docs.find((d) => status[d] !== "ready");

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-slate-700" />
          <h4 className="text-sm font-semibold text-slate-800">{t('documentReadiness')}</h4>
        </div>
        <span className="text-sm font-bold text-indigo-600">{pct}% {t('ready')}</span>
      </div>

      <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${allDone ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
      </div>

      <ul className="mt-3 space-y-1.5">
        {docs.map((doc) => {
          const s = status[doc];
          return (
            <li key={doc} className="flex items-center gap-2 py-1">
              {s === "ready" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : s === "not_ready" ? <XCircle className="w-4 h-4 text-rose-400 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
              <span className={`text-sm flex-1 ${s === "ready" ? "text-slate-400 line-through" : "text-slate-700"}`}>{doc}</span>
              <button type="button" onClick={() => setStatusFor(doc, "ready")}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition ${s === "ready" ? "bg-emerald-500 text-white border-emerald-500" : "border-slate-200 text-slate-500 hover:border-emerald-300"}`}>
                {t('ready')}
              </button>
              <button type="button" onClick={() => setStatusFor(doc, "not_ready")}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition ${s === "not_ready" ? "bg-rose-100 text-rose-600 border-rose-200" : "border-slate-200 text-slate-500 hover:border-rose-200"}`}>
                {t('notReady')}
              </button>
            </li>
          );
        })}
      </ul>

      {allDone ? (
        <p className="mt-3 text-xs text-emerald-600 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> All documents ready — you're set to visit a Channel Partner.
        </p>
      ) : nextDoc && (
        <p className="mt-3 text-xs text-indigo-600 flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" /> {t('nextStep')}: Prepare your {nextDoc}.
        </p>
      )}
    </div>
  );
}