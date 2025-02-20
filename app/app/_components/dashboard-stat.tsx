import courseData from "@/app/_components/course-data.json";
import DashboardCharts from "./dashboard-chart";

interface CourseData {
  ลงทะเบียน: string;
  รับ: string;
  ผู้สอน: string;
  [key: string]: string;
}

interface StatItem {
  label: string;
  value: number;
}

type DashboardStatsProps = {
    registeredTotal: number;
    capacityTotal: number;
}

const DashboardStats = (props: DashboardStatsProps) => {
  const facultyName = "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา";

  const lowEnrollmentCount = courseData.filter((item: CourseData) => {
    const enrolled = Number(item["ลงทะเบียน"]);
    const capacity = Number(item["รับ"]);
    if (capacity === 0) return false;
    return enrolled < capacity / 4;
  }).length;

  const totalCourses: number = courseData.length;

  const teacherCount: Record<string, number> = {};
  courseData.forEach((item: CourseData) => {
    const teachers = item["ผู้สอน"].split("|").map((name) => name.trim());
    teachers.forEach((teacher) => {
      if (!teacherCount[teacher]) teacherCount[teacher] = 0;
      teacherCount[teacher]++;
    });
  });
  
  const heavyLoadCount = Object.keys(teacherCount).filter(
    (teacher) => teacherCount[teacher] > 7
  ).length;

  const uniqueTeachers = [
    ...new Set(
      courseData.flatMap((item: CourseData) =>
        item["ผู้สอน"].split("|").map((name) => name.trim())
      )
    ),
  ];
  const totalUniqueTeachers = uniqueTeachers.length;

  const stats: StatItem[] = [
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

  const registeredTotal = courseData.reduce(
    (sum, item: CourseData) => sum + Number(item["ลงทะเบียน"]),
    0
  );
  
  const capacityTotal = courseData.reduce(
    (sum, item: CourseData) => sum + Number(item["รับ"]),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      <div className="relative mx-8 my-8 md:mx-12 lg:mx-16">
        {/* Main Dashboard Container */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 to-green-50 p-6 shadow-lg">
          {/* Decorative Circles */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/50"></div>
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-100/50"></div>

          {/* Dashboard Header */}
          <div className="mb-8 text-left">
            <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
              แดชบอร์ดภาระการทำงานอาจารย์
            </h1>
            <p className="text-lg text-gray-600">
              {facultyName}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <div 
                key={index}
                className="transform rounded-xl bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="mb-3 text-3xl font-bold text-teal-700">
                  {item.value}
                </h2>
                <p className="text-sm text-gray-600">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="Chart-card-container">
      <DashboardCharts />
    </div>
    </div>
  );
};

export default DashboardStats;