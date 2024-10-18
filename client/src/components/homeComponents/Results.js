// Results.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGetAllFeedbackMutation } from "../../lib/feedbackApi";
import { useSelector } from "react-redux";
import "../../Styles/Result.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const [npsData, setNpsData] = useState({});

  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.userState);
  const [getAllFeedback, { data, error, isSuccess, isLoading }] =
    useGetAllFeedbackMutation();

  console.log(pathname);

  useEffect(() => {
    if (user || pathname === "/result") {
      getAllFeedback(user?.apiToken);
    }
  }, [pathname]);

  useEffect(() => {
    if (isSuccess && data?.npsAnalytics) {
      setNpsData({
        labels: ["Promoters", "Passive", "Detractors"],
        datasets: [
          {
            label: "# of Votes",
            data: [
              data?.npsAnalytics?.promoters || 0,
              data?.npsAnalytics?.passive || 0,
              data?.npsAnalytics?.detractors || 0,
            ],
            backgroundColor: ["#34D399", "#FBBF24", "#EF4444"],
            borderColor: ["#34D399", "#FBBF24", "#EF4444"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [isSuccess]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: { enabled: true },
    },
  };
  console.log(data);
  console.log(error);

  return (
    <div className="results-page">
      <div className="results-header">
        <h1 className="results-title">NPS Results Dashboard</h1>
        <p className="results-description">
          Detailed breakdown of your NPS feedback
        </p>
      </div>

      {isSuccess && data?.npsAnalytics && npsData?.datasets?.length > 0 && (
        <div className="results-container">
          <div className="results-row">
            <div className="results-chart-column">
              <div className="chart-wrapper">
                <Doughnut data={npsData} options={options} />
              </div>
            </div>
            <div className="results-stats-column">
              <div className="stats-card main-score">
                <h2>Current NPS Score</h2>
                <span className="score-value">
                  {data.npsAnalytics.currentNpsScore || 0}
                </span>
              </div>

              <div className="stats-grid">
                <div className="stats-card promoters">
                  <h3>Promoters</h3>
                  <div className="stat-numbers">
                    <span className="count">{data.npsAnalytics.promoters}</span>
                    <span className="percentage">
                      {data?.npsAnalytics?.promotersPercentage || 0}%
                    </span>
                  </div>
                </div>

                <div className="stats-card passive">
                  <h3>Passive</h3>
                  <div className="stat-numbers">
                    <span className="count">{data.npsAnalytics.passive}</span>
                    <span className="percentage">
                      {Math.round(
                        (data?.npsAnalytics?.passive /
                          data?.npsAnalytics?.totalFeedback) *
                          100
                      ) || 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="stats-card detractors">
                  <h3>Detractors</h3>
                  <div className="stat-numbers">
                    <span className="count">
                      {data?.npsAnalytics?.detractors || 0}
                    </span>
                    <span className="percentage">
                      {data.npsAnalytics.detractorsPercentage || 0}%
                    </span>
                  </div>
                </div>

                <div className="stats-card total">
                  <h3>Total Feedback</h3>
                  <span className="count">
                    {data.npsAnalytics.totalFeedback || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
