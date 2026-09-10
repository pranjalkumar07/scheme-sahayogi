import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, AlertTriangle, Sparkles, FlaskConical } from "lucide-react";
import { useLanguage } from "@/lib/i18n.jsx";

const TYPE_LABEL = { SCA: "State Channelizing Agency", PSB: "Public Sector Bank", RRB: "Regional Rural Bank", "NBFC-MFI": "NBFC-MFI" };
const CATEGORY_LABEL = { micro_finance: "Micro Finance", term_loan: "Term Loan", education: "Education Loan" };

export default function PartnerCard({ partner, distance, selected, onSelect, selectedCategory }) {
  const { t } = useLanguage();
  const supportsSelected = selectedCategory ? (partner.supported_categories || []).includes(selectedCategory) : true;

  const whyText = !partner.is_eligible
    ? "This partner is currently restricted — applications are routed elsewhere."
    : selectedCategory && supportsSelected
      ? "Recommended because this partner supports your selected scheme" + (distance != null ? " and is nearby." : ".")
      : "Supports multiple scheme categories in your region.";

  return (
    <Card className={`cursor-pointer border transition-all ${selected ? "border-indigo-400 ring-1 ring-indigo-200 shadow-md" : "border-slate-200 hover:border-slate-300 shadow-sm"}`} onClick={() => onSelect(partner.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-900 leading-tight">{partner.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{TYPE_LABEL[partner.type]}</p>
          </div>
          {partner.is_eligible ? (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">Eligible</Badge>
          ) : (
            <Badge className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-50">Restricted</Badge>
          )}
        </div>

        <div className="mt-2 flex items-start gap-1 text-xs text-slate-500">
          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{partner.address}, {partner.city}, {partner.state}</span>
        </div>
        {distance != null && <p className="mt-1 text-xs font-medium text-indigo-600">📍 {distance.toFixed(1)} km away</p>}

        <div className="mt-3 flex flex-wrap gap-1">
          {(partner.supported_categories || []).map((c) => (
            <span key={c} className={`text-[11px] px-2 py-0.5 rounded-full ${selectedCategory === c ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>{CATEGORY_LABEL[c] || c}</span>
          ))}
        </div>

        {/* Demo data metrics */}
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-1 mb-1.5">
            <FlaskConical className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{t('demoData')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div><p className="text-slate-400">Fund Used</p><p className="font-medium text-slate-700">{partner.fund_utilization_percent}%</p></div>
            <div><p className="text-slate-400">NPA</p><p className={`font-medium ${partner.npa_percent > 5 ? "text-rose-500" : "text-slate-700"}`}>{partner.npa_percent}%</p></div>
            <div><p className="text-slate-400">Overdue</p><p className={`font-medium ${partner.overdue_percent > 5 ? "text-rose-500" : "text-slate-700"}`}>{partner.overdue_percent}%</p></div>
          </div>
        </div>

        {/* Why this partner */}
        <div className="mt-3 rounded-lg bg-indigo-50/60 border border-indigo-100 px-3 py-2 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold text-indigo-600">{t('whyThisPartner')}</p>
            <p className="text-xs text-slate-600 mt-0.5">{whyText}</p>
          </div>
        </div>

        {partner.is_eligible && (partner.contact_phone || partner.contact_email) && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            {partner.contact_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{partner.contact_phone}</span>}
            {partner.contact_email && <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3" />{partner.contact_email}</span>}
          </div>
        )}
        {!partner.is_eligible && (
          <p className="mt-3 text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High NPA/overdue — applications routed elsewhere</p>
        )}
      </CardContent>
    </Card>
  );
}