import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, FileCheck2, Wallet, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";

export default function ApplicationReadiness({ schemeMatch, docReadiness, financial }) {
  const { t } = useLanguage();
  const overall = Math.round(schemeMatch * 0.4 + docReadiness * 0.35 + financial.score * 0.25);

  const finColor = financial.color === 'emerald' ? 'text-emerald-600' : financial.color === 'amber' ? 'text-amber-600' : 'text-rose-500';

  const nextAction =
    docReadiness < 100 ? 'Prepare your remaining documents before approaching a Channel Partner.'
    : schemeMatch < 80 ? 'Review the recommended scheme criteria to improve your match.'
    : financial.score < 60 ? 'Consider a smaller loan amount to keep repayments comfortable.'
    : "You're ready — visit a Channel Partner to submit your application.";

  return (
    <Card className="border-indigo-200 shadow-sm bg-gradient-to-br from-indigo-50/60 to-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{t('applicationReadiness')}</h3>
            <p className="text-xs text-slate-400">A snapshot of how ready you are to apply</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold text-indigo-600 leading-none">{overall}%</p>
          </div>
        </div>

        <div className="space-y-3">
          <ReadinessRow icon={Target} label={t('schemeMatch')} value={`${schemeMatch}%`} pct={schemeMatch} color="bg-indigo-500" />
          <ReadinessRow icon={FileCheck2} label={t('documentReadiness')} value={`${docReadiness}%`} pct={docReadiness} color="bg-emerald-500" />
          <ReadinessRow icon={Wallet} label={t('financialReadiness')} value={financial.label} pct={financial.score} color="bg-amber-500" valueClass={finColor} />
        </div>

        <div className="mt-4 rounded-lg bg-white border border-indigo-100 px-4 py-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-slate-500">{t('nextBestAction')}</p>
            <p className="text-sm text-slate-700 mt-0.5">{nextAction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReadinessRow({ icon: Icon, label, value, pct, color, valueClass = "text-slate-800" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-slate-600"><Icon className="w-3.5 h-3.5 text-slate-400" />{label}</span>
        <span className={`font-semibold ${valueClass}`}>{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}