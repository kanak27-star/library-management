import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [annualData, setAnnualData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnnualData();
    fetchMonthlyData(selectedYear);
  }, [selectedYear]);

  const fetchAnnualData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/api/counts
/annual');
      const data = await response.json();
      // Fill in missing years from 2020 to 2025 with 0
      const annualCounts = {};
      for (let year = 2020; year <= 2025; year++) {
        annualCounts[year] = 0;
      }
      data.forEach(item => {
        if (item._id >= 2020 && item._id <= 2025) {
          annualCounts[item._id] = item.count;
        }
      });
      const filledData = Object.keys(annualCounts).map(year => ({
        _id: parseInt(year),
        count: annualCounts[year]
      }));
      setAnnualData(filledData);
    } catch (error) {
      console.error('Error fetching annual data:', error);
    }
  };

  const fetchMonthlyData = async (year) => {
    try {
      const response = await fetch(`http://localhost:3000/api/api/counts
/monthly/${year}`);
      const data = await response.json();
      // Fill in missing months with 0
      const monthlyCounts = Array(12).fill(0);
      data.forEach(item => {
        monthlyCounts[item._id - 1] = item.count;
      });
      setMonthlyData(monthlyCounts.map((count, index) => ({ _id: index + 1, count })));
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const annualChartData = {
    labels: annualData.map(item => item._id),
    datasets: [
      {
        label: 'Books Borrowed',
        data: annualData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Books Borrowed',
        data: monthlyData.map(item => item.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Book Borrowing Statistics',
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Library Statistics</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Annual Book Borrowings</h3>
        <Bar data={annualChartData} options={options} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Monthly Book Borrowings for {selectedYear}</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="mb-4 p-2 border rounded"
        >
          {annualData.map(item => (
            <option key={item._id} value={item._id}>{item._id}</option>
          ))}
        </select>
        <Line data={monthlyChartData} options={options} />
      </div>
    </div>
  );
};

export default Charts;