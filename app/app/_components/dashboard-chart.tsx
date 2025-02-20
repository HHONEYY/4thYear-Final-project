"use client"
import courseData from "@/app/_components/course-data.json";
import type { ChartData, ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { FC, useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import ChartCard from "./chart-card";
import ChartsContainer from "./chart-container";

interface CourseData {
  ลงทะเบียน: string;
  รับ: string;
  วัน: string;
  ปีการศึกษา: string;
  [key: string]: string;
}

interface DailyCount {
  M: number;
  Tu: number;
  W: number;
  Th: number;
  F: number;
  Sat: number;
  Sun: number;
  '-': number;
}

interface YearlyCount {
  [key: string]: number;
}


const DashboardCharts: FC = () => {
  const [barData, setBarData] = useState<ChartData<'bar'> | null>(null);
  const [doughnutData, setDoughnutData] = useState<ChartData<'doughnut'> | null>(null);
  const [lineData, setLineData] = useState<ChartData<'line'> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
  };

  useEffect(() => {
    try {
      if (!Array.isArray(courseData)) {
        console.error('Data is not an array:', courseData);
        return;
      }

      // Calculate totals
      const { totalRegistered, totalCapacity } = courseData.reduce(
        (acc, course: CourseData) => ({
          totalRegistered: acc.totalRegistered + (parseInt(course['ลงทะเบียน'], 10) || 0),
          totalCapacity: acc.totalCapacity + (parseInt(course['รับ'], 10) || 0),
        }),
        { totalRegistered: 0, totalCapacity: 0 }
      );

      // Update Doughnut Chart
      setDoughnutData({
        labels: ['ลงทะเบียน', 'รับ'],
        datasets: [
          {
            data: [totalRegistered, totalCapacity],
            backgroundColor: ['#92B9BD', '#A8D4AD'],
            borderWidth: 2,
          },
        ],
      });

      // Calculate Bar Chart data
      const registeredCounts: DailyCount = { M: 0, Tu: 0, W: 0, Th: 0, F: 0, Sat: 0, Sun: 0, '-': 0 };
      const capacityCounts: DailyCount = { M: 0, Tu: 0, W: 0, Th: 0, F: 0, Sat: 0, Sun: 0, '-': 0 };

      courseData.forEach((course: unknown) => {
        if (course['วัน']) {
          const day = course['วัน'] as keyof DailyCount;
          registeredCounts[day] += parseInt(course['ลงทะเบียน'], 10) || 0;
          capacityCounts[day] += parseInt(course['รับ'], 10) || 0;
        }
      });

      setBarData({
        labels: Object.keys(registeredCounts),
        datasets: [
          {
            label: 'ลงทะเบียน',
            data: Object.values(registeredCounts),
            backgroundColor: '#92B9BD',
          },
          {
            label: 'รับ',
            data: Object.values(capacityCounts),
            backgroundColor: '#A8D4AD',
          },
        ],
      });

      // Calculate Line Chart data
      const years = ['2564', '2565', '2566'];
      const registeredPerYear: YearlyCount = years.reduce((acc, year) => ({ ...acc, [year]: 0 }), {});
      const capacityPerYear: YearlyCount = years.reduce((acc, year) => ({ ...acc, [year]: 0 }), {});

      // @eslint-disable-next-line
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courseData.forEach((course: any) => {
        const year = course['ปีการศึกษา'];
        if (registeredPerYear.hasOwnProperty(year)) {
          registeredPerYear[year] += parseInt(course['ลงทะเบียน'], 10) || 0;
          capacityPerYear[year] += parseInt(course['รับ'], 10) || 0;
        }
      });

      setLineData({
        labels: years,
        datasets: [
          {
            label: 'ลงทะเบียน',
            data: years.map((year) => registeredPerYear[year]),
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            fill: true,
          },
          {
            label: 'รับได้',
            data: years.map((year) => capacityPerYear[year]),
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            fill: true,
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error('Error processing data:', error);
      setLoading(false);
    }
  }, []);

  const handleDoughnutClick = (event: unknown, elements: Array<{ index: number }>) => {
    if (!elements.length) {
      setSelectedCategory(null);
      return;
    }

    const index = elements[0].index;
    const clickedLabel = doughnutData?.labels?.[index] as string;
    setSelectedCategory(clickedLabel);
  };

  const getFilteredBarData = (): ChartData<'bar'> | null => {
    if (!barData || !selectedCategory) return barData;

    const datasetIndex = selectedCategory === 'ลงทะเบียน' ? 0 : 1;
    return {
      labels: barData.labels,
      datasets: [barData.datasets[datasetIndex]],
    };
  };

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    onClick: handleDoughnutClick,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} คน`,
        },
      },
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <ChartsContainer>
          <ChartCard title="ภาพรวมการลงทะเบียนและรับ (คลิกเพื่อกรองข้อมูล)">
            {/* Chart content */}
            <div className="chart-card-components">
              {loading ? <p>Loading...</p> : doughnutData && <Doughnut data={doughnutData} options={donutOptions} />}
            </div>
          </ChartCard>
          <ChartCard title={`จำนวนนักศึกษาที่${selectedCategory ? selectedCategory : 'ลงทะเบียนและรับ'}ในแต่ละวัน`}>
            <div className="chart-card-components">
              {loading ? <p>Loading...</p> : barData && <Bar data={getFilteredBarData()} options={chartOptions} />}
            </div>
          </ChartCard>
          <ChartCard title={`จำนวนนักศึกษาที่${selectedCategory ? selectedCategory : 'ลงทะเบียนและรับ'}ในแต่ละวัน`}>
            <div className="chart-card-components">
              {loading ? <p>Loading...</p> : barData && <Bar data={getFilteredBarData()} options={chartOptions} />}
            </div>
          </ChartCard>
          <ChartCard title="แนวโน้มการลงทะเบียน">
            <div className="chart-card-components">
              {loading ? <p>Loading...</p> : lineData && <Line data={lineData} options={lineOptions} />}
            </div>
          </ChartCard>
        </ChartsContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;