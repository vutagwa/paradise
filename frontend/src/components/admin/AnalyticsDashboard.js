import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import '../../styles/AnalyticsDasboard.css'; // Import your CSS file

// ChartJS registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [eWasteData, setEWasteData] = useState([]);
  const [hotspotData, setHotspotData] = useState([]);
  const [filter, setFilter] = useState({ date: "", area: "" });

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();

      // Fetch e-waste trends data with optional date filter
      let eWasteQuery = collection(db, "eWasteTrends");
      if (filter.date) {
        eWasteQuery = query(eWasteQuery, where("date", "==", filter.date));
      }
      const eWasteSnapshot = await getDocs(eWasteQuery);
      const eWasteList = eWasteSnapshot.docs.map(doc => doc.data());
      setEWasteData(eWasteList);

      // Fetch hotspots data with optional area filter
      let hotspotQuery = collection(db, "hotspots");
      if (filter.area) {
        hotspotQuery = query(hotspotQuery, where("location", "==", filter.area));
      }
      const hotspotSnapshot = await getDocs(hotspotQuery);
      const hotspotList = hotspotSnapshot.docs.map(doc => doc.data());
      
      // Sort by total e-waste and get top 5 hotspots
      hotspotList.sort((a, b) => b.totalEWaste - a.totalEWaste);
      const top5Hotspots = hotspotList.slice(0, 5);
      setHotspotData(top5Hotspots);
    };

    fetchData();
  }, [filter]);

  const handleDateChange = (e) => {
    setFilter({ ...filter, date: e.target.value });
  };

  const handleAreaChange = (e) => {
    setFilter({ ...filter, area: e.target.value });
  };

  // Preparing e-waste trends data for the line chart
  const eWasteChartData = {
    labels: eWasteData.map(data => data.date),
    datasets: [
      {
        label: "E-Waste Generated (kg)",
        data: eWasteData.map(data => data.amount),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Preparing hotspot data for the bar chart
  const hotspotChartData = {
    labels: hotspotData.map(data => data.location),
    datasets: [
      {
        label: "Total E-Waste (kg)",
        data: hotspotData.map(data => data.totalEWaste),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  // Recommendations based on e-waste data
  const getRecommendations = () => {
    const totalWaste = eWasteData.reduce((acc, data) => acc + data.amount, 0);
    const avgWaste = totalWaste / (eWasteData.length || 1); // Prevent division by zero

    const highWasteHotspots = hotspotData.filter(hotspot => hotspot.totalEWaste > avgWaste);

    return (
      <div>
        <h3>Recommendations</h3>
        <ul>
          {highWasteHotspots.length > 0 ? (
            highWasteHotspots.map((hotspot, index) => (
              <li key={index}>
                Consider adding more collection points in <strong>{hotspot.location}</strong> where total e-waste exceeds the average.
              </li>
            ))
          ) : (
            <li>No specific recommendations at the moment. Continue monitoring the e-waste trends.</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      {/* Filters for Date and Area */}
      <div className="filters">
        <label>Date:</label>
        <input type="date" value={filter.date} onChange={handleDateChange} />
        
        <label>Area:</label>
        <select value={filter.area} onChange={handleAreaChange}>
          <option value="">Select Area</option>
          <option value="Nairobi Central">Nairobi Central</option>
          <option value="Nairobi West">Nairobi West</option>
          {/* Add more areas as needed */}
        </select>
      </div>

      {/* Line Chart for E-Waste Generation Trends */}
      <div>
        <h3>E-Waste Generation Trends</h3>
        <Line data={eWasteChartData} />
      </div>

      {/* Bar Chart for Top E-Waste Hotspots */}
      <div style={{ marginTop: "50px" }}>
        <h3>Top 5 E-Waste Hotspots</h3>
        <Bar data={hotspotChartData} />
      </div>

      {/* Recommendations Section */}
      <div style={{ marginTop: "50px" }}>
        {getRecommendations()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
