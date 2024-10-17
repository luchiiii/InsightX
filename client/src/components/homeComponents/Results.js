// import React, { useEffect, useState } from 'react';
// import { useGetAllFeedbackMutation } from '../../lib/feedbackApi';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const Results = () => {
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [getAllFeedback] = useGetAllFeedbackMutation();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getAllFeedback();
//         const processedData = processDataForChart(response.data);
//         setFeedbackData(processedData);
//       } catch (error) {
//         console.error('Error fetching feedback:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const processDataForChart = (data) => {
//     return data.map((feedback, index) => ({
//       name: `Feedback ${index + 1}`,
//       satisfaction: feedback.scores[0],
//       recommendation: feedback.scores[1],
//       easeOfUse: feedback.scores[2],
//     }));
//   };

//   return (
//     <div className="results-container p-4">
//       <h1>Feedback Results</h1>
      
//       <div className="chart-container" style={{ height: '400px' }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={feedbackData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis domain={[0, 10]} />
//             <Tooltip />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="satisfaction" 
//               stroke="#8884d8" 
//               name="Satisfaction"
//             />
//             <Line 
//               type="monotone" 
//               dataKey="recommendation" 
//               stroke="#82ca9d" 
//               name="Recommendation"
//             />
//             <Line 
//               type="monotone" 
//               dataKey="easeOfUse" 
//               stroke="#ffc658" 
//               name="Ease of Use"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Results;