type ScoreWeights = {
  easeWeight: number;
  competitionWeight: number;
  saturationWeight: number;
  offerWeight: number;
  commissionWeight: number;
};

type ScoreInputs = {
  easeOfFilming: number;
  competitionLevel: number;
  saturationLevel: number;
  offerAttractiveness: number;
  commissionPercent: number;
};

export function computeProductScore(input: ScoreInputs, weights: ScoreWeights) {
  const normalizedCompetition = 100 - input.competitionLevel * 10;
  const normalizedSaturation = 100 - input.saturationLevel * 10;
  const normalizedEase = input.easeOfFilming * 10;
  const normalizedOffer = input.offerAttractiveness * 10;
  const normalizedCommission = Math.min(input.commissionPercent * 5, 100);

  const totalWeight =
    weights.easeWeight +
    weights.competitionWeight +
    weights.saturationWeight +
    weights.offerWeight +
    weights.commissionWeight;

  const rawScore =
    normalizedEase * weights.easeWeight +
    normalizedCompetition * weights.competitionWeight +
    normalizedSaturation * weights.saturationWeight +
    normalizedOffer * weights.offerWeight +
    normalizedCommission * weights.commissionWeight;

  const totalScore = Math.max(0, Math.min(100, Math.round(rawScore / totalWeight)));

  return {
    totalScore,
    scoreBreakdown: [
      `Độ dễ quay: ${normalizedEase}/100`,
      `Độ cạnh tranh quy đổi: ${normalizedCompetition}/100`,
      `Độ bão hòa quy đổi: ${normalizedSaturation}/100`,
      `Độ hấp dẫn offer: ${normalizedOffer}/100`,
      `Hoa hồng quy đổi: ${normalizedCommission}/100`,
    ].join("\n"),
  };
}
