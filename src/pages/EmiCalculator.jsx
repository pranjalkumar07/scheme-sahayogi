import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2, Info } from "lucide-react";
import { calculateEmi, formatINR, explainEmi } from "@/lib/schemeMatcher";
import { useLanguage } from "@/lib/i18n.jsx";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrustDisclaimer from "@/components/TrustDisclaimer";

const CATEGORY_LABEL = { micro_finance: "Micro Finance", term_loan: "Term Loan", education: "Educational Loan" };
const LOCAL_SCHEMES = [
  {
    id: "scheme-1",
    name: "SC Entrepreneur Business Loan",
    purpose: "business",
    category: "micro_finance",
    min_amount: 50000,
    max_amount: 500000,
    interest_rate: 4,
    moratorium_months: 6,
    max_tenure_months: 60,
    eligibility: "SC applicants with annual family income up to ₹5 Lakh.",
    documents: [
      "Aadhaar Card",
      "Caste Certificate",
      "Income Certificate",
      "Bank Account",
      "Business Plan"
    ]
  },
  {
    id: "scheme-2",
    name: "Small Business Term Loan",
    purpose: "business",
    category: "term_loan",
    min_amount: 100000,
    max_amount: 1000000,
    interest_rate: 6,
    moratorium_months: 6,
    max_tenure_months: 84,
    eligibility: "Eligible entrepreneurs with a viable business proposal.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Income Certificate",
      "Business Plan"
    ]
  },
  {
    id: "scheme-3",
    name: "SC Education Support Loan",
    purpose: "education",
    category: "education",
    min_amount: 50000,
    max_amount: 750000,
    interest_rate: 4,
    moratorium_months: 12,
    max_tenure_months: 84,
    eligibility: "SC students pursuing higher education or professional courses.",
    documents: [
      "Aadhaar Card",
      "Caste Certificate",
      "Income Certificate",
      "Admission Letter",
      "Academic Records"
    ]
  },
  {
    id: "scheme-4",
    name: "Micro Enterprise Development Loan",
    purpose: "both",
    category: "micro_finance",
    min_amount: 25000,
    max_amount: 300000,
    interest_rate: 5,
    moratorium_months: 3,
    max_tenure_months: 60,
    eligibility: "Small entrepreneurs seeking financial support for income-generating activities.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Bank Account",
      "Business Proposal"
    ]
  }
];
export default function EmiCalculator() {
  const { t, lang } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

  const [schemeId, setSchemeId] = useState("");
  const [principal, setPrincipal] = useState(100000);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [moratoriumMonths, setMoratoriumMonths] = useState(3);

  useEffect(() => {
  setSchemes(LOCAL_SCHEMES);

  const preset = params.get("scheme");

  if (preset && LOCAL_SCHEMES.some((s) => s.id === preset)) {
    setSchemeId(preset);
  } else {
    setSchemeId(LOCAL_SCHEMES[0].id);
  }

  setLoading(false);
}, [params]);

  const selectedScheme = schemes.find((s) => s.id === schemeId);

  useEffect(() => {
    if (selectedScheme) {
      setMoratoriumMonths(selectedScheme.moratorium_months);
      setPrincipal((p) => Math.min(p, selectedScheme.max_amount));
    }
  }, [schemeId]); // eslint-disable-line

  const result = useMemo(() => {
    if (!selectedScheme) return null;
    return calculateEmi({ principal, annualRate: selectedScheme.interest_rate, tenureMonths, moratoriumMonths });
  }, [selectedScheme, principal, tenureMonths, moratoriumMonths]);

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>);
  }

  const maxLoan = selectedScheme ? selectedScheme.max_amount : 5000000;
  const chartData = result ? [
    { name: t('principal'), value: principal, color: "#6366f1" },
    { name: t('totalInterest'), value: Math.max(0, result.totalInterest), color: "#f59e0b" },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">← {t('home')}</Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <h1 className="text-sm font-medium text-slate-500">Financial EMI Calculator</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">{t('planRepayments')}</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">See projected EMIs, total interest, and moratorium impact — tuned to each scheme's real rates and limits.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2 border-slate-200 shadow-sm h-fit">
            <CardContent className="p-6 space-y-5">
              <div>
                <Label className="text-sm font-medium text-slate-700">Select scheme</Label>
                <select value={schemeId} onChange={(e) => setSchemeId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {schemes.map((s) => <option key={s.id} value={s.id}>{s.name} · {CATEGORY_LABEL[s.category]}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Loan amount: <span className="text-emerald-600 font-semibold">{formatINR(principal)}</span></Label>
                <input type="range" min={10000} max={Math.max(maxLoan, principal)} step={10000} value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))} className="mt-3 w-full accent-emerald-600" />
                <p className="text-xs text-slate-400 mt-1">Max for this scheme: {formatINR(maxLoan)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Interest rate: <span className="text-emerald-600 font-semibold">{selectedScheme?.interest_rate}% p.a.</span></Label>
                <p className="text-xs text-slate-400 mt-1">Set by the scheme — not editable.</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Repayment tenure: <span className="text-emerald-600 font-semibold">{tenureMonths} months</span><span className="text-slate-400 font-normal"> ({(tenureMonths / 12).toFixed(1)} yrs)</span></Label>
                <input type="range" min={12} max={selectedScheme ? selectedScheme.max_tenure_months : 120} step={6} value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))} className="mt-3 w-full accent-emerald-600" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Moratorium: <span className="text-emerald-600 font-semibold">{moratoriumMonths} months</span></Label>
                <input type="range" min={0} max={12} step={1} value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(Number(e.target.value))} className="mt-3 w-full accent-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            {result && selectedScheme && (
              <>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                    <CardContent className="p-6">
                      <p className="text-sm text-indigo-100">{t('monthlyEmi')}</p>
                      <p className="mt-1 text-4xl font-bold tracking-tight">{formatINR(result.emi)}<span className="text-base font-normal text-indigo-200">/month</span></p>
                      <p className="mt-1 text-xs text-indigo-200">After {moratoriumMonths}-month moratorium · {selectedScheme.interest_rate}% p.a.</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="grid grid-cols-3 gap-3">
                  <Card className="border-slate-200 shadow-sm"><CardContent className="p-4"><p className="text-xs text-slate-400">{t('principal')}</p><p className="mt-1 font-semibold text-slate-800 text-sm">{formatINR(principal)}</p></CardContent></Card>
                  <Card className="border-slate-200 shadow-sm"><CardContent className="p-4"><p className="text-xs text-slate-400">{t('totalInterest')}</p><p className="mt-1 font-semibold text-amber-600 text-sm">{formatINR(result.totalInterest)}</p></CardContent></Card>
                  <Card className="border-slate-200 shadow-sm"><CardContent className="p-4"><p className="text-xs text-slate-400">{t('totalRepayment')}</p><p className="mt-1 font-semibold text-slate-800 text-sm">{formatINR(result.totalPayable)}</p></CardContent></Card>
                </div>

                {/* Principal vs Interest donut */}
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-5">
                    <h4 className="text-sm font-semibold text-slate-800">Principal vs Interest</h4>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-slate-600">{t('principal')}: <b className="text-slate-800">{formatINR(principal)}</b></span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-slate-600">{t('totalInterest')}: <b className="text-slate-800">{formatINR(result.totalInterest)}</b></span></div>
                        <p className="text-xs text-slate-400 pt-1">Interest is {Math.round((result.totalInterest / result.totalPayable) * 100)}% of total repayment.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Simple explanation */}
                <Card className="border-emerald-100 bg-emerald-50/40 shadow-sm">
                  <CardContent className="p-4 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 leading-relaxed">{explainEmi(result, selectedScheme, lang)}</p>
                  </CardContent>
                </Card>

                <TrustDisclaimer />

                <div className="flex justify-end">
                  <Link to={`/partners?category=${selectedScheme.category}`}>
                    <Button variant="outline" size="sm">Find a Channel Partner →</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}