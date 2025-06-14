export function computeScore(details: Record<string, number>): number {
  // Example: weight unsafe categories more heavily
  const weights: Record<string, number> = {
    porn: 0.5,
    hentai: 0.2,
    sexy: 0.2,
    neutral: 0.05,
    drawing: 0.05,
    toxic: 0.5,
    insult: 0.2,
    threat: 0.2,
    identity_hate: 0.1,
    safe: 0.1,
    unsafe: 0.9,
  };
  let score = 1;
  for (const [cat, value] of Object.entries(details)) {
    if (weights[cat]) {
      score -= value * weights[cat];
    }
  }
  return Math.max(0, Math.min(1, score));
}
