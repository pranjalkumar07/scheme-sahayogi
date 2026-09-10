import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Calculator, MapPin, ArrowRight, ShieldCheck, Landmark, GraduationCap, ClipboardList, Scissors, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrustDisclaimer from "@/components/TrustDisclaimer";
import AskSahayogi from "@/components/ai/AskSahayogi";
import { matchSchemes } from "@/lib/schemeMatcher";
import { LOCAL_SCHEMES } from "@/pages/SchemeRecommender";

const features = [
  {
    to: "/recommender",
    icon: Sparkles,
    title: "Smart Scheme Recommender",
    desc: "Answer a few questions about your project and income — get an instant, ranked match to the right concessional credit or education scheme.",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    to: "/calculator",
    icon: Calculator,
    title: "Financial EMI Calculator",
    desc: "See your projected monthly instalments, total interest, and moratorium impact — tuned to each scheme's real rates and limits.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    to: "/partners",
    icon: MapPin,
    title: "Geo-Spatial Partner Locator",
    desc: "Find the nearest eligible Channel Partner — SCAs, banks, and NBFC-MFIs — filtered by fund health so your application lands right.",
    accent: "from-amber-500 to-orange-500",
  },
];

export default function Home() {
const [aiAnswer, setAiAnswer] = React.useState("");
const [aiProfile, setAiProfile] = React.useState(null);
const [aiMissing, setAiMissing] = React.useState([]);
const [aiResults, setAiResults] = React.useState([]);
const [aiLoading, setAiLoading] = React.useState(false);
const [aiError, setAiError] = React.useState("");

  const askSahayogi = async (message) => {
    setAiLoading(true);
    setAiError("");
    setAiAnswer("");
    setAiProfile(null);
    setAiMissing([]);

    try {
      const response = await fetch("https://scheme-sahayogi.onrender.com/api/ask-sahayogi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setAiAnswer(data.answer);
      setAiProfile(data.profile);
      setAiMissing(data.missingInformation || []);
    if (data.profile) {
  const results = matchSchemes(LOCAL_SCHEMES, {
    projectType: data.profile.projectType,
    loanAmount: data.profile.loanAmount,
    annualIncome: data.profile.annualIncome,
    businessType: data.profile.businessType,
    socialCategory: data.profile.socialCategory,
  });

  console.log("Scheme matching results:", results);
  setAiResults(results);
}
    } catch (error) {
      console.error(error);
      setAiError("Sahayogi AI is temporarily unavailable. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden"><div className="absolute top-4 right-4 z-20"><LanguageSwitcher /></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Channel Finance · Concessional Lending
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Find the right scheme.<br />Reach the right partner.
            </h1>
            <p className="mt-5 text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              An intelligent, multi-lingual platform connecting Scheduled Caste entrepreneurs and students with concessional financial assistance — from scheme discovery to disbursal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/recommender">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-medium">
                  Find My Scheme <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/calculator">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white">
                  Calculate EMI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <Link to={f.to}>
                <Card className="h-full border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
                  <CardContent className="p-6">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center shadow-sm`}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:gap-2 gap-1 transition-all">
                      Get started <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard banner */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <Link to="/dashboard">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-indigo-300" />
                <div>
                  <p className="font-semibold">Track your application</p>
                  <p className="text-sm text-slate-300">Check if your loan is pending, under review, or approved.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Demo profiles */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <p className="text-xs font-medium text-slate-400 mb-2">Try a demo profile</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link to="/recommender?demo=tailoring">
            <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-sm transition h-full">
              <CardContent className="p-4">
                <Scissors className="w-5 h-5 text-indigo-500" />
                <p className="mt-1.5 text-sm font-medium text-slate-800">Tailoring Business</p>
                <p className="text-xs text-slate-400">₹4L project · ₹3L income</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/recommender?demo=dairy">
            <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-sm transition h-full">
              <CardContent className="p-4">
                <Sprout className="w-5 h-5 text-indigo-500" />
                <p className="mt-1.5 text-sm font-medium text-slate-800">Dairy / Small Business</p>
                <p className="text-xs text-slate-400">₹1L project</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/recommender?demo=student">
            <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-sm transition h-full">
              <CardContent className="p-4">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <p className="mt-1.5 text-sm font-medium text-slate-800">Student — Education</p>
                <p className="text-xs text-slate-400">Higher studies funding</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Ask Sahayogi AI */}
<section className="max-w-5xl mx-auto px-6 pb-10">
  <AskSahayogi
    onSubmit={askSahayogi}
    loading={aiLoading}
    error={aiError}
  />

  {aiAnswer && (
    <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">
          Sahayogi's Response
        </h3>
      </div>

      <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
        {aiAnswer}
      </p>
  {aiProfile && (
  <div className="mt-5 rounded-xl bg-white border border-indigo-100 p-4">
    <h4 className="font-semibold text-slate-900 mb-3">
      📋 Profile Understood
    </h4>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      {aiProfile.projectType && (
        <p><strong>Purpose:</strong> {aiProfile.projectType}</p>
      )}

      {aiProfile.businessType && (
        <p><strong>Business:</strong> {aiProfile.businessType}</p>
      )}

      {aiProfile.loanAmount && (
        <p>
          <strong>Loan Amount:</strong>{" "}
          ₹{Number(aiProfile.loanAmount).toLocaleString("en-IN")}
        </p>
      )}

      {aiProfile.annualIncome && (
        <p>
          <strong>Annual Income:</strong>{" "}
          ₹{Number(aiProfile.annualIncome).toLocaleString("en-IN")}
        </p>
      )}

      {aiProfile.state && (
        <p><strong>State:</strong> {aiProfile.state}</p>
      )}

      {aiProfile.district && (
        <p><strong>District:</strong> {aiProfile.district}</p>
      )}

      {aiProfile.socialCategory && (
        <p><strong>Category:</strong> {aiProfile.socialCategory}</p>
      )}

      {aiProfile.locationType && (
        <p><strong>Location:</strong> {aiProfile.locationType}</p>
      )}
    </div>
  </div>
)}
{aiResults.length > 0 && (
  <div className="mt-5 rounded-xl bg-white border border-indigo-100 p-4">
    <h4 className="font-semibold text-slate-900 mb-3">
      🎯 Recommended Schemes
    </h4>

    <div className="space-y-3">
      {aiResults.slice(0, 3).map((result) => (
        <div
          key={result.scheme.id}
          className="rounded-lg border border-slate-200 p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-slate-800">
              {result.scheme.name}
            </p>

            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {result.matchScore}% Match
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {result.whyRecommended}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

      <p className="mt-4 text-xs text-slate-400">
        AI guidance is informational. Final eligibility and loan
        sanction are decided by the authorized government/channel partner.
      </p>
    </div>
  )}
</section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-white border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">How the channel finance system works</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Funds for SC beneficiaries are not applied for directly — they flow through a network of over 100 Channel Partners. This platform helps you navigate that path with confidence.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            {[
              { icon: GraduationCap, step: "01", title: "Identify your need", text: "Tell us your project type, estimated cost, and family income." },
              { icon: Landmark, step: "02", title: "Match a scheme", text: "Get ranked recommendations across micro finance, term loans, and education loans." },
              { icon: MapPin, step: "03", title: "Locate a partner", text: "Find the nearest eligible Channel Partner ready to process your category." },
            ].map((s) => (
              <div key={s.step} className="relative">
                <span className="text-xs font-mono text-slate-300">{s.step}</span>
                <s.icon className="w-5 h-5 text-indigo-500 mt-1" />
                <h4 className="mt-2 font-medium text-slate-800">{s.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-6">
        <TrustDisclaimer />
      </section>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Empowering Scheduled Caste entrepreneurs & students · Concessional lending made accessible
      </footer>
    </div>
  );
}