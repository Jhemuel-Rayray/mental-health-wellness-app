<script setup>
import { ref, nextTick } from 'vue';
import { getAiMessage } from '@/services/aiService';

const newMessage = ref('');
const chatContainer = ref(null);
const isTyping = ref(false);

const messages = ref([
  { 
    id: 1, 
    text: "I'm **MindfulBot**. I'm here to support your well-being and help you navigate your day with clarity. How are you feeling in this moment?", 
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);

const mood = ref('');
const moodLoading = ref(false);

// Scroll chat to bottom
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

// Send normal chat message
const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return;

  const userText = newMessage.value;
  messages.value.push({ 
    id: Date.now(), 
    text: userText, 
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  newMessage.value = '';
  await nextTick();
  isTyping.value = true;

  // Placeholder AI message
  const aiMsgId = Date.now() + 1;
  messages.value.push({
    id: aiMsgId,
    text: '',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  try {
    const aiResponse = await getAiMessage(userText);
    const msgIndex = messages.value.findIndex(m => m.id === aiMsgId);

    for (let i = 0; i < aiResponse.length; i += 20) {
      messages.value[msgIndex].text += aiResponse.slice(i, i + 20);
      await new Promise(r => setTimeout(r, 50));
      scrollToBottom();
    }
  } catch (error) {
    const msg = messages.value.find(m => m.id === aiMsgId);
    if (msg) msg.text = "_Note:_ Connection lost. Please check your system status.";
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};

// Send mood support message
const askMoodSupport = async () => {
  if (!mood.value.trim() || isTyping.value) return;
  moodLoading.value = true;
  isTyping.value = true;

  const aiMsgId = Date.now();
  messages.value.push({
    id: aiMsgId,
    text: '',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  try {
    const response = await getAiMessage(
      "Give a supportive message for someone who feels: " + mood.value
    );

    const msgIndex = messages.value.findIndex(m => m.id === aiMsgId);
    for (let i = 0; i < response.length; i += 20) {
      messages.value[msgIndex].text += response.slice(i, i + 20);
      await new Promise(r => setTimeout(r, 50));
      scrollToBottom();
    }

    mood.value = '';
  } catch (error) {
    const msg = messages.value.find(m => m.id === aiMsgId);
    if (msg) msg.text = "_Note:_ AI could not generate a mood message.";
  } finally {
    moodLoading.value = false;
    isTyping.value = false;
    await scrollToBottom();
  }
};

// Download chat transcript
const downloadTranscript = () => {
  const content = messages.value
    .map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`)
    .join('\n\n');

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindful-session-${new Date().toISOString().slice(0,10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

// Format markdown text for display
const formatText = (text) => {
  return text
    .replace(/^### (.*$)/gim, '<h3 class="insight-heading">$1</h3>') 
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') 
    .replace(/_(.*)_/gim, '<em>$1</em>') 
    .replace(/\n/g, '<br>');
};
</script>

<template>
  <div class="ai-support-container page-fade-in">
    <div class="chat-window">

      <!-- Header -->
      <header class="chat-header">
        <div class="title-with-logo">
          <div class="bot-logo-circle">
            <span class="ai-icon">🌿</span>
          </div>
          <div class="header-text">
            <h2>MindfulBot <span class="version">v2.5</span></h2>
            <span class="logic-tag">Well-being Companion</span>
          </div>
        </div>
        <div class="header-actions">
          <button @click="downloadTranscript" class="icon-btn" title="Download Transcript">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12,2L4,5V11C4,16.19 7.41,20.87 12,22C16.59,20.87 20,16.19 20,11V5L12,2M12,14.5H9V12.5H12V9.5H14V12.5H17V14.5H14V17.5H12V14.5Z" />
            </svg>
          </button>
          <div class="bot-status">
            <span class="status-dot"></span>
            <span class="status-text">Attentive</span>
          </div>
        </div>
      </header>

      <!-- Chat Display -->
      <div class="chat-display" ref="chatContainer">
        <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.sender]">
          <div class="bubble-wrapper">
            <div class="bubble" v-html="formatText(msg.text)"></div>
            <span class="timestamp">{{ msg.timestamp }}</span>
          </div>
        </div>

        <div v-if="isTyping && messages[messages.length-1].text === ''" class="message-row ai">
          <div class="bubble-wrapper">
            <div class="bubble typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <form @submit.prevent="sendMessage" class="chat-input-wrapper">
        <input 
          v-model="newMessage" 
          placeholder="How are you feeling right now?" 
          :disabled="isTyping"
          autocomplete="off"
        />
        <button type="submit" class="send-btn" :disabled="!newMessage.trim() || isTyping">
          <svg viewBox="0 0 24 24" class="send-icon">
            <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </form>

      <!-- Mood Support Panel -->
      <div class="mood-support-panel p-4 mt-4 rounded-lg shadow-sm bg-gray-50">
        <h3 class="text-lg font-semibold mb-2">AI Mood Support</h3>
      
        <p class="text-xs text-gray-500 mt-2">
          ⚠️ This is not medical advice. For serious concerns, please consult a professional.
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Chat container */
.ai-support-container { display: flex; justify-content: center; padding: 2rem; }
.chat-window { width: 100%; max-width: 720px; height: 750px; display: flex; flex-direction: column; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }

/* Header */
.chat-header { padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.bot-logo-circle { width: 44px; height: 44px; background: #10b981; border-radius: 12px; display: flex; justify-content: center; align-items: center; color: white; font-size: 1.5rem; }
.header-text h2 { margin:0; font-size:1.25rem; color:#065f46; }
.version { font-size:0.7rem; color:#94a3b8; margin-left:4px; }
.logic-tag { font-size:0.7rem; font-weight:700; color:#10b981; }
.status-dot { width:8px; height:8px; background:#10b981; border-radius:50%; animation:pulse 2s infinite; }
.status-text { font-size:0.75rem; color:#64748b; margin-left:6px; }
@keyframes pulse { 0%,100% {transform:scale(1);opacity:1;} 50% {transform:scale(1.4);opacity:0.6;} }

/* Chat display */
.chat-display { flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem; background:#fefefe; }
.message-row { display:flex; width:100%; }
.message-row.user { justify-content:flex-end; }
.message-row.ai { justify-content:flex-start; }
.bubble-wrapper { max-width:70%; display:flex; flex-direction:column; }
.user .bubble-wrapper { align-items:flex-end; }
.bubble { padding:14px 18px; border-radius:20px; font-size:1rem; line-height:1.5; }
.user .bubble { background:#dbeafe; color:#1e40af; border-bottom-right-radius:4px; }
.ai .bubble { background:#dcfce7; color:#065f46; border-bottom-left-radius:4px; }
.typing .dot { width:6px; height:6px; background:#10b981; border-radius:50%; display:inline-block; margin:0 2px; animation:bounce 1.4s infinite; }
.typing .dot:nth-child(2) { animation-delay:0.2s; }
.typing .dot:nth-child(3) { animation-delay:0.4s; }
@keyframes bounce {0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}

/* Chat input */
.chat-input-wrapper { padding:1rem 1.5rem; display:flex; gap:0.75rem; background:#f9fafb; border-top:1px solid #e5e7eb; }
.chat-input-wrapper input { flex:1; padding:14px 16px; border:1px solid #d1d5db; border-radius:16px; outline:none; font-size:1rem; transition:border-color 0.2s; }
.chat-input-wrapper input:focus { border-color:#10b981; background:#fff; }
.send-btn { background:#10b981; color:white; width:50px; height:50px; border-radius:16px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.send-btn:hover:not(:disabled) { background:#059669; transform:scale(1.05); }

/* Mood panel */
.mood-support-panel textarea { resize:none; }
.mood-support-panel button:disabled { opacity:0.6; cursor:not-allowed; }
</style>
