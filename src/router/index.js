import { createRouter, createWebHistory } from 'vue-router'

// 1. Import your views
import HomeView from '@/views/HomeView.vue'
// Direct imports are often safer for debugging blank screens
import Breathing from '@/views/Breathing.vue'
import Wellness from '@/views/Wellness.vue'
import AiSupport from '@/views/AiSupport.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/breathing',
    name: 'breathing',
    component: Breathing
  },
  {
    path: '/wellness',
    name: 'wellness',
    component: Wellness
  },
  {
   
    path: '/ai-support', 
    name: 'support',
    component: AiSupport
  }
]

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router