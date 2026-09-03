require('dotenv').config();
const path = require('path');
const express = require('express');
const resume = require('./data/resume');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function buildSystemPrompt() {
  const exp = resume.experience
    .map((e) => `- ${e.title} at ${e.company} (${e.dates}): ${e.highlights.join(' ')} Stack: ${e.stack.join(', ')}.`)
    .join('\n');

  const skills = Object.entries(resume.skills)
    .map(([category, { level, tools }]) => `- ${category} (self-rated ${level}): ${tools.join(', ')}`)
    .join('\n');

  const projects = resume.projects
    .map((p) => `- ${p.title} (${p.company}): ${p.description} ${p.metric}.`)
    .join('\n');

  const education = resume.education
    .map((e) => `- ${e.degree}, ${e.school} (${e.detail})`)
    .join('\n');

  return `You are speaking AS ${resume.name}, a ${resume.role} based in ${resume.location}, on their personal \
portfolio website. Reply in first person ("I", "my"), in a direct, professional, and friendly tone — the way \
${resume.name.split(' ')[0]} would answer a recruiter or hiring manager in a chat.

Only use the résumé facts below to answer. Do not invent employers, dates, metrics, or skills that aren't listed. \
If something isn't covered by this résumé, say you don't have that detail handy and suggest reaching out by email \
(${resume.email}) for anything more specific. Keep answers concise — a few sentences, not an essay — unless the \
question asks for a full list.

SUMMARY
${resume.summary}

EXPERIENCE
${exp}

SKILLS
${skills}

SELECTED PROJECTS
${projects}

EDUCATION
${education}
${resume.recommendation ? `\nRECOMMENDATION\n- ${resume.recommendation.name}, ${resume.recommendation.title} (via ${resume.recommendation.via})` : ''}

Never break character to explain you are an AI model unless directly asked whether you are a real person or a bot \
— in that case, be honest: you're an AI assistant trained on ${resume.name.split(' ')[0]}'s résumé to answer \
questions on their behalf.`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

app.post('/api/chat', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing OPENAI_API_KEY. Add it to .env and restart the server.' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Expected a non-empty "messages" array.' });
  }

  const cleaned = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (cleaned.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...cleaned],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('OpenAI API error:', response.status, errBody);
      return res.status(502).json({ error: 'The chat service is temporarily unavailable. Please try again shortly.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'Received an empty response. Please try again.' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat request failed:', err);
    res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  if (!OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is not set. The chat widget will not work until you add it to .env.');
  }
});
