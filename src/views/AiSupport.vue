<script setup>
import { ref, nextTick } from 'vue';
import { aiService } from '@/services/aiService';

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

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

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
  isTyping.value = true;
  await scrollToBottom();

  // Create an initial empty message for the AI to stream into
  const aiMsgId = Date.now() + 1;
  messages.value.push({
    id: aiMsgId,
    text: '',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  try {
    const msgIndex = messages.value.findIndex(m => m.id === aiMsgId);
    
    // Consume the stream generator from aiService
    const stream = aiService.streamResponse(userText, messages.value);
    
    for await (const chunk of stream) {
      messages.value[msgIndex].text += chunk;
      
      // Smart scroll: only scroll if the user is already near the bottom
      const container = chatContainer.value;
      if (container.scrollHeight - container.scrollTop < container.clientHeight + 100) {
        scrollToBottom();
      }
    }
  } catch (error) {
    const msg = messages.value.find(m => m.id === aiMsgId);
    if (msg) msg.text = "_Note:_ Connection lost. Please check your system status.";
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};

const getAnalysis = async () => {
  if (messages.value.length < 4 || isTyping.value) return;
  
  isTyping.value = true;
  const aiMsgId = Date.now();
  messages.value.push({
    id: aiMsgId,
    text: '',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  try {
    const msgIndex = messages.value.findIndex(m => m.id === aiMsgId);
    const stream = aiService.streamResponse("summary", messages.value);
    
    for await (const chunk of stream) {
      messages.value[msgIndex].text += chunk;
      scrollToBottom();
    }
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};

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
             <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12,2L4,5V11C4,16.19 7.41,20.87 12,22C16.59,20.87 20,16.19 20,11V5L12,2M12,14.5H9V12.5H12V9.5H14V12.5H17V14.5H14V17.5H12V14.5Z" /></svg>
           </button>
           <div class="bot-status">
             <span class="status-dot"></span>
             <span class="status-text">Attentive</span>
           </div>
        </div>
      </header>

      <div class="analysis-toolbar">
        <div class="insight-pill">
          <span class="pill-label">Shared Thoughts:</span>
          <span class="pill-value">{{ messages.length }}</span>
        </div>
        <button @click="getAnalysis" class="analysis-btn" :disabled="messages.length < 4 || isTyping">
          <span class="sparkle">✨</span> Reflect on Session
        </button>
      </div>

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
    </div>
  </div>
</template>

<style scoped>
/* Added styles for the new header actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f0fdf4;
  color: #10b981;
}


<style scoped>
.ai-support-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.chat-window {
  width: 100%;
  max-width: 800px;
  height: 750px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 30px 60px -12px rgba(16, 185, 129, 0.1);
  border: 1px solid #f0fdf4;
}

.chat-header {
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-logo-circle {
  width: 48px;
  height: 48px;
  background: #10b981;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.header-text h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #064e3b;
}

.version { font-size: 0.7rem; color: #94a3b8; margin-left: 5px; }

.logic-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.analysis-toolbar {
  padding: 12px 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insight-pill {
  font-size: 0.75rem;
  background: white;
  padding: 6px 14px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
}

.analysis-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.analysis-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.chat-display {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #fff;
}

.message-row { display: flex; width: 100%; }
.message-row.user { justify-content: flex-end; }
.message-row.ai { justify-content: flex-start; }

.bubble-wrapper { max-width: 80%; display: flex; flex-direction: column; }
.user .bubble-wrapper { align-items: flex-end; }

.bubble {
  padding: 16px 20px;
  border-radius: 20px;
  font-size: 1rem;
  line-height: 1.6;
}

.user .bubble {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #dbeafe;
  border-bottom-right-radius: 4px;
}

.ai .bubble {
  background: #f0fdf4;
  color: #065f46;
  border: 1px solid #dcfce7;
  border-bottom-left-radius: 4px;
}

/* Specific styling for the AI summary headers */
:deep(.insight-heading) {
  font-size: 1.1rem;
  margin: 8px 0;
  color: #047857;
  border-bottom: 1px solid #dcfce7;
  padding-bottom: 4px;
}

.timestamp {
  font-size: 0.65rem;
  color: #94a3b8;
  margin-top: 5px;
}

.chat-input-wrapper {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 1rem;
}

input {
  flex: 1;
  padding: 16px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus { border-color: #10b981; background: #fff; }

.send-btn {
  background: #10b981;
  color: white;
  border: none;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) { background: #059669; transform: scale(1.05); }

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-left: 6px; }

.typing .dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.4s infinite;
}
.typing .dot:nth-child(2) { animation-delay: 0.2s; }
.typing .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
</style>