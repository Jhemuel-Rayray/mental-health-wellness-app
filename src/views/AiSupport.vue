<script setup>
import { ref, nextTick } from 'vue';
import { aiService } from '@/services/aiService';

const newMessage = ref('');
const chatContainer = ref(null);
const isTyping = ref(false);

const messages = ref([
  { 
    id: 1, 
    text: "I'm MindfulBot. Systems are online. I'm ready to help you analyze and navigate your day. What's on your mind?", 
    sender: 'ai' 
  }
]);

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return;

  const userText = newMessage.value;
  messages.value.push({ id: Date.now(), text: userText, sender: 'user' });
  
  newMessage.value = '';
  isTyping.value = true;
  await scrollToBottom();

  try {
    // Passes message and history to the new analytical engine
    const aiResponse = await aiService.getResponse(userText, messages.value);
    messages.value.push({ id: Date.now() + 1, text: aiResponse, sender: 'ai' });
  } catch (error) {
    messages.value.push({ 
      id: Date.now() + 1, 
      text: "Connection logic interrupted. Please retry your input.", 
      sender: 'ai' 
    });
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};

// New function to manually trigger the summary analysis from aiService
const getAnalysis = async () => {
  isTyping.value = true;
  const summary = await aiService.getResponse("summary", messages.value);
  messages.value.push({ id: Date.now(), text: summary, sender: 'ai' });
  isTyping.value = false;
  await scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};
</script>

<template>
  <div class="ai-support-container page-fade-in">
    <div class="glass-card chat-window">
      
      <header class="chat-header">
        <div class="title-with-logo">
          <div class="bot-logo-circle">🤖</div>
          <div class="header-text">
            <h2>MindfulBot</h2>
            <span class="logic-tag">Analytical Intelligence</span>
          </div>
        </div>
        
        <div class="bot-status">
          <span class="status-dot"></span>
          <span>Core Systems Active</span>
        </div>
      </header>

      <div class="analysis-toolbar">
        <div class="insight-pill">
          <span class="pill-label">Total Data Points:</span>
          <span class="pill-value">{{ messages.length }}</span>
        </div>
        <button @click="getAnalysis" class="analysis-btn" :disabled="messages.length < 4">
          ✨ Generate Session Insight
        </button>
      </div>

      <div class="chat-display" ref="chatContainer">
        <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.sender]">
          <div class="avatar" v-if="msg.sender === 'ai'">🤖</div>
          <div class="bubble" v-html="msg.text.replace(/\n/g, '<br>')">
            </div>
        </div>

        <div v-if="isTyping" class="message-row ai">
          <div class="avatar">🤖</div>
          <div class="bubble typing">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="chat-input-wrapper">
        <input 
          v-model="newMessage" 
          placeholder="Enter task, feeling, or observation..." 
          :disabled="isTyping"
        />
        <button type="submit" :disabled="!newMessage.trim() || isTyping">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.ai-support-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 20px;
}

.chat-window {
  width: 100%;
  max-width: 700px;
  height: 650px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.chat-header {
  padding: 1.2rem 2rem;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-with-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-text h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.logic-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: #3498db;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bot-logo-circle {
  width: 42px;
  height: 42px;
  background: #f0f7ff;
  border-radius: 12px; /* Square-ish for a tech feel */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  border: 1px solid #d6eaff;
}

/* Analysis Toolbar Styles */
.analysis-toolbar {
  padding: 10px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insight-pill {
  font-size: 0.75rem;
  background: white;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
}

.pill-label { color: #888; margin-right: 5px; }
.pill-value { color: #2c3e50; font-weight: 700; }

.analysis-btn {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.analysis-btn:hover:not(:disabled) {
  background: #34495e;
  transform: translateY(-1px);
}

.analysis-btn:disabled {
  background: #eee;
  color: #bbb;
  cursor: not-allowed;
}

/* Chat display and bubbles */
.chat-display {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.message-row { display: flex; gap: 12px; max-width: 85%; }
.message-row.user { align-self: flex-end; flex-direction: row-reverse; }
.message-row.ai { align-self: flex-start; }

.bubble {
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.user .bubble {
  background: #f0f0f0;
  color: #2c3e50;
  border-bottom-right-radius: 4px;
}

.ai .bubble {
  background: #f4f9ff;
  color: #2c3e50;
  border: 1px solid #e1efff;
  border-bottom-left-radius: 4px;
}

.chat-input-wrapper {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

input {
  flex: 1;
  padding: 14px 20px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #f9f9f9;
  outline: none;
}

button[type="submit"] {
  background: #2c3e50;
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #42b983;
  border-radius: 50%;
  animation: pulse 2s infinite;
  display: inline-block;
  margin-right: 5px;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(66, 185, 131, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(66, 185, 131, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 185, 131, 0); }
}

.typing span { animation: dot-blink 1.4s infinite; font-weight: bold; }
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
</style>