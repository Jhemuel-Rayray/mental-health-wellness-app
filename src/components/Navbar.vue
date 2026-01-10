<script setup>
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

// Helper to check if a link is active for custom styling
const isActive = (path) => route.path === path;
</script>

<template>
  <nav class="navbar-container">
    <div class="navbar-glass">
      <div class="logo">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">MindfulSpace</span>
      </div>

      <div class="nav-links">
        <RouterLink to="/" :class="['nav-item', { active: isActive('/') }]">
          Home
        </RouterLink>
        <RouterLink to="/breathing" :class="['nav-item', { active: isActive('/breathing') }]">
          Focus
        </RouterLink>
        <RouterLink to="/wellness" :class="['nav-item', { active: isActive('/wellness') }]">
          Learn
        </RouterLink>
        <RouterLink to="/ai-support" :class="['nav-item', { active: isActive('/ai-support') }]">
          Support
        </RouterLink>
      </div>

    
    </div>
  </nav>
</template>

<style scoped>
.navbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
}

.navbar-glass {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 1.2rem;
  color: #2c3e50;
}

.nav-links {
  display: flex;
  gap: 5px;
}

.nav-item {
  text-decoration: none;
  color: #666;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* Hover effects remain only for the navigation links */
.nav-item:hover {
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

.nav-item.active {
  color: #42b983;
  background: rgba(66, 185, 131, 0.1);
}


/* Mobile Responsiveness */
@media (max-width: 768px) {
  .logo-text, .nav-auth {
    display: none;
  }
  
  .navbar-glass {
    justify-content: center;
    padding: 0.5rem;
  }
}
</style>