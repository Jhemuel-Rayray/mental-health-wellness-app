<script setup>
import { ref } from 'vue';

const instruction = ref('Press Start to Begin');
const isRunning = ref(false);
const phase = ref(''); // 'inhale', 'hold', 'exhale'

const startBreathing = async () => {
  isRunning.ref = true;
  while (isRunning.ref) {
    // Inhale
    phase.value = 'inhale';
    instruction.value = 'Inhale deeply...';
    await new Promise(r => setTimeout(r, 4000));
    
    // Hold
    phase.value = 'hold';
    instruction.value = 'Hold your breath...';
    await new Promise(r => setTimeout(r, 7000));
    
    // Exhale
    phase.value = 'exhale';
    instruction.value = 'Exhale slowly...';
    await new Promise(r => setTimeout(r, 8000));
  }
};

const stopBreathing = () => {
  isRunning.value = false;
  phase.value = '';
  instruction.value = 'Session Stopped';
};
</script>

<template>
  <div class="breathing-container">
    <h2>Guided Breathing</h2>
    <p class="instruction">{{ instruction }}</p>

    <div class="circle-container">
      <div :class="['circle', phase]"></div>
    </div>

    <div class="controls">
      <button v-if="!isRunning" @click="startBreathing" class="btn start">Start</button>
      <button v-else @click="stopBreathing" class="btn stop">Stop</button>
    </div>
  </div>
</template>

<style scoped>
.breathing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.circle-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

.circle {
  width: 100px;
  height: 100px;
  background-color: #42b983;
  border-radius: 50%;
  opacity: 0.6;
  transition: all ease-in-out;
}

/* Animation Phases */
.inhale {
  transform: scale(2.5);
  transition-duration: 4s;
  background-color: #81c784;
}

.hold {
  transform: scale(2.5);
  background-color: #4db6ac;
}

.exhale {
  transform: scale(1);
  transition-duration: 8s;
  background-color: #42b983;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
}

.start { background-color: #42b983; color: white; }
.stop { background-color: #e57373; color: white; }
</style>