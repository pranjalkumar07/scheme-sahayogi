import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";

import Home from "@/pages/Home";
import SchemeRecommender from "@/pages/SchemeRecommender";
import EmiCalculator from "@/pages/EmiCalculator";
import PartnerLocator from "@/pages/PartnerLocator";
import Dashboard from "@/pages/Dashboard";
import Apply from "@/pages/Apply";
import Compare from "@/pages/Compare";

import { LanguageProvider } from "@/lib/i18n.jsx";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <LanguageProvider>
        <Router>
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommender" element={<SchemeRecommender />} />
            <Route path="/calculator" element={<EmiCalculator />} />
            <Route path="/partners" element={<PartnerLocator />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>

        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;