import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  // Nav / general
  home: { en: 'Home', hi: 'होम' },
  back: { en: 'Back', hi: 'वापस' },
  // Recommender
  findYourScheme: { en: 'Find your scheme', hi: 'अपनी योजना खोजें' },
  recommenderSubtitle: { en: "Tell us about your project and income. We'll match you to the most suitable concessional credit or education scheme.", hi: 'अपनी परियोजना और आय के बारे में बताएँ। हम आपको सबसे उपयुक्त रियायती ऋण या शिक्षा योजना से मिलाएँगे।' },
  fundingFor: { en: 'What do you need funding for?', hi: 'आपको किसके लिए धन चाहिए?' },
  business: { en: 'Business / Project', hi: 'व्यवसाय / परियोजना' },
  education: { en: 'Education', hi: 'शिक्षा' },
  projectCost: { en: 'Estimated project / education cost', hi: 'अनुमानित परियोजना / शिक्षा लागत' },
  loanAmount: { en: 'Required loan amount', hi: 'आवश्यक ऋण राशि' },
  annualIncome: { en: 'Annual family income', hi: 'वार्षिक पारिवारिक आय' },
  state: { en: 'Your state / location', hi: 'आपका राज्य / स्थान' },
  getRecommendation: { en: 'Get my recommendation', hi: 'मेरी सिफारिश पाएँ' },
  matching: { en: 'Matching schemes…', hi: 'योजनाएँ मिलाई जा रही हैं…' },
  matchedSchemes: { en: 'Your matched schemes', hi: 'आपकी मिली योजनाएँ' },
  rankedBy: { en: 'Ranked by suitability for your profile', hi: 'आपकी प्रोफ़ाइल के अनुसार क्रमित' },
  startOver: { en: 'Start over', hi: 'फिर से शुरू करें' },
  // Match result
  bestMatch: { en: 'Best Match', hi: 'सर्वोत्तम मिलान' },
  alternative: { en: 'Alternative', hi: 'विकल्प' },
  eligible: { en: 'Eligible', hi: 'पात्र' },
  notEligible: { en: 'Not eligible', hi: 'अपात्र' },
  whyRecommended: { en: 'Why is this recommended?', hi: 'यह सिफारिश क्यों है?' },
  whyNot: { en: "Why this is not the best match", hi: 'यह सर्वोत्तम मिलान क्यों नहीं' },
  betterAlternative: { en: 'A better match for you', hi: 'आपके लिए बेहतर विकल्प' },
  explainSimply: { en: 'Explain this scheme simply', hi: 'इस योजना को सरल भाषा में समझाएँ' },
  compare: { en: 'Compare', hi: 'तुलना करें' },
  // EMI
  planRepayments: { en: 'Plan your repayments', hi: 'अपनी चुकौती की योजना बनाएँ' },
  monthlyEmi: { en: 'Your monthly EMI', hi: 'आपकी मासिक EMI' },
  principal: { en: 'Principal', hi: 'मूलधन' },
  totalInterest: { en: 'Total Interest', hi: 'कुल ब्याज' },
  totalRepayment: { en: 'Total Repayment', hi: 'कुल चुकौती' },
  emiDisclaimer: { en: 'This is an estimate. Final terms depend on the authorized implementing agency.', hi: 'यह केवल अनुमान है। अंतिम शर्तें अधिकृत एजेंसी द्वारा तय होंगी।' },
  // Documents
  documentReadiness: { en: 'Document Readiness', hi: 'दस्तावेज़ तत्परता' },
  ready: { en: 'Ready', hi: 'तैयार' },
  notReady: { en: 'Not Ready', hi: 'तैयार नहीं' },
  nextStep: { en: 'Your next step', hi: 'आपका अगला कदम' },
  // Readiness
  applicationReadiness: { en: 'Application Readiness', hi: 'आवेदन तत्परता' },
  schemeMatch: { en: 'Scheme Match', hi: 'योजना मिलान' },
  financialReadiness: { en: 'Financial Readiness', hi: 'वित्तीय तत्परता' },
  nextBestAction: { en: 'Next Best Action', hi: 'अगला सर्वोत्तम कदम' },
  // Partners
  whyThisPartner: { en: 'Why this partner?', hi: 'यह पार्टनर क्यों?' },
  demoData: { en: 'Demo Data', hi: 'डेमो डेटा' },
  // Trust
  trustNote: { en: 'Sahayogi provides informational guidance and estimated calculations. Final eligibility, sanction and loan approval are determined by the authorized implementing agency.', hi: 'सहयोगी केवल सूचनात्मक मार्गदर्शन और अनुमानित गणना प्रदान करता है। अंतिम पात्रता और ऋण स्वीकृति अधिकृत एजेंसी द्वारा तय होती है।' },
  officialSource: { en: 'Official Source', hi: 'आधिकारिक स्रोत' },
  lastUpdated: { en: 'Last Updated', hi: 'अंतिम अद्यतन' },
  // Demo
  demoProfiles: { en: 'Try a demo profile', hi: 'डेमो प्रोफ़ाइल आज़माएँ' },
  // Eligibility Gap Analyzer
  eligibilityGaps: { en: 'Your Eligibility Gaps', hi: 'आपकी पात्रता की कमियाँ' },
  noGapsFound: { en: 'Great! No major eligibility gaps found.', hi: 'बढ़िया! कोई बड़ी पात्रता कमी नहीं मिली।' },
  howToImprove: { en: 'How to improve your eligibility', hi: 'अपनी पात्रता कैसे बढ़ाएँ' },
  eligibilityConfidence: { en: 'Confidence', hi: 'विश्वास' },
  likelyEligible: { en: 'Likely eligible based on the information provided.', hi: 'दी गई जानकारी के आधार पर संभवतः पात्र।' },
  high: { en: 'High', hi: 'उच्च' },
  medium: { en: 'Medium', hi: 'मध्यम' },
  low: { en: 'Low', hi: 'निम्न' },
  // My Sahayogi Plan
  mySahayogiPlan: { en: 'My Sahayogi Plan', hi: 'मेरी सहयोगी योजना' },
  match: { en: 'Match', hi: 'मिलान' },
  step1BestScheme: { en: 'Step 1 — Best Scheme', hi: 'चरण 1 — सर्वोत्तम योजना' },
  step2FinancialCheck: { en: 'Step 2 — Financial Check', hi: 'चरण 2 — वित्तीय जाँच' },
  step3Documents: { en: 'Step 3 — Documents', hi: 'चरण 3 — दस्तावेज़' },
  step4BestPartner: { en: 'Step 4 — Best Channel Partner', hi: 'चरण 4 — सर्वोत्तम चैनल पार्टनर' },
  step5NextAction: { en: 'Step 5 — Next Best Action', hi: 'चरण 5 — अगला सर्वोत्तम कदम' },
  yourApplicationJourney: { en: 'Your Application Journey', hi: 'आपकी आवेदन यात्रा' },
  continueJourney: { en: 'Continue My Application Journey', hi: 'अपनी आवेदन यात्रा जारी रखें' },
  viewRoute: { en: 'View Route', hi: 'मार्ग देखें' },
  estimatedEmi: { en: 'Estimated EMI', hi: 'अनुमानित EMI' },
};

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem('lang') || 'en'; } catch { return 'en'; }
  });
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch {}
  }, []);
  const t = useCallback((key) => (translations[key]?.[lang] ?? translations[key]?.en ?? key), [lang]);
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}