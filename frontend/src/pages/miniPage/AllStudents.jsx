import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AllStudents = () => {
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

    // ข้อมูลนักเรียนแต่ละชั้น
    const classData = [
        { id: 1, name: 'ม.1/1', male: 12, female: 5, total: 17 },
        { id: 2, name: 'ม.1/2', male: 14, female: 6, total: 20 },
        { id: 3, name: 'ม.2/1', male: 17, female: 9, total: 26 },
        { id: 4, name: 'ม.3/1', male: 11, female: 9, total: 20 },
        { id: 5, name: 'ม.3/2', male: 8, female: 8, total: 16 },
        { id: 6, name: 'ม.4/1', male: 10, female: 11, total: 21 },
        { id: 7, name: 'ม.5/1', male: 7, female: 15, total: 22 },
        { id: 8, name: 'ม.6/1', male: 3, female: 8, total: 11 },
    ];

    // คำนวณยอดรวมทั้งหมด
    const totalMale = classData.reduce((sum, item) => sum + item.male, 0);
    const totalFemale = classData.reduce((sum, item) => sum + item.female, 0);
    const totalAll = classData.reduce((sum, item) => sum + item.total, 0);

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
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-4">ข้อมูลจำนวนนักเรียนโรงเรียนท่าบ่อพิทยาคม ปีการศึกษา 2567</p>
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
                    ข้อมูล ณ วันที่ 1 เมษายน 2568
                </div>
            </div>
        </motion.div>
    );
};

export default AllStudents;