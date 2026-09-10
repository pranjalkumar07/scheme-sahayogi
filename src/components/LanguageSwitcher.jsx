import React from "react";
import { useLanguage } from "@/lib/i18n.jsx";
import { Languages } from "lucide-react";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs ${className}`}>
      <Languages className="w-3.5 h-3.5 text-slate-400 mx-1.5" />
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full font-medium transition ${lang === "en" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`px-2.5 py-1 rounded-full font-medium transition ${lang === "hi" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
      >
        हिंदी
      </button>
    </div>
  );
}