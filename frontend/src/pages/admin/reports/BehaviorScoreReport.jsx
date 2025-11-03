import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FileText, History, TrendingUp, TrendingDown, Edit2, Save, X, Calendar, Filter, Download, Eye, Clock, User, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { 
    useGetBehaviorReportsHistoryQuery,
    useGetBehaviorReportsSummaryQuery,
    useUpdateBehaviorScoreMutation,
    useDeleteBehaviorScoreMutation
} from '../../../services/behaviorScoreApi';
import { useGetClassroomsQuery } from '../../../services/studentsApi';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';

const ReportBehaviorScore = () => {
    const currentUser = useSelector(selectCurrentUser);
    const [activeTab, setActiveTab] = useState('history');
    const [selectedClass, setSelectedClass] = useState('ทั้งหมด');
    const [searchStudent, setSearchStudent] = useState(''); // สำหรับ History tab
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [reportPeriod, setReportPeriod] = useState('week');
    const [editingRecord, setEditingRecord] = useState(null);
    const [editForm, setEditForm] = useState({ score: 0, comments: '' });
    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedRecordLogs, setSelectedRecordLogs] = useState([]);
    
    // Sorting state for summary table
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // 🎯 Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const RECORDS_PER_PAGE = 50; // แสดง 50 รายการต่อหน้า

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
        search: searchStudent || undefined, // เพิ่มการค้นหาในหน้า Summary
        period: reportPeriod
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

    // Get filtered records
    const filteredRecords = useMemo(() => {
        const data = historyData?.data || [];
        console.log('History Data:', historyData);
        console.log('Filtered Records:', data);
        console.log('Selected Class:', selectedClass);
        console.log('Search Student:', searchStudent);
        console.log('Date Range:', dateRange);
        return data;
    }, [historyData, selectedClass, searchStudent, dateRange]);

    // 🎯 Pagination Logic
    const allRecords = filteredRecords;
    const totalPages = Math.ceil(allRecords.length / RECORDS_PER_PAGE);
    const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
    const endIndex = startIndex + RECORDS_PER_PAGE;
    const paginatedRecords = allRecords.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll to top of table
            document.getElementById('history-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedClass, searchStudent, dateRange]);

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

    // Handle sort
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sort icon
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
        }
        return sortConfig.direction === 'asc' 
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
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: error.data?.message || 'ไม่สามารถแก้ไขข้อมูลได้',
            });
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
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: error.data?.message || 'ไม่สามารถลบข้อมูลได้',
            });
        }
    };

    const handleViewLogs = (record) => {
        setSelectedRecordLogs(record.updateLogs || []);
        setShowLogModal(true);
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

    const exportToExcel = () => {
        Swal.fire({
            icon: 'info',
            title: 'กำลังพัฒนา',
            text: 'ฟีเจอร์นี้อยู่ระหว่างการพัฒนา',
            confirmButtonText: 'ตกลง'
        });
    };

    const exportToPDF = () => {
        Swal.fire({
            icon: 'info',
            title: 'กำลังพัฒนา',
            text: 'ฟีเจอร์นี้อยู่ระหว่างการพัฒนา',
            confirmButtonText: 'ตกลง'
        });
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

                    {/* Tabs - Mobile First with Horizontal Scroll */}
                    <div className="flex gap-2 mt-4 md:mt-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-4 sm:px-5 md:px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all touch-manipulation min-h-[48px] flex-shrink-0 ${activeTab === 'history'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                                }`}
                        >
                            <History className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="whitespace-nowrap">ประวัติการบันทึก</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex items-center gap-2 px-4 sm:px-5 md:px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all touch-manipulation min-h-[48px] flex-shrink-0 ${activeTab === 'summary'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                                }`}
                        >
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="whitespace-nowrap">รายงานสรุป</span>
                        </button>
                    </div>
                </div>

                {/* Filters - Mobile First */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Filter className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">ตัวกรอง</h2>
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
                                        className="w-full px- py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                            <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">ช่วงเวลาสรุป</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setReportPeriod('week')}
                                    className={`flex-1 sm:flex-none px-4 min-h-[48px] rounded-lg font-semibold text-base touch-manipulation transition-colors ${reportPeriod === 'week'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    รายสัปดาห์
                                </button>
                                <button
                                    onClick={() => setReportPeriod('month')}
                                    className={`flex-1 sm:flex-none px-4 min-h-[48px] rounded-lg font-semibold text-base touch-manipulation transition-colors ${reportPeriod === 'month'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    รายเดือน
                                </button>
                                <button
                                    onClick={() => setReportPeriod('semester')}
                                    className={`flex-1 sm:flex-none px-4 min-h-[48px] rounded-lg font-semibold text-base touch-manipulation transition-colors ${reportPeriod === 'semester'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    ภาคเรียน
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                
                {/* Export Buttons */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            onClick={exportToExcel}
                            className="flex items-center justify-center gap-2 px-4 min-h-[48px] bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base touch-manipulation transition-colors"
                        >
                            <Download className="w-5 h-5 flex-shrink-0" />
                            <span>ส่งออก Excel</span>
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center justify-center gap-2 px-4 min-h-[48px] bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-base touch-manipulation transition-colors"
                        >
                            <Download className="w-5 h-5 flex-shrink-0" />
                            <span>ส่งออก PDF</span>
                        </button>
                    </div>
                </div>               

                {/* Content */}
                {activeTab === 'history' ? (
                    <div id="history-table" className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                        {/* Header with Record Count */}
                        <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                                ประวัติการบันทึก
                            </h2>
                            {allRecords.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="bi bi-info-circle text-indigo-600"></i>
                                    <span>แสดง <span className="font-bold text-indigo-700">{startIndex + 1}-{Math.min(endIndex, allRecords.length)}</span> จากทั้งหมด <span className="font-bold text-indigo-700">{allRecords.length}</span> รายการ</span>
                                </div>
                            )}
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
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <div className="inline-block min-w-full align-middle">
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-indigo-600 text-white">
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">วันที่</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">รหัส</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ชื่อ-สกุล</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ห้อง</th>
                                                    <th className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap">คะแนน</th>
                                                    <th className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap">คะแนนรวม</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">รายละเอียด</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ผู้บันทึก</th>
                                                    <th className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedRecords.map((record) => (
                                                editingRecord === record.id ? (
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
                                                                        className="flex items-center justify-center gap-2 px-4 min-h-[48px] bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold touch-manipulation transition-colors"
                                                                    >
                                                                        <Save className="w-5 h-5 flex-shrink-0" />
                                                                        <span>บันทึก</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="flex items-center justify-center gap-2 px-4 min-h-[48px] bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold touch-manipulation transition-colors"
                                                                    >
                                                                        <X className="w-5 h-5 flex-shrink-0" />
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
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(record)}
                                                                    className="min-h-[36px] min-w-[36px] flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors touch-manipulation"
                                                                    title="แก้ไข"
                                                                    disabled={isUpdating || isDeleting}
                                                                >
                                                                    <Edit2 className="w-5 h-5 flex-shrink-0" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(record)}
                                                                    className="min-h-[36px] min-w-[36px] flex items-center justify-center bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors touch-manipulation"
                                                                    title="ลบ"
                                                                    disabled={isUpdating || isDeleting}
                                                                >
                                                                    <Trash2 className="w-5 h-5 flex-shrink-0" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleViewLogs(record)}
                                                                    className="min-h-[36px] min-w-[36px] flex items-center justify-center bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors touch-manipulation"
                                                                    title="ดูประวัติการแก้ไข"
                                                                >
                                                                    <Clock className="w-5 h-5 flex-shrink-0" />
                                                                </button>
                                                            </div>
                                                        </td>
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
                                            {editingRecord === record.id ? (
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
                                                            className="flex items-center justify-center gap-2 w-full min-h-[48px] bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold touch-manipulation transition-colors"
                                                        >
                                                            <Save className="w-5 h-5 flex-shrink-0" />
                                                            <span>บันทึก</span>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="flex items-center justify-center gap-2 w-full min-h-[48px] bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold touch-manipulation transition-colors"
                                                        >
                                                            <X className="w-5 h-5 flex-shrink-0" />
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

                                                    {/* Action Buttons */}
                                                    <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-gray-300">
                                                        <button
                                                            onClick={() => handleEdit(record)}
                                                            className="min-h-[48px] flex flex-col items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors touch-manipulation"
                                                            disabled={isUpdating || isDeleting}
                                                        >
                                                            <Edit2 className="w-5 h-5 flex-shrink-0 mb-1" />
                                                            <span className="text-xs font-semibold">แก้ไข</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(record)}
                                                            className="min-h-[48px] flex flex-col items-center justify-center bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors touch-manipulation"
                                                            disabled={isUpdating || isDeleting}
                                                        >
                                                            <Trash2 className="w-5 h-5 flex-shrink-0 mb-1" />
                                                            <span className="text-xs font-semibold">ลบ</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewLogs(record)}
                                                            className="min-h-[48px] flex flex-col items-center justify-center bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors touch-manipulation"
                                                        >
                                                            <Clock className="w-5 h-5 flex-shrink-0 mb-1" />
                                                            <span className="text-xs font-semibold">ประวัติ</span>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* 🎯 Pagination Controls - Mobile Optimized */}
                                {totalPages > 1 && (
                                    <div className="mt-6 md:mt-8 border-t-2 border-gray-200 pt-4 md:pt-6">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            {/* Page Info */}
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <i className="bi bi-files text-indigo-600"></i>
                                                <span>หน้า <span className="font-bold text-indigo-700">{currentPage}</span> จาก <span className="font-bold text-indigo-700">{totalPages}</span></span>
                                            </div>

                                            {/* Pagination Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* First Page */}
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    title="หน้าแรก"
                                                >
                                                    <i className="bi bi-chevron-double-left"></i>
                                                </button>

                                                {/* Previous Page */}
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <i className="bi bi-chevron-left mr-1"></i>
                                                    <span className="hidden sm:inline">ก่อนหน้า</span>
                                                </button>

                                                {/* Page Numbers - Show only on larger screens */}
                                                <div className="hidden md:flex items-center gap-1">
                                                    {[...Array(totalPages)].map((_, idx) => {
                                                        const pageNum = idx + 1;
                                                        // Show first 2, last 2, and 2 around current page
                                                        const showPage = 
                                                            pageNum === 1 || 
                                                            pageNum === 2 || 
                                                            pageNum === totalPages || 
                                                            pageNum === totalPages - 1 ||
                                                            Math.abs(pageNum - currentPage) <= 1;

                                                        if (!showPage && pageNum === 3 && currentPage > 4) {
                                                            return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                                        }
                                                        if (!showPage && pageNum === totalPages - 2 && currentPage < totalPages - 3) {
                                                            return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                                        }
                                                        if (!showPage) return null;

                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                                                                    currentPage === pageNum
                                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Next Page */}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <span className="hidden sm:inline">ถัดไป</span>
                                                    <i className="bi bi-chevron-right ml-1"></i>
                                                </button>

                                                {/* Last Page */}
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    title="หน้าสุดท้าย"
                                                >
                                                    <i className="bi bi-chevron-double-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-5 md:p-6">
                        <div className="mb-4 sm:mb-5 md:mb-6">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                รายงานสรุปคะแนน ({reportPeriod === 'week' ? 'รายสัปดาห์' : reportPeriod === 'month' ? 'รายเดือน' : 'ภาคเรียน'})
                            </h2>
                        </div>

                        {isLoadingSummary ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-600 font-medium mt-4">กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : summaryStats.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">ไม่พบข้อมูล</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
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
                                            {summaryStats.map((stat, index) => (
                                                <tr key={stat.studentCode} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">{index + 1}</td>
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
                                    {summaryStats.map((stat, index) => {
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
                                                        #{index + 1}
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

                        {summaryStats.length > 0 && (
                            <div>
                                {/* Summary Totals */}
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
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
                            </div>
                        )}
                    </div>
                )}

                {/* Log Modal */}
                {showLogModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:flex md:items-center md:justify-center md:p-4">
                        <div className="bg-white h-full md:h-auto md:rounded-xl shadow-xl w-full max-w-full md:max-w-2xl overflow-hidden flex flex-col">
                            <div className="bg-purple-600 text-white p-4 sm:p-5 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                    <span className="truncate">ประวัติการแก้ไข</span>
                                </h3>
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="min-h-[48px] min-w-[48px] flex items-center justify-center text-white hover:bg-purple-700 rounded-lg transition-colors touch-manipulation flex-shrink-0"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                </button>
                            </div>

                            <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1">
                                {selectedRecordLogs.length === 0 ? (
                                    <div className="text-center py-12 md:py-16">
                                        <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-base sm:text-lg text-gray-600 font-medium">ยังไม่มีประวัติการแก้ไข</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {selectedRecordLogs.map((log, index) => (
                                            <div key={index} className="border-2 border-gray-200 rounded-xl p-4 sm:p-5 bg-gray-50">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pb-3 border-b-2 border-gray-300">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                        <span className="font-bold text-gray-800 text-base sm:text-lg">{log.updatedBy}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                                                        <i className="bi bi-calendar-event flex-shrink-0"></i>
                                                        <span>{formatDate(log.updatedAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 sm:space-y-4">
                                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                        <div>
                                                            <div className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">คะแนนเดิม</div>
                                                            <div className={`text-lg sm:text-xl font-bold px-3 py-2 rounded-lg text-center ${log.changes.oldScore > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {log.changes.oldScore > 0 ? '+' : ''}{log.changes.oldScore}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">คะแนนใหม่</div>
                                                            <div className={`text-lg sm:text-xl font-bold px-3 py-2 rounded-lg text-center ${log.changes.newScore > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {log.changes.newScore > 0 ? '+' : ''}{log.changes.newScore}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">รายละเอียดเดิม</div>
                                                        <div className="text-sm sm:text-base text-gray-700 bg-white p-3 rounded-lg border border-gray-300 leading-relaxed">
                                                            {log.changes.oldComments}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs sm:text-sm text-gray-500 mb-2 font-semibold">รายละเอียดใหม่</div>
                                                        <div className="text-sm sm:text-base text-gray-700 bg-white p-3 rounded-lg border border-gray-300 leading-relaxed">
                                                            {log.changes.newComments}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportBehaviorScore;