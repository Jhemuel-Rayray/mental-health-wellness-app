<script setup>
import { ref, computed } from 'vue';

// --- STATE MANAGEMENT ---
const selectedCategory = ref('All');
const searchQuery = ref('');
const activeNode = ref(null);

// --- CATEGORIES ---
const categories = ['All', 'Cognitive', 'Biological', 'Digital', 'Emotional', 'Nutrition', 'Productivity'];

// --- DATA REPOSITORY ---
const articles = [
  { 
    id: 1, 
    category: 'Cognitive', 
    title: 'The 5-Minute Rule Logic', 
    desc: 'Lower the activation energy for tasks by committing to just 300 seconds of focus.',
    content: 'The 5-Minute Rule works by bypassing the biological resistance to starting a task. By committing to only 5 minutes, you reduce the perceived "cognitive load." Statistics show that 80% of users continue working once the initial 300-second threshold is passed because the brain prefers completing an active loop over starting a new one.',
    time: '3 min read',
    icon: '🧠',
    recommended: true,
    tags: ['Productivity', 'Focus']
  },
  { 
    id: 2, 
    category: 'Biological', 
    title: 'Cortisol Management Reset', 
    desc: 'The biological logic of the nervous system and how to manually trigger calm via the Vagus nerve.',
    content: 'The Vagus Nerve serves as the internal highway for the parasympathetic nervous system. To manually trigger a "reset," utilize the physiological sigh: two quick inhales through the nose followed by a long, slow exhale through the mouth. This mechanical action offloads CO2 and signals the brain to lower the heart rate immediately.',
    time: '6 min read',
    icon: '⚡',
    recommended: false,
    tags: ['Physiology', 'Stress']
  },
  { 
    id: 3, 
    category: 'Digital', 
    title: 'Dopamine Architecture', 
    desc: 'Deconstruct how digital interfaces hijack focus and the steps to reclaim your attention.',
    content: 'Modern interfaces use "Variable Reward Schedules" to keep users engaged. Reclaiming focus requires intentional "Digital Friction"—removing biometrics for social apps, turning your screen to grayscale, or using the "20-foot rule" (placing the device 20 feet away during deep work blocks).',
    time: '4 min read',
    icon: '📱',
    recommended: true,
    tags: ['Focus', 'Tech']
  },
  { 
    id: 4, 
    category: 'Emotional', 
    title: 'Cognitive Reframing Protocol', 
    desc: 'Identify logical fallacies in emotional processing to restructure negative thought patterns.',
    content: 'Cognitive reframing involves identifying "cognitive distortions" like all-or-nothing thinking or catastrophizing. By objectively labeling the thought as a "data point" rather than an absolute truth, the prefrontal cortex can override the amygdala’s emotional response.',
    time: '7 min read',
    icon: '🎭',
    recommended: true,
    tags: ['EQ', 'Mindset']
  },
  { 
    id: 5, 
    category: 'Nutrition', 
    title: 'Brain-Fuel Optimization', 
    desc: 'Specific nutritional inputs that support neuroplasticity and long-term cognitive health.',
    content: 'Neuroplasticity is supported by BDNF (Brain-Derived Neurotrophic Factor). High-quality Omega-3 fatty acids, polyphenols from dark berries, and maintaining stable blood glucose levels are the primary "hardware updates" required for peak synaptic performance.',
    time: '5 min read',
    icon: '🥗',
    recommended: false,
    tags: ['Bio-Fuel', 'Neuro']
  },
  { 
    id: 6, 
    category: 'Productivity', 
    title: 'Eisenhower Matrix Logic', 
    desc: 'A systematic method for sorting tasks by urgency and importance to prevent decision fatigue.',
    content: 'The Eisenhower Matrix forces a logical binary choice: Is it Urgent? Is it Important? By automating or delegating "Urgent but Not Important" tasks, you protect your "Deep Work" sessions for "Important but Not Urgent" strategic growth.',
    time: '4 min read',
    icon: '📊',
    recommended: false,
    tags: ['Workflow', 'Systems']
  }
];

// --- LOGIC ---
const openNode = (article) => {
  activeNode.value = article;
  document.body.style.overflow = 'hidden';
};

const closeNode = () => {
  activeNode.value = null;
  document.body.style.overflow = 'auto';
};

const filteredArticles = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  return articles.filter(article => {
    const matchesCategory = selectedCategory.value === 'All' || article.category === selectedCategory.value;
    const matchesSearch = !query || 
                          article.title.toLowerCase().includes(query) || 
                          article.tags.some(t => t.toLowerCase().includes(query)) ||
                          article.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
});
</script>

<template>
  <div class="wellness-container">
    <header class="wellness-header">
      <div class="intel-badge">Intelligence Repository v2.6</div>
      <h1>Systematic Wellness</h1>
      <p>Data-driven resources to optimize your mental hardware.</p>
    </header>

    <div class="control-panel">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" placeholder="Query knowledge base..." />
      </div>
      <div class="filter-wrapper">
        <div class="filter-bar">
          <button 
            v-for="cat in categories" :key="cat"
            @click="selectedCategory = cat"
            :class="['filter-btn', { active: selectedCategory === cat }]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <transition-group name="list" tag="div" class="resource-grid">
      <div 
        v-for="article in filteredArticles" 
        :key="article.id" 
        class="resource-card"
        @click="openNode(article)"
      >
        <div class="card-inner">
          <div v-if="article.recommended" class="rec-badge">High Impact</div>
          <div class="card-icon-wrapper">
            <div class="card-icon">{{ article.icon }}</div>
          </div>
          <div class="card-content">
            <div class="meta-row">
              <span class="category-tag">{{ article.category }}</span>
              <span class="read-time">⏱️ {{ article.time }}</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.desc }}</p>
            <div class="tag-cloud">
               <span v-for="tag in article.tags" :key="tag" class="small-tag">#{{ tag }}</span>
            </div>
            <div class="card-footer">
              <span class="action-text">View</span>
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <div v-if="filteredArticles.length === 0" class="no-data">
      <p>No intelligence nodes found.</p>
    </div>

    <teleport to="body">
      <transition name="modal">
        <div v-if="activeNode" class="modal-overlay" @click.self="closeNode">
          <div class="modal-window">
            <button class="close-x" @click="closeNode">✕</button>
            <div class="modal-header">
              <span class="modal-icon">{{ activeNode.icon }}</span>
              <span class="category-tag">{{ activeNode.category }} Node</span>
              <h2>{{ activeNode.title }}</h2>
            </div>
            <div class="modal-body">
              <p>{{ activeNode.content }}</p>
            </div>
            <div class="modal-footer">
              <button class="done-btn" @click="closeNode">Close Node</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.wellness-container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
.wellness-header { text-align: center; margin-bottom: 50px; }
.intel-badge { display: inline-block; background: #eef2ff; color: #4f46e5; font-size: 0.7rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 15px; text-transform: uppercase; border: 1px solid #e0e7ff; }
.wellness-header h1 { font-size: 2.8rem; color: #1e293b; letter-spacing: -1px; }

.control-panel { padding: 30px; margin-bottom: 40px; border-radius: 24px; display: flex; flex-direction: column; gap: 20px; align-items: center; background: white; border: 1px solid #f1f5f9; }
.search-wrapper { width: 100%; max-width: 600px; position: relative; }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); opacity: 0.5; }
.search-wrapper input { width: 100%; padding: 14px 15px 14px 45px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; outline: none; transition: all 0.2s; }
.search-wrapper input:focus { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

.filter-wrapper { width: 100%; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
.filter-bar { display: flex; gap: 10px; justify-content: center; min-width: max-content; }
.filter-btn { padding: 8px 18px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #64748b; transition: all 0.3s; }
.filter-btn.active { background: #1e293b; color: white; border-color: #1e293b; }

.resource-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
.resource-card { cursor: pointer; }
.card-inner { height: 100%; display: flex; flex-direction: column; border-radius: 24px; overflow: hidden; position: relative; transition: all 0.3s; border: 1px solid #f1f5f9; background: white; }

.rec-badge { position: absolute; top: 15px; right: 15px; background: #4f46e5; color: white; font-size: 0.6rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; z-index: 10; }
.card-icon-wrapper { padding: 40px; background: #f8fafc; text-align: center; }
.card-icon { font-size: 3rem; transition: transform 0.4s; }

.card-content { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; text-align: left; }
.meta-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
.category-tag { font-size: 0.65rem; font-weight: 800; color: #4f46e5; text-transform: uppercase; }
.read-time { font-size: 0.75rem; color: #94a3b8; }

.card-content h3 { margin: 0 0 10px 0; font-size: 1.4rem; color: #1e293b; }
.card-content p { font-size: 0.95rem; color: #64748b; line-height: 1.6; margin-bottom: 20px; }

.tag-cloud { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.small-tag { font-size: 0.65rem; background: #f1f5f9; padding: 3px 10px; border-radius: 6px; color: #64748b; }

.card-footer { margin-top: auto; padding-top: 15px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; }
.action-text { font-size: 0.85rem; font-weight: 800; color: #4f46e5; text-transform: uppercase; }
.arrow { color: #4f46e5; transition: transform 0.3s; }

.resource-card:hover .card-inner { transform: translateY(-10px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #e0e7ff; }
.resource-card:hover .card-icon { transform: scale(1.1); }
.resource-card:hover .arrow { transform: translateX(5px); }
.resource-card:active .card-inner { transform: scale(0.97); }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; }
.modal-window { background: white; max-width: 650px; width: 100%; border-radius: 28px; padding: 40px; position: relative; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.4); }
.close-x { position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }
.modal-header { text-align: center; margin-bottom: 25px; }
.modal-icon { font-size: 3rem; display: block; margin-bottom: 10px; }
.modal-body p { font-size: 1.1rem; line-height: 1.8; color: #475569; text-align: left; }
.modal-footer { margin-top: 25px; text-align: right; }
.done-btn { background: #1e293b; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; }

/* Transitions */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>