// src/services/aiService.js

export const aiService = {
  usedResponses: new Set(),
  
  // Track logical patterns across the session
  sessionMetrics: {
    productivityBlocks: 0,
    biologicalFactors: 0,
    cognitiveDistortions: 0,
    totalInteractions: 0
  },

  async getResponse(userMessage, history) {
    return new Promise((resolve) => {
      // Simulate variable cognitive processing time
      const delay = Math.min(Math.max(userMessage.length * 12, 600), 1500);
      setTimeout(() => {
        resolve(this.processLogic(userMessage, history));
      }, delay);
    });
  },

  processLogic(input, history) {
    const text = input.toLowerCase();
    this.sessionMetrics.totalInteractions++;

    // 1. ANALYTICAL SUMMARY (The "Big Picture" Intelligence)
    if (this.containsAny(text, ["summary", "analyze", "patterns", "insight"])) {
      return this.generateAnalyticalInsight();
    }

    // 2. PRODUCTIVITY STRATEGY (The Eisenhower & Pomodoro Logic)
    if (this.containsAny(text, ["busy", "procrastinate", "too much", "list", "work", "tasks"])) {
      this.sessionMetrics.productivityBlocks++;
      return this.pickSmartResponse("productivity");
    }

    // 3. BIOSYSTEM AUDIT (Physical-Mental Link)
    if (this.containsAny(text, ["tired", "sleep", "energy", "focus", "fog", "exhausted"])) {
      this.sessionMetrics.biologicalFactors++;
      return this.pickSmartResponse("biological");
    }

    // 4. LOGICAL REFRAMING (Identifying Cognitive Fallacies)
    if (this.containsAny(text, ["always", "never", "failure", "everyone", "bad at", "worst"])) {
      this.sessionMetrics.cognitiveDistortions++;
      return this.pickSmartResponse("cognitive_reframing");
    }

    // 5. FEATURE INTEGRATION
    if (this.containsAny(text, ["breathe", "panic", "relax", "calm"])) {
      return "I'm detecting a need for immediate physiological regulation. Based on your input, I recommend pausing our chat for a 2-minute **Breathing Exercise**. Shall we switch to Focus mode?";
    }

    // 6. ADAPTIVE INQUIRY
    if (history.length > 8) {
      return "We've analyzed several angles of this situation. If we were to apply a 'First Principles' approach, what is the single most basic truth we are working with here?";
    }

    return "That's a helpful data point. To understand the logic behind this better: is this an internal obstacle you're facing, or an external constraint?";
  },

  generateAnalyticalInsight() {
    const { productivityBlocks, biologicalFactors, cognitiveDistortions } = this.sessionMetrics;
    
    if (this.sessionMetrics.totalInteractions < 4) {
      return "I need a bit more data before I can provide a structural analysis of our conversation. Let's explore a few more thoughts first.";
    }

    let report = "### 🧠 Analytical Session Summary\n\n";
    
    // Logic to determine the primary bottleneck
    if (productivityBlocks > biologicalFactors && productivityBlocks > cognitiveDistortions) {
      report += "Your current bottleneck appears to be **Executive Function**. You are likely struggling with task prioritization rather than a lack of ability.";
    } else if (biologicalFactors > productivityBlocks) {
      report += "Our data suggests a **Physiological Drain**. Your mental friction might be a symptom of sleep debt or low glucose levels rather than a psychological block.";
    } else {
      report += "I'm detecting a pattern of **Cognitive Filtering**. You are applying 'absolute' logic (always/never) to temporary situations.";
    }

    report += "\n\nWould you like to deep-dive into a specific strategy for the primary issue identified?";
    return report;
  },

  responses: {
    productivity: [
      "When a list feels too long, the brain enters 'freeze' mode. Have you tried the **5-Minute Rule**? Commit to working on just one task for 300 seconds. You can stop after that.",
      "Logically, we can't do everything. Apply the **Eisenhower Matrix**: what is the one task that is truly *Important* but not yet *Urgent*? That's where your focus belongs.",
      "You're experiencing 'Decision Fatigue.' Stop trying to choose what to do next. Just do the smallest, easiest task on the list to regain momentum."
    ],
    biological: [
      "Intelligence is chemical. If you're feeling 'brain fog,' your prefrontal cortex might be depleted. A 10-minute walk or 500ml of water often resets focus better than caffeine.",
      "Check your 'Bio-Logic': When was your last meal or significant break? Low blood sugar mimics the symptoms of high-stress anxiety.",
      "Sleep debt is cumulative. If your logic feels 'slow' today, your brain is likely prioritizing basic survival over high-level processing. How was your rest last night?"
    ],
    cognitive_reframing: [
      "I noticed an absolute term ('always'/'never'). Factually, is this a universal truth, or a **Cognitive Distortion** based on a single data point?",
      "Let's look at the evidence objectively. What are three times in the past where the outcome contradicted what you are feeling right now?",
      "You're treating a feeling as a fact. Logically, a feeling is just a temporary chemical signal. What does the objective *evidence* say about your situation?"
    ]
  },

  pickSmartResponse(category) {
    const options = this.responses[category];
    const available = options.filter(opt => !this.usedResponses.has(opt));
    if (available.length === 0) {
      options.forEach(opt => this.usedResponses.delete(opt));
      return options[Math.floor(Math.random() * options.length)];
    }
    const selection = available[Math.floor(Math.random() * available.length)];
    this.usedResponses.add(selection);
    return selection;
  },

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }
};