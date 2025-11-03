import React, { useState, useEffect, useMemo } from 'react';
import { Award, TrendingUp, TrendingDown, Save, RotateCcw, AlertCircle, Info, BookOpen, Users, CheckCircle, History, X } from 'lucide-react';
import Swal from 'sweetalert2';
import {
    useSaveBehaviorScoresMutation,
    useGetStudentHistoryQuery
} from '../../services/behaviorScoreApi';
import { useGetClassroomsQuery, useGetStudentsWithScoresQuery } from '../../services/studentsApi';// ไม่ต้องใช้ mock classrooms แล้ว - ดึงจาก API

const addScoreCriteria = [
    { id: 1, points: 5, description: 'รักษาความสะอาด/เก็บของที่มีราคาไม่เกิน 50 บาท/ช่วยเหลือครูหรือคนอื่นเสมอ/เป็นตัวแทนเข้าร่วมแข่งขันระดับ ร.ร.' },
    { id: 2, points: 10, description: 'ช่วยเหลือกิจกรรม ร.ร./เก็บของที่มีราคามากกว่า 50 บาท/เป็นตัวแทนเข้าร่วมแข่งขันระดับอำเภอ' },
    { id: 3, points: 20, description: 'เป็นตัวแทนเข้าร่วมแข่งขันต่าง ๆ ระดับจังหวัด/เข้าร่วมประชุม/อบรมสัมมนา/เรียนดีความประพฤติดีอย่างสม่ำเสมอ' },
    { id: 4, points: 30, description: 'เป็นตัวแทนเข้าร่วมแข่งขันระดับภาค/เข้าร่วมบริจาคเลือด' },
    { id: 5, points: 50, description: 'นำชื่อเสียงมาสู่โรงเรียน' }
];

const deductScoreCriteria = [
    { id: 6, points: -5, description: 'มาสาย/แต่งกายผิดระเบียบ/เสียงดัง/ห้องสกปรก/พูดจาหยาบคาย/ทานอาหารในเวลาเรียน' },
    { id: 7, points: -10, description: 'ขาดเรียนเกิน 3 วัน/ออกนอกบริเวณโรงเรียน/ทรงผมไม่เหมาะสม/ไม่สวมหมวกนิรภัย' },
    { id: 8, points: -20, description: 'หนีเรียน/สูบบุหรี่/เล่นการพนัน/ลักขโมย/ทะเลาะวิวาท/ไม่เข้าร่วมกิจกรรม/เที่ยวกลางคืน' },
    { id: 9, points: -30, description: 'เสพยาเสพติด/ทะเลาะวิวาทระหว่างโรงเรียน/พกพาอาวุธ/นำโทรศัพท์หรือสื่อลามกมาโรงเรียน/ก่าวร้าวครูอาจารย์' },
    { id: 10, points: -50, description: 'ซื้อขายยาเสพติด/นำความเสื่อมเสียมาสู่โรงเรียน' }
];

