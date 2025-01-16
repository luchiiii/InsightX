const calculateNPS = (feedbacks) => {
  let report = {
    promoters: 0,
    passive: 0,
    detractors: 0,
    currentNpsScore: 0,
  };

  for (let feedback of feedbacks) {
    if (feedback?.feedback && feedback?.feedback.length > 0) {
      for (let response of feedback?.feedback) {
        if (response.score === 9 || response.score === 10) {
          report.promoters += 1;
        } else if (response.score === 7 || response.score === 8) {
          report.passive += 1;
        } else {
          report.detractors += 1;
        }
      }
    }
  }

  const totalFeedback = report.promoters + report.detractors + report.passive;

  const overallReport = {
    ...report,
    promotersPercentage: Math.round((report.promoters / totalFeedback) * 100),
    detractorsPercentage: Math.round((report.detractors / totalFeedback) * 100),
    totalFeedback,
  };

  return {
    ...overallReport,
    currentNpsScore:
      overallReport.promotersPercentage - overallReport.detractorsPercentage,
  };
};

module.exports = { calculateNPS };
