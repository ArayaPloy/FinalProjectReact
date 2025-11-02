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
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Mobile First */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 md:mb-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 flex items-center gap-2 sm:gap-3 leading-tight">
                                <i className="bi bi-graph-up-arrow text-2xl sm:text-3xl md:text-4xl flex-shrink-0"></i>
                                <span className="truncate">รายงานการเช็คชื่อนักเรียนเข้าแถว</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-1.5 leading-relaxed">สถิติและข้อมูลการเข้าแถวหน้าเสาธง</p>
                        </div>
                        <button
                            onClick={handleExport}
                            disabled={!reportData?.records?.length}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 sm:px-5 md:px-6 py-3 sm:py-2.5 rounded-lg md:rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] sm:min-h-0"
                        >
                            <i className="bi bi-download text-base sm:text-lg flex-shrink-0"></i>
                            <span>ส่งออก CSV</span>
                        </button>
                    </div>

                    {/* Filters - Mobile First */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                        {/* Summary Cards - Mobile First */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 md:mb-6">
                            <SummaryCard
                                title="ทั้งหมด"
                                value={totalRecords}
                                icon={<i className="bi bi-clipboard-data text-xl sm:text-2xl"></i>}
                                color="bg-gray-500"
                            />
                            <SummaryCard
                                title="มา"
                                value={presentCount}
                                icon={<i className="bi bi-check-circle-fill text-xl sm:text-2xl"></i>}
                                color="bg-green-500"
                            />
                            <SummaryCard 
                                title="สาย" 
                                value={lateCount} 
                                icon={<i className="bi bi-clock-fill text-xl sm:text-2xl"></i>}
                                color="bg-yellow-500" 
                            />
                            <SummaryCard 
                                title="ลาป่วย" 
                                value={sickLeaveCount} 
                                icon={<i className="bi bi-heart-pulse-fill text-xl sm:text-2xl"></i>}
                                color="bg-blue-500" 
                            />
                            <SummaryCard 
                                title="ลากิจ" 
                                value={personalLeaveCount} 
                                icon={<i className="bi bi-person-fill-dash text-xl sm:text-2xl"></i>}
                                color="bg-purple-500" 
                            />
                            <SummaryCard 
                                title="ขาด" 
                                value={absentCount} 
                                icon={<i className="bi bi-x-circle-fill text-xl sm:text-2xl"></i>}
                                color="bg-red-500" 
                            />
                        </div>

                        {/* Attendance Rate - Mobile First */}
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">อัตราการเข้าแถวหน้าเสาธง</h2>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex-1 bg-gray-200 rounded-full h-7 sm:h-8 overflow-hidden">
                                    <div
                                        className="bg-green-500 h-full flex items-center justify-center text-white font-bold text-xs sm:text-sm transition-all"
                                        style={{ width: `${attendanceRate}%` }}
                                    >
                                        {attendanceRate > 10 && `${attendanceRate}%`}
                                    </div>
                                </div>
                                <span className="text-xl sm:text-2xl font-bold text-green-600 flex-shrink-0">{attendanceRate}%</span>
                            </div>
                        </div>

                        {/* Charts - Mobile First */}
                        {chartData.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 md:mb-6">
                                {/* Bar Chart */}
                                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">กราฟแท่ง - การเข้าแถวรายวัน</h2>
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
                                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">กราฟวงกลม - สัดส่วนสถานะการมาเข้าแถว</h2>
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
                            <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-8 sm:p-10 md:p-12 text-center text-gray-500">
                                <i className="bi bi-inbox text-5xl sm:text-6xl mb-3 md:mb-4 opacity-50 block"></i>
                                <p className="text-sm sm:text-base leading-relaxed">ไม่มีข้อมูลในช่วงเวลาที่เลือก</p>
                            </div>
                        )}

                        {/* Data Table - Dual View: Desktop Table + Mobile Cards */}
                        {reportData?.records?.length > 0 && (
                            <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">ตารางข้อมูลรายละเอียด</h2>
                                
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                                                    วันที่
                                                </th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                                                    เลขประจำตัว
                                                </th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                                                    ชื่อ-นามสกุล
                                                </th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                                                    ห้องเรียน
                                                </th>
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">
                                                    สถานะ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reportData.records.map((record, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900">
                                                        {record.date}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900 font-medium">
                                                        {record.studentNumber}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900">
                                                        {record.studentName}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900 font-medium">
                                                        {record.classRoom}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                                        <span
                                                            className="px-3 py-1.5 rounded-lg text-white text-sm font-bold"
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

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    {reportData.records.map((record, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-3 hover:border-amber-300 transition-colors"
                                        >
                                            {/* Header with Status */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 font-medium">รายการที่ {index + 1}</span>
                                                <span
                                                    className="px-3 py-1.5 rounded-lg text-white text-sm font-bold"
                                                    style={{ backgroundColor: COLORS[record.status] }}
                                                >
                                                    {record.status}
                                                </span>
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-start gap-2">
                                                <i className="bi bi-calendar-event text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5">วันที่</p>
                                                    <p className="text-sm font-bold text-gray-800 leading-tight">
                                                        {record.date}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Student Info */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-start gap-2">
                                                    <i className="bi bi-person-badge text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs text-gray-500 mb-0.5">เลขประจำตัว</p>
                                                        <p className="text-sm font-bold text-gray-800 leading-tight break-words">
                                                            {record.studentNumber}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <i className="bi bi-building text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs text-gray-500 mb-0.5">ห้องเรียน</p>
                                                        <p className="text-sm font-bold text-gray-800 leading-tight">
                                                            {record.classRoom}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                                                <i className="bi bi-person text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5">ชื่อ-นามสกุล</p>
                                                    <p className="text-sm font-bold text-gray-800 leading-tight break-words">
                                                        {record.studentName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Summary Card Component - Mobile First
const SummaryCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-600 leading-tight">{title}</h3>
                {icon && <div className={`${color} text-white p-1.5 sm:p-2 rounded-lg flex-shrink-0`}>{icon}</div>}
            </div>
            <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-none">{value.toLocaleString()}</p>
        </div>
    );
};

export default FlagpoleAttendanceReport;
