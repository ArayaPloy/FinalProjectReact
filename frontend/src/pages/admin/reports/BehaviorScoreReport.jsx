import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FileText, History, TrendingUp, TrendingDown, Filter, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { MdModeEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';
import Swal from 'sweetalert2';
import { showApiError } from '../../../utils/sweetAlertHelper';
import {
    useGetBehaviorReportsHistoryQuery,
    useGetBehaviorReportsSummaryQuery,
    useUpdateBehaviorScoreMutation,
    useDeleteBehaviorScoreMutation
} from '../../../services/behaviorScoreApi';
import { useGetClassroomsQuery } from '../../../services/studentsApi';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';

// ─── Week/Month helper functions ────────────────────────────────────────
const getMonday = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return d.toISOString().split('T')[0];
};
const getSunday = (mondayStr) => {
    const d = new Date(mondayStr);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
};
const formatThaiShortDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

const ReportBehaviorScore = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
    const [activeTab, setActiveTab] = useState('history');
    const [selectedClass, setSelectedClass] = useState('ทั้งหมด');
    const [searchStudent, setSearchStudent] = useState(''); // สำหรับ History tab
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [reportPeriod, setReportPeriod] = useState('week');
    const [summaryWeekDate, setSummaryWeekDate] = useState(() => getMonday(new Date().toISOString().split('T')[0]));
    const [summaryMonthDate, setSummaryMonthDate] = useState(new Date().toISOString().slice(0, 7));
    const [editingRecord, setEditingRecord] = useState(null);
    const [editForm, setEditForm] = useState({ score: 0, comments: '' });
    // Sorting state for summary table
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    // Sorting state for history table
    const [historySortConfig, setHistorySortConfig] = useState({ key: null, direction: 'asc' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(25);
    const [summaryCurrentPage, setSummaryCurrentPage] = useState(1);
    const [summaryRecordsPerPage, setSummaryRecordsPerPage] = useState(25);

    // RTK Query hooks
    const { data: classroomsData, isLoading: isLoadingClassrooms } = useGetClassroomsQuery();
    const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory, isFetching } = useGetBehaviorReportsHistoryQuery({
        classRoom: selectedClass === 'ทั้งหมด' ? undefined : selectedClass,
        search: searchStudent || undefined, // ใช้สำหรับค้นหาชื่อ/รหัสนักเรียน
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
    }, {
        refetchOnMountOrArgChange: true,
        skip: false
    });
    const { data: summaryData, isLoading: isLoadingSummary, refetch: refetchSummary } = useGetBehaviorReportsSummaryQuery({
        classRoom: selectedClass === 'ทั้งหมด' ? undefined : selectedClass,
        search: searchStudent || undefined,
        period: reportPeriod,
        weekDate: reportPeriod === 'week' ? summaryWeekDate : undefined,
        monthDate: reportPeriod === 'month' ? summaryMonthDate : undefined,
    }, {
        refetchOnMountOrArgChange: true,
        skip: false
    });
    const [updateBehaviorScore, { isLoading: isUpdating }] = useUpdateBehaviorScoreMutation();
    const [deleteBehaviorScore, { isLoading: isDeleting }] = useDeleteBehaviorScoreMutation();

    // Prepare classroom list
    const classRoomList = useMemo(() => {
        const classrooms = classroomsData || [];
        return ['ทั้งหมด', ...classrooms];
    }, [classroomsData]);

    // Get filtered records (with sorting)
    const filteredRecords = useMemo(() => {
        const data = historyData?.data || [];

        if (historySortConfig.key) {
            return [...data].sort((a, b) => {
                let aVal = a[historySortConfig.key];
                let bVal = b[historySortConfig.key];

                if (aVal == null) return 1;
                if (bVal == null) return -1;

                // Date sorting
                if (historySortConfig.key === 'createdAt') {
                    aVal = new Date(aVal).getTime();
                    bVal = new Date(bVal).getTime();
                }

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    const cmp = aVal.localeCompare(bVal, 'th', { sensitivity: 'base', numeric: true });
                    return historySortConfig.direction === 'asc' ? cmp : -cmp;
                }

                if (aVal < bVal) return historySortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return historySortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [historyData, historySortConfig]);

    // Pagination Logic
    const allRecords = filteredRecords;
    const totalPages = Math.ceil(allRecords.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = allRecords.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll to top of table
            document.getElementById('history-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSummaryPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= summaryTotalPages) {
            setSummaryCurrentPage(newPage);
            document.getElementById('summary-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Reset to page 1 when filters, sort, or per-page changes
    React.useEffect(() => {
        setCurrentPage(1);
        setSummaryCurrentPage(1);
    }, [selectedClass, searchStudent, dateRange, historySortConfig, recordsPerPage]);

    React.useEffect(() => {
        setSummaryCurrentPage(1);
    }, [sortConfig, reportPeriod, summaryWeekDate, summaryMonthDate, summaryRecordsPerPage]);

    // Summary statistics with sorting
    const summaryStats = useMemo(() => {
        const data = summaryData?.data?.summary || [];

        // Apply sorting
        if (sortConfig.key) {
            const sorted = [...data].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle null/undefined values
                if (aValue == null) return 1;
                if (bValue == null) return -1;

                // Handle string comparison with Thai language support
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    const comparison = aValue.localeCompare(bValue, 'th', {
                        sensitivity: 'base',
                        numeric: true
                    });
                    return sortConfig.direction === 'asc' ? comparison : -comparison;
                }

                // Handle number comparison
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }

        return data;
    }, [summaryData, sortConfig]);

    // Summary Pagination Logic
    const summaryTotalPages = Math.ceil(summaryStats.length / summaryRecordsPerPage);
    const summaryStartIndex = (summaryCurrentPage - 1) * summaryRecordsPerPage;
    const summaryEndIndex = summaryStartIndex + summaryRecordsPerPage;
    const paginatedSummaryStats = summaryStats.slice(summaryStartIndex, summaryEndIndex);

    // Handle sort
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sort icon (summary)
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 inline ml-1" />
            : <ArrowDown className="w-4 h-4 inline ml-1" />;
    };

    // Handle sort for history table
    const handleHistorySort = (key) => {
        let direction = 'asc';
        if (historySortConfig.key === key && historySortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setHistorySortConfig({ key, direction });
    };

    // Get sort icon (history)
    const getHistorySortIcon = (columnKey) => {
        if (historySortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
        }
        return historySortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 inline ml-1" />
            : <ArrowDown className="w-4 h-4 inline ml-1" />;
    };

    const handleEdit = (record) => {
        setEditingRecord(record.id);
        setEditForm({
            score: record.score,
            comments: record.comments
        });
    };

    const handleSaveEdit = async (recordId) => {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการแก้ไข?',
                html: `
                    <div class="text-left">
                        <p class="mb-2"><strong>รายการที่:</strong> ${recordId}</p>
                        <p class="mb-2"><strong>คะแนนใหม่:</strong> ${editForm.score}</p>
                        <p class="mb-2"><strong>หมายเหตุ:</strong> ${editForm.comments}</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            });

            if (result.isConfirmed) {
                await updateBehaviorScore({
                    id: recordId,
                    score: editForm.score,
                    comments: editForm.comments,
                    updatedBy: currentUser?.id || 1
                }).unwrap();

                await Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขสำเร็จ!',
                    text: 'บันทึกการแก้ไขเรียบร้อยแล้ว',
                    timer: 1500,
                    showConfirmButton: false
                });

                setEditingRecord(null);
                refetchHistory();
                refetchSummary();
            }
        } catch (error) {
            showApiError(error, 'ไม่สามารถแก้ไขข้อมูลได้', 'แก้ไขข้อมูลคะแนนพฤติกรรม');
        }
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
        setEditForm({ score: 0, comments: '' });
    };

    const handleDelete = async (record) => {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการลบ?',
                html: `
                    <div class="text-left">
                        <p class="mb-2"><strong>นักเรียน:</strong> ${record.studentName}</p>
                        <p class="mb-2"><strong>คะแนน:</strong> ${record.score > 0 ? '+' : ''}${record.score}</p>
                        <p class="mb-2"><strong>หมายเหตุ:</strong> ${record.comments}</p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก'
            });

            if (result.isConfirmed) {
                await deleteBehaviorScore({
                    id: record.id,
                    deletedBy: currentUser?.id || 1
                }).unwrap();

                await Swal.fire({
                    icon: 'success',
                    title: 'ลบสำเร็จ!',
                    text: 'ลบข้อมูลเรียบร้อยแล้ว',
                    timer: 1500,
                    showConfirmButton: false
                });

                refetchHistory();
                refetchSummary();
            }
        } catch (error) {
            showApiError(error, 'ไม่สามารถลบข้อมูลได้', 'ลบข้อมูลคะแนนพฤติกรรม');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSummaryPeriodLabel = () => {
        if (reportPeriod === 'week') {
            return `จ. ${formatThaiShortDate(summaryWeekDate)} – อา. ${formatThaiShortDate(getSunday(summaryWeekDate))}`;
        }
        if (reportPeriod === 'month') {
            const [y, m] = summaryMonthDate.split('-');
            return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
        }
        return summaryData?.data?.statistics?.periodLabel || 'ภาคเรียนปัจจุบัน';
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
        const today = new Date().toISOString().split('T')[0];

        if (activeTab === 'summary') {
            if (!summaryStats || summaryStats.length === 0) {
                Swal.fire({ icon: 'error', title: 'ไม่มีข้อมูล', text: 'ไม่มีข้อมูลให้ส่งออก', confirmButtonText: 'ตกลง' });
                return;
            }
            const periodLabel = getSummaryPeriodLabel();
            const headers = ['ลำดับ', 'ช่วงเวลา', 'รหัสนักเรียน', 'ชื่อ-สกุล', 'ห้อง', 'จำนวนครั้ง', 'คะแนนเพิ่ม', 'คะแนนหัก', 'คะแนนรวม'];
            const rows = summaryStats.map((stat, idx) => [
                idx + 1,
                escapeCSV(periodLabel),
                stat.studentCode,
                escapeCSV(stat.studentName),
                `="${stat.classRoom}"`,
                stat.recordCount,
                stat.addedPoints || 0,
                stat.deductedPoints || 0,
                stat.currentScore
            ]);
            const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `behavior_summary_report_${today}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
        } else {
            if (!allRecords || allRecords.length === 0) {
                Swal.fire({ icon: 'error', title: 'ไม่มีข้อมูล', text: 'ไม่มีข้อมูลให้ส่งออก', confirmButtonText: 'ตกลง' });
                return;
            }
            const headers = ['วันที่', 'รหัส', 'ชื่อ-สกุล', 'ห้อง', 'คะแนน', 'คะแนนรวม', 'รายละเอียด', 'ผู้บันทึก'];
            const rows = allRecords.map((record) => [
                escapeCSV(formatDate(record.createdAt)),
                record.studentCode,
                escapeCSV(record.studentName),
                `="${record.classRoom}"`,
                record.score > 0 ? `+${record.score}` : record.score,
                record.currentTotal,
                escapeCSV(record.comments || ''),
                escapeCSV(record.recorderName || '-')
            ]);
            const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `behavior_history_report_${today}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
        }
        Swal.fire({ icon: 'success', title: 'ส่งออกสำเร็จ', text: 'ดาวน์โหลดไฟล์รายงานเรียบร้อย', timer: 2000, showConfirmButton: false });
    };

    const renderPagination = (totalCount, totalPgs, currPage, onPageChange, perPage, onPerPageChange) => {
        if (totalCount === 0 || totalPgs <= 0) return null;
        return (
            <div className="mb-4 md:mb-5 border-b-2 border-gray-200 pb-4 md:pb-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>แสดง</span>
                        <select value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))} className="px-2 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>รายการ/หน้า</span>
                        {totalPgs > 1 && <span className="text-gray-400">|</span>}
                        {totalPgs > 1 && <span>หน้า <span className="font-bold text-indigo-700">{currPage}</span> / <span className="font-bold text-indigo-700">{totalPgs}</span></span>}
                    </div>
                    {totalPgs > 1 && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => onPageChange(1)} disabled={currPage === 1} className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="หน้าแรก"><i className="bi bi-chevron-double-left"></i></button>
                            <button onClick={() => onPageChange(currPage - 1)} disabled={currPage === 1} className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><i className="bi bi-chevron-left mr-1"></i><span className="hidden sm:inline">ก่อนหน้า</span></button>
                            <div className="hidden md:flex items-center gap-1">
                                {[...Array(totalPgs)].map((_, idx) => {
                                    const p = idx + 1;
                                    const show = p === 1 || p === 2 || p === totalPgs || p === totalPgs - 1 || Math.abs(p - currPage) <= 1;
                                    if (!show && p === 3 && currPage > 4) return <span key={p} className="px-2 text-gray-400">...</span>;
                                    if (!show && p === totalPgs - 2 && currPage < totalPgs - 3) return <span key={p} className="px-2 text-gray-400">...</span>;
                                    if (!show) return null;
                                    return <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${currPage === p ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'}`}>{p}</button>;
                                })}
                            </div>
                            <button onClick={() => onPageChange(currPage + 1)} disabled={currPage === totalPgs} className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><span className="hidden sm:inline">ถัดไป</span><i className="bi bi-chevron-right ml-1"></i></button>
                            <button onClick={() => onPageChange(totalPgs)} disabled={currPage === totalPgs} className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="หน้าสุดท้าย"><i className="bi bi-chevron-double-right"></i></button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
            <div className="max-w-full mx-auto overflow-x-hidden">
                {/* Header - Mobile First */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 mb-4 md:mb-6 border-t-4 border-indigo-600">
                    <div className="flex items-start mb-4 md:mb-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 flex items-center gap-2 sm:gap-3 leading-tight">
                                <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </div>
                                <span className="truncate">รายงานบันทึกคะแนนความประพฤติ</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1.5 sm:mt-2 ml-0 sm:ml-1 leading-relaxed">โรงเรียนท่าบ่อพิทยาคม</p>
                        </div>
                    </div>

                    {/* Tabs - underline style */}
                    <div className="flex items-center border-b border-gray-200 mt-4 md:mt-6">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${activeTab === 'history'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <History className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>ประวัติการบันทึก</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${activeTab === 'summary'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span>รายงานสรุป</span>
                        </button>
                    </div>

                    {/* Filters - below tabs, inside same card */}
                    <div className="pt-4 md:pt-5">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-indigo-500 flex-shrink-0" />
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            {/* แสดง filter วันที่เฉพาะ History tab */}
                            {activeTab === 'history' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่เริ่มต้น</label>
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่สิ้นสุด</label>
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        รายสัปดาห์
                                    </button>
                                    <button
                                        onClick={() => setReportPeriod('month')}
                                        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${reportPeriod === 'month'
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        รายเดือน
                                    </button>
                                    <button
                                        onClick={() => setReportPeriod('semester')}
                                        className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors touch-manipulation flex-shrink-0 border-b-2 -mb-px ${reportPeriod === 'semester'
                                                ? 'border-indigo-600 text-indigo-600'
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
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                                title="เลือกวันใดก็ได้ในสัปดาห์ที่ต้องการ"
                                            />
                                            <span className="text-sm font-semibold text-indigo-700 whitespace-nowrap">
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
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm flex-1 min-w-[160px]"
                                        />
                                        <button
                                            onClick={() => setSummaryMonthDate(prev => { const [y, m] = prev.split('-').map(Number); const d = new Date(y, m, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 transition-colors min-h-[40px]"
                                            title="เดือนถัดไป"
                                        >&#8250;</button>
                                    </div>
                                )}
                                {/* Semester info */}
                                {reportPeriod === 'semester' && summaryData?.data?.statistics && (
                                    <div className="text-sm text-gray-700 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
                                        <i className="bi bi-calendar-range mr-2 text-indigo-600"></i>
                                        {summaryData.data.statistics.periodLabel || `${formatThaiShortDate(summaryData.data.statistics.startDate)} – ${formatThaiShortDate(summaryData.data.statistics.endDate)}`}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'history' ? (
                    <div id="history-table" className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                        {/* Header */}
                        <div className="mb-2 sm:mb-3">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                                ประวัติการบันทึก
                            </h2>
                        </div>

                        {isLoadingHistory || isFetching ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-600 font-medium mt-4">กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : allRecords.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">ไม่พบข้อมูล</p>
                            </div>
                        ) : (
                            <>
                                {/* Pagination above table */}
                                {renderPagination(allRecords.length, totalPages, currentPage, handlePageChange, recordsPerPage, setRecordsPerPage)}

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto mt-4">
                                    <div className="inline-block min-w-full align-middle">
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-indigo-600 text-white">
                                                    <th
                                                        onClick={() => handleHistorySort('createdAt')}
                                                        className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        วันที่ {getHistorySortIcon('createdAt')}
                                                    </th>
                                                    <th
                                                        onClick={() => handleHistorySort('studentCode')}
                                                        className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        รหัส {getHistorySortIcon('studentCode')}
                                                    </th>
                                                    <th
                                                        onClick={() => handleHistorySort('studentName')}
                                                        className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        ชื่อ-สกุล {getHistorySortIcon('studentName')}
                                                    </th>
                                                    <th
                                                        onClick={() => handleHistorySort('classRoom')}
                                                        className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        ห้อง {getHistorySortIcon('classRoom')}
                                                    </th>
                                                    <th
                                                        onClick={() => handleHistorySort('score')}
                                                        className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        คะแนน {getHistorySortIcon('score')}
                                                    </th>
                                                    <th
                                                        onClick={() => handleHistorySort('currentTotal')}
                                                        className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        คะแนนรวม {getHistorySortIcon('currentTotal')}
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">รายละเอียด</th>
                                                    <th
                                                        onClick={() => handleHistorySort('recorderName')}
                                                        className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                    >
                                                        ผู้บันทึก {getHistorySortIcon('recorderName')}
                                                    </th>
                                                    {isAdmin && <th className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap">จัดการ</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedRecords.map((record) => (
                                                    isAdmin && editingRecord === record.id ? (
                                                        <tr key={record.id} className="border-b bg-blue-50">
                                                            <td colSpan="9" className="px-4 md:px-6 py-4 md:py-5">
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                                คะแนน
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                value={editForm.score}
                                                                                onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) })}
                                                                                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                                คะแนนปัจจุบัน
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                value={record.currentTotal}
                                                                                disabled
                                                                                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg bg-gray-50"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                            รายละเอียด
                                                                        </label>
                                                                        <textarea
                                                                            value={editForm.comments}
                                                                            onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                                                                            className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                            rows="3"
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <button
                                                                            onClick={() => handleSaveEdit(record.id)}
                                                                            className="inline-flex items-center justify-center gap-2 px-4 min-h-[48px] bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-semibold touch-manipulation transition-colors"
                                                                        >
                                                                            <MdSave className="w-5 h-5 flex-shrink-0" />
                                                                            <span>บันทึก</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancelEdit}
                                                                            className="inline-flex items-center justify-center gap-2 px-4 min-h-[48px] bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold touch-manipulation transition-colors"
                                                                        >
                                                                            <MdClose className="w-5 h-5 flex-shrink-0" />
                                                                            <span>ยกเลิก</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr key={record.id} className="border-b hover:bg-gray-50 transition-colors">
                                                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                                                                {formatDate(record.createdAt)}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm font-semibold whitespace-nowrap">
                                                                {record.studentCode}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm">
                                                                {record.studentName}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                                                                {record.classRoom}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                <span className={`text-sm font-bold px-2 py-1 rounded-lg whitespace-nowrap ${record.score > 0
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {record.score > 0 ? '+' : ''}{record.score}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-3 text-center text-sm font-bold whitespace-nowrap">
                                                                {record.currentTotal}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm">
                                                                <div className="max-w-[120px] truncate" title={record.comments}>
                                                                    {record.comments}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3 text-sm">
                                                                <div className="max-w-[100px] truncate" title={record.recorderName}>
                                                                    {record.recorderName}
                                                                </div>
                                                            </td>
                                                            {isAdmin && (
                                                                <td className="px-3 py-3">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <button
                                                                            onClick={() => handleEdit(record)}
                                                                            className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors touch-manipulation"
                                                                            title="แก้ไข"
                                                                            disabled={isUpdating || isDeleting}
                                                                        >
                                                                            <MdModeEdit className="w-4 h-4 flex-shrink-0" />
                                                                            <span>แก้ไข</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(record)}
                                                                            className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors touch-manipulation"
                                                                            title="ลบ"
                                                                            disabled={isUpdating || isDeleting}
                                                                        >
                                                                            <MdDelete className="w-4 h-4 flex-shrink-0" />
                                                                            <span>ลบ</span>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    )
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile Cards View */}
                                <div className="md:hidden space-y-3">
                                    {paginatedRecords.map((record) => (
                                        <div
                                            key={record.id}
                                            className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                                        >
                                            {isAdmin && editingRecord === record.id ? (
                                                <div className="space-y-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                คะแนน
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={editForm.score}
                                                                onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) })}
                                                                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                คะแนนปัจจุบัน
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={record.currentTotal}
                                                                disabled
                                                                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg bg-gray-100"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                                รายละเอียด
                                                            </label>
                                                            <textarea
                                                                value={editForm.comments}
                                                                onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                                                                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                rows="3"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 pt-3 border-t-2 border-gray-300">
                                                        <button
                                                            onClick={() => handleSaveEdit(record.id)}
                                                            className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-semibold touch-manipulation transition-colors"
                                                        >
                                                            <MdSave className="w-5 h-5 flex-shrink-0" />
                                                            <span>บันทึก</span>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold touch-manipulation transition-colors"
                                                        >
                                                            <MdClose className="w-5 h-5 flex-shrink-0" />
                                                            <span>ยกเลิก</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Score Badge */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${record.score > 0
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {record.score > 0 ? '+' : ''}{record.score}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            คะแนนรวม: <span className="font-bold text-lg">{record.currentTotal}</span>
                                                        </span>
                                                    </div>

                                                    {/* Date */}
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                        <i className="bi bi-calendar-event flex-shrink-0"></i>
                                                        <span>{formatDate(record.createdAt)}</span>
                                                    </div>

                                                    {/* Student Info Grid */}
                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                        <div>
                                                            <div className="text-xs text-gray-500 mb-1">รหัสนักเรียน</div>
                                                            <div className="flex items-center gap-2">
                                                                <i className="bi bi-person-badge flex-shrink-0 text-indigo-600"></i>
                                                                <span className="font-semibold text-gray-800">{record.studentCode}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500 mb-1">ห้องเรียน</div>
                                                            <div className="flex items-center gap-2">
                                                                <i className="bi bi-building flex-shrink-0 text-indigo-600"></i>
                                                                <span className="font-semibold text-gray-800">{record.classRoom}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Student Name */}
                                                    <div className="pt-3 border-t-2 border-gray-300 mb-3">
                                                        <div className="text-xs text-gray-500 mb-1">ชื่อ-สกุล</div>
                                                        <div className="flex items-center gap-2">
                                                            <i className="bi bi-person flex-shrink-0 text-indigo-600"></i>
                                                            <span className="font-semibold text-gray-800">{record.studentName}</span>
                                                        </div>
                                                    </div>

                                                    {/* Comments */}
                                                    <div className="mb-3">
                                                        <div className="text-xs text-gray-500 mb-1">รายละเอียด</div>
                                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                            <div className="flex items-start gap-2">
                                                                <i className="bi bi-chat-dots flex-shrink-0 text-indigo-600 mt-0.5"></i>
                                                                <p className="text-sm text-gray-700 leading-relaxed">{record.comments}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Recorder */}
                                                    <div className="mb-3">
                                                        <div className="text-xs text-gray-500 mb-1">ผู้บันทึก</div>
                                                        <div className="flex items-center gap-2">
                                                            <i className="bi bi-person-check flex-shrink-0 text-indigo-600"></i>
                                                            <span className="text-sm text-gray-700">{record.recorderName}</span>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons - admin only */}
                                                    {isAdmin && (
                                                        <div className="grid grid-cols-2 gap-2 pt-3 border-t-2 border-gray-300">
                                                            <button
                                                                onClick={() => handleEdit(record)}
                                                                className="inline-flex items-center justify-center gap-1 min-h-[48px] px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors touch-manipulation"
                                                                disabled={isUpdating || isDeleting}
                                                            >
                                                                <MdModeEdit className="w-5 h-5 flex-shrink-0" />
                                                                <span>แก้ไข</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(record)}
                                                                className="inline-flex items-center justify-center gap-1 min-h-[48px] px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors touch-manipulation"
                                                                disabled={isUpdating || isDeleting}
                                                            >
                                                                <MdDelete className="w-5 h-5 flex-shrink-0" />
                                                                <span>ลบ</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div id="summary-table" className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                        <div className="mb-4 sm:mb-5 md:mb-6">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">
                                รายงานสรุปคะแนน ({reportPeriod === 'week' ? 'รายสัปดาห์' : reportPeriod === 'month' ? 'รายเดือน' : 'ภาคเรียน'})
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-3 py-1">
                                    <i className="bi bi-calendar-range"></i>
                                    <span>{getSummaryPeriodLabel()}</span>
                                </span>
                                {summaryStats.length > 0 && (
                                    <span className="text-gray-500">ทั้งหมด <span className="font-bold text-indigo-700">{summaryStats.length}</span> รายการ
                                        {summaryTotalPages > 1 && <span> · หน้า <span className="font-bold text-indigo-700">{summaryCurrentPage}</span>/{summaryTotalPages}</span>}
                                    </span>
                                )}
                            </div>
                        </div>

                        {isLoadingSummary ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-600 font-medium mt-4">กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : summaryStats.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <i className="bi bi-calendar-x text-3xl text-gray-400"></i>
                                </div>
                                <p className="text-gray-700 font-semibold text-base mb-1">ไม่มีการบันทึกคะแนนความประพฤติ</p>
                                <p className="text-gray-500 text-sm">ในช่วงเวลา <span className="font-semibold text-indigo-600">{getSummaryPeriodLabel()}</span></p>
                            </div>
                        ) : (
                            <>
                                {/* Summary Totals */}
                                <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 md:p-5">
                                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">จำนวนนักเรียน</div>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
                                            {summaryData?.data?.statistics?.totalStudents || 0}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3 sm:p-4 md:p-5">
                                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">คะแนนเฉลี่ย</div>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">
                                            {summaryData?.data?.statistics?.averageScore || '100.00'}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 md:p-5">
                                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">คะแนน ≥ 90</div>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                                            {summaryData?.data?.statistics?.studentsAbove90 || 0}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">คน</div>
                                    </div>
                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 md:p-5">
                                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">คะแนน &lt; 70</div>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700">
                                            {summaryData?.data?.statistics?.studentsBelow70 || 0}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">คน</div>
                                    </div>
                                </div>

                                {/* Additional Stats */}
                                <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 md:p-5">
                                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">คะแนนที่เพิ่มรวม</div>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                                            +{summaryData?.data?.statistics?.totalAdded || 0}
                                        </div>
                                    </div>
                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 md:p-5">
                                        <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">คะแนนที่หักรวม</div>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700">
                                            -{summaryData?.data?.statistics?.totalDeducted || 0}
                                        </div>
                                    </div>
                                </div>

                                {/* Pagination above table */}
                                {renderPagination(summaryStats.length, summaryTotalPages, summaryCurrentPage, handleSummaryPageChange, summaryRecordsPerPage, setSummaryRecordsPerPage)}

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto mt-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-indigo-600 text-white">
                                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-semibold">ลำดับ</th>
                                                <th
                                                    onClick={() => handleSort('studentCode')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    รหัสนักเรียน {getSortIcon('studentCode')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('studentName')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    ชื่อ-สกุล {getSortIcon('studentName')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('classRoom')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    ห้อง {getSortIcon('classRoom')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('recordCount')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-center text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    จำนวนครั้ง {getSortIcon('recordCount')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('addedPoints')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-center text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 inline mr-1 flex-shrink-0" />
                                                    เพิ่ม {getSortIcon('addedPoints')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('deductedPoints')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-center text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    <TrendingDown className="w-4 h-4 md:w-5 md:h-5 inline mr-1 flex-shrink-0" />
                                                    หัก {getSortIcon('deductedPoints')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('currentScore')}
                                                    className="px-4 md:px-6 py-3 md:py-4 text-center text-sm md:text-base font-semibold cursor-pointer hover:bg-indigo-700 transition-colors touch-manipulation"
                                                >
                                                    คะแนนรวม {getSortIcon('currentScore')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedSummaryStats.map((stat, index) => (
                                                <tr key={stat.studentCode} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">{summaryStartIndex + index + 1}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold">{stat.studentCode}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">{stat.studentName}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">{stat.classRoom}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-center font-semibold">{stat.recordCount}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold text-sm md:text-base">
                                                            +{stat.addedPoints || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-semibold text-sm md:text-base">
                                                            -{stat.deductedPoints || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg font-bold text-sm md:text-base">
                                                            {stat.currentScore}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards View */}
                                <div className="md:hidden space-y-3">
                                    {paginatedSummaryStats.map((stat, index) => {
                                        const scoreColor = stat.currentScore >= 90
                                            ? 'bg-green-100 text-green-700 border-green-300'
                                            : stat.currentScore >= 70
                                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                : 'bg-red-100 text-red-700 border-red-300';

                                        return (
                                            <div
                                                key={stat.studentCode}
                                                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                                            >
                                                {/* Header with Index and Score */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
                                                        #{summaryStartIndex + index + 1}
                                                    </span>
                                                    <span className={`text-2xl font-bold px-4 py-2 rounded-lg border-2 ${scoreColor}`}>
                                                        {stat.currentScore}
                                                    </span>
                                                </div>

                                                {/* Student Info */}
                                                <div className="space-y-2 mb-3">
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">รหัสนักเรียน</div>
                                                        <div className="flex items-center gap-2">
                                                            <i className="bi bi-person-badge flex-shrink-0 text-indigo-600"></i>
                                                            <span className="font-semibold text-gray-800">{stat.studentCode}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">ชื่อ-สกุล</div>
                                                        <div className="flex items-center gap-2">
                                                            <i className="bi bi-person flex-shrink-0 text-indigo-600"></i>
                                                            <span className="font-semibold text-gray-800">{stat.studentName}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">ห้องเรียน</div>
                                                        <div className="flex items-center gap-2">
                                                            <i className="bi bi-building flex-shrink-0 text-indigo-600"></i>
                                                            <span className="font-semibold text-gray-800">{stat.classRoom}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Statistics Grid */}
                                                <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-gray-300">
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500 mb-1">จำนวนครั้ง</div>
                                                        <div className="bg-gray-100 rounded-lg py-2">
                                                            <div className="text-lg font-bold text-gray-800">{stat.recordCount}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                                                            <TrendingUp className="w-3 h-3 flex-shrink-0" />
                                                            <span>เพิ่ม</span>
                                                        </div>
                                                        <div className="bg-green-100 rounded-lg py-2">
                                                            <div className="text-lg font-bold text-green-700">+{stat.addedPoints || 0}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                                                            <TrendingDown className="w-3 h-3 flex-shrink-0" />
                                                            <span>หัก</span>
                                                        </div>
                                                        <div className="bg-red-100 rounded-lg py-2">
                                                            <div className="text-lg font-bold text-red-700">-{stat.deductedPoints || 0}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportBehaviorScore;