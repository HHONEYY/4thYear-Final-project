import React from "react";
import "../styles/DashboardStats.css";
import courseData from "../assets/courseData.json"; // ตรวจสอบให้แน่ใจว่าไฟล์ JSON อยู่ใน src/assets
import DashboardCharts from "./pages/DashboardCharts"; // Import ไฟล์ DashboardCharts

function DashboardStats() {
  const facultyName = "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา";

  // คำนวณวิชาที่มีคนลงทะเบียนน้อย (ลงทะเบียน < รับ/4)
  const lowEnrollmentCount = courseData.filter((item) => {
    const enrolled = Number(item["ลงทะเบียน"]);
    const capacity = Number(item["รับ"]);
    if (capacity === 0) return false;
    return enrolled < capacity / 4;
  }).length;

  // จำนวนวิชาที่เปิดทั้งหมด
  const totalCourses = courseData.length;

  // คำนวณอาจารย์ที่ภาระการสอนเยอะ (สอนมากกว่า 10 วิชา)
  const teacherCount = {};
  courseData.forEach((item) => {
    // สมมุติว่าในฟิลด์ "ผู้สอน" มีรายชื่ออาจารย์ที่คั่นด้วย "|" 
    const teachers = item["ผู้สอน"].split("|").map((name) => name.trim());
    teachers.forEach((teacher) => {
      if (!teacherCount[teacher]) teacherCount[teacher] = 0;
      teacherCount[teacher]++;
    });
  });
  const heavyLoadCount = Object.keys(teacherCount).filter(
    (teacher) => teacherCount[teacher] > 7
  ).length;

  // ตัวอย่าง placeholder สำหรับ "อาจารย์ที่มีสอนคณะอื่น"
  const otherFacultyTeachersCount = 0;

  const uniqueTeachers = [
    ...new Set(
      courseData.flatMap((item) =>
        item["ผู้สอน"].split("|").map((name) => name.trim())
      )
    ),
  ];
  const totalUniqueTeachers = uniqueTeachers.length;

  const stats = [
    {
      label: "วิชาที่มีจำนวนคนลงทะเบียนน้อย",
      value: lowEnrollmentCount,
    },
    {
      label: "จำนวนวิชาที่เปิดทั้งหมด",
      value: totalCourses,
    },
    {
      label: "อาจารย์ที่ภาระการสอนเยอะ",
      value: heavyLoadCount,
    },
    {
      label: "อาจารย์ที่มีสอนทั้งหมด",
      value: totalUniqueTeachers,
    },
  ];

const registeredTotal = courseData.reduce((sum, item) => sum + Number(item["ลงทะเบียน"]), 0);
const capacityTotal = courseData.reduce((sum, item) => sum + Number(item["รับ"]), 0);

  

return (
  <div>
    <div className="dashboard-stats-container">
      <div className="dashboard-header">
        <h1>แดชบอร์ดภาระการทำงานอาจารย์</h1>
        <p className="faculty-name">{facultyName}</p>
      </div>

      <div className="stats-card-container">
        {stats.map((item, index) => (
          <div className="stats-card" key={index}>
            <h2>{item.value}</h2>
            <p>{item.label}</p>
          </div>
        ))}
      </div>  
    </div>

    <div className="Chart-card-container">
      <DashboardCharts registeredTotal={registeredTotal} capacityTotal={capacityTotal} />
    </div>
  </div>
); 

}export default DashboardStats;