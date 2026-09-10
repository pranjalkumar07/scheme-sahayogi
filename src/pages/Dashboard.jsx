import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, FilePlus2, Sparkles } from "lucide-react";
import ApplicationCard from "@/components/applications/ApplicationCard";

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const savedApplications = JSON.parse(
    localStorage.getItem("applications") || "[]"
  );

  // Latest applications first
  savedApplications.sort(
    (a, b) =>
      new Date(b.created_date) - new Date(a.created_date)
  );

  setApps(savedApplications);
  setLoading(false);
}, []);

  const stats = {
    pending: apps.filter((a) => a.status === "pending").length,
    under_review: apps.filter((a) => a.status === "under_review").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
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
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">← Home</Link>
          <h1 className="text-sm font-medium text-slate-500">Application Dashboard</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your applications</h2>
            <p className="text-sm text-slate-500">Track the status of every loan you've applied for.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Pending", value: stats.pending, color: "text-slate-700", dot: "bg-slate-400" },
            { label: "Under Review", value: stats.under_review, color: "text-indigo-600", dot: "bg-indigo-500" },
            { label: "Approved", value: stats.approved, color: "text-emerald-600", dot: "bg-emerald-500" },
            { label: "Rejected", value: stats.rejected, color: "text-rose-500", dot: "bg-rose-400" },
          ].map((s) => (
            <Card key={s.label} className="border-slate-200 shadow-sm">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-xs text-slate-400">{s.label}</span>
                </div>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {apps.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <FilePlus2 className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">No applications yet</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">Find a scheme that fits your needs, then apply — your application status will appear here.</p>
              <Link to="/recommender">
                <Button className="mt-5 bg-slate-900 hover:bg-slate-800">
                  <Sparkles className="w-4 h-4 mr-2" /> Find a scheme
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.3) }}
              >
                <ApplicationCard app={app} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}