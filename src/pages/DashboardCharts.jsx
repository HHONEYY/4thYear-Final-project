import React, { useState, useEffect } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import ChartCard from "../components/ChartCard";
import courseData from "../assets/courseData.json"; // ใช้ JSON จาก import

const DashboardCharts = () => {
  const [barData, setBarData] = useState(null);
  const [doughnutData, setDoughnutData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000, // ตั้งค่าให้อนิเมชั่นทำงาน 1 วินาที
        easing: "easeInOutQuad", // ทำให้การเคลื่อนไหวดูนุ่มนวล
    },
};


  useEffect(() => {
    try {
      console.log("Data received:", courseData);

      if (!Array.isArray(courseData)) {
        console.error("Data is not an array:", courseData);
        return;
      }

      // คำนวณค่ารวมของ "ลงทะเบียน" และ "รับ"
      let totalRegistered = 0;
      let totalCapacity = 0;

      courseData.forEach((course) => {
        totalRegistered += parseInt(course["ลงทะเบียน"], 10) || 0;
        totalCapacity += parseInt(course["รับ"], 10) || 0;
      });

      console.log("Total Registered:", totalRegistered);
      console.log("Total Capacity:", totalCapacity);

      // อัปเดต Doughnut Chart
      setDoughnutData({
        labels: ["ลงทะเบียน", "รับ"],
        datasets: [
          {
            data: [totalRegistered, totalCapacity],
            backgroundColor: ["#92B9BD", "#A8D4AD"],
            borderWidth: 2,
          },
        ],
      });

      // คำนวณค่า Bar Chart
      const registeredCounts = { M: 0, Tu: 0, W: 0, Th: 0, F: 0, Sat: 0, Sun: 0, "-": 0 };
      const capacityCounts = { M: 0, Tu: 0, W: 0, Th: 0, F: 0, Sat: 0, Sun: 0, "-": 0 };

      courseData.forEach((course) => {
        if (course["วัน"]) {
          registeredCounts[course["วัน"]] += parseInt(course["ลงทะเบียน"], 10) || 0;
          capacityCounts[course["วัน"]] += parseInt(course["รับ"], 10) || 0;
        }
      });

      setBarData({
        labels: Object.keys(registeredCounts),
        datasets: [
          {
            label: "ลงทะเบียน",
            data: Object.values(registeredCounts),
            backgroundColor: "#92B9BD",
          },
          {
            label: "รับ",
            data: Object.values(capacityCounts),
            backgroundColor: "#A8D4AD",
          },
        ],
      });

      // คำนวณค่า Line Chart
      const years = ["2564", "2565", "2566"];
      const registeredPerYear = { "2564": 0, "2565": 0, "2566": 0 };
      const capacityPerYear = { "2564": 0, "2565": 0, "2566": 0 };

      courseData.forEach((course) => {
        if (course["ปีการศึกษา"]) {
          const year = course["ปีการศึกษา"];
          if (registeredPerYear[year] !== undefined) {
            registeredPerYear[year] += parseInt(course["ลงทะเบียน"], 10) || 0;
            capacityPerYear[year] += parseInt(course["รับ"], 10) || 0;
          }
        }
      });

      console.log("Registered Per Year:", registeredPerYear);
      console.log("Capacity Per Year:", capacityPerYear);

      setLineData({
        labels: years,
        datasets: [
          {
            label: "ลงทะเบียน",
            data: years.map((year) => registeredPerYear[year]),
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            fill: true,
          },
          {
            label: "รับได้",
            data: years.map((year) => capacityPerYear[year]),
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.2)",
            fill: true,
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error processing data:", error);
      setLoading(false);
    }
  }, []);

  // Event Handler สำหรับคลิก Doughnut Chart
  const handleDoughnutClick = (event, elements) => {
    if (!elements.length) {
      setSelectedCategory(null);
      return;
    }

    const index = elements[0].index;
    const clickedLabel = doughnutData.labels[index];

    console.log("Clicked on:", clickedLabel);
    setSelectedCategory(clickedLabel);
  };

  // ฟังก์ชันกรองข้อมูล Bar Chart
  const getFilteredBarData = () => {
    if (!barData || !selectedCategory) return barData;

    const datasetIndex = selectedCategory === "ลงทะเบียน" ? 0 : 1;
    return {
      labels: barData.labels,
      datasets: [barData.datasets[datasetIndex]],
    };
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    onClick: handleDoughnutClick,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " คน";
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="charts-container">
      {/* Doughnut Chart */}
      <div className="chart-card">
        <ChartCard title="ภาพรวมการลงทะเบียนและรับ (คลิกเพื่อกรองข้อมูล)">
          <div className="chart-card-components">
            {loading ? <p>Loading...</p> : <Doughnut data={doughnutData} options={donutOptions} />}
          </div>
        </ChartCard>
      </div>

      {/* Bar Chart */}
      <div className="chart-card">
        <ChartCard title={`จำนวนนักศึกษาที่${selectedCategory ? selectedCategory : "ลงทะเบียนและรับ"}ในแต่ละวัน`}>
          <div className="chart-card-components">
            {loading ? <p>Loading...</p> : <Bar data={getFilteredBarData()} options={{ responsive: true, maintainAspectRatio: false }} />}
          </div>
        </ChartCard>
      </div>

      {/* Line Chart */}
      <div className="chart-card">
        <ChartCard title="แนวโน้มการลงทะเบียน">
          <div className="chart-card-components">
            {loading ? <p>Loading...</p> : <Line data={lineData} options={lineOptions} />}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardCharts;
