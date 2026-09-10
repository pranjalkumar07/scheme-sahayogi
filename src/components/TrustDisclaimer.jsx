import React from "react";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";

export default function TrustDisclaimer({ className = "" }) {
  const { t } = useLanguage();
  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 flex items-start gap-2.5 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700 leading-relaxed">{t('trustNote')}</p>
    </div>
  );
}