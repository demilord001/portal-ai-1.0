export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface TavilyResponse {
  query: string;
  answer?: string;
  results: TavilySearchResult[];
}

/**
 * Intelligent detector for whether a prompt demands real-time web search
 */
export function requiresLiveSearch(prompt: string, forceSearch?: boolean): boolean {
  if (forceSearch === true) return true;
  if (forceSearch === false) return false;

  const text = prompt.toLowerCase();

  // Search indicators
  const searchTriggers = [
    /\b(latest|recent|news|today|yesterday|tomorrow|this week|current|currently|now|upcoming)\b/i,
    /\b(weather|stock|crypto|bitcoin|price of|score|game today|who won|election)\b/i,
    /\b(release date|when will|changelog|patch notes|scheduled for)\b/i,
    /\b(2024|2025|2026|2027)\b/i,
    /\b(search for|google|look up|find info about|browse the web)\b/i,
    /\b(what is happening|what happened to|breaking)\b/i,
  ];

  return searchTriggers.some((pattern) => pattern.test(text));
}

/**
 * Perform Tavily web search
 */
export async function searchTavily(query: string, apiKey?: string): Promise<TavilyResponse | null> {
  const key = apiKey || process.env.TAVILY_API_KEY;
  if (!key || key.trim() === "" || key.includes("placeholder")) {
    return null;
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: "basic",
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!res.ok) {
      console.warn("Tavily search API responded with status:", res.status);
      return null;
    }

    const data = await res.json();
    return {
      query,
      answer: data.answer,
      results: (data.results || []).map((r: any) => ({
        title: r.title || "Web Result",
        url: r.url || "#",
        content: r.content || "",
        score: r.score,
      })),
    };
  } catch (err) {
    console.error("Tavily search execution failed:", err);
    return null;
  }
}
