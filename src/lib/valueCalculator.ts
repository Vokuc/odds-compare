import { OddsMarket } from '@/types';

/**
 * Convert decimal odds to implied probability
 * Formula: Implied Probability = 1 / Odds
 */
export function oddsToProbability(odds: number): number {
  if (odds <= 0) return 0;
  return 1 / odds;
}

/**
 * Calculate value percentage
 * Formula: (Your Probability / Market Probability) - 1
 * Positive value means good value
 */
export function calculateValuePercentage(
  yourOdds: number,
  marketAverageOdds: number
): number {
  const yourProb = oddsToProbability(yourOdds);
  const marketProb = oddsToProbability(marketAverageOdds);

  if (marketProb === 0) return 0;

  return (yourProb / marketProb - 1) * 100;
}

/**
 * Determine value level based on percentage
 */
export function getValueLevel(valuePercentage: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (valuePercentage >= 5) return 'HIGH';
  if (valuePercentage >= 1) return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate market average odds from multiple bookmakers
 */
export function calculateMarketAverage(odds: number[]): number {
  if (odds.length === 0) return 0;
  const probabilities = odds.map(oddsToProbability);
  const avgProbability = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;
  if (avgProbability === 0) return 0;
  return 1 / avgProbability;
}

/**
 * Generate human-readable value recommendation
 */
export function getValueRecommendation(
  valuePercentage: number,
  valueLevel: string
): string {
  if (valueLevel === 'HIGH') {
    return `Excellent value! ${valuePercentage.toFixed(1)}% better than market average.`;
  }
  if (valueLevel === 'MEDIUM') {
    return `Good value. ${valuePercentage.toFixed(1)}% above market.`;
  }
  return `Market-rate odds. Limited edge detected.`;
}
