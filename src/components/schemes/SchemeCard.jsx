import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/schemeMatcher";

const CATEGORY_LABEL = {
  micro_finance: "Micro Finance",
  term_loan: "Term Loan",
  education: "Educational Loan",
};

const CATEGORY_COLOR = {
  micro_finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
  term_loan: "bg-indigo-50 text-indigo-700 border-indigo-200",
  education: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function SchemeCard({ scheme, children }) {
  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{scheme.name}</h3>
            <Badge variant="outline" className={`mt-1.5 ${CATEGORY_COLOR[scheme.category]}`}>
              {CATEGORY_LABEL[scheme.category]}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-slate-900">{scheme.interest_rate}%<span className="text-sm font-normal text-slate-400"> p.a.</span></p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">{scheme.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-400">Max Loan</p>
            <p className="font-medium text-slate-700">{formatINR(scheme.max_amount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Coverage</p>
            <p className="font-medium text-slate-700">{scheme.coverage_percent}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Moratorium</p>
            <p className="font-medium text-slate-700">{scheme.moratorium_months} mo</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}