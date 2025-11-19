import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

const systemInstruction = `
You are an expert Senior Technical Recruiter and Career Coach. 
Your goal is to analyze a CV against a Job Description (JD) and provide structured, actionable data in JSON format.
You are critical but constructive. You look for specific gaps and provide strategy to overcome them.
`;

export const analyzeCVWithGemini = async (cvText: string, jobText: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
  Analyze the candidate data against the job description.
  
  === CANDIDATE CV ===
  ${cvText}

  === JOB DESCRIPTION ===
  ${jobText}

  RETURN YOUR RESPONSE AS PURE VALID JSON ONLY. NO MARKDOWN BLOCK. USE THIS SCHEMA:
  {
    "matchScore": number (0-100 integer),
    "subScores": {
      "technical": number (0-100),
      "softSkills": number (0-100),
      "experience": number (0-100)
    },
    "criticalAdjustments": ["string", "string"...] (List of 3-5 high priority fixes),
    "shortenRemove": ["string", "string"...] (List of fluff/irrelevant info to delete),
    "technicalGuidance": ["string", "string"...] (Strategic advice on keyword alignment),
    "improvedSummary": "string" (A rewriting of the professional summary, tailored to the JD),
    "interviewPrep": [
      {
        "question": "string" (A tough interview question based on a weakness in the CV),
        "context": "string" (Why you are asking this, e.g., 'Candidate lacks X'),
        "sampleAnswer": "string" (A STAR format strategy to answer this)
      },
      ... (provide 3 questions)
    ]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json"
      },
    });

    const text = response.text || '{}';
    return parseGeminiResponse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const parseGeminiResponse = (text: string): AnalysisResult => {
  try {
    // Clean text if it accidentally includes markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(cleanText);

    return {
      matchScore: json.matchScore || 0,
      subScores: {
        technical: json.subScores?.technical || 0,
        softSkills: json.subScores?.softSkills || 0,
        experience: json.subScores?.experience || 0,
      },
      criticalAdjustments: json.criticalAdjustments || [],
      shortenRemove: json.shortenRemove || [],
      technicalGuidance: json.technicalGuidance || [],
      improvedSummary: json.improvedSummary || "Could not generate summary.",
      interviewPrep: json.interviewPrep || [],
      rawText: text
    };
  } catch (e) {
    console.error("JSON Parse Error", e);
    // Fallback structure
    return {
      matchScore: 0,
      subScores: { technical: 0, softSkills: 0, experience: 0 },
      criticalAdjustments: ["Error parsing AI response. Please try again."],
      shortenRemove: [],
      technicalGuidance: [],
      improvedSummary: "",
      interviewPrep: [],
      rawText: text
    };
  }
};