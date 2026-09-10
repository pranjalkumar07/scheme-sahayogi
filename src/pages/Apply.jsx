import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { formatINR } from "@/lib/schemeMatcher";

const LOCAL_SCHEMES = [
  {
    id: "scheme-1",
    name: "SC Entrepreneur Business Loan",
    category: "micro_finance",
    interest_rate: 4,
    max_amount: 500000,
    moratorium_months: 6,
  },
  {
    id: "scheme-2",
    name: "Small Business Term Loan",
    category: "term_loan",
    interest_rate: 6,
    max_amount: 1000000,
    moratorium_months: 6,
  },
  {
    id: "scheme-3",
    name: "SC Education Support Loan",
    category: "education",
    interest_rate: 4,
    max_amount: 750000,
    moratorium_months: 12,
  },
  {
    id: "scheme-4",
    name: "Micro Enterprise Development Loan",
    category: "micro_finance",
    interest_rate: 5,
    max_amount: 300000,
    moratorium_months: 3,
  },
];

const LOCAL_PARTNERS = [
  {
    id: "partner-1",
    name: "Uttar Pradesh SC Finance Corporation",
    type: "SCA",
    city: "Lucknow",
    supported_categories: ["micro_finance", "term_loan"],
    is_eligible: true,
  },
  {
    id: "partner-2",
    name: "State Bank Business Support",
    type: "Public Sector Bank",
    city: "New Delhi",
    supported_categories: ["term_loan", "micro_finance"],
    is_eligible: true,
  },
  {
    id: "partner-3",
    name: "Regional Rural Finance Centre",
    type: "RRB",
    city: "Ghaziabad",
    supported_categories: ["micro_finance"],
    is_eligible: true,
  },
  {
    id: "partner-4",
    name: "National Education Finance Partner",
    type: "Education Finance",
    city: "New Delhi",
    supported_categories: ["education"],
    is_eligible: true,
  },
  {
    id: "partner-5",
    name: "Micro Enterprise Support Centre",
    type: "NBFC-MFI",
    city: "Noida",
    supported_categories: ["micro_finance", "term_loan"],
    is_eligible: true,
  },
];

const CATEGORY_LABEL = {
  micro_finance: "Micro Finance",
  term_loan: "Term Loan",
  education: "Education Loan",
};

export default function Apply() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    applicant_name: "",
    scheme_id: "",
    loan_amount: 100000,
    partner_name: "",
  });

  useEffect(() => {
  setSchemes(LOCAL_SCHEMES);
  setPartners(LOCAL_PARTNERS);

  const schemeId =
    params.get("scheme") || LOCAL_SCHEMES[0].id;

  const amount = params.get("amount")
    ? Number(params.get("amount"))
    : 100000;

  setForm({
    applicant_name: "",
    scheme_id: schemeId,
    loan_amount: amount,
    partner_name: "",
  });

  setLoading(false);
}, [params]);

  const selectedScheme = schemes.find((s) => s.id === form.scheme_id);
  const eligiblePartners = selectedScheme
    ? partners.filter((p) => p.is_eligible && (p.supported_categories || []).includes(selectedScheme.category))
    : [];
  const overLimit = selectedScheme && form.loan_amount > selectedScheme.max_amount;

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedScheme || !form.applicant_name) return;

  setSubmitting(true);

  try {
    const application = {
      id: `app-${Date.now()}`,
      applicant_name: form.applicant_name,
      scheme_id: selectedScheme.id,
      scheme_name: selectedScheme.name,
      scheme_category: selectedScheme.category,
      partner_name: form.partner_name || "Not yet assigned",
      loan_amount: Math.min(
        form.loan_amount,
        selectedScheme.max_amount
      ),
      status: "pending",
      created_date: new Date().toISOString(),
    };

    // Save application locally
    const existingApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    existingApplications.push(application);

    localStorage.setItem(
      "applications",
      JSON.stringify(existingApplications)
    );

    // Go to dashboard
    navigate("/dashboard");
  } catch (err) {
    console.error("Application submission failed:", err);
    setSubmitting(false);
  }
};

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
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/recommender" className="text-sm text-slate-400 hover:text-slate-600 inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <h1 className="text-sm font-medium text-slate-500">New Application</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Submit your application</h2>
        <p className="mt-1 text-sm text-slate-500">We'll record your application as pending. A Channel Partner will review it and update the status.</p>

        <Card className="border-slate-200 shadow-sm mt-6">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-slate-700">Applicant name</Label>
                <input
                  type="text"
                  required
                  value={form.applicant_name}
                  onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Scheme</Label>
                <select
                  value={form.scheme_id}
                  onChange={(e) => setForm({ ...form, scheme_id: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {schemes.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} · {CATEGORY_LABEL[s.category]}</option>
                  ))}
                </select>
                {selectedScheme && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Interest {selectedScheme.interest_rate}% p.a. · Max {formatINR(selectedScheme.max_amount)} · {selectedScheme.moratorium_months} month moratorium
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">
                  Loan amount: <span className="text-slate-900 font-semibold">{formatINR(form.loan_amount)}</span>
                </Label>
                <input
                  type="range"
                  min={10000}
                  max={selectedScheme ? Math.max(selectedScheme.max_amount, form.loan_amount) : 5000000}
                  step={10000}
                  value={form.loan_amount}
                  onChange={(e) => setForm({ ...form, loan_amount: Number(e.target.value) })}
                  className="mt-3 w-full accent-slate-900"
                />
                {overLimit && (
                  <p className="mt-1 text-xs text-rose-500">⚠ Exceeds scheme maximum — will be capped at {formatINR(selectedScheme.max_amount)}.</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Preferred Channel Partner (optional)</Label>
                <select
                  value={form.partner_name}
                  onChange={(e) => setForm({ ...form, partner_name: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Let the platform assign one</option>
                  {eligiblePartners.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} · {p.type} ({p.city})</option>
                  ))}
                </select>
                {selectedScheme && eligiblePartners.length === 0 && (
                  <p className="mt-1 text-xs text-slate-400">No eligible partners for this category nearby — one will be assigned centrally.</p>
                )}
              </div>

              <Button type="submit" disabled={submitting || !form.applicant_name} className="w-full bg-slate-900 hover:bg-slate-800 font-medium">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4 mr-2" /> Submit application</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}