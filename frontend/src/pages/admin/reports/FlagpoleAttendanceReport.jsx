import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useGetClassRoomsQuery, useGetFlagpoleReportQuery, useGetFlagpoleSummaryQuery } from '../../../redux/features/attendance/flagpoleAttendanceApi';
import { showError, showSuccess } from '../../../utils/sweetAlertHelper';
import { CheckCircle2, Clock, Heart, FileText, XCircle, Users } from 'lucide-react';

// ─── Week/Month/Date helper functions ─────────────────────────────────────
// ใช้ local timezone เพื่อป้องกันปัญหาข้ามวัน (ช่วงก่อน 07:00 น. UTC+7)
const getLocalDateString = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};
const getMonday = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return getLocalDateString(d);
};
const getSunday = (mondayStr) => {
    const d = new Date(mondayStr);
    d.setDate(d.getDate() + 6);
    return getLocalDateString(d);
};
const formatThaiShortDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

const FlagpoleAttendanceReport = () => {
    const [startDate, setStartDate] = useState(
        getLocalDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    );
    const [endDate, setEndDate] = useState(getLocalDateString);
    const [selectedClass, setSelectedClass] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(25);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });

    // Tab + Summary State
    const [activeTab, setActiveTab] = useState('history');
    const [reportPeriod, setReportPeriod] = useState('week');
    const [searchStudent, setSearchStudent] = useState('');
    const [summarySortConfig, setSummarySortConfig] = useState({ key: null, direction: 'asc' });
    const [summaryPage, setSummaryPage] = useState(1);
    const [summaryPerPage, setSummaryPerPage] = useState(25);

    // Summary date pickers
    const [summaryWeekDate, setSummaryWeekDate] = useState(() => getMonday(getLocalDateString()));
    const [summaryMonthDate, setSummaryMonthDate] = useState(() => getLocalDateString().slice(0, 7));

    // RTK Query hooks
    const { data: classRoomsData = [], isLoading: isLoadingClassrooms } = useGetClassRoomsQuery();
    const classRoomList = useMemo(() => ['ทั้งหมด', ...classRoomsData], [classRoomsData]);
    const classRooms = classRoomsData;
    const { data: reportData, isLoading: reportLoading, refetch } = useGetFlagpoleReportQuery(
        { startDate, endDate, classRoom: selectedClass },
        { skip: !startDate || !endDate }
    );
    const { data: summaryData, isLoading: summaryLoading } = useGetFlagpoleSummaryQuery(
        {
            period: reportPeriod,
            classRoom: selectedClass !== 'all' ? selectedClass : undefined,
            weekDate: reportPeriod === 'week' ? summaryWeekDate : undefined,
            monthDate: reportPeriod === 'month' ? summaryMonthDate : undefined,
        },
        { skip: activeTab !== 'summary', refetchOnMountOrArgChange: true }
    );

    const COLORS = {
        'มา': '#10B981',
        'สาย': '#F59E0B',
        'ลาป่วย': '#3B82F6',
        'ลากิจ': '#8B5CF6',
        'ขาด': '#EF4444',
    };

    const getStatusConfig = (status) => {
        const configs = {
            'มา': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            'สาย': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            'ลาป่วย': { icon: Heart, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
            'ลากิจ': { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
            'ขาด': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
        };
        return configs[status] || { icon: Users, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    };

    useEffect(() => {
        if (startDate && endDate) {
            refetch();
            setCurrentPage(1);
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

    const attendanceRate = totalRecords > 0 ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(2) : '0.00';

    // Pagination Logic
    const rawRecords = reportData?.records || [];

    // Sorted + searched records
    const allRecords = useMemo(() => {
        let filtered = rawRecords;
        if (searchStudent && searchStudent.trim()) {
            const q = searchStudent.trim().toLowerCase();
            filtered = rawRecords.filter(r =>
                String(r.studentNumber ?? '').toLowerCase().includes(q) ||
                (r.studentName ?? '').toLowerCase().includes(q)
            );
        }
        if (!sortConfig.key) {
            return [...filtered].sort((a, b) => {
                const aTime = a.recordedAt ? new Date(a.recordedAt).getTime() : new Date(a.date).getTime();
                const bTime = b.recordedAt ? new Date(b.recordedAt).getTime() : new Date(b.date).getTime();
                return bTime - aTime; // ล่าสุดขึ้นก่อน
            });
        }
        return [...filtered].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (sortConfig.key === 'date') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                const cmp = aVal.localeCompare(bVal, 'th', { sensitivity: 'base', numeric: true });
                return sortConfig.direction === 'asc' ? cmp : -cmp;
            }
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [rawRecords, sortConfig, searchStudent]);

    // Reset page when sort, search, or per-page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [sortConfig, recordsPerPage, searchStudent]);

    const totalPages = Math.ceil(allRecords.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = allRecords.slice(startIndex, endIndex);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const SortIcon = ({ col }) => {
        if (sortConfig.key !== col) return <span className="inline-block ml-1 opacity-40">⇅</span>;
        return <span className="inline-block ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            document.getElementById('records-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ─── Summary helpers ────────────────────────────────────────────
    useEffect(() => { setSummaryPage(1); }, [reportPeriod, selectedClass, searchStudent, summarySortConfig, summaryPerPage]);

    const rawSummary = summaryData?.summary || [];
    const summaryStats = useMemo(() => {
        // Client-side search filter
        let filtered = rawSummary;
        if (searchStudent && searchStudent.trim()) {
            const q = searchStudent.trim().toLowerCase();
            filtered = rawSummary.filter(st =>
                String(st.studentCode ?? '').toLowerCase().includes(q) ||
                st.studentName?.toLowerCase().includes(q)
            );
        }
        if (!summarySortConfig.key) return filtered;
        return [...filtered].sort((a, b) => {
            let aVal = a[summarySortConfig.key];
            let bVal = b[summarySortConfig.key];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                const cmp = aVal.localeCompare(bVal, 'th', { sensitivity: 'base', numeric: true });
                return summarySortConfig.direction === 'asc' ? cmp : -cmp;
            }
            if (aVal < bVal) return summarySortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return summarySortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [rawSummary, summarySortConfig, searchStudent]);

    const summaryTotalPages = Math.ceil(summaryStats.length / summaryPerPage);
    const paginatedSummary = summaryStats.slice((summaryPage - 1) * summaryPerPage, summaryPage * summaryPerPage);

    const handleSummarySort = (key) => setSummarySortConfig(prev => ({
        key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));

    const SummarySortIcon = ({ col }) => {
        if (summarySortConfig.key !== col) return <span className="inline-block ml-1 opacity-40">⇅</span>;
        return <span className="inline-block ml-1">{summarySortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    const getSummaryPeriodLabel = () => {
        if (reportPeriod === 'week') {
            return `จ. ${formatThaiShortDate(summaryWeekDate)} – อา. ${formatThaiShortDate(getSunday(summaryWeekDate))}`;
        }
        if (reportPeriod === 'month') {
            const [y, m] = summaryMonthDate.split('-').map(Number);
            return new Date(y, m - 1, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
        }
        return summaryData?.statistics?.periodLabel || 'ภาคเรียนปัจจุบัน';
    };

    const handleSummaryPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= summaryTotalPages) {
            setSummaryPage(newPage);
            document.getElementById('summary-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const exportToExcel = () => {
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '""';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return `"${str}"`;
        };

        if (activeTab === 'summary') {
            if (!summaryStats || summaryStats.length === 0) {
                showError('ไม่มีข้อมูล', 'ไม่มีข้อมูลให้ส่งออก');
                return;
            }
            const periodLabel = getSummaryPeriodLabel();
            const headers = ['รหัส', 'ช่วงเวลา', 'ชื่อ-สกุล', 'ห้อง', 'มา', 'สาย', 'ลาป่วย', 'ลากิจ', 'ขาด', 'รวม', '% เข้าแถว'];
            const rows = summaryStats.map(st => [st.studentCode, escapeCSV(periodLabel), escapeCSV(st.studentName), `="${st.classRoom}"`, st.มา, st.สาย, st.ลาป่วย, st.ลากิจ, st.ขาด, st.total, `${st.attendanceRate}%`]);
            const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `flagpole_summary_${reportPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            showSuccess('ส่งออกสำเร็จ', 'ดาวน์โหลดไฟล์รายงานสรุปเรียบร้อย', 2000);
        } else {
            if (!allRecords || allRecords.length === 0) {
                showError('ไม่มีข้อมูล', 'ไม่มีข้อมูลให้ส่งออก');
                return;
            }
            const formatTime = (iso) => {
                if (!iso) return '-';
                return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Bangkok' });
            };
            const headers = ['วันที่', 'เวลาบันทึก', 'เลขประจำตัว', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'สถานะ', 'ผู้บันทึก'];
            const rows = allRecords.map((record) => [
                escapeCSV(record.date),
                escapeCSV(formatTime(record.recordedAt)),
                record.studentNumber,
                escapeCSV(record.studentName),
                `="${record.classRoom}"`,
                escapeCSV(record.status),
                escapeCSV(record.recorder || '-')
            ]);
            const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `attendance_report_${startDate}_${endDate}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            showSuccess('ส่งออกสำเร็จ', 'ดาวน์โหลดไฟล์รายงานเรียบร้อย', 2000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Bangkok'
        });
    };

    const renderPagination = (totalCount, totalPgs, currPage, onPageChange, perPage, onPerPageChange) => {
        if (totalCount === 0 || totalPgs <= 0) return null;
        return (
            <div className="mb-4 md:mb-5 border-b-2 border-gray-200 pb-4 md:pb-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>แสดง</span>
                        <select value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))} className="px-2 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-400 bg-white">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>รายการ/หน้า</span>
                        {totalPgs > 1 && <span className="text-gray-400">|</span>}
                        {totalPgs > 1 && <span>หน้า <span className="font-bold text-amber-700">{currPage}</span> / <span className="font-bold text-amber-700">{totalPgs}</span></span>}
                    </div>
                    {totalPgs > 1 && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => onPageChange(1)} disabled={currPage === 1} className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="หน้าแรก"><i className="bi bi-chevron-double-left"></i></button>
                            <button onClick={() => onPageChange(currPage - 1)} disabled={currPage === 1} className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><i className="bi bi-chevron-left mr-1"></i><span className="hidden sm:inline">ก่อนหน้า</span></button>
                            <div className="hidden md:flex items-center gap-1">
                                {[...Array(totalPgs)].map((_, idx) => {
                                    const p = idx + 1;
                                    const show = p === 1 || p === 2 || p === totalPgs || p === totalPgs - 1 || Math.abs(p - currPage) <= 1;
                                    if (!show && p === 3 && currPage > 4) return <span key={p} className="px-2 text-gray-400">...</span>;
                                    if (!show && p === totalPgs - 2 && currPage < totalPgs - 3) return <span key={p} className="px-2 text-gray-400">...</span>;
                                    if (!show) return null;
                                    return <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${currPage === p ? 'bg-amber-600 text-white shadow-md' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-amber-50 hover:border-amber-300'}`}>{p}</button>;
                                })}
                            </div>
                            <button onClick={() => onPageChange(currPage + 1)} disabled={currPage === totalPgs} className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><span className="hidden sm:inline">ถัดไป</span><i className="bi bi-chevron-right ml-1"></i></button>
                            <button onClick={() => onPageChange(totalPgs)} disabled={currPage === totalPgs} className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="หน้าสุดท้าย"><i className="bi bi-chevron-double-right"></i></button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const loading = reportLoading || isLoadingClassrooms;

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Mobile First */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 mb-4 md:mb-6 border-t-4 border-amber-500">
                    <div className="flex items-start mb-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 flex items-center gap-2 sm:gap-3 leading-tight">
                                <i className="bi bi-graph-up-arrow text-2xl sm:text-3xl md:text-4xl flex-shrink-0"></i>
                                <span className="truncate">รายงานการเช็คชื่อนักเรียนเข้าแถว</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-1.5 leading-relaxed">สถิติและข้อมูลการเข้าแถวหน้าเสาธง</p>
                        </div>
                    </div>
                    {/* Tabs - underline style */}
                    <div className="flex items-center border-b border-gray-200 mt-4 md:mt-6">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${activeTab === 'history'
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <i className="bi bi-clock-history flex-shrink-0"></i>
                            <span>ประวัติการเช็คชื่อ</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${activeTab === 'summary'
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <i className="bi bi-bar-chart-line flex-shrink-0"></i>
                            <span>รายงานสรุป</span>
                        </button>
                    </div>

                    {/* Filters - below tabs, inside same card */}
                    <div className="pt-4 md:pt-5">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                <i className="bi bi-funnel text-amber-600 flex-shrink-0"></i>
                                <span className="text-sm font-semibold text-gray-700">ตัวกรอง</span>
                            </div>
                            <button
                                onClick={exportToExcel}
                                disabled={activeTab === 'history' ? allRecords.length === 0 : summaryStats.length === 0}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>ส่งออก Excel</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ห้องเรียน</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    disabled={isLoadingClassrooms}
                                >
                                    {isLoadingClassrooms ? (
                                        <option>กำลังโหลด...</option>
                                    ) : (
                                        classRoomList.map((cls) => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ค้นหานักเรียน</label>
                                <input
                                    type="text"
                                    value={searchStudent}
                                    onChange={(e) => setSearchStudent(e.target.value)}
                                    placeholder="ชื่อ, รหัสนักเรียน"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            {activeTab === 'history' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่เริ่มต้น</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่สิ้นสุด</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {activeTab === 'summary' && (
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ช่วงเวลาสรุป</label>
                                {/* Period tabs - underline style */}
                                <div className="flex border-b border-gray-200 mb-4">
                                    <button
                                        onClick={() => setReportPeriod('week')}
                                        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${reportPeriod === 'week'
                                                ? 'border-amber-500 text-amber-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        รายสัปดาห์
                                    </button>
                                    <button
                                        onClick={() => setReportPeriod('month')}
                                        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${reportPeriod === 'month'
                                                ? 'border-amber-500 text-amber-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        รายเดือน
                                    </button>
                                    <button
                                        onClick={() => setReportPeriod('semester')}
                                        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${reportPeriod === 'semester'
                                                ? 'border-amber-500 text-amber-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        ภาคเรียน
                                    </button>
                                </div>
                                {/* Week picker */}
                                {reportPeriod === 'week' && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => setSummaryWeekDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; })}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors min-h-[40px]"
                                            title="สัปดาห์ก่อนหน้า"
                                        >&#8249;</button>
                                        <div className="flex items-center gap-2 flex-1 min-w-[220px] flex-wrap">
                                            <input
                                                type="date"
                                                value={summaryWeekDate}
                                                onChange={e => setSummaryWeekDate(getMonday(e.target.value))}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                                                title="เลือกวันใดก็ได้ในสัปดาห์ที่ต้องการ"
                                            />
                                            <span className="text-sm font-semibold text-amber-700 whitespace-nowrap">
                                                จันทร์ {formatThaiShortDate(summaryWeekDate)} – อาทิตย์ {formatThaiShortDate(getSunday(summaryWeekDate))}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setSummaryWeekDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]; })}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors min-h-[40px]"
                                            title="สัปดาห์ถัดไป"
                                        >&#8250;</button>
                                    </div>
                                )}
                                {/* Month picker */}
                                {reportPeriod === 'month' && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => setSummaryMonthDate(prev => { const [y, m] = prev.split('-').map(Number); const d = new Date(y, m - 2, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors min-h-[40px]"
                                            title="เดือนก่อนหน้า"
                                        >&#8249;</button>
                                        <input
                                            type="month"
                                            value={summaryMonthDate}
                                            onChange={e => setSummaryMonthDate(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm flex-1 min-w-[160px]"
                                        />
                                        <button
                                            onClick={() => setSummaryMonthDate(prev => { const [y, m] = prev.split('-').map(Number); const d = new Date(y, m, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors min-h-[40px]"
                                            title="เดือนถัดไป"
                                        >&#8250;</button>
                                    </div>
                                )}
                                {/* Semester info */}
                                {reportPeriod === 'semester' && summaryData?.statistics && (
                                    <div className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                                        <i className="bi bi-calendar-range mr-2 text-amber-600"></i>
                                        {summaryData.statistics.periodLabel || `${formatThaiShortDate(summaryData.statistics.startDate)} – ${formatThaiShortDate(summaryData.statistics.endDate)}`}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {activeTab === 'history' && (loading ? (
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
                                        {Number(attendanceRate) > 10 ? `${attendanceRate}%` : null}
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
                        {allRecords.length > 0 && (
                            <div id="records-table" className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                                {/* Header with Record Count */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 md:mb-4">
                                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight">ตารางข้อมูลรายละเอียด</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <i className="bi bi-info-circle text-amber-600"></i>
                                        <span>แสดง <span className="font-bold text-amber-700">{startIndex + 1}-{Math.min(endIndex, allRecords.length)}</span> จากทั้งหมด <span className="font-bold text-amber-700">{allRecords.length}</span> รายการ</span>
                                    </div>
                                </div>

                                {/* Pagination above table */}
                                {renderPagination(allRecords.length, totalPages, currentPage, handlePageChange, recordsPerPage, setRecordsPerPage)}

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    onClick={() => handleSort('date')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap align-middle"
                                                >
                                                    วันที่<SortIcon col="date" />
                                                </th>
                                                <th
                                                    onClick={() => handleSort('studentNumber')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap align-middle"
                                                >
                                                    เลขประจำตัว<SortIcon col="studentNumber" />
                                                </th>
                                                <th
                                                    onClick={() => handleSort('studentName')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap align-middle"
                                                >
                                                    ชื่อ-นามสกุล<SortIcon col="studentName" />
                                                </th>
                                                <th
                                                    onClick={() => handleSort('classRoom')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap align-middle"
                                                >
                                                    ห้องเรียน<SortIcon col="classRoom" />
                                                </th>
                                                <th
                                                    onClick={() => handleSort('status')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap align-middle"
                                                >
                                                    สถานะ<SortIcon col="status" />
                                                </th>
                                                <th
                                                    onClick={() => handleSort('recorder')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none whitespace-nowrap align-middle"
                                                >
                                                    ผู้บันทึก<SortIcon col="recorder" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginatedRecords.map((record, index) => (
                                                <tr key={`${record.date}-${record.studentNumber}-${index}`} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                                        <div className="text-sm md:text-base text-gray-900">
                                                            {formatDate(record.recordedAt || record.date)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900 font-bold">
                                                        {record.studentNumber}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900">
                                                        {record.studentName}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900 font-medium">
                                                        {record.classRoom}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                                        {(() => {
                                                            const cfg = getStatusConfig(record.status); const Icon = cfg.icon; return (
                                                                <div className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.border} border-2 px-2.5 py-1.5 rounded-lg`}>
                                                                    <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
                                                                    <span className={`font-bold ${cfg.color} text-sm`}>{record.status}</span>
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-700">
                                                        {record.recorder || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    {paginatedRecords.map((record, index) => (
                                        <div
                                            key={`mobile-${record.date}-${record.studentNumber}-${index}`}
                                            className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-3 hover:border-amber-300 transition-colors"
                                        >
                                            {/* Header with Status */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 font-medium">รายการที่ {startIndex + index + 1}</span>
                                                {(() => {
                                                    const cfg = getStatusConfig(record.status); const Icon = cfg.icon; return (
                                                        <div className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.border} border-2 px-2.5 py-1.5 rounded-lg`}>
                                                            <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
                                                            <span className={`font-bold ${cfg.color} text-sm`}>{record.status}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-start gap-2">
                                                <i className="bi bi-calendar-event text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5">วันที่</p>
                                                    <p className="text-sm text-gray-800 leading-tight">
                                                        {formatDate(record.recordedAt || record.date)}
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

                                            {/* Recorder */}
                                            <div className="flex items-start gap-2">
                                                <i className="bi bi-person-check text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5">ผู้บันทึก</p>
                                                    <p className="text-sm font-semibold text-gray-700 leading-tight">
                                                        {record.recorder || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                            </div>
                        )}
                    </>
                ))}

                {/* Summary Tab */}
                {activeTab === 'summary' && (summaryLoading ? (
                    <LoadingSpinner message="กำลังโหลดรายงานสรุป..." />
                ) : (
                    <>
                        <div id="summary-table" className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                            <div className="mb-4">
                                <h2 className="text-base sm:text-lg font-bold text-gray-800">
                                    รายงานสรุปรายนักเรียน ({summaryData?.statistics?.periodLabel || ''})
                                    {summaryData?.statistics?.startDate && (
                                        <span className="text-sm font-normal text-gray-500 ml-2">{summaryData.statistics.startDate} ถึง {summaryData.statistics.endDate}</span>
                                    )}
                                </h2>
                            </div>

                            {summaryStats.length === 0 ? (
                                <div className="text-center py-12">
                                    <i className="bi bi-inbox text-5xl text-gray-300 mb-4 block"></i>
                                    <p className="text-gray-600 font-medium">ไม่พบข้อมูล</p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary Stats Cards - above table */}
                                    {summaryData?.statistics && (
                                        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                                                <div className="text-xs sm:text-sm text-gray-600 mb-1">จำนวนนักเรียน</div>
                                                <div className="text-xl sm:text-2xl font-bold text-blue-700">{summaryData.statistics.totalStudents} คน</div>
                                            </div>
                                            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4">
                                                <div className="text-xs sm:text-sm text-gray-600 mb-1">อัตราเข้าแถวเฉลี่ย</div>
                                                <div className="text-xl sm:text-2xl font-bold text-amber-700">{summaryData.statistics.overallAttendanceRate}%</div>
                                            </div>
                                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
                                                <div className="text-xs sm:text-sm text-gray-600 mb-1">เข้าแถว ≥ 90%</div>
                                                <div className="text-xl sm:text-2xl font-bold text-green-700">{summaryData.statistics.studentsAbove90} คน</div>
                                            </div>
                                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                                                <div className="text-xs sm:text-sm text-gray-600 mb-1">เข้าแถว &lt; 70%</div>
                                                <div className="text-xl sm:text-2xl font-bold text-red-700">{summaryData.statistics.studentsBelow70} คน</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pagination above table */}
                                    {renderPagination(summaryStats.length, summaryTotalPages, summaryPage, handleSummaryPageChange, summaryPerPage, setSummaryPerPage)}

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-amber-500 text-white">
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ลำดับ</th>
                                                    <th onClick={() => handleSummarySort('studentCode')} className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">รหัส<SummarySortIcon col="studentCode" /></th>
                                                    <th onClick={() => handleSummarySort('studentName')} className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">ชื่อ-สกุล<SummarySortIcon col="studentName" /></th>
                                                    <th onClick={() => handleSummarySort('classRoom')} className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">ห้อง<SummarySortIcon col="classRoom" /></th>
                                                    <th onClick={() => handleSummarySort('มา')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">มา<SummarySortIcon col="มา" /></th>
                                                    <th onClick={() => handleSummarySort('สาย')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">สาย<SummarySortIcon col="สาย" /></th>
                                                    <th onClick={() => handleSummarySort('ลาป่วย')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">ลาป่วย<SummarySortIcon col="ลาป่วย" /></th>
                                                    <th onClick={() => handleSummarySort('ลากิจ')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">ลากิจ<SummarySortIcon col="ลากิจ" /></th>
                                                    <th onClick={() => handleSummarySort('ขาด')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">ขาด<SummarySortIcon col="ขาด" /></th>
                                                    <th onClick={() => handleSummarySort('total')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">รวม<SummarySortIcon col="total" /></th>
                                                    <th onClick={() => handleSummarySort('attendanceRate')} className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-amber-600 select-none">% เข้าแถว<SummarySortIcon col="attendanceRate" /></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedSummary.map((st, idx) => {
                                                    const globalIdx = (summaryPage - 1) * summaryPerPage + idx + 1;
                                                    const rate = st.attendanceRate;
                                                    const rc = rate >= 90 ? 'text-green-700 bg-green-100' : rate >= 70 ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100';
                                                    return (
                                                        <tr key={st.studentCode} className="border-b hover:bg-gray-50 transition-colors">
                                                            <td className="px-3 py-3 text-sm">{globalIdx}</td>
                                                            <td className="px-3 py-3 text-sm font-semibold">{st.studentCode}</td>
                                                            <td className="px-3 py-3 text-sm">{st.studentName}</td>
                                                            <td className="px-3 py-3 text-sm">{st.classRoom}</td>
                                                            <td className="px-3 py-3 text-center"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold text-sm">{st.มา}</span></td>
                                                            <td className="px-3 py-3 text-center"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-semibold text-sm">{st.สาย}</span></td>
                                                            <td className="px-3 py-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold text-sm">{st.ลาป่วย}</span></td>
                                                            <td className="px-3 py-3 text-center"><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold text-sm">{st.ลากิจ}</span></td>
                                                            <td className="px-3 py-3 text-center"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold text-sm">{st.ขาด}</span></td>
                                                            <td className="px-3 py-3 text-center font-bold text-sm">{st.total}</td>
                                                            <td className="px-3 py-3 text-center"><span className={`px-2 py-0.5 rounded font-bold text-sm ${rc}`}>{st.attendanceRate}%</span></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3">
                                        {paginatedSummary.map((st, idx) => {
                                            const globalIdx = (summaryPage - 1) * summaryPerPage + idx + 1;
                                            const rate = st.attendanceRate;
                                            const rc = rate >= 90 ? 'text-green-700 bg-green-100' : rate >= 70 ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100';
                                            return (
                                                <div key={st.studentCode} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs text-gray-500">#{globalIdx}</span>
                                                        <span className={`px-3 py-1 rounded-full font-bold text-sm ${rc}`}>{st.attendanceRate}% เข้าแถว</span>
                                                    </div>
                                                    <div className="font-bold text-gray-800 mb-1">{st.studentName}</div>
                                                    <div className="text-sm text-gray-500 mb-3">รหัส {st.studentCode} | ห้อง {st.classRoom}</div>
                                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                        <div className="bg-green-100 rounded-lg p-2"><div className="font-bold text-green-700 text-base">{st.มา}</div><div className="text-gray-500">มา</div></div>
                                                        <div className="bg-yellow-100 rounded-lg p-2"><div className="font-bold text-yellow-700 text-base">{st.สาย}</div><div className="text-gray-500">สาย</div></div>
                                                        <div className="bg-red-100 rounded-lg p-2"><div className="font-bold text-red-700 text-base">{st.ขาด}</div><div className="text-gray-500">ขาด</div></div>
                                                        <div className="bg-blue-100 rounded-lg p-2"><div className="font-bold text-blue-700 text-base">{st.ลาป่วย}</div><div className="text-gray-500">ลาป่วย</div></div>
                                                        <div className="bg-purple-100 rounded-lg p-2"><div className="font-bold text-purple-700 text-base">{st.ลากิจ}</div><div className="text-gray-500">ลากิจ</div></div>
                                                        <div className="bg-gray-200 rounded-lg p-2"><div className="font-bold text-gray-700 text-base">{st.total}</div><div className="text-gray-500">รวม</div></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ))}
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
            <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-none">{(value ?? 0).toLocaleString()}</p>
        </div>
    );
};

export default FlagpoleAttendanceReport;
