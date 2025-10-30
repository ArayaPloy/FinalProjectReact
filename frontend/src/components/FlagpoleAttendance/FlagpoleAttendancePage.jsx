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
import {
  useGetAcademicYearsQuery,
  useGetCurrentSemesterQuery
} from '../../services/academicApi';

const FlagpoleAttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [originalAttendanceRecords, setOriginalAttendanceRecords] = useState({}); // เก็บค่าเดิมสำหรับ reset
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // RTK Query hooks
  const { data: statuses = [] } = useGetAttendanceStatusesQuery();
  const { data: classList = [] } = useGetClassRoomsQuery();
  const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsByClassRoomQuery(selectedClass, { skip: !selectedClass });
  const { data: existingAttendance = [], isLoading: isLoadingAttendance } = useGetFlagpoleAttendanceQuery(
    { date: selectedDate, classRoom: selectedClass },
    { skip: !selectedClass || !selectedDate }
  );
  const [createAttendance, { isLoading: isSaving }] = useCreateFlagpoleAttendanceMutation();

  // Academic Year & Semester hooks
  const { data: academicYears = [], isLoading: isLoadingYears } = useGetAcademicYearsQuery();
  const { data: currentSemester } = useGetCurrentSemesterQuery();

  // Filter active semesters for selected academic year
  const availableSemesters = useMemo(() => {
    if (!selectedAcademicYear) return [];
    const year = academicYears.find(y => y.id === parseInt(selectedAcademicYear));
    return year?.semesters || [];
  }, [selectedAcademicYear, academicYears]);

  // Get selected semester object for date range
  const selectedSemesterObj = useMemo(() => {
    if (!selectedSemester) return null;
    return availableSemesters.find(s => s.id === parseInt(selectedSemester));
  }, [selectedSemester, availableSemesters]);

  // Set default academic year and semester from current semester
  useEffect(() => {
    if (currentSemester && !selectedAcademicYear && !selectedSemester) {
      setSelectedAcademicYear(currentSemester.academicYearId.toString());
      setSelectedSemester(currentSemester.id.toString());
    }
  }, [currentSemester]);

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

    if (!selectedSemester) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกภาคเรียน', 'warning');
      return;
    }

    // ตรวจสอบว่าวันที่อยู่ในช่วงของภาคเรียนหรือไม่
    if (selectedSemesterObj) {
      const selectedDateObj = new Date(selectedDate);
      const semesterStart = new Date(selectedSemesterObj.startDate);
      const semesterEnd = new Date(selectedSemesterObj.endDate);

      if (selectedDateObj < semesterStart || selectedDateObj > semesterEnd) {
        Swal.fire({
          icon: 'warning',
          title: 'วันที่ไม่อยู่ในช่วงภาคเรียน',
          html: `วันที่ที่เลือกไม่อยู่ในช่วงของภาคเรียนที่ ${selectedSemesterObj.semesterNumber}<br>` +
            `(${new Date(selectedSemesterObj.startDate).toLocaleDateString('th-TH')} - ` +
            `${new Date(selectedSemesterObj.endDate).toLocaleDateString('th-TH')})`,
          confirmButtonColor: '#D97706'
        });
        return;
      }
    }

    // กรองเฉพาะนักเรียนที่มีการเลือกสถานะแล้ว
    const records = Object.entries(attendanceRecords)
      .filter(([_, statusId]) => statusId !== null && statusId !== undefined)
      .map(([studentId, statusId]) => ({
        studentId: parseInt(studentId),
        statusId: parseInt(statusId),
      }));

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
      confirmButtonColor: '#D97706',
      cancelButtonColor: '#6B7280',
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
        semesterId: parseInt(selectedSemester)
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'บันทึกข้อมูลการเช็คชื่อเรียบร้อยแล้ว',
        confirmButtonColor: '#D97706',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  ระบบเช็คชื่อนักเรียนเข้าแถว
                </h1>
                <p className="text-amber-100 mt-1 flex items-center gap-2">
                  <i className="bi bi-building"></i>
                  โรงเรียนท่าบ่อพิทยาคม
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-6">
            <AttendanceFilters
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              classList={classList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              minDate={selectedSemesterObj?.startDate ? new Date(selectedSemesterObj.startDate).toISOString().split('T')[0] : undefined}
              maxDate={selectedSemesterObj?.endDate ? new Date(selectedSemesterObj.endDate).toISOString().split('T')[0] : undefined}
              selectedAcademicYear={selectedAcademicYear}
              setSelectedAcademicYear={setSelectedAcademicYear}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              academicYears={academicYears}
              availableSemesters={availableSemesters}
              isLoadingYears={isLoadingYears}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        <BulkActionBar
          statuses={statuses}
          onBulkChange={handleBulkStatusChange}
          disabled={isLoadingStudents || filteredStudents.length === 0}
        />

        {/* Student List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* สถิติการเช็คชื่อ */}
          {filteredStudents.length > 0 && (
            <div className="bg-gray-50 px-6 py-6 border-b space-y-4">
              {/* สถิติรวม */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <i className="bi bi-bar-chart-fill text-amber-600 text-xl"></i>
                  <h3 className="text-lg font-bold text-amber-700">สถิติการเช็คชื่อ</h3>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <i className="bi bi-people-fill text-amber-600 text-lg"></i>
                      <span className="text-sm font-semibold text-gray-700">
                        นักเรียนทั้งหมด: <span className="text-amber-700 text-lg">{attendanceStats.total}</span> คน
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-check-circle-fill text-green-600 text-lg"></i>
                      <span className="text-sm font-semibold text-gray-700">
                        เช็คแล้ว: <span className="text-green-600 text-lg">{attendanceStats.checked}</span> คน
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-clock-fill text-orange-600 text-lg"></i>
                      <span className="text-sm font-semibold text-gray-700">
                        ยังไม่เช็ค: <span className="text-orange-600 text-lg">{attendanceStats.unchecked}</span> คน
                      </span>
                    </div>
                  </div>
                  {attendanceStats.unchecked === 0 && attendanceStats.total > 0 && (
                    <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-bold">เช็คครบทุกคนแล้ว</span>
                    </div>
                  )}
                </div>
              </div>

              {/* สถิติแยกตามสถานะ */}
              {attendanceStats.checked > 0 && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="bi bi-pie-chart-fill text-amber-600 text-lg"></i>
                    <span className="text-base font-bold text-gray-800">สถิติแยกตามสถานะ</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
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
                            className={`${bgColor} px-4 py-3 rounded-xl border-2 ${textColor.replace('text-', 'border-').replace('-700', '-200')} flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}
                          >
                            <i className={`bi ${iconClass} ${textColor} text-lg`}></i>
                            <span className={`text-sm font-bold ${textColor}`}>
                              {data.name}
                            </span>
                            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold min-w-[28px] text-center shadow-sm`}>
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
            <div className="text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold text-lg">ไม่พบรายชื่อนักเรียน</p>
              <p className="text-gray-500 text-sm mt-2">กรุณาเลือกห้องเรียนหรือตรวจสอบคำค้นหา</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-12 gap-4 px-4 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold text-sm shadow-md mb-3">
                <div className="col-span-1 flex items-center gap-1">
                  <i className="bi bi-hash"></i> ที่
                </div>
                <div className="col-span-5 md:col-span-4 flex items-center gap-2">
                  <i className="bi bi-person-badge"></i> ข้อมูลนักเรียน
                </div>
                <div className="col-span-6 md:col-span-7 flex items-center gap-2">
                  <i className="bi bi-clipboard-check"></i> สถานะการเข้าแถว
                </div>
              </div>

              <div className="space-y-2">
                {filteredStudents.map((student, index) => (
                  <StudentAttendanceRow
                    key={student.id}
                    student={student}
                    statuses={statuses}
                    selectedStatus={attendanceRecords[student.id]}
                    onStatusChange={handleStatusChange}
                    studentNumber={index + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {hasChanges && (
                <div className="flex items-center gap-2 bg-orange-100 px-5 py-3 rounded-xl border-2 border-orange-300">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">
                    มีการเปลี่ยนแปลง {attendanceStats.checked} รายการที่ยังไม่ได้บันทึก
                  </span>
                </div>
              )}
              <div className="flex ms-auto items-center gap-3">
                <button
                  onClick={handleSaveAttendance}
                  disabled={isSaving || filteredStudents.length === 0 || !hasChanges}
                  className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>

                <button
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <RotateCcw className="w-5 h-5" />
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagpoleAttendancePage;