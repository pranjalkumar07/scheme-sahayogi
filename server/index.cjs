const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/ask-sahayogi", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

   const interaction = await ai.interactions.create({
  model: "gemini-3.6-flash",

  input: `
You are "Sahayogi AI", an AI scheme-matching assistant for an
Indian government financial assistance discovery platform.

Your job is to understand the user's message and extract their
financial requirements accurately.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Use exactly this structure:

{
  "profile": {
    "projectType": null,
    "businessType": null,
    "loanAmount": null,
    "annualIncome": null,
    "state": null,
    "district": null,
    "socialCategory": null,
    "locationType": null,
    "educationLevel": null
  },
  "missingInformation": [],
  "answer": ""
}

RULES FOR profile:

- projectType must be "business", "education", or null.
- businessType should contain the specific business/project type,
  such as "dairy", "tailoring", "food business", etc.
- loanAmount must be a number in INR, without ₹ or commas.
- annualIncome must be a number in INR, without ₹ or commas.
- state and district should be extracted if mentioned.
- socialCategory should be "SC", "ST", "OBC", "General", or null.
- locationType should be "rural", "urban", or null.
- educationLevel should be extracted if relevant.
- If information is not provided, use null.
- Do not guess missing information.

RULES FOR missingInformation:

Only include important information that is missing and necessary
for better scheme matching.

Possible values:
"state"
"district"
"socialCategory"
"locationType"
"loanAmount"
"annualIncome"
"projectType"

RULES FOR answer:

- Reply in the same language as the user.
- Keep it concise and easy to understand.
- Summarize what you understood.
- Do not claim official eligibility.
- Do not approve or sanction loans.
- Do not invent government schemes, interest rates, loan limits,
  subsidies, or channel partners.
- Do not present generic financial products as government schemes.
- If important information is missing, politely ask the user for it.
- Mention that final eligibility is verified by the authorized
  government agency/channel partner.

IMPORTANT NSFDC CONTEXT:

The platform helps marginalized entrepreneurs and students explore
financial assistance associated with NSFDC and its authorized
channel partners.

The annual family income ceiling for relevant NSFDC assistance is
₹5 lakh.

NSFDC does not directly sanction individual loans. Applications are
routed through authorized channel partners.

USER MESSAGE:

${message}
`,
});

    const rawOutput = interaction.output_text.trim();

let aiResult;

try {
  aiResult = JSON.parse(rawOutput);
} catch (parseError) {
  console.error("AI JSON Parse Error:", rawOutput);

  return res.status(500).json({
    error: "Sahayogi returned an invalid response format.",
  });
}

res.json(aiResult);
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      error: "Sahayogi AI could not process your request.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🤖 Sahayogi AI server running on port ${PORT}`);
});