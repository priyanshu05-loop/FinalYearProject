import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const extractJson = (text) => {
  if (!text) return null;

  const trimmed = text.trim();
  const hasJsonFence = trimmed.includes('```');

  if (hasJsonFence) {
    const raw = trimmed.replace(/```json/g, '```').replace(/```/g, '');
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // ignore parse errors and fall through
      }
    }
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
};

export const getClaudeClient = () => {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not configured');
  }

  return anthropic;
};

export const extractSkillsFromResume = async (resumeText) => {
  const client = getClaudeClient();

  const prompt = `Analyze this resume and extract structured information. Return ONLY valid JSON with no extra text.

Resume:
${resumeText}

Return this exact JSON structure:
{
  "technical_skills": ["skill1", "skill2", ...],
  "soft_skills": ["skill1", "skill2", ...],
  "programming_languages": ["language1", "language2", ...],
  "frameworks_tools": ["framework1", "tool1", ...],
  "years_of_experience": 0,
  "experience_summary": "brief summary",
  "education": ["degree", "school"],
  "certifications": ["cert1", "cert2"],
  "job_titles": ["title1", "title2"],
  "industries": ["industry1", "industry2"]
}`;

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    max_tokens: 1600,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = response.content?.[0]?.text || '';
  const parsed = extractJson(responseText);

  if (!parsed) {
    throw new Error('Failed to parse Claude response for resume extraction');
  }

  return parsed;
};

export const generateInterviewQuestions = async ({ jobRole, skills = [], experienceYears = 0, numQuestions = 6, difficulty = 'medium' }) => {
  const client = getClaudeClient();

  const skillsString = skills.length ? skills.join(', ') : 'not specified';
  const prompt = `Generate ${numQuestions} interview questions for a ${jobRole || 'Software Engineer'} role.

Candidate Profile:
- Skills: ${skillsString}
- Experience: ${experienceYears} years
- Difficulty: ${difficulty}

Create a mix of:
- 2 Technical questions
- 2 Behavioral questions
- ${numQuestions - 4} Scenario/Problem-solving questions

Return ONLY valid JSON with this structure:
{
  "questions": [
    {
      "question": "What is...",
      "type": "technical",
      "expected_answer_points": ["point1", "point2", "point3"],
      "time_limit_seconds": 180
    }
  ]
}`;

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = response.content?.[0]?.text || '';
  const parsed = extractJson(responseText);

  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error('Failed to parse Claude response for interview question generation');
  }

  return parsed.questions;
};

export const generateSessionReport = async ({ jobRole, scores, strengths, weaknesses }) => {
  const client = getClaudeClient();

  const prompt = `Generate a professional interview feedback report.

Position: ${jobRole || 'General'}
Overall Score: ${scores?.overall || 0}/100

Strengths:
${(strengths || []).map((item) => `- ${item}`).join('\n')}

Areas for Improvement:
${(weaknesses || []).map((item) => `- ${item}`).join('\n')}

Return JSON:
{
  "summary": "2-3 sentence summary",
  "key_takeaways": ["takeaway1", "takeaway2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "next_steps": ["step1", "step2"],
  "recommendation": "proceed/needs_improvement/strong_candidate"
}`;

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = response.content?.[0]?.text || '';
  const parsed = extractJson(responseText);

  if (!parsed) {
    throw new Error('Failed to parse Claude response for session report generation');
  }

  return parsed;
};