const BehaviorScorePage = () => {
    const [selectedClass, setSelectedClass] = useState('ทั้งหมด');
    const [searchQuery, setSearchQuery] = useState('');
    const [scoreRecords, setScoreRecords] = useState({});
    const [originalScoreRecords, setOriginalScoreRecords] = useState({});
    const [showCriteria, setShowCriteria] = useState(false);
    const [bulkScoreMode, setBulkScoreMode] = useState(false);
    const [bulkCriteria, setBulkCriteria] = useState(null);
    const [bulkComment, setBulkComment] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // RTK Query hooks
    const { data: classroomsData, isLoading: isLoadingClassrooms } = useGetClassroomsQuery();
    const { data: studentsData, isLoading, refetch } = useGetStudentsWithScoresQuery(
        { classRoom: selectedClass, search: searchQuery },
        { skip: !selectedClass }
    );
    const [saveBehaviorScores, { isLoading: isSaving }] = useSaveBehaviorScoresMutation();
    const { data: historyData, isLoading: isLoadingHistory } = useGetStudentHistoryQuery(
        selectedStudentForHistory,
        { skip: !selectedStudentForHistory }
    );

    const classRoomList = classroomsData || [];
    const students = studentsData?.data || [];

    const filteredStudents = useMemo(() => {
        return students; // API already filters by class and search
    }, [students]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedClass, searchQuery, itemsPerPage]);

    const scoreStats = useMemo(() => {
        const total = filteredStudents.length;
        const recorded = filteredStudents.filter(student =>
            scoreRecords[student.id] !== null && scoreRecords[student.id] !== undefined
        ).length;
        const notRecorded = total - recorded;
        const totalAdded = Object.values(scoreRecords).reduce((sum, record) => {
            if (record && record.points && record.points > 0) return sum + record.points;
            return sum;
        }, 0);
        const totalDeducted = Object.values(scoreRecords).reduce((sum, record) => {
            if (record && record.points && record.points < 0) return sum + record.points;
            return sum;
        }, 0);
        return { total, recorded, notRecorded, totalAdded, totalDeducted };
    }, [filteredStudents, scoreRecords]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(scoreRecords) !== JSON.stringify(originalScoreRecords);
    }, [scoreRecords, originalScoreRecords]);

    useEffect(() => {
        if (classRoomList.length > 0 && !selectedClass) {
            setSelectedClass('ทั้งหมด');
        }
    }, [classRoomList, selectedClass]);

    useEffect(() => {
        if (filteredStudents.length === 0) return;
        const defaultRecords = {};
        filteredStudents.forEach((student) => {
            defaultRecords[student.id] = null;
        });
        setScoreRecords(defaultRecords);
        setOriginalScoreRecords(defaultRecords);
    }, [selectedClass, filteredStudents.length]);

    const handleScoreChange = (studentId, criteriaId, points, description) => {
        setScoreRecords((prev) => {
            if (prev[studentId]?.criteriaId === criteriaId) {
                return { ...prev, [studentId]: null };
            }
            return { ...prev, [studentId]: { criteriaId, points, description, comment: '' } };
        });
    };

    const handleCommentChange = (studentId, comment) => {
        setScoreRecords((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], comment }
        }));
    };

    const handleToggleStudent = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            }
            return [...prev, studentId];
        });
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };

    const handleBulkScoreChange = (criteriaId, points, description) => {
        setBulkCriteria({ criteriaId, points, description });
    };

    const handleApplyBulkScore = async () => {
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!bulkCriteria || selectedStudents.length === 0 || !bulkComment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                html: `
                    <div class="text-left space-y-2">
                        <p class="text-gray-700">กรุณาตรวจสอบข้อมูลต่อไปนี้:</p>
                        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            ${!bulkCriteria ? '<li>เลือกคะแนนที่ต้องการบันทึก</li>' : ''}
                            ${selectedStudents.length === 0 ? '<li>เลือกนักเรียนอย่างน้อย 1 คน</li>' : ''}
                            ${!bulkComment.trim() ? '<li>กรอกเหตุผลการให้คะแนน</li>' : ''}
                        </ul>
                    </div>
                `,
                confirmButtonColor: '#D97706',
                confirmButtonText: 'เข้าใจแล้ว',
                customClass: {
                    confirmButton: 'font-bold px-6 py-3'
                }
            });
            return;
        }

        // ยืนยันการบันทึก
        const result = await Swal.fire({
            title: 'ยืนยันการบันทึกกลุ่ม',
            html: `
                <div class="text-left space-y-3">
                    <p class="text-gray-700">คุณต้องการบันทึกคะแนนกลุ่มใช่หรือไม่?</p>
                    
                    <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <i class="bi bi-people-fill text-amber-600"></i>
                                <span class="text-gray-700">จำนวนนักเรียน: <strong class="text-amber-700">${selectedStudents.length}</strong> คน</span>
                            </div>
                            <div class="flex items-center gap-2">
                                ${bulkCriteria.points > 0 
                                    ? '<i class="bi bi-arrow-up-circle-fill text-green-600"></i>' 
                                    : '<i class="bi bi-arrow-down-circle-fill text-red-600"></i>'}
                                <span class="text-gray-700">คะแนน: <strong class="${bulkCriteria.points > 0 ? 'text-green-600' : 'text-red-600'}">${bulkCriteria.points > 0 ? '+' : ''}${bulkCriteria.points}</strong> คะแนน</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                        <p class="text-xs text-gray-500 mb-1">เหตุผล:</p>
                        <p class="text-gray-700 text-sm">${bulkComment}</p>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-circle-fill mr-2"></i>ยืนยัน',
            cancelButtonText: '<i class="bi bi-x-circle mr-2"></i>ยกเลิก',
            confirmButtonColor: '#D97706',
            cancelButtonColor: '#6B7280',
            reverseButtons: true,
            customClass: {
                confirmButton: 'font-bold px-6 py-3',
                cancelButton: 'font-bold px-6 py-3'
            }
        });

        if (!result.isConfirmed) return;

        // บันทึกคะแนน
        const newRecords = { ...scoreRecords };
        selectedStudents.forEach(studentId => {
            newRecords[studentId] = { ...bulkCriteria, comment: bulkComment };
        });
        setScoreRecords(newRecords);

        // แสดงผลสำเร็จ
        Swal.fire({
            icon: 'success',
            title: 'บันทึกคะแนนกลุ่มสำเร็จ!',
            html: `
                <div class="space-y-3">
                    <p class="text-gray-700">บันทึกคะแนนความประพฤติกลุ่มเรียบร้อยแล้ว</p>
                    <div class="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-green-700">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>บันทึกสำเร็จ <strong>${selectedStudents.length}</strong> คน</span>
                            </div>
                            <div class="flex items-center gap-2 text-green-700">
                                ${bulkCriteria.points > 0 
                                    ? '<i class="bi bi-arrow-up-circle-fill"></i>' 
                                    : '<i class="bi bi-arrow-down-circle-fill"></i>'}
                                <span>คะแนน: <strong>${bulkCriteria.points > 0 ? '+' : ''}${bulkCriteria.points}</strong> คะแนน</span>
                            </div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-500">
                        <i class="bi bi-info-circle mr-1"></i>
                        กรุณากดปุ่ม "บันทึกข้อมูล" ด้านล่างเพื่อบันทึกลงฐานข้อมูล
                    </p>
                </div>
            `,
            confirmButtonColor: '#10B981', // Green
            confirmButtonText: 'เรียบร้อย',
            timer: 5000,
            timerProgressBar: true,
            customClass: {
                confirmButton: 'font-bold px-6 py-3'
            }
        });

        // รีเซ็ตโหมดบันทึกกลุ่ม
        setBulkScoreMode(false);
        setSelectedStudents([]);
        setBulkCriteria(null);
        setBulkComment('');
    };

    const handleCancelBulk = async () => {
        const result = await Swal.fire({
            title: 'ยกเลิกโหมดบันทึกกลุ่ม?',
            html: `
                <div class="text-left space-y-2">
                    <p class="text-gray-700">การตั้งค่าทั้งหมดจะถูกรีเซ็ต:</p>
                    <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm">
                        ${selectedStudents.length > 0 ? `<li>นักเรียนที่เลือก (${selectedStudents.length} คน)</li>` : ''}
                        ${bulkCriteria ? `<li>คะแนนที่เลือก (${bulkCriteria.points > 0 ? '+' : ''}${bulkCriteria.points} คะแนน)</li>` : ''}
                        ${bulkComment.trim() ? '<li>เหตุผลที่กรอก</li>' : ''}
                    </ul>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-circle mr-2"></i>ใช่, ยกเลิก',
            cancelButtonText: '<i class="bi bi-x-circle mr-2"></i>ไม่, กลับไป',
            confirmButtonColor: '#EF4444', // Red
            cancelButtonColor: '#6B7280', // Gray
            reverseButtons: true,
            customClass: {
                confirmButton: 'font-bold px-6 py-3',
                cancelButton: 'font-bold px-6 py-3'
            }
        });

        if (result.isConfirmed) {
            setBulkScoreMode(false);
            setSelectedStudents([]);
            setBulkCriteria(null);
            setBulkComment('');

            Swal.fire({
                icon: 'info',
                title: 'ยกเลิกแล้ว',
                text: 'ออกจากโหมดบันทึกกลุ่มเรียบร้อย',
                confirmButtonColor: '#D97706',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    };

    const handleReset = async () => {
        const result = await Swal.fire({
            title: 'ยืนยันการยกเลิก?',
            html: `
                <div class="text-left space-y-2">
                    <p class="text-gray-700">การเปลี่ยนแปลงทั้งหมดจะถูกยกเลิก</p>
                    <div class="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 mt-3">
                        <p class="text-orange-800 text-sm">
                            <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                            ข้อมูลจะกลับไปเป็นค่าเดิมก่อนแก้ไข
                        </p>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-arrow-counterclockwise mr-2"></i>ใช่, ยกเลิก',
            cancelButtonText: '<i class="bi bi-x-circle mr-2"></i>ไม่, กลับไป',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            reverseButtons: true,
            customClass: {
                confirmButton: 'font-bold px-6 py-3',
                cancelButton: 'font-bold px-6 py-3'
            }
        });

        if (result.isConfirmed) {
            setScoreRecords({ ...originalScoreRecords });
            
            Swal.fire({
                icon: 'success',
                title: 'ยกเลิกสำเร็จ',
                text: 'ย้อนกลับไปเป็นค่าเดิมแล้ว',
                confirmButtonColor: '#D97706',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    };

    const handleSave = async () => {
        try {
            const records = Object.entries(scoreRecords)
                .filter(([_, record]) => record !== null)
                .map(([studentId, record]) => ({
                    studentId: parseInt(studentId),
                    score: record.points,
                    comments: record.comment || record.description
                }));

            if (records.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ไม่มีข้อมูลที่ต้องบันทึก',
                    text: 'กรุณาเลือกคะแนนสำหรับนักเรียนอย่างน้อย 1 คน',
                    confirmButtonColor: '#D97706', // Amber theme
                });
                return;
            }

            const confirmed = await Swal.fire({
                title: 'ยืนยันการบันทึก',
                html: `
                    <div class="text-left space-y-2">
                        <p class="text-gray-700">คุณต้องการบันทึกคะแนนความประพฤติสำหรับ</p>
                        <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 my-3">
                            <p class="text-amber-800 font-bold text-lg">${records.length} คน</p>
                        </div>
                        ${scoreStats.totalAdded > 0 ? `
                            <div class="flex items-center gap-2 text-green-600">
                                <i class="bi bi-arrow-up-circle-fill"></i>
                                <span>เพิ่มคะแนน: <strong>+${scoreStats.totalAdded}</strong> คะแนน</span>
                            </div>
                        ` : ''}
                        ${scoreStats.totalDeducted < 0 ? `
                            <div class="flex items-center gap-2 text-red-600">
                                <i class="bi bi-arrow-down-circle-fill"></i>
                                <span>หักคะแนน: <strong>${scoreStats.totalDeducted}</strong> คะแนน</span>
                            </div>
                        ` : ''}
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '<i class="bi bi-check-circle-fill mr-2"></i>ยืนยันการบันทึก',
                cancelButtonText: '<i class="bi bi-x-circle mr-2"></i>ยกเลิก',
                confirmButtonColor: '#D97706', // Amber
                cancelButtonColor: '#6B7280', // Gray
                reverseButtons: true,
                customClass: {
                    confirmButton: 'font-bold px-6 py-3',
                    cancelButton: 'font-bold px-6 py-3'
                }
            });

            if (!confirmed.isConfirmed) return;

            // แสดง Loading Alert
            Swal.fire({
                title: 'กำลังบันทึก...',
                html: '<div class="flex items-center justify-center gap-3"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div><span class="text-gray-600">กรุณารอสักครู่</span></div>',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // TODO: ใส่ recorderId จริงจาก user ที่ login
            const result = await saveBehaviorScores({
                records,
                recorderId: 1 // ควรดึงจาก auth context
            }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                html: `
                    <div class="space-y-3">
                        <p class="text-gray-700">${result.message || 'บันทึกคะแนนความประพฤติเรียบร้อยแล้ว'}</p>
                        <div class="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                            <p class="text-green-800 font-bold">
                                <i class="bi bi-check-circle-fill mr-2"></i>
                                บันทึกสำเร็จ ${records.length} รายการ
                            </p>
                        </div>
                    </div>
                `,
                confirmButtonColor: '#D97706',
                confirmButtonText: 'เรียบร้อย',
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    confirmButton: 'font-bold px-6 py-3'
                }
            });

            // Reset state
            setScoreRecords({});
            setOriginalScoreRecords({});
            refetch(); // Refresh data

        } catch (error) {
            console.error('Error saving:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                html: `
                    <div class="space-y-2">
                        <p class="text-gray-700">ไม่สามารถบันทึกข้อมูลได้</p>
                        <div class="bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-3">
                            <p class="text-red-800 text-sm">
                                <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                                ${error.data?.message || 'กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ'}
                            </p>
                        </div>
                    </div>
                `,
                confirmButtonColor: '#EF4444', // Red
                confirmButtonText: 'ปิด',
                customClass: {
                    confirmButton: 'font-bold px-6 py-3'
                }
            });
        }
    };

    const handleViewHistory = (student) => {
        setSelectedStudentForHistory(student.id);
        setShowHistoryModal(true);
    };

    const closeHistoryModal = () => {
        setShowHistoryModal(false);
        setSelectedStudentForHistory(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32 md:pb-24">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
                {/* Header - Mobile Optimized */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 sm:px-5 md:px-6 py-6 md:py-8">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="p-2.5 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl backdrop-blur-sm flex-shrink-0">
                                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                                    ระบบบันทึกคะแนนความประพฤติ
                                </h1>
                                <p className="text-amber-100 mt-1 md:mt-1.5 flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                                    <i className="bi bi-building flex-shrink-0"></i>
                                    <span className="truncate">โรงเรียนท่าบ่อพิทยาคม</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters - Mobile First */}
                    <div className="px-4 sm:px-5 md:px-6 py-4 md:py-5 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-people-fill text-amber-600 text-base md:text-base"></i>
                                    <span>ห้องเรียน</span>
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
                                    disabled={isLoadingClassrooms}
                                >
                                    {isLoadingClassrooms ? (
                                        <option>กำลังโหลด...</option>
                                    ) : (
                                        <>
                                            <option value="ทั้งหมด">ทุกห้องเรียน</option>
                                            {classRoomList.map((cls) => <option key={cls} value={cls}>ห้อง {cls}</option>)}
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-search text-amber-600 text-base md:text-base"></i>
                                    <span>ค้นหานักเรียน</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="ชื่อหรือรหัสนักเรียน"
                                        className="w-full px-4 py-3 md:py-3.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                            title="ล้างการค้นหา"
                                        >
                                            <i className="bi bi-x-circle-fill text-lg"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-file-text-fill text-amber-600 text-base md:text-base"></i>
                                    <span>แสดงต่อหน้า</span>
                                </label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
                                >
                                    <option value={10}>10 รายการ</option>
                                    <option value={20}>20 รายการ</option>
                                    <option value={30}>30 รายการ</option>
                                    <option value={50}>50 รายการ</option>
                                    <option value={100}>100 รายการ</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Criteria Section - Mobile Optimized */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg mb-4 md:mb-6 overflow-hidden">
                    <button
                        onClick={() => setShowCriteria(!showCriteria)}
                        className="flex items-center justify-between w-full p-4 sm:p-5 md:p-6 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                    >
                        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 md:gap-2 text-gray-800">
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-600 flex-shrink-0" />
                            <span className="leading-tight">เกณฑ์การให้คะแนนความประพฤติ</span>
                        </h2>
                        <div className={`transform transition-transform flex-shrink-0 ${showCriteria ? 'rotate-180' : ''}`}>
                            <i className="bi bi-chevron-down text-xl md:text-2xl text-gray-600"></i>
                        </div>
                    </button>
                    {showCriteria && (
                        <div className="p-4 sm:p-5 md:p-6 pt-0 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-3">
                                {/* เกณฑ์เพิ่มคะแนน */}
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                        <span>เกณฑ์การเพิ่มคะแนน</span>
                                    </h3>
                                    <div className="space-y-2.5 md:space-y-2">
                                        {addScoreCriteria.map((c) => (
                                            <div key={c.id} className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-3 md:p-3">
                                                <span className="bg-green-600 text-white px-2.5 py-1 rounded-md font-bold text-xs md:text-sm inline-block">
                                                    +{c.points}
                                                </span>
                                                <p className="text-xs md:text-sm mt-2 text-gray-700 leading-relaxed">{c.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* เกณฑ์หักคะแนน */}
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                        <span>เกณฑ์การหักคะแนน</span>
                                    </h3>
                                    <div className="space-y-2.5 md:space-y-2">
                                        {deductScoreCriteria.map((c) => (
                                            <div key={c.id} className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-3 md:p-3">
                                                <span className="bg-red-600 text-white px-2.5 py-1 rounded-md font-bold text-xs md:text-sm inline-block">
                                                    {c.points}
                                                </span>
                                                <p className="text-xs md:text-sm mt-2 text-gray-700 leading-relaxed">{c.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics - Mobile Optimized */}
                {filteredStudents.length > 0 && (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6">
                        <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-4 md:py-6 border-b space-y-3 md:space-y-4">
                            {/* สถิติรวม - Responsive */}
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg md:rounded-xl border-2 border-amber-200 p-4 md:p-5">
                                <div className="flex items-center gap-2 mb-3 md:mb-3">
                                    <i className="bi bi-bar-chart-fill text-amber-600 text-lg md:text-xl"></i>
                                    <h3 className="text-base md:text-lg font-bold text-amber-700">สถิติการบันทึก</h3>
                                </div>
                                
                                {/* Mobile: Vertical Stack, Tablet+: Horizontal */}
                                <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:flex-wrap md:gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6">
                                        {/* ทั้งหมด */}
                                        <div className="flex items-center gap-2.5 md:gap-2">
                                            <i className="bi bi-people-fill text-amber-600 text-lg md:text-lg flex-shrink-0"></i>
                                            <span className="text-sm md:text-sm font-semibold text-gray-700">
                                                ทั้งหมด: <span className="text-amber-700 text-base md:text-lg font-bold">{scoreStats.total}</span> คน
                                            </span>
                                        </div>
                                        
                                        {/* บันทึกแล้ว */}
                                        <div className="flex items-center gap-2.5 md:gap-2">
                                            <i className="bi bi-check-circle-fill text-blue-600 text-lg md:text-lg flex-shrink-0"></i>
                                            <span className="text-sm md:text-sm font-semibold text-gray-700">
                                                บันทึกแล้ว: <span className="text-blue-600 text-base md:text-lg font-bold">{scoreStats.recorded}</span> คน
                                            </span>
                                        </div>
                                        
                                        {/* ยังไม่บันทึก */}
                                        <div className="flex items-center gap-2.5 md:gap-2">
                                            <i className="bi bi-clock-fill text-orange-600 text-lg md:text-lg flex-shrink-0"></i>
                                            <span className="text-sm md:text-sm font-semibold text-gray-700">
                                                ยังไม่บันทึก: <span className="text-orange-600 text-base md:text-lg font-bold">{scoreStats.notRecorded}</span> คน
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Success Badge */}
                                    {scoreStats.recorded === scoreStats.total && scoreStats.total > 0 && (
                                        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 md:py-2 rounded-lg shadow-md w-full sm:w-auto justify-center">
                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                            <span className="text-sm font-bold">บันทึกครบทุกคนแล้ว</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* สถิติคะแนน - Mobile Grid */}
                            {scoreStats.recorded > 0 && (
                                <div className="bg-white rounded-lg md:rounded-xl border-2 border-gray-200 p-4 md:p-5">
                                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                                        <i className="bi bi-pie-chart-fill text-amber-600 text-lg md:text-lg"></i>
                                        <span className="text-sm md:text-base font-bold text-gray-800">สถิติคะแนน</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2.5 md:gap-3">
                                        {/* คะแนนเพิ่ม */}
                                        <div className="bg-green-50 px-4 py-3 md:py-3 rounded-lg md:rounded-xl border-2 border-green-200 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                                            <i className="bi bi-arrow-up-circle-fill text-green-700 text-lg md:text-lg flex-shrink-0"></i>
                                            <span className="text-sm md:text-sm font-bold text-green-700 flex-1">คะแนนเพิ่ม</span>
                                            <span className="bg-green-600 text-white px-3 py-1.5 md:py-1 rounded-full text-sm font-bold min-w-[32px] md:min-w-[28px] text-center shadow-sm flex-shrink-0">
                                                +{scoreStats.totalAdded}
                                            </span>
                                        </div>
                                        
                                        {/* คะแนนหัก */}
                                        <div className="bg-red-50 px-4 py-3 md:py-3 rounded-lg md:rounded-xl border-2 border-red-200 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                                            <i className="bi bi-arrow-down-circle-fill text-red-700 text-lg md:text-lg flex-shrink-0"></i>
                                            <span className="text-sm md:text-sm font-bold text-red-700 flex-1">คะแนนหัก</span>
                                            <span className="bg-red-600 text-white px-3 py-1.5 md:py-1 rounded-full text-sm font-bold min-w-[32px] md:min-w-[28px] text-center shadow-sm flex-shrink-0">
                                                {scoreStats.totalDeducted}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bulk Mode Toggle - Mobile Optimized */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6">
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b-2 border-amber-200 p-4 md:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-0">
                            <div className="flex items-start sm:items-center gap-3 md:gap-3">
                                <div className="bg-amber-200 p-2 md:p-2 rounded-lg flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm md:text-base font-bold text-amber-800 leading-tight">โหมดบันทึกกลุ่ม</h3>
                                    <p className="text-xs md:text-sm text-amber-700 mt-0.5 md:mt-0">เลือกนักเรียนหลายคนเพื่อบันทึกพร้อมกัน</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setBulkScoreMode(!bulkScoreMode)}
                                className={`px-5 md:px-6 py-3 md:py-2.5 rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all shadow-md hover:shadow-lg active:scale-95 touch-manipulation min-h-[48px] md:min-h-0 flex items-center justify-center gap-2 ${
                                    bulkScoreMode
                                        ? 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-2 border-gray-300'
                                }`}
                            >
                                {bulkScoreMode ? (
                                    <>
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>เปิดใช้งาน</span>
                                    </>
                                ) : (
                                    <span>เปิดโหมดกลุ่ม</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Score Panel - Mobile Optimized */}
                {bulkScoreMode && (
                    <>
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl md:rounded-xl p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
                            <h3 className="text-lg md:text-xl font-bold text-amber-700 mb-3 md:mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                                <span>บันทึกคะแนนกลุ่ม ({selectedStudents.length} คน)</span>
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-sm md:text-sm font-semibold mb-2 md:mb-3 text-gray-700">เลือกคะแนน:</label>
                                    <div className="bg-white rounded-lg p-3 md:p-4 space-y-3 md:space-y-3">
                                        {/* เพิ่มคะแนน */}
                                        <div>
                                            <p className="text-xs md:text-xs font-semibold text-green-700 mb-2">เพิ่มคะแนน</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-5 md:flex md:flex-wrap gap-2">
                                                {addScoreCriteria.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => handleBulkScoreChange(c.id, c.points, c.description)}
                                                        className={`px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-semibold text-sm md:text-base transition-all active:scale-95 touch-manipulation ${
                                                            bulkCriteria?.criteriaId === c.id
                                                                ? 'bg-green-600 text-white shadow-lg md:scale-105'
                                                                : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 active:bg-green-200'
                                                        }`}
                                                    >
                                                        +{c.points}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* หักคะแนน */}
                                        <div>
                                            <p className="text-xs md:text-xs font-semibold text-red-700 mb-2">หักคะแนน</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-5 md:flex md:flex-wrap gap-2">
                                                {deductScoreCriteria.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => handleBulkScoreChange(c.id, c.points, c.description)}
                                                        className={`px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-semibold text-sm md:text-base transition-all active:scale-95 touch-manipulation ${
                                                            bulkCriteria?.criteriaId === c.id
                                                                ? 'bg-red-600 text-white shadow-lg md:scale-105'
                                                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:bg-red-200'
                                                        }`}
                                                    >
                                                        {c.points}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Selected Criteria Display */}
                                {bulkCriteria && (
                                    <div className="bg-white rounded-lg p-3 md:p-4 border-2 border-amber-300">
                                        <span className={`px-3 py-1.5 rounded-lg font-bold text-sm md:text-base ${bulkCriteria.points > 0 ? 'bg-green-600' : 'bg-red-600'} text-white inline-block`}>
                                            {bulkCriteria.points > 0 ? '+' : ''}{bulkCriteria.points}
                                        </span>
                                        <p className="text-xs md:text-sm mt-2 text-gray-700 leading-relaxed">{bulkCriteria.description}</p>
                                    </div>
                                )}
                                
                                {/* Comment Input */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm md:text-sm font-bold mb-2 text-gray-700">
                                        <i className="bi bi-pencil-square text-amber-600"></i>
                                        <span>เหตุผล/รายละเอียด</span>
                                    </label>
                                    <textarea
                                        value={bulkComment}
                                        onChange={(e) => setBulkComment(e.target.value)}
                                        placeholder="ตัวอย่าง: 7 เม.ย.66 (คาบ PBL) นักเรียนช่วยเหลืองานกิจกรรม"
                                        className="w-full px-4 py-3 md:py-3 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                                        rows="3"
                                    />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    <button
                                        onClick={handleApplyBulkScore}
                                        disabled={!bulkCriteria || selectedStudents.length === 0}
                                        className="bg-amber-600 text-white px-4 md:px-6 py-3.5 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 active:bg-amber-800 transition-all shadow-md hover:shadow-lg touch-manipulation min-h-[48px]"
                                    >
                                        <i className="bi bi-check-circle-fill mr-1"></i>
                                        <span className="hidden sm:inline">บันทึก </span>({selectedStudents.length})
                                    </button>
                                    <button
                                        onClick={handleCancelBulk}
                                        className="bg-gray-500 text-white px-4 md:px-6 py-3.5 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:bg-gray-600 active:bg-gray-700 transition-all shadow-md hover:shadow-lg touch-manipulation min-h-[48px]"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Select All Button */}
                        {filteredStudents.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-3 md:p-4 mb-4 md:mb-6">
                                <button
                                    onClick={handleSelectAll}
                                    className="w-full sm:w-auto bg-indigo-600 text-white px-5 md:px-5 py-3 md:py-2.5 rounded-lg font-semibold text-sm md:text-base hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation min-h-[48px] md:min-h-0"
                                >
                                    {selectedStudents.length === filteredStudents.length ? (
                                        <>
                                            <i className="bi bi-check-square-fill mr-1"></i> 
                                            <span>ยกเลิกเลือกทั้งหมด</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-square mr-1"></i> 
                                            <span>เลือกทั้งหมด</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination - Mobile Optimized */}
                {filteredStudents.length > 0 && totalPages > 1 && (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                            <div className="text-xs sm:text-sm font-semibold text-gray-700 text-center sm:text-left">
                                แสดง {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} จาก {filteredStudents.length} รายการ
                            </div>

                            <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
                                {/* First Page */}
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-2.5 md:px-3 py-2 md:py-2 rounded-lg border-2 font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation min-w-[40px] md:min-w-0"
                                >
                                    ««
                                </button>
                                
                                {/* Previous Page */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-2.5 md:px-3 py-2 md:py-2 rounded-lg border-2 font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation min-w-[40px] md:min-w-0"
                                >
                                    «
                                </button>

                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 md:px-4 py-2 md:py-2 rounded-lg font-bold text-sm md:text-base transition-all touch-manipulation min-w-[40px] md:min-w-0 ${
                                                    currentPage === pageNum
                                                        ? 'bg-amber-600 text-white shadow-md hover:shadow-lg active:bg-amber-700'
                                                        : 'border-2 hover:bg-gray-50 active:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === currentPage - 2 ||
                                        pageNum === currentPage + 2
                                    ) {
                                        return <span key={pageNum} className="px-1 md:px-2 text-gray-500 text-sm md:text-base">...</span>;
                                    }
                                    return null;
                                })}

                                {/* Next Page */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-2.5 md:px-3 py-2 md:py-2 rounded-lg border-2 font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation min-w-[40px] md:min-w-0"
                                >
                                    »
                                </button>
                                
                                {/* Last Page */}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-2.5 md:px-3 py-2 md:py-2 rounded-lg border-2 font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation min-w-[40px] md:min-w-0"
                                >
                                    »»
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sticky Action Bar - Mobile First */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-4 py-3 md:py-4">
                        {/* Mobile: Vertical Stack, Desktop: Horizontal */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                            {/* Alert Message - Full Width on Mobile */}
                            {hasChanges && (
                                <div className="flex items-center gap-2 md:gap-2 bg-orange-100 px-4 md:px-5 py-3 md:py-3 rounded-lg md:rounded-xl border-2 border-orange-300 w-full md:w-auto">
                                    <AlertCircle className="w-5 h-5 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
                                    <span className="text-sm md:text-sm font-semibold text-orange-700">
                                        มีการเปลี่ยนแปลง <span className="font-bold">{scoreStats.recorded}</span> รายการที่ยังไม่ได้บันทึก
                                    </span>
                                </div>
                            )}
                            
                            {/* Action Buttons - Mobile: Full Width Grid, Desktop: Flex */}
                            <div className="grid grid-cols-2 md:flex md:ms-auto gap-2 md:gap-3 w-full md:w-auto">
                                {/* Save Button - Touch Optimized */}
                                <button
                                    onClick={handleSave}
                                    disabled={!hasChanges || isSaving}
                                    className="bg-amber-600 text-white px-4 md:px-8 py-3.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 active:bg-amber-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl touch-manipulation min-h-[48px]"
                                >
                                    <Save className="w-5 h-5 md:w-5 md:h-5 flex-shrink-0" />
                                    <span className="truncate">{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                                </button>

                                {/* Reset Button - Touch Optimized */}
                                <button
                                    onClick={handleReset}
                                    disabled={!hasChanges}
                                    className="bg-gray-500 text-white px-4 md:px-8 py-3.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 active:bg-gray-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl touch-manipulation min-h-[48px]"
                                >
                                    <RotateCcw className="w-5 h-5 md:w-5 md:h-5 flex-shrink-0" />
                                    <span className="truncate">ยกเลิก</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student List - Mobile Optimized */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 px-4 sm:px-5 md:px-6 py-3 md:py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-0">
                        <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-4 h-4 md:w-5 md:h-5 text-amber-600 flex-shrink-0" />
                            <span>รายชื่อนักเรียน</span>
                            <span className="text-xs md:text-sm font-semibold text-gray-500">
                                ({startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} จาก {filteredStudents.length} คน)
                            </span>
                        </h3>
                        {bulkScoreMode && selectedStudents.length > 0 && (
                            <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-sm inline-flex items-center justify-center">
                                เลือกแล้ว {selectedStudents.length} คน
                            </span>
                        )}
                    </div>

                    <div className="p-3 sm:p-4 md:p-6">
                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-12 md:py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                                    <Users className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                                </div>
                                <p className="text-gray-700 font-bold text-base md:text-lg">ไม่พบรายชื่อนักเรียน</p>
                                <p className="text-gray-500 text-sm md:text-sm mt-2">ลองเปลี่ยนเกณฑ์การค้นหา</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentStudents.map((student, index) => {
                                    const record = scoreRecords[student.id];
                                    const isSelected = record !== null;
                                    const isChecked = selectedStudents.includes(student.id);
                                    const globalIndex = startIndex + index;

                                    return (
                                        <div
                                            key={student.id}
                                            className={`border-2 rounded-xl p-5 transition-all ${isSelected
                                                    ? 'border-amber-300 bg-amber-50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    {bulkScoreMode && (
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleStudent(student.id)}
                                                            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                                                        />
                                                    )}
                                                    <div className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 font-bold w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                                                        {globalIndex + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-lg text-gray-800">{student.fullName}</div>
                                                        <div className="text-sm text-gray-500">รหัส: {student.studentId} • ห้อง: {student.classRoom}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                    <button
                                                        onClick={() => handleViewHistory(student)}
                                                        className="bg-blue-100 text-blue-700 px-3 py-2 md:px-4 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-200 transition-colors min-h-[44px]"
                                                        title="ประวัติคะแนน"
                                                    >
                                                        <History className="w-4 h-4 flex-shrink-0" />
                                                        <span className="hidden md:inline">ประวัติ</span>
                                                    </button>
                                                    <div className="text-right bg-gray-50 px-1 md:px-4 py-1 md:py-2 rounded-lg border">
                                                        <div className="text-xs text-gray-600">
                                                            <span className="md:hidden">คะแนน</span> 
                                                            <span className="hidden md:inline">คะแนนปัจจุบัน</span>
                                                        </div>
                                                        <div className={`text-2xl font-bold ${student.currentScore >= 90 ? 'text-green-600' :
                                                                student.currentScore >= 70 ? 'text-blue-600' :
                                                                    student.currentScore >= 50 ? 'text-orange-600' : 'text-red-600'
                                                            }`}>
                                                            {student.currentScore}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {!bulkScoreMode && (
                                                <>
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <div className="text-sm font-semibold mb-2 text-green-700">เพิ่มคะแนน:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {addScoreCriteria.map((c) => (
                                                                    <button
                                                                        key={c.id}
                                                                        onClick={() => handleScoreChange(student.id, c.id, c.points, c.description)}
                                                                        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${record?.criteriaId === c.id
                                                                                ? 'bg-green-600 text-white shadow-md scale-105'
                                                                                : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                                            }`}
                                                                    >
                                                                        +{c.points}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold mb-2 text-red-700">หักคะแนน:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {deductScoreCriteria.map((c) => (
                                                                    <button
                                                                        key={c.id}
                                                                        onClick={() => handleScoreChange(student.id, c.id, c.points, c.description)}
                                                                        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${record?.criteriaId === c.id
                                                                                ? 'bg-red-600 text-white shadow-md scale-105'
                                                                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                                            }`}
                                                                    >
                                                                        {c.points}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200 bg-white rounded-lg p-4">
                                                            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                                                                <i className="bi bi-pencil-square"></i> รายละเอียดเพิ่มเติม
                                                            </label>
                                                            <textarea
                                                                value={record?.comment || ''}
                                                                onChange={(e) => handleCommentChange(student.id, e.target.value)}
                                                                placeholder="ตัวอย่าง: 7 เม.ย.66 (คาบ PBL) นักเรียนเก็บเงินได้ 100 บาท"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                                rows="2"
                                                            />
                                                            {record && record.points && (
                                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                    <span className={`font-semibold ${record.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {record.points > 0 ? '+' : ''}{record.points} คะแนน:
                                                                    </span>
                                                                    <span className="ml-2 text-gray-700">{record.description}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* History Modal */}
                {showHistoryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">ประวัติการบันทึกคะแนน</h2>
                                        {historyData?.data && (
                                            <p className="text-sm opacity-90 mt-1">
                                                {historyData.data.student.fullName} • ห้อง {historyData.data.student.classRoom} • รหัส {historyData.data.student.studentCode}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={closeHistoryModal}
                                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto bg-gray-50" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                                {isLoadingHistory ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto"></div>
                                        <p className="text-gray-600 mt-4 font-semibold">กำลังโหลดข้อมูล...</p>
                                    </div>
                                ) : historyData?.data?.history && historyData.data.history.length > 0 ? (
                                    <div className="space-y-4">
                                        {historyData.data.history.map((record, index) => (
                                            <div key={record.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`px-4 py-2 rounded-lg font-bold text-white shadow-md ${record.score > 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                                                            {record.score > 0 ? '+' : ''}{record.score}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-800">
                                                                คะแนนสะสม: <span className={`text-lg ${record.currentTotal >= 90 ? 'text-green-600' :
                                                                        record.currentTotal >= 70 ? 'text-blue-600' :
                                                                            record.currentTotal >= 50 ? 'text-orange-600' : 'text-red-600'
                                                                    }`}>{record.currentTotal}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                                <i className="bi bi-person-fill"></i> บันทึกโดย: {record.recordedBy}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500 text-right bg-gray-50 px-3 py-2 rounded-lg">
                                                        <div className="font-semibold flex items-center justify-end gap-1">
                                                            <i className="bi bi-calendar-event"></i> {new Date(record.recordedAt).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}</div>
                                                        <div className="text-xs mt-1 flex items-center justify-end gap-1">
                                                            <i className="bi bi-clock"></i> {new Date(record.recordedAt).toLocaleTimeString('th-TH')}</div>
                                                    </div>
                                                </div>
                                                {record.comments && (
                                                    <div className="mt-3 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                        <div className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                            <i className="bi bi-pencil-square"></i> รายละเอียด:
                                                        </div>
                                                        <div className="text-gray-600">{record.comments}</div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <Info className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg font-semibold">ยังไม่มีประวัติการบันทึกคะแนน</p>
                                        <p className="text-gray-400 text-sm mt-2">นักเรียนคนนี้ยังไม่เคยมีการบันทึกคะแนน</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 border-t flex items-center justify-between">
                                {historyData?.data && (
                                    <div className="text-sm text-gray-600">
                                        ประวัติทั้งหมด: <span className="font-semibold">{historyData.data.history?.length || 0}</span> รายการ
                                    </div>
                                )}
                                <button
                                    onClick={closeHistoryModal}
                                    className="bg-gray-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BehaviorScorePage;