<script setup>
import { ref, computed } from 'vue';

const selectedCategory = ref('All');
const searchQuery = ref('');
const categories = ['All', 'Mindfulness', 'Physical', 'Sleep', 'Digital'];

const articles = [
  { 
    id: 1, 
    category: 'Mindfulness', 
    title: 'The Art of Mindful Observation', 
    desc: 'Deconstruct internal patterns by observing thoughts as objective data points.',
    time: '4 min read',
    icon: '🧘',
    recommended: true
  },
  { 
    id: 2, 
    category: 'Physical', 
    title: 'Vagus Nerve Reset', 
    desc: 'The biological logic of the nervous system and how to manually trigger calm.',
    time: '6 min read',
    icon: '⚡',
    recommended: false
  },
  { 
    id: 3, 
    category: 'Sleep', 
    title: 'Circadian Logic', 
    desc: 'Optimizing your biological clock through light-exposure timing and temperature.',
    time: '5 min read',
    icon: '🌙',
    recommended: true
  },
  { 
    id: 4, 
    category: 'Digital', 
    title: 'Dopamine Architecture', 
    desc: 'How digital interfaces hijack focus and the logical steps to reclaim your attention.',
    time: '3 min read',
    icon: '📱',
    recommended: false
  }
];

// Dual-filtering: Category + Search
const filteredArticles = computed(() => {
  return articles.filter(article => {
    const matchesCategory = selectedCategory.value === 'All' || article.category === selectedCategory.value;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          article.desc.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});
</script>

<template>
  <div class="wellness-container page-fade-in">
    <header class="wellness-header">
      <div class="intel-badge">Knowledge Base v2.0</div>
      <h1>Wellness Intelligence</h1>
      <p>Systematic resources for cognitive and physical optimization.</p>
    </header>

    <div class="control-panel glass-card">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" placeholder="Search keywords (e.g., 'dopamine', 'stress')..." />
      </div>
      
      <div class="filter-bar">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectedCategory = cat"
          :class="['filter-btn', { active: selectedCategory === cat }]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <transition-group name="list" tag="div" class="resource-grid">
      <div 
        v-for="article in filteredArticles" 
        :key="article.id" 
        class="resource-card"
      >
        <div class="card-inner glass-card">
          <div v-if="article.recommended" class="rec-badge">Best for Focus</div>
          <div class="card-icon">{{ article.icon }}</div>
          <div class="card-content">
            <span class="category-tag">{{ article.category }}</span>
            <h3>{{ article.title }}</h3>
            <p>{{ article.desc }}</p>
            <div class="card-footer">
              <span class="read-time">⏱️ {{ article.time }}</span>
              <button class="read-btn">Access Data</button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <div v-if="filteredArticles.length === 0" class="no-results">
      <p>No resources found for "{{ searchQuery }}". Try adjusting your parameters.</p>
    </div>
  </div>
</template>

<style scoped>
.wellness-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px;
}

.wellness-header {
  text-align: center;
  margin-bottom: 50px;
}

.intel-badge {
  display: inline-block;
  background: #f0f7ff;
  color: #007aff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 15px;
  text-transform: uppercase;
  border: 1px solid #d6eaff;
}

.wellness-header h1 {
  font-size: 2.8rem;
  color: #1a1a1a;
  letter-spacing: -1px;
}

/* Control Panel with Search */
.control-panel {
  padding: 20px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.search-wrapper {
  width: 100%;
  max-width: 600px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.search-wrapper input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #fdfdfd;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.search-wrapper input:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid #eee;
  background: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  color: #555;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

/* Resource Cards */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.resource-card {
  position: relative;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.resource-card:hover {
  transform: translateY(-8px);
}

.card-inner {
  height: 100%;
  padding: 0;
  overflow: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

.rec-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #2c3e50;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  z-index: 10;
}

.card-icon {
  font-size: 2.5rem;
  padding: 40px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.card-content {
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: #007aff;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.card-content h3 {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  color: #2c3e50;
}

.card-content p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f9f9f9;
}

.read-time { font-size: 0.8rem; color: #aaa; font-weight: 500; }

.read-btn {
  background: #f0f7ff;
  color: #007aff;
  border: 1px solid #d6eaff;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.read-btn:hover {
  background: #007aff;
  color: white;
}

.no-results {
  text-align: center;
  padding: 50px;
  color: #999;
}

/* Transitions */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
</style>