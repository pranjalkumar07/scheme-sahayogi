import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, FileSearch, BadgeCheck, Building2 } from "lucide-react";
import { formatINR } from "@/lib/schemeMatcher";

const STAGES = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "under_review", label: "Under Review", icon: FileSearch },
  { key: "approved", label: "Approved", icon: BadgeCheck },
];

const CATEGORY_LABEL = {
  micro_finance: "Micro Finance",
  term_loan: "Term Loan",
  education: "Education Loan",
};

export default function ApplicationCard({ app }) {
  const rejected = app.status === "rejected";
  const currentIndex = STAGES.findIndex((s) => s.key === app.status);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">{app.scheme_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {CATEGORY_LABEL[app.scheme_category] || app.scheme_category} · {formatINR(app.loan_amount)}
            </p>
          </div>
          {rejected ? (
            <Badge className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-50 gap-1">
              <X className="w-3 h-3" /> Rejected
            </Badge>
          ) : app.status === "approved" ? (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 gap-1">
              <BadgeCheck className="w-3 h-3" /> Approved
            </Badge>
          ) : (
            <Badge variant="outline" className="text-slate-500">{STAGES[currentIndex]?.label}</Badge>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Building2 className="w-3.5 h-3.5" />
          <span>{app.partner_name || "Channel partner not yet assigned"}</span>
        </div>

        {/* Stepper */}
        {!rejected && (
          <div className="mt-5 flex items-center">
            {STAGES.map((stage, i) => {
              const isDone = i < currentIndex;
              const isCurrent = i === currentIndex;
              const Icon = stage.icon;
              return (
                <React.Fragment key={stage.key}>
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                        isDone ? "bg-emerald-500 border-emerald-500 text-white"
                        : isCurrent ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-200 text-slate-300"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[11px] ${isCurrent || isDone ? "text-slate-700 font-medium" : "text-slate-400"}`}>{stage.label}</span>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 -mt-4 rounded ${i < currentIndex ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {rejected && (
          <div className="mt-4 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 text-sm text-rose-600">
            This application was not approved. Please review the scheme criteria or try a different scheme.
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          Applied on {new Date(app.created_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </CardContent>
    </Card>
  );
}