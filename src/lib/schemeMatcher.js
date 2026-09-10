export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const INCOME_LIMIT = 500000;

export function matchSchemes(schemes, userInput) {
  const {
    projectType,
    estimatedCost = 0,
    loanAmount = 0,
    annualIncome,
    educationLevel,
    businessType,
    socialCategory,
  } = userInput;

  const loan = Number(loanAmount || estimatedCost || 0);
  const income = Number(annualIncome || 0);

  const results = [];

  for (const scheme of schemes) {
    const checks = [];
    let score = 0;
    let eligible = true;

    // 1. Income eligibility
    const incomeProvided = annualIncome !== undefined && annualIncome !== null && annualIncome !== "";

    const incomeOk = incomeProvided
      ? income <= INCOME_LIMIT
      : true;

    checks.push({
      key: "income",
      pass: incomeOk,
      label: !incomeProvided
        ? "Income not provided"
        : incomeOk
          ? "Income within ₹5 Lakh limit"
          : "Income exceeds ₹5 Lakh limit",
    });

    if (incomeProvided && incomeOk) {
      score += 25;
    }

    if (incomeProvided && !incomeOk) {
      eligible = false;
    }

    // 2. Purpose match
    const purposeOk =
      !projectType ||
      scheme.purpose === "both" ||
      scheme.purpose === projectType ||
      (projectType === "business" &&
        ["micro_finance", "term_loan"].includes(scheme.category)) ||
      (projectType === "education" &&
        scheme.category === "education");

    checks.push({
      key: "purpose",
      pass: purposeOk,
      label: purposeOk
        ? "Purpose matches"
        : "Purpose does not match",
    });

    if (purposeOk) {
      score += 25;
    } else {
      eligible = false;
    }

    // 3. Business / project type match
    let businessOk = true;

    if (businessType && projectType === "business") {
      const text = `${scheme.name || ""} ${
        scheme.description || ""
      }`.toLowerCase();

      const business = businessType.toLowerCase();

      businessOk =
        text.includes(business) ||
        business === "dairy" ||
        business === "dairy farming";
    }

    checks.push({
      key: "businessType",
      pass: businessOk,
      label: businessOk
        ? "Business/project type is compatible"
        : "Business/project type may not match",
    });

    if (businessOk) {
      score += 15;
    }

    // 4. Project cost within maximum
    const costProvided =
      Number(estimatedCost) > 0 || Number(loanAmount) > 0;

    const costOk = costProvided
      ? loan <= Number(scheme.max_amount || Infinity)
      : true;

    checks.push({
      key: "cost",
      pass: costOk,
      label: !costProvided
        ? "Project amount not provided"
        : costOk
          ? "Required amount is within scheme limit"
          : "Required amount exceeds maximum limit",
    });

    if (costProvided && costOk) {
      score += 20;
    }

    if (costProvided && !costOk) {
      eligible = false;
    }

    // 5. Applicant profile
    let profileOk = true;

    if (socialCategory && scheme.social_category) {
      profileOk =
        scheme.social_category === socialCategory ||
        scheme.social_category === "all";
    }

    if (projectType === "education") {
      profileOk =
        profileOk &&
        (!scheme.category || scheme.category === "education");
    }

    checks.push({
      key: "profile",
      pass: profileOk,
      label: profileOk
        ? "Applicant profile is compatible"
        : "Applicant profile may not match",
    });

    if (profileOk) {
      score += 15;
    }

    const matchScore = Math.max(0, Math.min(100, score));

    const whyNot = checks
      .filter((check) => !check.pass)
      .map((check) => check.label);

    const passLabels = checks
      .filter((check) => check.pass)
      .map((check) => check.label.toLowerCase());

    const whyRecommended = passLabels.length
      ? `Recommended because ${passLabels.slice(0, 3).join(", ")}.`
      : "This scheme does not match your current profile.";

    results.push({
      scheme,
      score: matchScore,
      matchScore,
      eligible,
      checks,
      whyRecommended,
      whyNot,
      rank: 0,
      alternative: null,
    });
  }

  // Highest match first
  results.sort((a, b) => b.matchScore - a.matchScore);

  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  // Find best eligible option
  const topEligible = results.find((result) => result.eligible);

  results.forEach((result) => {
    if (
      !result.eligible &&
      topEligible &&
      topEligible.scheme.id !== result.scheme.id
    ) {
      result.alternative = {
        name: topEligible.scheme.name,
        id: topEligible.scheme.id,
      };
    }
  });

  return results;
}

