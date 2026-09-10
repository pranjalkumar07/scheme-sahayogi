import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, FileText, Wallet, Building2, Sparkles, ArrowRight } from "lucide-react";
import { calculateEmi, formatINR } from "@/lib/schemeMatcher";
import { useLanguage } from "@/lib/i18n.jsx";

export default function MySahayogiPlan({ result, profile }) {
  const { t } = useLanguage();
  const { scheme, matchScore, eligible, alternative } = result;
  const [partners, setPartners] = useState([]);

  useEffect(() => {
  const LOCAL_PARTNERS = [
    {
      id: "partner-1",
      name: "Demo Channel Partner",
      city: "Ghaziabad",
      is_eligible: true,
      supported_categories: ["micro_finance", "term_loan"],
    },
    {
      id: "partner-2",
      name: "Demo Financial Partner",
      city: "Delhi",
      is_eligible: true,
      supported_categories: ["micro_finance", "term_loan", "education"],
    },
    {
      id: "partner-3",
      name: "Demo Education Finance Partner",
      city: "Noida",
      is_eligible: true,
      supported_categories: ["education"],
    },
  ];

  setPartners(LOCAL_PARTNERS);
}, []);

  const emiRes = useMemo(() => calculateEmi({
    principal: Math.min(profile.loanAmount || profile.estimatedCost, scheme.max_amount),
    annualRate: scheme.interest_rate,
    tenureMonths: scheme.max_tenure_months || 60,
    moratoriumMonths: scheme.moratorium_months,
  }), [scheme, profile]);

  const { totalDocs, readyDocs, missingDocs, allDocsReady } = useMemo(() => {
    const docs = scheme.documents || [];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(`docs:${scheme.id}`) || "{}"); } catch {}
    const ready = docs.filter((d) => saved[d] === "ready");
    const missing = docs.filter((d) => saved[d] !== "ready");
    return { totalDocs: docs.length, readyDocs: ready.length, missingDocs: missing, allDocsReady: docs.length > 0 && missing.length === 0 };
  }, [scheme.id, scheme.documents]);

  const bestPartner = useMemo(() => {
    return partners.filter((p) => p.is_eligible && (p.supported_categories || []).includes(scheme.category))[0] || null;
  }, [partners, scheme.category]);

  const docFrac = totalDocs ? readyDocs / totalDocs : 0;
  const progress = Math.round(((1 + 1 + docFrac + (bestPartner ? 1 : 0)) / 4) * 100);

  let nextAction;
  if (!eligible) nextAction = alternative ? `Consider the ${alternative.name} instead` : "Review the eligibility gaps above";
  else if (!allDocsReady) nextAction = `Prepare your ${missingDocs[0] || "remaining documents"}`;
  else if (!bestPartner) nextAction = "Find a channel partner near you";
  else nextAction = `You're ready — start your application for ${scheme.name}`;

  const ctaTo = eligible
    ? `/apply?scheme=${scheme.id}${profile.loanAmount ? `&amount=${profile.loanAmount}` : ""}`
    : `/calculator?scheme=${alternative?.id || scheme.id}`;

  const steps = [
    { n: 1, label: t("step1BestScheme"), done: true, warn: false,
      content: <><span className="font-medium text-slate-800">{scheme.name}</span><span className="ml-2 text-indigo-600 font-semibold">{matchScore}% {t("match")}</span></> },
    { n: 2, label: t("step2FinancialCheck"), done: true, warn: false,
      content: <span className="text-slate-700">{t("estimatedEmi")}: <b className="text-slate-900">{formatINR(emiRes.emi)}</b>/mo</span> },
    { n: 3, label: t("step3Documents"), done: allDocsReady, warn: !allDocsReady,
      content: <span className={allDocsReady ? "text-slate-700" : "text-amber-600 font-medium"}>{readyDocs}/{totalDocs} {t("ready")}{!allDocsReady && <span className="ml-2 text-slate-500 font-normal">→ {missingDocs[0] || ""}</span>}</span> },
    { n: 4, label: t("step4BestPartner"), done: !!bestPartner, warn: false,
      content: bestPartner
        ? <span className="text-slate-700"><MapPin className="inline w-3 h-3 mr-1 -mt-0.5" />{bestPartner.name}, {bestPartner.city} <Link to={`/partners?category=${scheme.category}`} className="ml-2 text-indigo-600 hover:underline">→ {t("viewRoute")}</Link></span>
        : <span className="text-slate-500">Not selected yet <Link to={`/partners?category=${scheme.category}`} className="ml-2 text-indigo-600 hover:underline">→ {t("viewRoute")}</Link></span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-indigo-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-semibold">{t("mySahayogiPlan")}</h3>
          </div>
          <p className="text-xs text-indigo-100 mt-0.5">Your personalized application roadmap</p>
        </div>
        <CardContent className="p-5">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("yourApplicationJourney")}</p>
              <span className="text-sm font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.n} className="flex items-start gap-3">
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.done ? "bg-emerald-100 text-emerald-600" : s.warn ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                  {s.n}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
                  <div className="text-sm mt-0.5">{s.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">{t("step5NextAction")}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{nextAction}</p>
            </div>
          </div>

          <Link to={ctaTo}>
            <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 font-medium">
              {t("continueJourney")} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}