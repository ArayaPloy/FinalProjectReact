import React, { useState, useMemo } from 'react';
import { FileText, History, TrendingUp, TrendingDown, Edit2, Save, X, Calendar, Filter, Download, Eye, Clock, User, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { 
    useGetBehaviorReportsHistoryQuery,
    useGetBehaviorReportsSummaryQuery,
    useUpdateBehaviorScoreMutation,
    useDeleteBehaviorScoreMutation
} from '../../../services/behaviorScoreApi';
import { useGetClassroomsQuery } from '../../../services/studentsApi';

const ReportBehaviorScore = () => {
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

    // RTK Query hooks
    const { data: classroomsData, isLoading: isLoadingClassrooms } = useGetClassroomsQuery();
    const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useGetBehaviorReportsHistoryQuery({
        classRoom: selectedClass === 'ทั้งหมด' ? undefined : selectedClass,
        search: searchStudent || undefined, // ใช้สำหรับค้นหาชื่อ/รหัสนักเรียน
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
    });
    const { data: summaryData, isLoading: isLoadingSummary, refetch: refetchSummary } = useGetBehaviorReportsSummaryQuery({
        classRoom: selectedClass === 'ทั้งหมด' ? undefined : selectedClass,
        search: searchStudent || undefined, // เพิ่มการค้นหาในหน้า Summary
        period: reportPeriod
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
        return historyData?.data || [];
    }, [historyData]);

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
                    updatedBy: 1 // TODO: Get from auth context
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
                    deletedBy: 1 // TODO: Get from auth context
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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-indigo-600">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <FileText className="w-8 h-8" />
                                </div>
                                รายงานบันทึกคะแนนความประพฤติ
                            </h1>
                            <p className="text-gray-600 mt-2 ml-1">โรงเรียนท่าบ่อพิทยาคม</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'history'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <History className="w-5 h-5" />
                            ประวัติการบันทึก
                        </button>
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'summary'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            รายงานสรุป
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-800">ตัวกรอง</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">ช่วงเวลาสรุป</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setReportPeriod('week')}
                                    className={`px-4 py-2 rounded-lg font-semibold ${reportPeriod === 'week'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    รายสัปดาห์
                                </button>
                                <button
                                    onClick={() => setReportPeriod('month')}
                                    className={`px-4 py-2 rounded-lg font-semibold ${reportPeriod === 'month'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    รายเดือน
                                </button>
                                <button
                                    onClick={() => setReportPeriod('semester')}
                                    className={`px-4 py-2 rounded-lg font-semibold ${reportPeriod === 'semester'
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
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                        >
                            <Download className="w-4 h-4" />
                            ส่งออก Excel
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                        >
                            <Download className="w-4 h-4" />
                            ส่งออก PDF
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'history' ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                ประวัติการบันทึก ({filteredRecords.length} รายการ)
                            </h2>
                        </div>

                        {isLoadingHistory ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-600 font-medium mt-4">กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">ไม่พบข้อมูล</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredRecords.map((record) => (
                                    <div
                                        key={record.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        {editingRecord === record.id ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            คะแนน
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={editForm.score}
                                                            onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            คะแนนปัจจุบัน
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={record.currentTotal}
                                                            disabled
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        รายละเอียด
                                                    </label>
                                                    <textarea
                                                        value={editForm.comments}
                                                        onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        rows="3"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(record.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        บันทึก
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-semibold text-gray-600">
                                                                {record.studentCode}
                                                            </span>
                                                            <span className="font-bold text-gray-800">{record.studentName}</span>
                                                            <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                                {record.classRoom}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600 mb-2">
                                                            <Calendar className="w-4 h-4 inline mr-1" />
                                                            {formatDate(record.createdAt)}
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-sm text-gray-700">{record.comments}</p>
                                                        </div>
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            <User className="w-3 h-3 inline mr-1" />
                                                            บันทึกโดย: {record.recorderName}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`text-2xl font-bold px-4 py-2 rounded-lg ${record.score > 0
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                    }`}
                                                            >
                                                                {record.score > 0 ? '+' : ''}{record.score}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            คะแนนรวม: <span className="font-bold">{record.currentTotal}</span>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleEdit(record)}
                                                                className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                                                                title="แก้ไข"
                                                                disabled={isUpdating || isDeleting}
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(record)}
                                                                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                                                                title="ลบ"
                                                                disabled={isUpdating || isDeleting}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleViewLogs(record)}
                                                                className="p-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors"
                                                                title="ดูประวัติการแก้ไข"
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
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
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white">
                                            <th className="px-4 py-3 text-left text-sm font-semibold">ลำดับ</th>
                                            <th 
                                                onClick={() => handleSort('studentCode')}
                                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                รหัสนักเรียน {getSortIcon('studentCode')}
                                            </th>
                                            <th 
                                                onClick={() => handleSort('studentName')}
                                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                ชื่อ-สกุล {getSortIcon('studentName')}
                                            </th>
                                            <th 
                                                onClick={() => handleSort('classRoom')}
                                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                ห้อง {getSortIcon('classRoom')}
                                            </th>
                                            <th 
                                                onClick={() => handleSort('recordCount')}
                                                className="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                จำนวนครั้ง {getSortIcon('recordCount')}
                                            </th>
                                            <th 
                                                onClick={() => handleSort('addedPoints')}
                                                className="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                <TrendingUp className="w-4 h-4 inline mr-1" />
                                                เพิ่ม {getSortIcon('addedPoints')}
                                            </th>
                                            <th 
                                                onClick={() => handleSort('deductedPoints')}
                                                className="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                <TrendingDown className="w-4 h-4 inline mr-1" />
                                                หัก {getSortIcon('deductedPoints')}
                                            </th>
                                            <th 
                                                onClick={() => handleSort('currentScore')}
                                                className="px-4 py-3 text-center text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
                                            >
                                                คะแนนรวม {getSortIcon('currentScore')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summaryStats.map((stat, index) => (
                                            <tr key={stat.studentCode} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-medium">{stat.studentCode}</td>
                                                <td className="px-4 py-3 text-sm">{stat.studentName}</td>
                                                <td className="px-4 py-3 text-sm">{stat.classRoom}</td>
                                                <td className="px-4 py-3 text-sm text-center">{stat.recordCount}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold text-sm">
                                                        +{stat.addedPoints || 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-semibold text-sm">
                                                        -{stat.deductedPoints || 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-bold text-sm">
                                                        {stat.currentScore}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Summary Totals */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">จำนวนนักเรียน</div>
                                        <div className="text-2xl font-bold text-blue-700">
                                            {summaryData?.data?.statistics?.totalStudents || 0}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">คะแนนเฉลี่ย</div>
                                        <div className="text-2xl font-bold text-purple-700">
                                            {summaryData?.data?.statistics?.averageScore || '100.00'}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">นักเรียนคะแนน ≥ 90</div>
                                        <div className="text-2xl font-bold text-green-700">
                                            {summaryData?.data?.statistics?.studentsAbove90 || 0} คน
                                        </div>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">นักเรียนคะแนน &lt; 70</div>
                                        <div className="text-2xl font-bold text-red-700">
                                            {summaryData?.data?.statistics?.studentsBelow70 || 0} คน
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Stats */}
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">คะแนนที่เพิ่มรวม</div>
                                        <div className="text-2xl font-bold text-green-700">
                                            +{summaryData?.data?.statistics?.totalAdded || 0}
                                        </div>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">คะแนนที่หักรวม</div>
                                        <div className="text-2xl font-bold text-red-700">
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                            <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Clock className="w-6 h-6" />
                                    ประวัติการแก้ไข
                                </h3>
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="text-white hover:bg-purple-700 p-2 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                                {selectedRecordLogs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium">ยังไม่มีประวัติการแก้ไข</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedRecordLogs.map((log, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-purple-600" />
                                                        <span className="font-semibold text-gray-800">{log.updatedBy}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{formatDate(log.updatedAt)}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-xs text-gray-500 mb-1">คะแนนเดิม</div>
                                                            <div className={`font-bold ${log.changes.oldScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {log.changes.oldScore > 0 ? '+' : ''}{log.changes.oldScore}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500 mb-1">คะแนนใหม่</div>
                                                            <div className={`font-bold ${log.changes.newScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {log.changes.newScore > 0 ? '+' : ''}{log.changes.newScore}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">รายละเอียดเดิม</div>
                                                        <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                                            {log.changes.oldComments}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">รายละเอียดใหม่</div>
                                                        <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
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