
import { GoogleGenAI, Type } from "@google/genai";
import { Order, Product } from "../types";

export const getBusinessInsights = async (orders: Order[], products: Product[]): Promise<string> => {
  // Always use a named parameter for the API key from process.env.API_KEY strictly as required
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalProfit = orders.reduce((acc, o) => acc + o.profit, 0);
  const lowStock = products.filter(p => p.stock < p.minStock).map(p => p.name);

  const context = {
    financials: { totalRevenue, totalProfit, margin: totalRevenue > 0 ? (totalProfit/totalRevenue) : 0 },
    inventory: { lowStockCount: lowStock.length, lowStockItems: lowStock },
    velocity: orders.length
  };

  const prompt = `
    Analyze this Cafe's performance: ${JSON.stringify(context)}.
    Provide 3 high-impact executive recommendations focusing on:
    1. Profit margin improvement.
    2. Inventory optimization for the low stock items.
    3. Revenue growth strategy.
    Use Markdown, keep it extremely concise but punchy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Complex reasoning task
      contents: prompt,
    });
    // Accessing text as a property directly from the response object
    return response.text || "Unable to generate insights.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Consultant is currently offline.";
  }
};

export const getSmartMenuSuggestions = async (products: Product[]): Promise<string[]> => {
  // Always use a named parameter for the API key from process.env.API_KEY strictly as required
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Current menu: ${products.map(p => p.name).join(', ')}.
    Suggest 3 high-margin seasonal additions. 
    Format: Return ONLY a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Basic text generation task
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Accessing text as a property directly from the response object
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return ["Salted Caramel Cold Foam", "Truffle Mushroom Melt", "Matcha Pistachio Cheesecake"];
  }
};