export function assessFinancialReadiness({ annualIncome, emi }) {
  if (!emi || !annualIncome) return { label: 'Good', score: 85, color: 'emerald' };
  const monthlyIncome = annualIncome / 12;
  const ratio = emi / monthlyIncome;
  if (ratio < 0.3) return { label: 'Good', score: 90, color: 'emerald' };
  if (ratio < 0.5) return { label: 'Moderate', score: 65, color: 'amber' };
  return { label: 'Tight', score: 40, color: 'rose' };
}

export function explainScheme(scheme, lang = 'en') {
  const docs = (scheme.documents || []).join(', ');
  if (lang === 'hi') {
    return {
      what: `यह ${scheme.name} अनुसूचित वर्ग के उद्यमियों और छात्रों के लिए एक रियायती ऋण योजना है।`,
      who: scheme.eligibility || 'पात्रता: वार्षिक पारिवारिक आय ₹5 लाख तक के अनुसूचित वर्ग के आवेदक।',
      borrow: `आप ${formatINR(scheme.min_amount || 0)} से ${formatINR(scheme.max_amount)} तक का ऋण ले सकते हैं।`,
      interest: `ब्याज दर लगभग ${scheme.interest_rate}% प्रति वर्ष है, और ${scheme.moratorium_months} महीने की छूट अवधि मिलती है।`,
      documents: docs ? `आवश्यक दस्तावेज़: ${docs}।` : 'दस्तावेज़ों की सूची देखें।',
      where: 'आवेदन के लिए अपने नज़दीकी चैनल पार्टनर (SCA/बैंक) से संपर्क करें।',
    };
  }
  return {
    what: `${scheme.name} is a concessional credit scheme for Scheduled Caste entrepreneurs and students.`,
    who: scheme.eligibility || 'Eligibility: SC applicants with annual family income up to ₹5 Lakh.',
    borrow: `You can borrow between ${formatINR(scheme.min_amount || 0)} and ${formatINR(scheme.max_amount)}.`,
    interest: `Interest is around ${scheme.interest_rate}% p.a., with a ${scheme.moratorium_months}-month moratorium.`,
    documents: docs ? `Required documents: ${docs}.` : 'See the document checklist.',
    where: 'Apply through your nearest Channel Partner (SCA / Bank / NBFC-MFI).',
  };
}

export function explainEmi(result, scheme, lang = 'en') {
  if (!result) return '';
  if (lang === 'hi') {
    return `आपकी अनुमानित मासिक किस्त ${formatINR(result.emi)} है, जिसमें कुल ब्याज ${formatINR(result.totalInterest)} होगा। यानी आप कुल ${formatINR(result.totalPayable)} चुकाएँगे। ${scheme.moratorium_months} महीने की छूट अवधि के बाद EMI शुरू होगी।`;
  }
  return `Your estimated monthly EMI is ${formatINR(result.emi)}, with total interest of ${formatINR(result.totalInterest)} — so you'll repay ${formatINR(result.totalPayable)} in all. EMIs begin after the ${scheme.moratorium_months}-month moratorium.`;
}

export function calculateEmi({ principal, annualRate, tenureMonths, moratoriumMonths }) {
  const monthlyRate = annualRate / 100 / 12;
  const moratorium = moratoriumMonths || 0;

  const moratoriumInterest = principal * monthlyRate * moratorium;
  const effectivePrincipal = principal + moratoriumInterest;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = effectivePrincipal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    emi = (effectivePrincipal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  const schedule = [];
  let balance = effectivePrincipal;
  const totalMonths = moratorium + tenureMonths;
  for (let m = 1; m <= totalMonths; m++) {
    if (m <= moratorium) {
      const interest = principal * monthlyRate;
      balance += interest;
      schedule.push({ month: m, phase: 'moratorium', emi: 0, interest, principal: 0, balance });
    } else {
      const interest = balance * monthlyRate;
      const principalPart = emi - interest;
      balance -= principalPart;
      schedule.push({ month: m, phase: 'repayment', emi, interest, principal: principalPart, balance: Math.max(0, balance) });
    }
  }

  return { emi, totalPayable, totalInterest, moratoriumInterest, effectivePrincipal, schedule };
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}