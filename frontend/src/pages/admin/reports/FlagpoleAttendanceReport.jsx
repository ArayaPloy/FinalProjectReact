import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, FileText, Download } from 'lucide-react';
import DatePicker from '../../../components/common/DatePicker';
import ClassSelect from '../../../components/common/ClassSelect';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
// import { attendanceService } from '../services/attendanceService';
import { showError, showSuccess } from '../../../utilis/sweetAlertHelper';

const AttendanceReports = () => {
    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('');
    const [classList, setClassList] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(false);

    const COLORS = {
        'มา': '#10B981',
        'สาย': '#F59E0B',
        'ลา': '#3B82F6',
        'ขาด': '#EF4444',
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchStatistics();
    }, [startDate, endDate, selectedClass]);

    const fetchClasses = async () => {
        try {
            const data = await attendanceService.getClasses();
            setClassList(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const data = await attendanceService.getStatistics(startDate, endDate, selectedClass);
            setStatistics(data);
        } catch (error) {
            showError('ข้อผิดพลาด', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Prepare data for charts
    const prepareChartData = () => {
        const grouped = {};

        statistics.forEach((stat) => {
            if (!grouped[stat.date]) {
                grouped[stat.date] = { date: stat.date };
            }
            grouped[stat.date][stat.status] = stat.count;
        });

        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const preparePieData = () => {
        const totals = {};

        statistics.forEach((stat) => {
            if (!totals[stat.status]) {
                totals[stat.status] = 0;
            }
            totals[stat.status] += stat.count;
        });

        return Object.entries(totals).map(([status, count]) => ({
            name: status,
            value: count,
        }));
    };

    const chartData = prepareChartData();
    const pieData = preparePieData();

    // Calculate summary
    const totalRecords = statistics.reduce((sum, stat) => sum + stat.count, 0);
    const presentCount = statistics.filter((s) => s.status === 'มา').reduce((sum, s) => sum + s.count, 0);
    const lateCount = statistics.filter((s) => s.status === 'สาย').reduce((sum, s) => sum + s.count, 0);
    const absentCount = statistics.filter((s) => s.status === 'ขาด').reduce((sum, s) => sum + s.count, 0);
    const leaveCount = statistics.filter((s) => s.status === 'ลา').reduce((sum, s) => sum + s.count, 0);

    const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : 0;

    const handleExport = () => {
        // Simple CSV export
        const headers = ['วันที่', 'สถานะ', 'จำนวน'];
        const rows = statistics.map((stat) => [stat.date, stat.status, stat.count]);

        const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `attendance_report_${startDate}_${endDate}.csv`;
        link.click();

        showSuccess('ส่งออกสำเร็จ', 'ดาวน์โหลดไฟล์รายงานเรียบร้อย', 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-12">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                                <TrendingUp className="w-8 h-8" />
                                รายงานการเช็คชื่อนักเรียนเข้าแถว
                            </h1>
                            <p className="text-gray-600 mt-1">สถิติและข้อมูลการเข้าเรียน</p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                        >
                            <Download className="w-5 h-5" />
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
                            options={classList}
                            placeholder="-- ทุกห้อง --"
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner message="กำลังโหลดรายงาน..." />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <SummaryCard
                                title="ทั้งหมด"
                                value={totalRecords}
                                icon={<FileText className="w-6 h-6" />}
                                color="bg-gray-500"
                            />
                            <SummaryCard
                                title="มา"
                                value={presentCount}
                                icon={<Users className="w-6 h-6" />}
                                color="bg-green-500"
                            />
                            <SummaryCard title="สาย" value={lateCount} color="bg-yellow-500" />
                            <SummaryCard title="ลา" value={leaveCount} color="bg-blue-500" />
                            <SummaryCard title="ขาด" value={absentCount} color="bg-red-500" />
                        </div>

                        {/* Attendance Rate */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">อัตราการเข้าเรียน</h2>
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
                        {statistics.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Bar Chart */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">กราฟแท่ง - การเข้าเรียนรายวัน</h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="มา" fill={COLORS['มา']} />
                                            <Bar dataKey="สาย" fill={COLORS['สาย']} />
                                            <Bar dataKey="ลา" fill={COLORS['ลา']} />
                                            <Bar dataKey="ขาด" fill={COLORS['ขาด']} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">กราฟวงกลม - สัดส่วนสถานะ</h2>
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
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>ไม่มีข้อมูลในช่วงเวลาที่เลือก</p>
                            </div>
                        )}

                        {/* Data Table */}
                        {statistics.length > 0 && (
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
                                                    สถานะ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    จำนวน
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {statistics.map((stat, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-white text-sm font-semibold`}
                                                            style={{ backgroundColor: COLORS[stat.status] }}
                                                        >
                                                            {stat.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                        {stat.count}
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

export default AttendanceReports;