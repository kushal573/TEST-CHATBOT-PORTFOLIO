(() => {
  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = form.querySelector('.chat-send');

  const history = [];

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
    promptSpan.textContent = role === 'user' ? 'you$' : role === 'error' ? '!!' : 'maya$';
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
    row.innerHTML = '<span class="chat-prompt">maya$</span><span class="chat-text">thinking…</span>';
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user', message);
    history.push({ role: 'user', content: message });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    const typingRow = appendTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      typingRow.remove();

      if (!res.ok) {
        appendMessage('error', data.error || 'Something went wrong. Please try again.');
        return;
      }

      appendMessage('bot', data.reply);
      history.push({ role: 'assistant', content: data.reply });
    } catch (err) {
      typingRow.remove();
      appendMessage('error', 'Could not reach the server. Please try again.');
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });
})();
