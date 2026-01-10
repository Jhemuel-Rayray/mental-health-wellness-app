<script setup>
import { ref, computed } from 'vue';

const selectedMood = ref(null);
const moods = [
  { emoji: '✨', label: 'Energized', color: '#fff9c4', suggestion: 'wellness' },
  { emoji: '🧘', label: 'Calm', color: '#e8f5e9', suggestion: 'wellness' },
  { emoji: '😔', label: 'Low', color: '#e3f2fd', suggestion: 'support' },
  { emoji: '😫', label: 'Stressed', color: '#ffecb3', suggestion: 'breathing' }
];

const selectMood = (mood) => {
  selectedMood.value = mood;
};

// Logic to suggest a specific page based on mood
const suggestionLink = computed(() => {
  if (!selectedMood.value) return null;
  const map = {
    wellness: { text: 'Explore Wellness Tips', path: '/wellness' },
    support: { text: 'Talk to MindfulBot', path: '/ai-support' },
    breathing: { text: 'Try a Breathing Exercise', path: '/breathing' }
  };
  return map[selectedMood.value.suggestion];
});
</script>

<template>
  <div class="home-wrapper page-fade-in">
    <header class="hero">
      <h1>Your Mindful Space</h1>
      <p>A quiet corner of the internet for your mental well-being.</p>
    </header>

    <div class="glass-card mood-container">
      <h3>How are you checking in today?</h3>
      <div class="mood-grid">
        <button 
          v-for="mood in moods" 
          :key="mood.label"
          @click="selectMood(mood)"
          :class="['mood-card', { active: selectedMood?.label === mood.label }]"
          :style="{ '--mood-color': mood.color }"
        >
          <span class="emoji">{{ mood.emoji }}</span>
          <span class="label">{{ mood.label }}</span>
        </button>
      </div>

      <transition name="slide-up">
        <div v-if="selectedMood" class="suggestion-box">
          <p>It's okay to feel <strong>{{ selectedMood.label.toLowerCase() }}</strong>. We've got something for you:</p>
          <RouterLink :to="suggestionLink.path" class="btn-primary">
            {{ suggestionLink.text }}
          </RouterLink>
        </div>
      </transition>
    </div>

    <section class="quick-actions">
      <RouterLink to="/breathing" class="action-card">
        <div class="icon">🌬️</div>
        <h4>Focus</h4>
      </RouterLink>
      <RouterLink to="/wellness" class="action-card">
        <div class="icon">🌿</div>
        <h4>Learn</h4>
      </RouterLink>
      <RouterLink to="/ai-support" class="action-card">
        <div class="icon">🤖</div>
        <h4>Chat</h4>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home-wrapper {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero {
  padding: 40px 0;
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(45deg, #2c3e50, #42b983);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.mood-container {
  padding: 40px;
  margin-bottom: 40px;
}

.mood-grid {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.mood-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 20px;
  padding: 15px;
  width: 100px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mood-card:hover {
  transform: translateY(-5px);
  border-color: #42b983;
}

.mood-card.active {
  background-color: var(--mood-color);
  border-color: #42b983;
  box-shadow: 0 10px 20px rgba(66, 185, 131, 0.1);
}

.emoji { font-size: 2rem; }
.label { font-size: 0.8rem; font-weight: bold; margin-top: 5px; color: #555; }

.suggestion-box {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-primary {
  display: inline-block;
  margin-top: 15px;
  background: #42b983;
  color: white;
  padding: 12px 28px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.3);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.action-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  text-decoration: none;
  color: #333;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.action-card:hover {
  background: #f9f9f9;
  border-color: #42b983;
}

.action-card .icon { font-size: 1.5rem; margin-bottom: 5px; }

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s ease-out;
}
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }

@media (max-width: 600px) {
  .quick-actions { grid-template-columns: 1fr; }
}
</style>