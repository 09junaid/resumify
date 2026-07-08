import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const SYSTEM =
  'You are an expert resume writer. Return ONLY the requested text with no preamble, ' +
  'no headings, no quotes, and no markdown formatting.';

/** Build a targeted prompt based on the field and task. */
function buildPrompt({ task, field, content, context = {} }) {
  const c = context || {};

  if (field === 'summary') {
    if (task === 'enhance' && content) {
      return `${SYSTEM}\nImprove this resume professional summary to be concise (2-3 sentences), confident, and results-oriented:\n${content}`;
    }
    return `${SYSTEM}\nWrite a professional resume summary (2-3 sentences) for ${
      c.full_name || 'a candidate'
    }${c.profession ? `, a ${c.profession}` : ''}.${
      c.skills?.length ? ` Key skills: ${c.skills.join(', ')}.` : ''
    } Make it confident, concise, and results-oriented.`;
  }

  if (field === 'experience') {
    const role = [c.position, c.company].filter(Boolean).join(' at ');
    if (task === 'enhance' && content) {
      return `${SYSTEM}\nRewrite these work-experience details into 3-4 concise, achievement-oriented resume bullet points (one per line, no bullet symbols). Use strong action verbs and quantify impact where reasonable:\n${content}`;
    }
    return `${SYSTEM}\nWrite 3-4 concise, achievement-oriented resume bullet points (one per line, no bullet symbols) for the role ${
      role || 'this position'
    }. Use strong action verbs and quantify impact where reasonable.`;
  }

  if (field === 'project') {
    if (task === 'enhance' && content) {
      return `${SYSTEM}\nRewrite this project description into 1-2 concise, impressive sentences for a resume:\n${content}`;
    }
    return `${SYSTEM}\nWrite a concise, impressive 1-2 sentence resume description for a project titled "${
      c.name || 'this project'
    }"${c.type ? ` (${c.type})` : ''}.`;
  }

  // Generic fallback.
  if (content) {
    return `${SYSTEM}\nImprove the following resume text to be more professional and impactful:\n${content}`;
  }
  return `${SYSTEM}\nWrite professional resume content.`;
}

export const aiService = {
  async generate({ task = 'generate', field = 'generic', content = '', context = {} }) {
    if (!env.gemini.apiKey) {
      throw new ApiError(503, 'AI is not configured. Set GEMINI_API_KEY on the server.');
    }

    const prompt = buildPrompt({ task, field, content, context });
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.gemini.model}:generateContent?key=${env.gemini.apiKey}`;

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });
    } catch {
      throw new ApiError(502, 'Could not reach the Gemini API');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(
        res.status === 400 || res.status === 403 ? res.status : 502,
        data?.error?.message || 'Gemini request failed'
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new ApiError(502, 'AI returned no content');
    return text;
  },
};
