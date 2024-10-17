import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGetAllFeedbackMutation } from "../../lib/feedbackApi";
import { useSelector } from "react-redux";

//register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const { user } = useSelector((state) => state.userState);
  const [getAllFeedback, { data, error, isLoading }] =
    useGetAllFeedbackMutation();
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    getAllFeedback();
  }, []);



  console.log(data);

  const dummyData = {
    labels: ["Promoters", "Passive", "Detractors"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3],
        backgroundColor: ["green", "orange", "red"],
        borderColor: ["green", "orange", "red"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: { enabled: true },
    },
  };

  return (
    <div>
      <h1>Results</h1>
      <p>Here are your results.</p>

      <Doughnut data={dummyData} options={options} />
    </div>
  );
};

export default Results;
