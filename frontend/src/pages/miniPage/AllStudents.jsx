import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGetAllStudentsQuery } from '../../services/studentsApi';
import { useGetAcademicYearsQuery } from '../../services/academicApi';

const AllStudents = () => {
    // ดึงข้อมูลนักเรียนทั้งหมดจาก API
    const { data: studentsResponse, isLoading, error } = useGetAllStudentsQuery();
    const students = studentsResponse?.data || [];

    // ดึงข้อมูลปีการศึกษา
    const { data: academicYears = [] } = useGetAcademicYearsQuery();
    const currentYear = academicYears.find(year => year.isCurrent);

    // Set viewport meta tag to prevent zooming issues on mobile
    useEffect(() => {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        } else {
            metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Prevent zoom on double-tap for iOS
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }, []);

    // คำนวณข้อมูลนักเรียนแต่ละชั้นจาก database
    const classData = useMemo(() => {
        if (!students.length) return [];

        // จัดกลุ่มนักเรียนตามห้องเรียน
        const groupedByClass = students.reduce((acc, student) => {
            const classroom = student.classRoom || 'ไม่ระบุ';
            if (!acc[classroom]) {
                acc[classroom] = { male: 0, female: 0, total: 0 };
            }
            
            // genderId: 1 = ชาย, 2 = หญิง
            if (student.genderId === 1) {
                acc[classroom].male++;
            } else if (student.genderId === 2) {
                acc[classroom].female++;
            }
            acc[classroom].total++;
            
            return acc;
        }, {});

        // แปลงเป็น array และเรียงลำดับ
        return Object.entries(groupedByClass)
            .map(([name, data], index) => ({
                id: index + 1,
                name: name,
                male: data.male,
                female: data.female,
                total: data.total
            }))
            .sort((a, b) => {
                // เรียงตามระดับชั้น (1/1, 1/2, 2/1, ...)
                const [gradeA, roomA] = a.name.split('/').map(Number);
                const [gradeB, roomB] = b.name.split('/').map(Number);
                return gradeA === gradeB ? roomA - roomB : gradeA - gradeB;
            });
    }, [students]);

    // คำนวณยอดรวมทั้งหมด
    const totalMale = useMemo(() => 
        classData.reduce((sum, item) => sum + item.male, 0), [classData]);
    const totalFemale = useMemo(() => 
        classData.reduce((sum, item) => sum + item.female, 0), [classData]);
    const totalAll = useMemo(() => 
        classData.reduce((sum, item) => sum + item.total, 0), [classData]);

    // หาวันที่ที่มีการอัพเดตข้อมูลนักเรียนล่าสุด
    const lastUpdated = useMemo(() => {
        if (!students.length) return new Date();
        
        // หาวันที่ที่มีการแก้ไขล่าสุดจากข้อมูลนักเรียน
        const latestUpdate = students.reduce((latest, student) => {
            const studentDate = new Date(student.updatedAt || student.createdAt);
            return studentDate > latest ? studentDate : latest;
        }, new Date(0)); // เริ่มจากวันที่เก่าสุด (1970-01-01)
        
        return latestUpdate;
    }, [students]);

    // ข้อมูลสำหรับกราฟแท่ง
    const barChartData = classData.map(item => ({
        name: item.name,
        ชาย: item.male,
        หญิง: item.female,
    }));

    // ข้อมูลสำหรับกราฟวงกลม
    const pieChartData = [
        { name: 'ชาย', value: totalMale, color: '#3b82f6' },
        { name: 'หญิง', value: totalFemale, color: '#ec4899' },
    ];

    // สีสำหรับกราฟ
    const COLORS = ['#3b82f6', '#ec4899'];

    // แสดง Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลนักเรียน...</p>
                </div>
            </div>
        );
    }

    // แสดง Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="text-gray-600 mb-4">ไม่สามารถโหลดข้อมูลนักเรียนได้</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        กลับสู่หน้าหลัก
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-4 sm:py-6 md:py-8"
            style={{ minWidth: '320px' }}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* ปุ่มกลับ */}
                <Link
                    to="/"
                    className="flex items-center text-blue-700 hover:text-blue-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
                >
                    <IoChevronBack className="mr-1" />
                    กลับสู่หน้าหลัก
                </Link>

                {/* หัวข้อหลัก */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2">จำนวนนักเรียน</h1>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-4">
                        ข้อมูลจำนวนนักเรียนโรงเรียนท่าบ่อพิทยาคม ปีการศึกษา {currentYear?.year || '2567'}
                    </p>
                    <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto"></div>
                </div>

                {/* การ์ดแสดงจำนวนนักเรียนทั้งหมด */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">นักเรียนทั้งหมด</h3>
                        <p className="text-3xl sm:text-4xl font-bold text-blue-600">{totalAll}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">คน</p>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">นักเรียนชาย</h3>
                        <p className="text-3xl sm:text-4xl font-bold text-blue-500">{totalMale}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">คน</p>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">นักเรียนหญิง</h3>
                        <p className="text-3xl sm:text-4xl font-bold text-pink-500">{totalFemale}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">คน</p>
                    </div>
                </div>

                {/* กราฟและตาราง */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* กราฟแท่ง */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4">จำนวนนักเรียนแยกตามชั้นเรียน</h3>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barChartData}
                                    margin={{ 
                                        top: 20, 
                                        right: window.innerWidth < 640 ? 10 : 30, 
                                        left: window.innerWidth < 640 ? 10 : 20, 
                                        bottom: 5 
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        fontSize={window.innerWidth < 640 ? 10 : 12}
                                        interval={0}
                                        angle={window.innerWidth < 640 ? -45 : 0}
                                        textAnchor={window.innerWidth < 640 ? 'end' : 'middle'}
                                        height={window.innerWidth < 640 ? 60 : 30}
                                    />
                                    <YAxis fontSize={window.innerWidth < 640 ? 10 : 12} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            fontSize: window.innerWidth < 640 ? '12px' : '14px' 
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ 
                                            fontSize: window.innerWidth < 640 ? '12px' : '14px' 
                                        }}
                                    />
                                    <Bar dataKey="ชาย" fill="#3b82f6" />
                                    <Bar dataKey="หญิง" fill="#ec4899" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* กราฟวงกลม */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4">สัดส่วนนักเรียนชาย-หญิง</h3>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={window.innerWidth < 640 ? 60 : 80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => 
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                        fontSize={window.innerWidth < 640 ? 12 : 14}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            fontSize: window.innerWidth < 640 ? '12px' : '14px' 
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ 
                                            fontSize: window.innerWidth < 640 ? '12px' : '14px' 
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ตารางแสดงข้อมูล */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">ระดับชั้น</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">ชาย</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">หญิง</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">ทั้งหมด</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classData.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{item.male}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{item.female}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-blue-600">{item.total}</td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50 font-semibold">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-900">รวม</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-900">{totalMale}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-900">{totalFemale}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-blue-700">{totalAll}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* หมายเหตุ */}
                <div className="text-center text-xs sm:text-sm text-gray-500">
                    ข้อมูลอัพเดตล่าสุด ณ วันที่ {lastUpdated.toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default AllStudents;