const calculateNPS = (feedbackArray) => {
  if (!feedbackArray || feedbackArray.length === 0) {
    return {
      promoters: 0,
      passive: 0,
      detractors: 0,
      promotersPercentage: 0,
      passivePercentage: 0,
      detractorsPercentage: 0,
      totalResponses: 0,
      npsScore: 0,
    };
  }

  let promoters = 0;
  let passive = 0;
  let detractors = 0;
  let ratingCount = 0;

  feedbackArray.forEach((feedback) => {
    if (feedback.responses && Array.isArray(feedback.responses)) {
      feedback.responses.forEach((response) => {
        if (response.type === "rating" && typeof response.answer === "number") {
          ratingCount++;
          const score = response.answer;

          if (score >= 9) {
            promoters++;
          } else if (score >= 7) {
            passive++;
          } else {
            detractors++;
          }
        }
      });
    }
  });

  const totalResponses = promoters + passive + detractors;

  if (totalResponses === 0) {
    return {
      promoters: 0,
      passive: 0,
      detractors: 0,
      promotersPercentage: 0,
      passivePercentage: 0,
      detractorsPercentage: 0,
      totalResponses: 0,
      npsScore: 0,
    };
  }

  const promotersPercentage = Math.round((promoters / totalResponses) * 100);
  const passivePercentage = Math.round((passive / totalResponses) * 100);
  const detractorsPercentage = Math.round((detractors / totalResponses) * 100);
  const npsScore = promotersPercentage - detractorsPercentage;

  return {
    promoters,
    passive,
    detractors,
    promotersPercentage,
    passivePercentage,
    detractorsPercentage,
    totalResponses,
    npsScore,
  };
};

module.exports = { calculateNPS };
