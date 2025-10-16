import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Users, Save, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import StudentAttendanceRow from './StudentAttendanceRow';
import AttendanceFilters from './AttendanceFilters';
import BulkActionBar from './BulkActionBar';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  useGetAttendanceStatusesQuery,
  useGetClassRoomsQuery,
  useGetStudentsByClassRoomQuery,
  useGetFlagpoleAttendanceQuery,
  useCreateFlagpoleAttendanceMutation
} from '../../redux/features/attendance/flagpoleAttendanceApi';

const FlagpoleAttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [originalAttendanceRecords, setOriginalAttendanceRecords] = useState({}); // เก็บค่าเดิมสำหรับ reset
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // RTK Query hooks
  const { data: statuses = [] } = useGetAttendanceStatusesQuery();
  const { data: classList = [] } = useGetClassRoomsQuery();
  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByClassRoomQuery(selectedClass, { skip: !selectedClass });
  const { data: existingAttendance = [], isLoading: isLoadingAttendance } = useGetFlagpoleAttendanceQuery(
    { date: selectedDate, classRoom: selectedClass },
    { skip: !selectedClass || !selectedDate }
  );
  const [createAttendance, { isLoading: isSaving }] = useCreateFlagpoleAttendanceMutation();

  // Filter students using useMemo to prevent unnecessary re-renders
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];
    
    if (searchQuery.trim() === '') {
      return students;
    }
    
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student, index) =>
        student.fullName?.toLowerCase().includes(query) ||
        student.studentId?.toLowerCase().includes(query) ||
        student.studentNumber?.toString().includes(query)
    );
  }, [students, searchQuery]);

  // คำนวณสถิติการเช็คชื่อ
  const attendanceStats = useMemo(() => {
    const total = filteredStudents.length;
    const checked = filteredStudents.filter(student => 
      attendanceRecords[student.id] !== null && attendanceRecords[student.id] !== undefined
    ).length;
    const unchecked = total - checked;
    
    // นับจำนวนแต่ละสถานะ
    const statusCounts = {};
    statuses.forEach(status => {
      statusCounts[status.id] = {
        name: status.name,
        count: 0
      };
    });
    
    filteredStudents.forEach(student => {
      const statusId = attendanceRecords[student.id];
      if (statusId !== null && statusId !== undefined && statusCounts[statusId]) {
        statusCounts[statusId].count++;
      }
    });
    
    return { total, checked, unchecked, statusCounts };
  }, [filteredStudents, attendanceRecords, statuses]);

  // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
  const hasChanges = useMemo(() => {
    return JSON.stringify(attendanceRecords) !== JSON.stringify(originalAttendanceRecords);
  }, [attendanceRecords, originalAttendanceRecords]);

  // Initialize attendance records when students change
  useEffect(() => {
    if (students.length === 0) return;
    
    // Set default records to null (no status selected)
    const defaultRecords = {};
    students.forEach((student) => {
      defaultRecords[student.id] = null; // ไม่มีการเลือกสถานะ
    });

    setAttendanceRecords(defaultRecords);
    setOriginalAttendanceRecords(defaultRecords); // เก็บค่าเดิมด้วย
  }, [selectedClass, students.length]); // trigger เมื่อเปลี่ยนห้องหรือจำนวนนักเรียนเปลี่ยน

  // Update attendance records when existing attendance is loaded
  useEffect(() => {
    if (isLoadingAttendance) return;
    
    // Reset to null first
    const resetRecords = {};
    students.forEach((student) => {
      resetRecords[student.id] = null;
    });
    
    // Then update with existing data if any
    if (existingAttendance.length > 0) {
      existingAttendance.forEach((record) => {
        resetRecords[record.studentId] = record.statusId;
      });
    }
    
    setAttendanceRecords(resetRecords);
    setOriginalAttendanceRecords(resetRecords); // เก็บค่าเดิมสำหรับเปรียบเทียบ
  }, [selectedDate, selectedClass, isLoadingAttendance, existingAttendance.length]); // trigger เมื่อเปลี่ยนวันที่หรือห้อง

  // Set initial class when class list is loaded
  useEffect(() => {
    if (classList.length > 0 && !selectedClass) {
      setSelectedClass(classList[0]);
    }
  }, [classList.length, selectedClass]); // เพิ่ม selectedClass เพื่อหลีกเลี่ยง re-set

  const handleStatusChange = (studentId, statusId) => {
    setAttendanceRecords((prev) => {
      // ถ้ากดปุ่มเดิม ให้ uncheck (เปลี่ยนเป็น null)
      if (prev[studentId] === statusId) {
        return {
          ...prev,
          [studentId]: null,
        };
      }
      
      // ถ้ากดปุ่มใหม่ ให้เปลี่ยนสถานะ
      return {
        ...prev,
        [studentId]: statusId,
      };
    });
  };

  // ฟังก์ชันยกเลิกการเปลี่ยนแปลง
  const handleReset = () => {
    Swal.fire({
      title: 'ยืนยันการยกเลิก?',
      text: 'การเปลี่ยนแปลงทั้งหมดจะถูกยกเลิก',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ยกเลิก',
      cancelButtonText: 'ไม่',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
    }).then((result) => {
      if (result.isConfirmed) {
        setAttendanceRecords({ ...originalAttendanceRecords });
        Swal.fire({
          icon: 'success',
          title: 'ยกเลิกสำเร็จ',
          text: 'ย้อนกลับไปเป็นค่าเดิมแล้ว',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleBulkStatusChange = (statusId) => {
    const newRecords = {};
    filteredStudents.forEach((student) => {
      newRecords[student.id] = statusId;
    });
    setAttendanceRecords((prev) => ({ ...prev, ...newRecords }));

    Swal.fire({
      icon: 'success',
      title: 'ตั้งค่าสำเร็จ',
      text: `ตั้งสถานะทั้งหมดเป็น "${statuses.find((s) => s.id === statusId)?.name}"`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleSaveAttendance = async () => {
    if (!selectedDate || !selectedClass) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกวันที่และห้องเรียน', 'warning');
      return;
    }

    // กรองเฉพาะนักเรียนที่มีการเลือกสถานะแล้ว
    const records = Object.entries(attendanceRecords)
      .filter(([_, statusId]) => statusId !== null && statusId !== undefined)
      .map(([studentId, statusId]) => ({
        studentId: parseInt(studentId),
        statusId: parseInt(statusId),
      }));

    // if (records.length === 0) {
    //   Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกสถานะอย่างน้อย 1 คน', 'warning');
    //   return;
    // }

    // แสดงจำนวนที่ยังไม่ได้เช็ค
    const uncheckedCount = filteredStudents.length - records.length;
    const warningText = uncheckedCount > 0 
      ? `<br><span class="text-orange-600">⚠️ ยังมี ${uncheckedCount} คนที่ยังไม่ได้เช็คชื่อ</span>`
      : '';

    // Show confirmation
    const result = await Swal.fire({
      title: 'ยืนยันการบันทึก',
      html: `จะบันทึกการเช็คชื่อ<br><strong>${records.length} คน</strong><br>วันที่ ${selectedDate}<br>ห้อง ${selectedClass}${warningText}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3B82F6',
    });

    if (!result.isConfirmed) return;

    // Show loading
    Swal.fire({
      title: 'กำลังบันทึก...',
      html: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await createAttendance({
        date: selectedDate,
        classRoom: selectedClass,
        records,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'บันทึกข้อมูลการเช็คชื่อเรียบร้อยแล้ว',
        confirmButtonColor: '#3B82F6',
      });

      // อัพเดท original records หลังบันทึกสำเร็จ
      setOriginalAttendanceRecords({ ...attendanceRecords });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
                ระบบเช็คชื่อนักเรียนเข้าแถว
              </h1>
              <p className="text-gray-600 mt-2 ml-1">โรงเรียนท่าบ่อพิทยาคม</p>
            </div>
          </div>

          {/* Filters */}
          <AttendanceFilters
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            classList={classList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Bulk Actions */}
        <BulkActionBar
          statuses={statuses}
          onBulkChange={handleBulkStatusChange}
          disabled={isLoadingStudents || filteredStudents.length === 0}
        />

        {/* Student List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* สถิติการเช็คชื่อ */}
          {filteredStudents.length > 0 && (
            <div className="mb-6 space-y-3">
              {/* สถิติรวม */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <i className="bi bi-people-fill text-blue-600"></i>
                      <span className="text-sm font-semibold text-gray-700">
                        นักเรียนทั้งหมด: <span className="text-blue-600">{attendanceStats.total}</span> คน
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-check-circle-fill text-green-600"></i>
                      <span className="text-sm font-semibold text-gray-700">
                        เช็คแล้ว: <span className="text-green-600">{attendanceStats.checked}</span> คน
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-clock-fill text-orange-600"></i>
                      <span className="text-sm font-semibold text-gray-700">
                        ยังไม่เช็ค: <span className="text-orange-600">{attendanceStats.unchecked}</span> คน
                      </span>
                    </div>
                  </div>
                  {attendanceStats.unchecked === 0 && attendanceStats.total > 0 && (
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">เช็คครบทุกคนแล้ว</span>
                    </div>
                  )}
                </div>
              </div>

              {/* สถิติแยกตามสถานะ */}
              {attendanceStats.checked > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <i className="bi bi-bar-chart-fill text-blue-600"></i>
                    <span className="text-sm font-semibold text-gray-700">สถิติแยกตามสถานะ</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(attendanceStats.statusCounts)
                      .filter(([_, data]) => data.count > 0)
                      .map(([statusId, data]) => {
                        const status = statuses.find(s => s.id === parseInt(statusId));
                        let bgColor = 'bg-gray-100';
                        let textColor = 'text-gray-700';
                        let badgeColor = 'bg-gray-600';
                        let iconClass = 'bi-question-circle-fill';
                        
                        // กำหนดสีและไอคอนตามชื่อสถานะ
                        if (status?.name === 'มา') {
                          bgColor = 'bg-green-50';
                          textColor = 'text-green-700';
                          badgeColor = 'bg-green-600';
                          iconClass = 'bi-check-circle-fill';
                        } else if (status?.name === 'สาย') {
                          bgColor = 'bg-yellow-50';
                          textColor = 'text-yellow-700';
                          badgeColor = 'bg-yellow-600';
                          iconClass = 'bi-clock-fill';
                        } else if (status?.name === 'ลาป่วย') {
                          bgColor = 'bg-blue-50';
                          textColor = 'text-blue-700';
                          badgeColor = 'bg-blue-600';
                          iconClass = 'bi-heart-pulse-fill';
                        } else if (status?.name === 'ลากิจ') {
                          bgColor = 'bg-purple-50';
                          textColor = 'text-purple-700';
                          badgeColor = 'bg-purple-600';
                          iconClass = 'bi-file-text-fill';
                        } else if (status?.name === 'ขาด') {
                          bgColor = 'bg-red-50';
                          textColor = 'text-red-700';
                          badgeColor = 'bg-red-600';
                          iconClass = 'bi-x-circle-fill';
                        }
                        
                        return (
                          <div 
                            key={statusId} 
                            className={`${bgColor} px-3 py-2 rounded-lg border ${textColor.replace('text-', 'border-').replace('-700', '-200')} flex items-center gap-2`}
                          >
                            <i className={`bi ${iconClass} ${textColor}`}></i>
                            <span className={`text-sm font-semibold ${textColor}`}>
                              {data.name}
                            </span>
                            <span className={`${badgeColor} text-white px-2.5 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center`}>
                              {data.count}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoadingStudents ? (
            <LoadingSpinner message="กำลังโหลดรายชื่อนักเรียน..." />
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">ไม่พบรายชื่อนักเรียน</p>
              <p className="text-gray-400 text-sm mt-1">กรุณาเลือกห้องเรียนหรือตรวจสอบคำค้นหา</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold text-sm">
                <div className="col-span-1">เลขที่</div>
                <div className="col-span-5 md:col-span-4">ข้อมูลนักเรียน</div>
                <div className="col-span-6 md:col-span-7">สถานะการเข้าแถว</div>
              </div>

              {filteredStudents.map((student, index) => (
                <StudentAttendanceRow
                  key={student.id}
                  student={student}
                  statuses={statuses}
                  selectedStatus={attendanceRecords[student.id]}
                  onStatusChange={handleStatusChange}
                  studentNumber={index+1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveAttendance}
                disabled={isSaving || filteredStudents.length === 0 || !hasChanges}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-5 h-5" />
                บันทึกข้อมูล
              </button>

              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                ยกเลิก
              </button>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagpoleAttendancePage;