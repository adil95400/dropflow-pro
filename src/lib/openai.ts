import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// 🔍 Détection de niches rentables
export async function detectWinningNiches(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert en e-commerce. Suggère des niches rentables pour le dropshipping.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return response.choices[0]?.message?.content;
}

// 📄 Génération de fiches produits complètes (titre + description + tags)
export async function generateProductDetails(title: string, category: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Tu es un assistant IA expert en rédaction de fiches produits e-commerce. Génère un titre optimisé, une description marketing convaincante, et 5 tags SEO.",
      },
      {
        role: "user",
        content: `Titre: ${title}\nCatégorie: ${category}`,
      },
    ],
  });
  return response.choices[0]?.message?.content;
}

// 🌍 Traduction optimisée multilingue
export async function translateProduct(text: string, language: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Traduire et adapter ce texte pour le marché ${language}, avec un style vendeur et localisé.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });
  return response.choices[0]?.message?.content;
}

// 💼 Analyse des concurrents
export async function analyzeCompetitor(title: string, marketplace: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Tu es un outil d'analyse concurrentielle. Estime le niveau de concurrence et le prix moyen d'un produit sur une marketplace.",
      },
      {
        role: "user",
        content: `Produit: ${title} | Marketplace: ${marketplace}`,
      },
    ],
  });
  return response.choices[0]?.message?.content;
}
