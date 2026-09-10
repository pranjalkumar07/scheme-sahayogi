import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Locate, Filter, FlaskConical } from "lucide-react";
import PartnerMap from "@/components/partners/PartnerMap";
import PartnerCard from "@/components/partners/PartnerCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { haversineKm } from "@/lib/schemeMatcher";

const LOCAL_PARTNERS = [
  {
    id: "partner-1",
    name: "Uttar Pradesh SC Finance Corporation",
    category: "micro_finance",
    supported_categories: ["micro_finance", "term_loan"],
    lat: 28.6139,
    lng: 77.2090,
    address: "Lucknow, Uttar Pradesh",
    phone: "1800-000-1001",
    is_eligible: true,
    fund_health: "Good",
  },
  {
    id: "partner-2",
    name: "State Bank Business Support",
    category: "term_loan",
    supported_categories: ["term_loan", "micro_finance"],
    lat: 28.4595,
    lng: 77.0266,
    address: "Gurugram, Haryana",
    phone: "1800-000-1002",
    is_eligible: true,
    fund_health: "Good",
  },
  {
    id: "partner-3",
    name: "Regional Rural Finance Centre",
    category: "micro_finance",
    supported_categories: ["micro_finance"],
    lat: 28.6692,
    lng: 77.4538,
    address: "Ghaziabad, Uttar Pradesh",
    phone: "1800-000-1003",
    is_eligible: true,
    fund_health: "Healthy",
  },
  {
    id: "partner-4",
    name: "National Education Finance Partner",
    category: "education",
    supported_categories: ["education"],
    lat: 28.6139,
    lng: 77.2090,
    address: "New Delhi",
    phone: "1800-000-1004",
    is_eligible: true,
    fund_health: "Good",
  },
  {
    id: "partner-5",
    name: "Micro Enterprise Support Centre",
    category: "micro_finance",
    supported_categories: ["micro_finance", "term_loan"],
    lat: 28.5355,
    lng: 77.3910,
    address: "Noida, Uttar Pradesh",
    phone: "1800-000-1005",
    is_eligible: false,
    fund_health: "Limited",
  },
  {
    id: "partner-6",
    name: "Small Business Finance Hub",
    category: "term_loan",
    supported_categories: ["term_loan"],
    lat: 28.4089,
    lng: 77.3178,
    address: "Faridabad, Haryana",
    phone: "1800-000-1006",
    is_eligible: true,
    fund_health: "Healthy",
  },
];

const CATEGORY_LABEL = {
  micro_finance: "Micro Finance",
  term_loan: "Term Loan",
  education: "Education Loan",
};

export default function PartnerLocator() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(params.get("category") || "all");
  const [eligibleOnly, setEligibleOnly] = useState(true);

  useEffect(() => {
  setPartners(LOCAL_PARTNERS);
  setLoading(false);
}, []);

  const detectLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      // Fallback to a default Indian location (Delhi)
      setUserLocation({ lat: 28.6139, lng: 77.209 });
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setUserLocation({ lat: 28.6139, lng: 77.209 });
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const filtered = useMemo(() => {
    let list = [...partners];
    if (categoryFilter !== "all") {
      list = list.filter((p) => (p.supported_categories || []).includes(categoryFilter));
    }
    if (eligibleOnly) {
      list = list.filter((p) => p.is_eligible);
    }
    if (userLocation) {
      list = list
        .map((p) => ({ ...p, _distance: haversineKm(userLocation.lat, userLocation.lng, p.lat, p.lng) }))
        .sort((a, b) => a._distance - b._distance);
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [partners, categoryFilter, eligibleOnly, userLocation]);

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
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">← Home</Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <h1 className="text-sm font-medium text-slate-500">Geo-Spatial Partner Locator</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">Find your nearest Channel Partner</h2>
            <p className="mt-1 text-sm text-slate-500">SCAs, Public Sector Banks, RRBs & NBFC-MFIs — filtered by fund health so your application isn't misrouted.</p>
          </div>
          <Button onClick={detectLocation} disabled={locating} className="bg-slate-900 hover:bg-slate-800 self-start">
            {locating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Locate className="w-4 h-4 mr-2" />}
            {userLocation ? "Update location" : "Use my location"}
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 shadow-sm mb-5">
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium"><Filter className="w-4 h-4" /> Filters</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${categoryFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
              >
                All schemes
              </button>
              {Object.entries(CATEGORY_LABEL).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setCategoryFilter(val)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${categoryFilter === val ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 ml-auto cursor-pointer">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="accent-slate-900 w-4 h-4"
              />
              Eligible partners only
            </label>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5" /> Partner fund-health metrics are shown as Demo Data for prototype purposes.</p>
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm h-[500px] sticky top-4">
              <PartnerMap partners={filtered} userLocation={userLocation} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>

          {/* List */}
          <div className="order-1 lg:order-2 space-y-3">
            {!userLocation && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Enable location to sort partners by distance.
              </p>
            )}
            {filtered.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="p-8 text-center text-sm text-slate-400">
                  No partners match your current filters. Try widening your search.
                </CardContent>
              </Card>
            ) : (
              filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <PartnerCard
                    partner={p}
                    distance={p._distance}
                    selected={selectedId === p.id}
                    onSelect={setSelectedId}
                    selectedCategory={categoryFilter !== "all" ? categoryFilter : null}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}