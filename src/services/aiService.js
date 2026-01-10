export const aiService = {
  usedResponses: new Set(),
  
  sessionMetrics: {
    productivityBlocks: 0,
    biologicalFactors: 0,
    cognitiveDistortions: 0,
    stressSignals: 0,
    totalInteractions: 0
  },

  /**
   * API-Style Streaming Generator
   * Yields text word-by-word
   */
  async *streamResponse(userMessage, history) {
    const fullText = this.processLogic(userMessage, history);
    const words = fullText.split(' ');
    
    for (const word of words) {
      // Simulate 'token' generation speed (30ms - 80ms per word)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
      yield word + ' ';
    }
  },

  processLogic(input, history) {
    const text = input.toLowerCase();
    this.sessionMetrics.totalInteractions++;

    if (this.containsAny(text, ["summary", "analyze", "patterns", "insight"])) {
      return this.generateAnalyticalInsight();
    }

    // Mapping intents to responses
    let category = "general_support";
    if (this.containsAny(text, ["stressed", "overwhelmed", "anxious", "panic"])) {
      this.sessionMetrics.stressSignals++;
      category = "supportive_reset";
    } else if (this.containsAny(text, ["busy", "procrastinate", "work", "tasks"])) {
      this.sessionMetrics.productivityBlocks++;
      category = "productivity";
    } else if (this.containsAny(text, ["tired", "sleep", "energy", "fog"])) {
      this.sessionMetrics.biologicalFactors++;
      category = "biological";
    } else if (this.containsAny(text, ["always", "never", "failure"])) {
      this.sessionMetrics.cognitiveDistortions++;
      category = "cognitive_reframing";
    }

    return category === "general_support" 
      ? "I have logged that observation. To support you effectively: are we looking for a **tactical move** or just a **mental reset**?"
      : this.pickSmartResponse(category);
  },

  generateAnalyticalInsight() {
    const { productivityBlocks, biologicalFactors, cognitiveDistortions, stressSignals } = this.sessionMetrics;
    if (this.sessionMetrics.totalInteractions < 3) return "Insufficient data nodes. Share more context for a full diagnostic.";

    let report = "### 🌿 Well-being Diagnostic\n\n";
    if (stressSignals > 0) report += "**Status:** [High Pressure Detected].\n";
    
    if (biologicalFactors >= productivityBlocks) {
      report += "**Root Cause:** Biological Resource Drain. Prioritize sleep/hydration over task-logic.";
    } else {
      report += "**Root Cause:** Cognitive Load. Your system is over-capacity. Apply the 5-minute rule.";
    }
    return report;
  },

  responses: {
    supportive_reset: [
      "**Validation:** This pressure is objectively high. What is the *smallest* action you can take to feel 1% safer right now?",
      "**System Reset:** I detect an 'Overwhelm Loop.' Take 3 slow breaths. I will wait until your heart rate stabilizes."
    ],
    productivity: [
      "**Strategy:** Try the **5-Minute Rule**. Focus for 300 seconds. If momentum fails, terminate the task and pivot.",
      "**Strategy:** Distinguish between 'Urgent Noise' and 'Strategic Importance.' Focus only on the latter."
    ],
    biological: [
      "**Hardware Check:** Brain fog is a resource shortage. Reset with 500ml of water or a 10-minute walk.",
      "**Hardware Check:** If your battery is at 10%, expecting 100% output is a logic error. Prioritize rest."
    ],
    cognitive_reframing: [
      "**Reframing:** You used an absolute ('always'). Is this a universal truth, or a temporary feeling?",
      "**Reframing:** Evidence check: name one time where the outcome was different than what you feel now."
    ]
  },

  pickSmartResponse(category) {
    const options = this.responses[category];
    const available = options.filter(opt => !this.usedResponses.has(opt));
    if (available.length === 0) this.usedResponses.clear();
    const selection = available[0] || options[0];
    this.usedResponses.add(selection);
    return selection;
  },

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }
};