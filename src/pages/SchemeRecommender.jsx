import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, RotateCcw, GitCompare, Scissors, Sprout, GraduationCap } from "lucide-react";
import { matchSchemes, formatINR, calculateEmi, assessFinancialReadiness } from "@/lib/schemeMatcher";
import { useLanguage } from "@/lib/i18n.jsx";
import RecommendationResult from "@/components/schemes/RecommendationResult";
import ApplicationReadiness from "@/components/ApplicationReadiness";
import MySahayogiPlan from "@/components/schemes/MySahayogiPlan";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrustDisclaimer from "@/components/TrustDisclaimer";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Haryana",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal",
];

const DEMO_PROFILES = {
  tailoring: { projectType: "business", estimatedCost: 400000, loanAmount: 300000, annualIncome: 300000, state: "Tamil Nadu", educationLevel: "higher_secondary", label: "Tailoring Business", desc: "₹4L project · ₹3L income", icon: Scissors },
  dairy: { projectType: "business", estimatedCost: 100000, loanAmount: 100000, annualIncome: 250000, state: "Gujarat", educationLevel: "higher_secondary", label: "Dairy / Small Business", desc: "₹1L project", icon: Sprout },
  student: { projectType: "education", estimatedCost: 200000, loanAmount: 200000, annualIncome: 300000, state: "Uttar Pradesh", educationLevel: "undergraduate", label: "Student — Education", desc: "Higher studies funding", icon: GraduationCap },
};

 export const LOCAL_SCHEMES = [
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

export default function SchemeRecommender() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [compareIds, setCompareIds] = useState([]);

  const [form, setForm] = useState({
    projectType: "business",
    estimatedCost: 100000,
    loanAmount: 100000,
    annualIncome: 250000,
    state: "Tamil Nadu",
    educationLevel: "higher_secondary",
  });

  useEffect(() => {
  setSchemes(LOCAL_SCHEMES);

  const demo = params.get("demo");

  if (demo && DEMO_PROFILES[demo]) {
    const profile = { ...DEMO_PROFILES[demo] };

    setForm(profile);
    setResults(matchSchemes(LOCAL_SCHEMES, profile));
  }

  setLoading(false);
}, [params]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setResults(matchSchemes(schemes, form));
      setCompareIds([]);
      setSubmitting(false);
    }, 500);
  };

  const applyDemo = (key) => {
    const profile = { ...DEMO_PROFILES[key] };
    setForm(profile);
    setResults(matchSchemes(schemes, profile));
    setCompareIds([]);
  };

  const reset = () => {
    setResults(null);
    setCompareIds([]);
    setForm({ projectType: "business", estimatedCost: 100000, loanAmount: 100000, annualIncome: 250000, state: "Tamil Nadu", educationLevel: "higher_secondary" });
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  // Top result drives readiness + My Sahayogi Plan
  let topResult = null;
  let readinessProps = null;
  if (results && results.length) {
    topResult = results.find((r) => r.eligible) || results[0];
    const schemeMatch = topResult.matchScore;
    let docReadiness = 0;
    try {
      const saved = JSON.parse(localStorage.getItem(`docs:${topResult.scheme.id}`) || "{}");
      const total = (topResult.scheme.documents || []).length;
      const ready = (topResult.scheme.documents || []).filter((d) => saved[d] === "ready").length;
      docReadiness = total ? Math.round((ready / total) * 100) : 0;
    } catch { docReadiness = 0; }
    const emiRes = calculateEmi({
      principal: Math.min(form.loanAmount || form.estimatedCost, topResult.scheme.max_amount),
      annualRate: topResult.scheme.interest_rate,
      tenureMonths: topResult.scheme.max_tenure_months || 60,
      moratoriumMonths: topResult.scheme.moratorium_months,
    });
    const financial = assessFinancialReadiness({ annualIncome: form.annualIncome, emi: emiRes.emi });
    readinessProps = { schemeMatch, docReadiness, financial };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">← {t('home')}</Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <h1 className="text-sm font-medium text-slate-500">Smart Scheme Recommender</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">{t('findYourScheme')}</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">{t('recommenderSubtitle')}</p>
        </div>

        {/* Demo profiles */}
        {!results && (
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-400 mb-2">{t('demoProfiles')}</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(DEMO_PROFILES).map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyDemo(key)}
                  className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition group"
                >
                  <p.icon className="w-5 h-5 text-indigo-500" />
                  <p className="mt-1.5 text-sm font-medium text-slate-800">{p.label}</p>
                  <p className="text-xs text-slate-400">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {!results && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700">{t('fundingFor')}</Label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {[
                      { val: "business", label: t('business'), desc: "Start or expand a venture" },
                      { val: "education", label: t('education'), desc: "Higher studies or skill course" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setForm({ ...form, projectType: opt.val })}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${form.projectType === opt.val ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <p className="font-medium text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    {t('projectCost')}: <span className="text-indigo-600 font-semibold">{formatINR(form.estimatedCost)}</span>
                  </Label>
                  <input type="range" min={10000} max={5000000} step={10000} value={form.estimatedCost}
                    onChange={(e) => setForm({ ...form, estimatedCost: Number(e.target.value) })}
                    className="mt-3 w-full accent-indigo-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹10K</span><span>₹50 Lakh</span></div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    {t('loanAmount')}: <span className="text-indigo-600 font-semibold">{formatINR(form.loanAmount)}</span>
                  </Label>
                  <input type="range" min={10000} max={5000000} step={10000} value={form.loanAmount}
                    onChange={(e) => setForm({ ...form, loanAmount: Number(e.target.value) })}
                    className="mt-3 w-full accent-indigo-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹10K</span><span>₹50 Lakh</span></div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">
                    {t('annualIncome')}: <span className="text-indigo-600 font-semibold">{formatINR(form.annualIncome)}</span>
                  </Label>
                  <input type="range" min={0} max={800000} step={10000} value={form.annualIncome}
                    onChange={(e) => setForm({ ...form, annualIncome: Number(e.target.value) })}
                    className="mt-3 w-full accent-indigo-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹0</span><span>Eligible up to ₹5 Lakh</span></div>
                  {form.annualIncome > 500000 && (
                    <p className="mt-2 text-xs text-rose-500">⚠ Income exceeds the ₹5.00 Lakh eligibility threshold for concessional schemes.</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">{t('state')}</Label>
                  <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {form.projectType === "education" && (
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Education level</Label>
                    <select value={form.educationLevel} onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="higher_secondary">Higher Secondary (11th–12th)</option>
                      <option value="undergraduate">Undergraduate / Diploma</option>
                      <option value="postgraduate">Postgraduate / Professional</option>
                      <option value="skill">Skill / Vocational Course</option>
                    </select>
                  </div>
                )}

                <Button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('matching')}</> : <><Sparkles className="w-4 h-4 mr-2" /> {t('getRecommendation')}</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {results && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t('matchedSchemes')}</h3>
                <p className="text-sm text-slate-400">{t('rankedBy')}</p>
              </div>
              <div className="flex items-center gap-2">
                {compareIds.length >= 2 && (
                  <Link to={`/compare?ids=${compareIds.join(",")}`}>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <GitCompare className="w-3.5 h-3.5 mr-1" /> {t('compare')} ({compareIds.length})
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> {t('startOver')}
                </Button>
              </div>
            </div>

            {readinessProps && (
              <div className="mb-5">
                <ApplicationReadiness {...readinessProps} />
              </div>
            )}

            <div className="space-y-4">
              {results.map((r) => (
                <RecommendationResult
                  key={r.scheme.id}
                  result={r}
                  estimatedCost={form.estimatedCost}
                  loanAmount={form.loanAmount}
                  compareSelected={compareIds.includes(r.scheme.id)}
                  onToggleCompare={() => toggleCompare(r.scheme.id)}
                />
              ))}
            </div>

            {topResult && (
              <div className="mt-6">
                <MySahayogiPlan result={topResult} profile={form} />
              </div>
            )}

            <div className="mt-6">
              <TrustDisclaimer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}