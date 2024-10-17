// utils/npsCalculator.js

const calculateNPSForQuestions = (feedbacks) => {
    // Initialize results object to store questions and their responses
    const questionResponses = {};
    let totalOrganizationScore = 0;
    let totalQuestions = 0;

    // First, group all scores by question
    feedbacks.forEach(feedback => {
        feedback.feedback.forEach(question => {
            const { questionText, score } = question;
            
            if (!questionResponses[questionText]) {
                questionResponses[questionText] = {
                    scores: [],
                    totalScore: 0,
                    averageScore: 0,
                    totalResponses: 0,
                    promoters: 0,
                    passives: 0,
                    detractors: 0,
                    npsScore: 0
                };
            }
            
            questionResponses[questionText].scores.push(score);
            questionResponses[questionText].totalScore += score;
            totalOrganizationScore += score;
            totalQuestions++;
        });
    });

    // Calculate statistics for each question
    const results = {
        overallStats: {
            averageOrganizationScore: totalQuestions > 0 ? 
                Math.round((totalOrganizationScore / totalQuestions) * 10) / 10 : 0,
            totalResponses: feedbacks.length
        },
        questionStats: {}
    };

    // Calculate detailed stats for each question
    for (const [questionText, data] of Object.entries(questionResponses)) {
        const totalResponses = data.scores.length;
        
        // Calculate promoters, passives, and detractors
        data.scores.forEach(score => {
            if (score >= 9) data.promoters++;
            else if (score >= 7) data.passives++;
            else data.detractors++;
        });

        // Calculate percentages and scores
        const promoterPercentage = (data.promoters / totalResponses) * 100;
        const detractorPercentage = (data.detractors / totalResponses) * 100;
        const averageScore = data.totalScore / totalResponses;

        results.questionStats[questionText] = {
            totalResponses: totalResponses,
            totalScore: data.totalScore,
            averageScore: Math.round(averageScore * 10) / 10,
            promoters: data.promoters,
            passives: data.passives,
            detractors: data.detractors,
            promoterPercentage: Math.round(promoterPercentage),
            passivePercentage: Math.round((data.passives / totalResponses) * 100),
            detractorPercentage: Math.round(detractorPercentage),
            npsScore: Math.round(promoterPercentage - detractorPercentage)
        };
    }

    return results;
};

module.exports = { calculateNPSForQuestions };