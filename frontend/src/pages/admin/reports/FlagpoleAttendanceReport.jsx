import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from '../../../components/common/DatePicker';
import ClassSelect from '../../../components/common/ClassSelect';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useGetClassRoomsQuery, useGetFlagpoleReportQuery } from '../../../redux/features/attendance/flagpoleAttendanceApi';
import { showError, showSuccess } from '../../../utilis/sweetAlertHelper';

const FlagpoleAttendanceReport = () => {
    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('all');

    // RTK Query hooks
    const { data: classRooms = [], isLoading: classesLoading } = useGetClassRoomsQuery();
    const { data: reportData, isLoading: reportLoading, refetch } = useGetFlagpoleReportQuery(
        { startDate, endDate, classRoom: selectedClass },
        { skip: !startDate || !endDate }
    );

    const COLORS = {
        'มา': '#10B981',
        'สาย': '#F59E0B',
        'ลาป่วย': '#3B82F6',
        'ลากิจ': '#8B5CF6',
        'ขาด': '#EF4444',
    };

    useEffect(() => {
        if (startDate && endDate) {
            refetch();
        }
    }, [startDate, endDate, selectedClass, refetch]);

    // Prepare chart data from API response
    const chartData = reportData?.chartData || [];
    const pieData = reportData?.totalStats ? 
        Object.entries(reportData.totalStats)
            .filter(([_, value]) => value > 0)
            .map(([status, count]) => ({ name: status, value: count })) 
        : [];

    // Calculate summary from API response
    const totalRecords = reportData?.totalStats ? 
        Object.values(reportData.totalStats).reduce((sum, val) => sum + val, 0) : 0;
    const presentCount = reportData?.totalStats?.มา || 0;
    const lateCount = reportData?.totalStats?.สาย || 0;
    const sickLeaveCount = reportData?.totalStats?.ลาป่วย || 0;
    const personalLeaveCount = reportData?.totalStats?.ลากิจ || 0;
    const absentCount = reportData?.totalStats?.ขาด || 0;

    const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0;

    const handleExport = () => {
        if (!reportData?.records || reportData.records.length === 0) {
            showError('ไม่มีข้อมูล', 'ไม่มีข้อมูลให้ส่งออก');
            return;
        }

        // CSV export with detailed records
        // ใช้ ="value" เพื่อบังคับให้ Excel แสดงเป็น Text และไม่แปลงค่า
        const headers = ['วันที่', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'สถานะ'];
        const rows = reportData.records.map((record) => [
            record.date,
            record.studentNumber,
            record.studentName,
            `="${record.classRoom}"`,  // ใช้ ="ม.1/1" บังคับให้แสดงเป็นข้อความ
            record.status
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
        // สร้าง Blob สำหรับดาวน์โหลด \uFEFF = BOM (Byte Order Mark) สำหรับ UTF-8
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        // ลิงก์ดาวน์โหลดไฟล์
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `attendance_report_${startDate}_${endDate}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);

        showSuccess('ส่งออกสำเร็จ', 'ดาวน์โหลดไฟล์รายงานเรียบร้อย', 2000);
    };

    const loading = reportLoading || classesLoading;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-600 flex items-center gap-2">
                                <i className="bi bi-graph-up-arrow text-4xl"></i>
                                รายงานการเช็คชื่อนักเรียนเข้าแถว
                            </h1>
                            <p className="text-gray-600 mt-1">สถิติและข้อมูลการเข้าแถวหน้าเสาธง</p>
                        </div>
                        <button
                            onClick={handleExport}
                            disabled={!reportData?.records?.length}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="bi bi-download text-lg"></i>
                            ส่งออก CSV
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DatePicker label="วันที่เริ่มต้น" value={startDate} onChange={setStartDate} />
                        <DatePicker label="วันที่สิ้นสุด" value={endDate} onChange={setEndDate} />
                        <ClassSelect
                            label="ห้องเรียน (ทั้งหมด)"
                            value={selectedClass}
                            onChange={setSelectedClass}
                            options={[...classRooms]}
                            placeholder="-- ทุกห้อง --"
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner message="กำลังโหลดรายงาน..." />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                            <SummaryCard
                                title="ทั้งหมด"
                                value={totalRecords}
                                icon={<i className="bi bi-clipboard-data text-2xl"></i>}
                                color="bg-gray-500"
                            />
                            <SummaryCard
                                title="มา"
                                value={presentCount}
                                icon={<i className="bi bi-check-circle-fill text-2xl"></i>}
                                color="bg-green-500"
                            />
                            <SummaryCard 
                                title="สาย" 
                                value={lateCount} 
                                icon={<i className="bi bi-clock-fill text-2xl"></i>}
                                color="bg-yellow-500" 
                            />
                            <SummaryCard 
                                title="ลาป่วย" 
                                value={sickLeaveCount} 
                                icon={<i className="bi bi-heart-pulse-fill text-2xl"></i>}
                                color="bg-blue-500" 
                            />
                            <SummaryCard 
                                title="ลากิจ" 
                                value={personalLeaveCount} 
                                icon={<i className="bi bi-person-fill-dash text-2xl"></i>}
                                color="bg-purple-500" 
                            />
                            <SummaryCard 
                                title="ขาด" 
                                value={absentCount} 
                                icon={<i className="bi bi-x-circle-fill text-2xl"></i>}
                                color="bg-red-500" 
                            />
                        </div>

                        {/* Attendance Rate */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">อัตราการเข้าแถวหน้าเสาธง</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full flex items-center justify-center text-white font-bold text-sm transition-all"
                                        style={{ width: `${attendanceRate}%` }}
                                    >
                                        {attendanceRate > 10 && `${attendanceRate}%`}
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-green-600">{attendanceRate}%</span>
                            </div>
                        </div>

                        {/* Charts */}
                        {chartData.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Bar Chart */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">กราฟแท่ง - การเข้าแถวรายวัน</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="มา" fill={COLORS['มา']} />
                                            <Bar dataKey="สาย" fill={COLORS['สาย']} />
                                            <Bar dataKey="ลาป่วย" fill={COLORS['ลาป่วย']} />
                                            <Bar dataKey="ลากิจ" fill={COLORS['ลากิจ']} />
                                            <Bar dataKey="ขาด" fill={COLORS['ขาด']} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">กราฟวงกลม - สัดส่วนสถานะการมาเข้าแถว</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ${entry.value}`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                                <i className="bi bi-inbox text-6xl mb-4 opacity-50 block"></i>
                                <p>ไม่มีข้อมูลในช่วงเวลาที่เลือก</p>
                            </div>
                        )}

                        {/* Data Table */}
                        {reportData?.records?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">ตารางข้อมูลรายละเอียด</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    วันที่
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    เลขประจำตัว
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ชื่อ-นามสกุล
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ห้องเรียน
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    สถานะ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reportData.records.map((record, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.studentNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.studentName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {record.classRoom}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                                                            style={{ backgroundColor: COLORS[record.status] }}
                                                        >
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
                {icon && <div className={`${color} text-white p-2 rounded-lg`}>{icon}</div>}
            </div>
            <p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
        </div>
    );
};

export default FlagpoleAttendanceReport;
