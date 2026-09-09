import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

export const getAITasks = async (req, res, next) => {
  try {
    res.json({ message: 'AI task tracking is available', tasks: [] });
  } catch (error) {
    next(error);
  }
};

export const generateQuestions = async (req, res, next) => {
  try {
    const { session_id } = req.body;

    const prompt = `Generate 6 interview questions based on the session ${session_id}. Return JSON with an array of question objects.`;

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0]?.text || '';

    res.json({ message: 'Questions generated', data: text });
  } catch (error) {
    next(error);
  }
};
