(() => {
  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = form.querySelector('.chat-send');

  let resume = null;
  fetch('resume.json').then((r) => r.json()).then((data) => { resume = data; });

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  closeBtn.addEventListener('click', () => setOpen(false));

  function appendMessage(role, text) {
    const row = document.createElement('div');
    row.className = `chat-msg ${role}`;
    const promptSpan = document.createElement('span');
    promptSpan.className = 'chat-prompt';
    promptSpan.textContent = role === 'user' ? 'you$' : role === 'error' ? '!!' : 'kushal$';
    const textSpan = document.createElement('span');
    textSpan.className = 'chat-text';
    textSpan.textContent = text;
    row.append(promptSpan, textSpan);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function appendTyping() {
    const row = document.createElement('div');
    row.className = 'chat-msg typing';
    row.innerHTML = '<span class="chat-prompt">kushal$</span><span class="chat-text">typing…</span>';
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  // --- Answer generation, built entirely from resume.json ---

  // Whole-word matching only: plain substring checks would match "api" inside
  // "capital" or "your" inside a project title full of common words.
  const STOPWORDS = new Set([
    'the', 'and', 'with', 'from', 'your', 'have', 'what', 'about', 'this',
    'that', 'were', 'been', 'into', 'their', 'you', 'are', 'for', 'who',
    'how', 'can', 'ask', 'tell', 'me', 'a', 'an', 'of', 'is', 'in', 'on',
    'to', 'did', 'does', 'do', 'app', 'system', 'website', 'platform',
    'know', 'knows', 'knew', 'used', 'using', 'use',
  ]);

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function hasWord(text, word) {
    return new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(text);
  }

  function meaningfulWords(str, minLen) {
    return str
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= minLen && !STOPWORDS.has(w));
  }

  function firstName() {
    return resume.name.split(' ')[0];
  }

  function listExperience() {
    const lines = resume.experience.map(
      (e) => `${e.title} at ${e.company} (${e.dates})`
    );
    return `I've spent 3+ years across four companies: ${lines.join('; ')}. Ask me about any one of these by name and I'll go deeper.`;
  }

  function introduceSelf() {
    const current = resume.experience[0];
    return `Hi, I'm ${resume.name}, a ${resume.role} based in ${resume.location}. ${resume.summary} Right now I'm ${current.title} at ${current.company}. Ask me about my experience, skills, projects, or education for more.`;
  }

  function findCompany(text) {
    return resume.experience.find((e) =>
      meaningfulWords(e.company, 4).some((word) => hasWord(text, word))
    );
  }

  function describeCompany(e) {
    return `At ${e.company} (${e.dates}) I worked as ${e.title}. Highlights: ${e.highlights.join(' ')}`;
  }

  function listSkills() {
    const cats = Object.entries(resume.skills)
      .map(([cat, { level, tools }]) => `${cat} (self-rated ${level}: ${tools.join(', ')})`)
      .join('; ');
    return `Here's how I'd rate my own coverage: ${cats}. I also work with ${resume.languagesAndTools.join(', ')}.`;
  }

  function findSkillCategory(text) {
    return Object.entries(resume.skills).find(([, { tools }]) =>
      meaningfulWords(tools.join(' '), 4).some((word) => hasWord(text, word))
    );
  }

  function listProjects() {
    const lines = resume.projects.map((p) => `${p.title} (${p.company}) — ${p.description}`);
    return `A few projects I've worked on: ${lines.join(' | ')}`;
  }

  function findProject(text) {
    return resume.projects.find((p) =>
      meaningfulWords(p.title, 4).some((word) => hasWord(text, word))
    );
  }

  function describeEducation() {
    return resume.education
      .map((e) => `${e.degree} from ${e.school} (${e.detail})`)
      .join(' ');
  }

  function describeContact() {
    return `Best way to reach me: email at ${resume.email} or phone ${resume.phone}. I'm based in ${resume.location}. LinkedIn: ${resume.links.linkedin} · GitHub: ${resume.links.github} · Portfolio: ${resume.links.portfolio}`;
  }

  function describeRecommendation() {
    const r = resume.recommendation;
    return r ? `${r.name}, ${r.title}, has recommended me on ${r.via} — happy to point you to it.` : "I don't have a recommendation listed right now.";
  }

  const INTENTS = [
    { test: (t) => /^(hi|hello|hey|sup|yo)\b/.test(t), answer: () => `Hey! Ask me about my experience, skills, projects, education, or how to reach me.` },
    { test: (t) => /(who are you|are you\s.*\b(a\s+)?(bot|real|ai)\b|\bhuman\b)/.test(t), answer: () => `I'm a small script on ${firstName()}'s portfolio that matches your question to answers pulled straight from his résumé — not a language model, just quick lookups. For anything I can't answer, email works best.` },
    { test: (t) => /(introduce yourself|tell me about yourself|about yourself|who is kushal|your background|elevator pitch)/.test(t), answer: introduceSelf },
    { test: (t) => findCompany(t) !== undefined, answer: (t) => describeCompany(findCompany(t)) },
    { test: (t) => findProject(t) !== undefined, answer: (t) => {
        const p = findProject(t);
        return `${p.title} (${p.company}): ${p.description} ${p.note}.`;
      } },
    { test: (t) => findSkillCategory(t) !== undefined, answer: (t) => {
        const [cat, { level, tools }] = findSkillCategory(t);
        return `${cat} — self-rated ${level}. Tools: ${tools.join(', ')}.`;
      } },
    { test: (t) => /(experience|work history|career|companies|jobs|background)/.test(t), answer: listExperience },
    { test: (t) => /(skill|tool|tech stack|automation|framework)/.test(t), answer: listSkills },
    { test: (t) => /(project|portfolio work|case stud)/.test(t), answer: listProjects },
    { test: (t) => /(education|degree|university|college|study|studied)/.test(t), answer: describeEducation },
    { test: (t) => /(recommend|reference|testimonial)/.test(t), answer: describeRecommendation },
    { test: (t) => /(contact|email|phone|reach|hire|linkedin|github|available|opportunit)/.test(t), answer: describeContact },
  ];

  function answer(userText) {
    const t = userText.toLowerCase();
    for (const intent of INTENTS) {
      if (intent.test(t)) return intent.answer(t);
    }
    return `I don't have a canned answer for that one. Try asking about my experience, skills, projects, or education — or email me directly at ${resume.email}.`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message || !resume) return;

    appendMessage('user', message);
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    const typingRow = appendTyping();

    setTimeout(() => {
      typingRow.remove();
      appendMessage('bot', answer(message));
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }, 350 + Math.random() * 350);
  });
})();
