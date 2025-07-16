// lib/keywords.ts

import { generateCompletion } from "./openai";

export interface SEOKeywordsResult {
  keywords: string[];
  metaDescription: string;
  hashtags: string[];
}

export async function generateSEOKeywords({
  title,
  description,
  locale = "fr",
}: {
  title: string;
  description: string;
  locale?: "fr" | "en";
}): Promise<SEOKeywordsResult> {
  const prompt = `
Tu es un expert en SEO pour e-commerce dropshipping.
Analyse le produit suivant et génère :
1. Une liste de 10 mots-clés optimisés
2. Une meta-description de 160 caractères maximum
3. Une liste de hashtags SEO-friendly

Produit :
Titre : ${title}
Description : ${description}
Langue : ${locale === "fr" ? "Français" : "Anglais"}

Réponds en JSON dans ce format :
{
  "keywords": [...],
  "metaDescription": "...",
  "hashtags": [...]
}
`;

  const result = await generateCompletion(prompt, {
    temperature: 0.7,
    max_tokens: 500,
  });

  try {
    const json = JSON.parse(result);
    return {
      keywords: json.keywords || [],
      metaDescription: json.metaDescription || "",
      hashtags: json.hashtags || [],
    };
  } catch (e) {
    console.error("Erreur parsing keywords:", e);
    return {
      keywords: [],
      metaDescription: "",
      hashtags: [],
    };
  }
}
