<script setup>
import { ref, onUnmounted } from 'vue';

const instruction = ref('Press Start to Begin');
const isRunning = ref(false);
const phase = ref(''); // 'inhale', 'hold', 'exhale'
const timer = ref(0);

// Use a separate variable to control the loop to avoid ref bugs
let loopActive = false;

const startBreathing = async () => {
  isRunning.value = true;
  loopActive = true;
  
  while (loopActive) {
    // 1. INHALE (4s)
    phase.value = 'inhale';
    instruction.value = 'Inhale deeply...';
    await runCountdown(4);
    if (!loopActive) break;
    
    // 2. HOLD (7s)
    phase.value = 'hold';
    instruction.value = 'Hold...';
    await runCountdown(7);
    if (!loopActive) break;
    
    // 3. EXHALE (8s)
    phase.value = 'exhale';
    instruction.value = 'Exhale slowly...';
    await runCountdown(8);
  }
};

// Helper function for the timer logic
const runCountdown = (seconds) => {
  timer.value = seconds;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      timer.value--;
      if (timer.value <= 0 || !loopActive) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
};

const stopBreathing = () => {
  isRunning.value = false;
  loopActive = false;
  phase.value = '';
  instruction.value = 'Session Stopped';
  timer.value = 0;
};

// Clean up if component is destroyed
onUnmounted(() => stopBreathing());
</script>

<template>
  <div class="breathing-container glass-card">
    <div class="intel-badge">Respiratory Protocol: 4-7-8</div>
    <h2>Deep Breathing</h2>
    
    <div class="status-box">
      <p class="instruction">{{ instruction }}</p>
      <p v-if="isRunning" class="timer">{{ timer }}s</p>
    </div>

    <div class="circle-container">
      <div class="outer-ring"></div>
      <div :class="['circle', phase]"></div>
    </div>

    <div class="controls">
      <button v-if="!isRunning" @click="startBreathing" class="btn start">Initialize Protocol</button>
      <button v-else @click="stopBreathing" class="btn stop">Terminate</button>
    </div>
  </div>
</template>

<style scoped>
.breathing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 400px;
  margin: 0 auto;
}

.intel-badge {
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}

.status-box {
  height: 80px;
  margin-top: 20px;
}

.instruction {
  font-size: 1.2rem;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
}

.timer {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4f46e5;
  margin-top: 5px;
}

.circle-container {
  height: 320px;
  width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  position: relative;
}

.outer-ring {
  position: absolute;
  width: 250px;
  height: 250px;
  border: 2px dashed #e2e8f0;
  border-radius: 50%;
}

.circle {
  width: 100px;
  height: 100px;
  background-color: #4f46e5;
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.3);
  /* Use linear for breathing to avoid jerky starts */
  transition: all linear; 
}

/* Logic Phases */
.inhale {
  transform: scale(2.5);
  transition-duration: 4s;
  background-color: #818cf8;
}

.hold {
  transform: scale(2.5);
  background-color: #4f46e5;
}

.exhale {
  transform: scale(1);
  transition-duration: 8s;
  background-color: #10b981;
}

.controls {
  margin-top: 20px;
}

.btn {
  padding: 14px 40px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s, background 0.2s;
}

.btn:active { transform: scale(0.95); }

.start { background-color: #1e293b; color: white; }
.stop { background-color: #ef4444; color: white; }
</style>