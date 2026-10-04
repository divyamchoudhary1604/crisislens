/**
 * SerpApi Service — Live Crisis News & Advisory Search
 * 
 * Qualifies for Hacktoberfest Prize: "Best Use of SerpApi"
 * Grounds CrisisLens in fresh real-time web results when an emergency occurs.
 */

import config from '../../config/index.js';

export async function searchLiveCrisisNews(query, location = 'Mohali, Punjab, India') {
  if (!config.hasSerpApi()) {
    return {
      success: false,
      isDemo: true,
      message: 'SERPAPI_KEY not configured. Running with curated crisis dispatches.',
      results: [],
    };
  }

  try {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('q', `${query} emergency advisory alert news`);
    url.searchParams.set('location', location);
    url.searchParams.set('tbm', 'nws'); // Google News tab
    url.searchParams.set('api_key', config.serpApiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const newsResults = (data.news_results || []).slice(0, 5).map((item, index) => ({
      id: `serp-${Date.now()}-${index}`,
      title: item.title,
      publisher: item.source || 'Verified News Source',
      url: item.link,
      publishedAt: item.date || new Date().toISOString(),
      rawContent: item.snippet || item.title,
      cleanedContent: item.snippet || item.title,
      type: 'NEWS',
      isLive: true,
    }));

    return {
      success: true,
      isDemo: false,
      query,
      results: newsResults,
    };
  } catch (error) {
    console.error('SerpApi search error:', error.message);
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
}

export default {
  searchLiveCrisisNews,
};
