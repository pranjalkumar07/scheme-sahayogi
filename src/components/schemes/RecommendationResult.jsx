import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowRight, GitCompare, Building2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/schemeMatcher";
import { useLanguage } from "@/lib/i18n.jsx";
import DocumentChecklist from "@/components/schemes/DocumentChecklist";
import MatchScoreRing from "@/components/schemes/MatchScoreRing";
import SchemeExplain from "@/components/schemes/SchemeExplain";
import EligibilityGapAnalyzer from "@/components/schemes/EligibilityGapAnalyzer";

export default function RecommendationResult({ result, estimatedCost, loanAmount, compareSelected, onToggleCompare }) {
  const { t } = useLanguage();
  const { scheme, matchScore, eligible, rank } = result;
  const isTop = rank === 1 && eligible;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: rank * 0.05 }}>
      <Card className={`overflow-hidden border shadow-sm ${isTop ? "border-indigo-300 ring-1 ring-indigo-200" : "border-slate-200"}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <MatchScoreRing score={matchScore} />
              <div>
                {isTop ? (
                  <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white gap-1">
                    <Lightbulb className="w-3 h-3" /> {t('bestMatch')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-500">{t('alternative')} #{rank}</Badge>
                )}
                <h3 className="mt-1.5 text-xl font-semibold text-slate-900 tracking-tight">{scheme.name}</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleCompare}
              className={`shrink-0 inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition ${compareSelected ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 text-slate-500 hover:border-indigo-300"}`}
            >
              <GitCompare className="w-3 h-3" /> {t('compare')}
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-500">{scheme.description}</p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-xs text-slate-400">Interest</p><p className="font-semibold text-slate-800">{scheme.interest_rate}% p.a.</p></div>
            <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-xs text-slate-400">Max Loan</p><p className="font-semibold text-slate-800">{formatINR(scheme.max_amount)}</p></div>
            <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-xs text-slate-400">Coverage</p><p className="font-semibold text-slate-800">{scheme.coverage_percent}%</p></div>
            <div className="rounded-lg bg-slate-50 px-3 py-2"><p className="text-xs text-slate-400">Moratorium</p><p className="font-semibold text-slate-800">{scheme.moratorium_months} months</p></div>
          </div>

          {/* Eligibility Gap Analyzer */}
          <EligibilityGapAnalyzer result={result} />

          {/* Explain simply */}
          <SchemeExplain scheme={scheme} />

          {/* Trust info */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
            {scheme.official_source && (
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {t('officialSource')}: {scheme.official_source}</span>
            )}
            {scheme.last_updated && (
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t('lastUpdated')}: {scheme.last_updated}</span>
            )}
          </div>

          {eligible && <DocumentChecklist scheme={scheme} />}

          {eligible && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={`/calculator?scheme=${scheme.id}`}>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Calculate EMI <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
              </Link>
              <Link to={`/partners?category=${scheme.category}`}>
                <Button size="sm" variant="outline">Find Channel Partner <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
              </Link>
              <Link to={`/apply?scheme=${scheme.id}${loanAmount ? `&amount=${loanAmount}` : estimatedCost ? `&amount=${estimatedCost}` : ""}`}>
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}