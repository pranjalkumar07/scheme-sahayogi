import React, { useMemo } from "react";
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/schemeMatcher";
import { useLanguage } from "@/lib/i18n.jsx";

const CONFIDENCE = {
  High: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function EligibilityGapAnalyzer({ result }) {
  const { t } = useLanguage();
  const { scheme, checks, eligible, matchScore, alternative } = result;

  const { allDocsReady, missingDocs } = useMemo(() => {
    const docs = scheme.documents || [];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(`docs:${scheme.id}`) || "{}"); } catch {}
    const missing = docs.filter((d) => saved[d] !== "ready");
    return { allDocsReady: docs.length > 0 && missing.length === 0, missingDocs: missing };
  }, [scheme.id, scheme.documents]);

  const gapItems = [
    ...checks,
    { key: "docs", pass: allDocsReady, label: allDocsReady ? "Required documents ready" : `${missingDocs.length} required document(s) not ready` },
  ];
  const failing = gapItems.filter((c) => !c.pass);

  let confidence = "Low";
  if (eligible && matchScore >= 85 && allDocsReady) confidence = "High";
  else if (eligible && matchScore >= 65) confidence = "Medium";

  const improvementSteps = [];
  failing.forEach((f) => {
    switch (f.key) {
      case "income":
        improvementSteps.push("Confirm your total family income (all members combined) is within ₹5 Lakh to qualify for concessional SC schemes.");
        break;
      case "purpose":
        improvementSteps.push(`This scheme supports ${scheme.purpose === "education" ? "education" : "business"} funding. Switch your funding purpose or pick a matching scheme.`);
        break;
      case "cost":
        improvementSteps.push(`Reduce your project cost to within ${formatINR(scheme.max_amount)}, or choose a scheme with a higher limit.`);
        break;
      case "loan":
        improvementSteps.push(`Reduce your requested loan amount to within ${formatINR(scheme.max_amount)}.`);
        break;
      case "profile":
        improvementSteps.push("This scheme targets a different applicant profile. Consider the suggested alternative below.");
        break;
      case "docs":
        improvementSteps.push(`Prepare your missing documents: ${missingDocs.join(", ")}.`);
        break;
      default:
        break;
    }
  });
  if (alternative && !eligible) {
    improvementSteps.push(`Consider the ${alternative.name} instead — it's a better match for your profile.`);
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <h4 className="text-sm font-semibold text-slate-800">{failing.length ? t("eligibilityGaps") : t("noGapsFound")}</h4>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${CONFIDENCE[confidence]}`}>
          {t("eligibilityConfidence")}: {t(confidence.toLowerCase())}
        </span>
      </div>

      <div className="p-4">
        {failing.length === 0 ? (
          <p className="text-sm text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{t("noGapsFound")} {t("likelyEligible")}</span>
          </p>
        ) : (
          <>
            <ul className="space-y-1.5">
              {gapItems.map((c, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  {c.pass
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  <span className={c.pass ? "text-slate-600" : "text-slate-700 font-medium"}>{c.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-lg bg-indigo-50/50 border border-indigo-100 px-3 py-2.5">
              <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {t("howToImprove")}
              </p>
              <ul className="mt-1.5 space-y-1">
                {improvementSteps.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}