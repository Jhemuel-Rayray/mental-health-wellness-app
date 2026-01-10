<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue' // Add this import
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main class="container">
      <RouterView />
    </main>
    <Footer /> </div>
</template>

<style>
/* Using a Flexbox shell ensures the footer stays at the bottom */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.container {
  flex: 1; /* This pushes the footer down */
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}
</style>