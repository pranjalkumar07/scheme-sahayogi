import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GitCompare, Loader2, Trophy, ArrowRight } from "lucide-react";
import { calculateEmi, formatINR } from "@/lib/schemeMatcher";
import { useLanguage } from "@/lib/i18n.jsx";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrustDisclaimer from "@/components/TrustDisclaimer";

const CATEGORY_LABEL = { micro_finance: "Micro Finance", term_loan: "Term Loan", education: "Education Loan" };

export default function Compare() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loanAmount, setLoanAmount] = useState(150000);

  useEffect(() => {
  const LOCAL_SCHEMES = [
    {
      id: "scheme-1",
      name: "SC Entrepreneur Business Loan",
      category: "micro_finance",
      interest_rate: 4,
      max_amount: 500000,
      coverage_percent: 90,
      moratorium_months: 6,
      max_tenure_months: 60,
      eligibility: "SC applicants, income up to ₹5 Lakh",
      documents: ["Aadhaar", "Income Certificate", "Caste Certificate", "Business Plan"],
    },
    {
      id: "scheme-2",
      name: "Small Business Term Loan",
      category: "term_loan",
      interest_rate: 6,
      max_amount: 1000000,
      coverage_percent: 80,
      moratorium_months: 6,
      max_tenure_months: 84,
      eligibility: "SC applicants, income up to ₹5 Lakh",
      documents: ["Aadhaar", "Income Certificate", "Caste Certificate", "Business Plan"],
    },
    {
      id: "scheme-3",
      name: "SC Education Support Loan",
      category: "education",
      interest_rate: 4,
      max_amount: 750000,
      coverage_percent: 100,
      moratorium_months: 12,
      max_tenure_months: 84,
      eligibility: "SC students, income up to ₹5 Lakh",
      documents: ["Aadhaar", "Income Certificate", "Caste Certificate", "Admission Letter"],
    },
    {
      id: "scheme-4",
      name: "Micro Enterprise Development Loan",
      category: "micro_finance",
      interest_rate: 5,
      max_amount: 300000,
      coverage_percent: 90,
      moratorium_months: 3,
      max_tenure_months: 60,
      eligibility: "SC applicants, income up to ₹5 Lakh",
      documents: ["Aadhaar", "Income Certificate", "Caste Certificate"],
    },
  ];

  setSchemes(LOCAL_SCHEMES);
  setLoading(false);
}, []);

  const ids = (params.get("ids") || "").split(",").filter(Boolean);
  const selected = useMemo(() => schemes.filter((s) => ids.includes(s.id)), [schemes, ids]);

  // Pick "best option": lowest interest, then highest coverage
  const bestId = selected.length ? selected.reduce((best, s) => (s.interest_rate < best.interest_rate ? s : best), selected[0]).id : null;

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>);

  if (selected.length < 2) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="border-slate-200 shadow-sm max-w-md text-center">
          <CardContent className="p-10">
            <GitCompare className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="mt-4 font-semibold text-slate-800">Select schemes to compare</h2>
            <p className="mt-1 text-sm text-slate-500">Go back to the recommender and pick 2–3 schemes to compare side by side.</p>
            <Link to="/recommender"><Button className="mt-5 bg-indigo-600 hover:bg-indigo-700">Find schemes</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rows = [
    { label: 'Match Score', render: (s) => '—' },
    { label: 'Maximum Loan', render: (s) => formatINR(s.max_amount) },
    { label: 'Interest Rate', render: (s) => `${s.interest_rate}% p.a.` },
    { label: 'Coverage', render: (s) => `${s.coverage_percent}%` },
    { label: 'Moratorium', render: (s) => `${s.moratorium_months} months` },
    { label: 'Purpose', render: (s) => CATEGORY_LABEL[s.category] },
    { label: 'Eligibility', render: (s) => s.eligibility || 'SC applicants, income up to ₹5 Lakh' },
    { label: 'Required Documents', render: (s) => (s.documents || []).join(', ') || '—' },
  ];

  const emiFor = (s) => {
    const r = calculateEmi({ principal: Math.min(loanAmount, s.max_amount), annualRate: s.interest_rate, tenureMonths: s.max_tenure_months || 60, moratoriumMonths: s.moratorium_months });
    return r.emi;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/recommender" className="text-sm text-slate-400 hover:text-slate-600">← Back to results</Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <h1 className="text-sm font-medium text-slate-500">Compare Schemes</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Compare {selected.length} schemes</h2>
            <p className="text-sm text-slate-500">Side-by-side breakdown to pick the best option for you.</p>
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm mb-6">
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-slate-700">Loan amount for EMI estimate: <span className="text-indigo-600 font-semibold">{formatINR(loanAmount)}</span></Label>
            <input type="range" min={10000} max={2000000} step={10000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="mt-3 w-full accent-indigo-600" />
          </CardContent>
        </Card>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}>
          {selected.map((s, i) => {
            const isBest = s.id === bestId;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`h-full ${isBest ? "border-indigo-300 ring-1 ring-indigo-200" : "border-slate-200"} shadow-sm`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      {isBest ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full"><Trophy className="w-3 h-3" /> Best option for you</span>
                      ) : <span />}
                    </div>
                    <h3 className="mt-2 font-semibold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-400">{CATEGORY_LABEL[s.category]}</p>

                    <div className="mt-4 space-y-3">
                      {rows.map((r) => (
                        <div key={r.label} className="border-b border-slate-100 pb-2">
                          <p className="text-[11px] text-slate-400">{r.label}</p>
                          <p className="text-sm text-slate-700 mt-0.5">{r.render(s)}</p>
                        </div>
                      ))}
                      <div className="bg-indigo-50/60 rounded-lg px-3 py-2">
                        <p className="text-[11px] text-slate-400">Estimated EMI</p>
                        <p className="text-sm font-bold text-indigo-600 mt-0.5">{formatINR(emiFor(s))}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                      </div>
                    </div>

                    <Link to={`/calculator?scheme=${s.id}`}>
                      <Button size="sm" variant="outline" className="w-full mt-4">Calculate <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6">
          <TrustDisclaimer />
        </div>
      </div>
    </div>
  );
}