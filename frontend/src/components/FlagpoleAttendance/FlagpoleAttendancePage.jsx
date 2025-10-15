import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Calendar, Users, Search, Save, RefreshCw, FileSpreadsheet, ExternalLink } from 'lucide-react';
import StudentAttendanceRow from './StudentAttendanceRow';
import AttendanceFilters from './AttendanceFilters';
import BulkActionBar from './BulkActionBar';
import LoadingSpinner from '../common/LoadingSpinner';
import { attendanceService } from '../../services/attendanceService';

const FlagpoleAttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classList, setClassList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statuses, setStatuses] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchStatuses();
    fetchClasses();
  }, []);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  // Fetch existing attendance when date or class changes
  useEffect(() => {
    if (selectedDate && selectedClass) {
      fetchExistingAttendance();
    }
  }, [selectedDate, selectedClass]);

  // Filter students by search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          (student) =>
            student.fullName.toLowerCase().includes(query) ||
            student.studentId.toLowerCase().includes(query) ||
            student.studentNumber.toString().includes(query)
        )
      );
    }
  }, [searchQuery, students]);

  const fetchStatuses = async () => {
    try {
      const data = await attendanceService.getStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await attendanceService.getClasses();
      setClassList(data);
      if (data.length > 0 && !selectedClass) {
        setSelectedClass(data[0]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดรายชื่อห้องเรียน', 'error');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getStudents(selectedClass);
      setStudents(data);
      setFilteredStudents(data);

      // Initialize attendance records with default status (PRESENT)
      const defaultRecords = {};
      data.forEach((student) => {
        defaultRecords[student.id] = statuses.find((s) => s.name === 'มา')?.id || 1;
      });
      setAttendanceRecords(defaultRecords);
    } catch (error) {
      console.error('Error fetching students:', error);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดรายชื่อนักเรียน', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getFlagpoleAttendance(selectedDate, selectedClass);

      if (data.length > 0) {
        const records = {};
        data.forEach((record) => {
          records[record.student.id] = record.status.id;
        });
        setAttendanceRecords((prev) => ({ ...prev, ...records }));
      }
    } catch (error) {
      console.error('Error fetching existing attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, statusId) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: statusId,
    }));
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

    const records = Object.entries(attendanceRecords).map(([studentId, statusId]) => ({
      studentId: parseInt(studentId),
      statusId: parseInt(statusId),
    }));

    if (records.length === 0) {
      Swal.fire('ข้อผิดพลาด', 'ไม่มีข้อมูลที่จะบันทึก', 'warning');
      return;
    }

    // Show confirmation
    const result = await Swal.fire({
      title: 'ยืนยันการบันทึก',
      html: `จะบันทึกการเช็คชื่อ<br><strong>${records.length} คน</strong><br>วันที่ ${selectedDate}<br>ห้อง ${selectedClass}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3B82F6',
    });

    if (!result.isConfirmed) return;

    setSaving(true);

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
      const response = await attendanceService.bulkCreateAttendance({
        date: selectedDate,
        className: selectedClass,
        records,
      });

      Swal.close();

      if (response.synced) {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ!',
          html: `บันทึกเรียบร้อย <strong>${response.count}</strong> รายการ<br>และ sync กับ Google Sheets สำเร็จ`,
          confirmButtonColor: '#3B82F6',
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'บันทึกสำเร็จบางส่วน',
          html: `บันทึกเรียบร้อย <strong>${response.count}</strong> รายการ<br><br>แต่ไม่สามารถ sync กับ Google Sheets ได้<br><small>${response.error}</small><br><br>คุณสามารถ Retry ได้ที่เมนู Sync`,
          confirmButtonColor: '#F59E0B',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleViewGoogleSheet = () => {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    if (sheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${sheetId}`, '_blank');
    } else {
      Swal.fire('ข้อผิดพลาด', 'ไม่พบ Google Sheet ID', 'error');
    }
  };

  const handleFetchFromSheet = async () => {
    Swal.fire({
      title: 'กำลังดึงข้อมูล...',
      html: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const data = await attendanceService.fetchFromGoogleSheet('FlagpoleAttendance');

      Swal.close();

      // Display data in a table
      const headers = data[0] || [];
      const rows = data.slice(1, 11); // Show first 10 rows

      const tableHTML = `
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-100">
                ${headers.map((h) => `<th class="px-2 py-1 border">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  ${row.map((cell) => `<td class="px-2 py-1 border">${cell || '-'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="mt-2 text-xs text-gray-500">แสดง 10 แถวแรก</p>
        </div>
      `;

      Swal.fire({
        title: 'ข้อมูลจาก Google Sheet',
        html: tableHTML,
        width: '80%',
        confirmButtonColor: '#3B82F6',
      });
    } catch (error) {
      Swal.fire('ข้อผิดพลาด', error.message, 'error');
    }
  };

  const handleSyncMissing = async () => {
    const result = await Swal.fire({
      title: 'Sync ข้อมูลที่ขาดหาย',
      text: 'จะพยายาม sync ข้อมูลที่ยังไม่ได้ส่งไป Google Sheets',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sync เลย',
      cancelButtonText: 'ยกเลิก',
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'กำลัง Sync...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await attendanceService.syncMissingToSheet();

      Swal.fire({
        icon: 'success',
        title: 'Sync สำเร็จ!',
        text: `Sync สำเร็จ ${response.count} รายการ`,
        confirmButtonColor: '#3B82F6',
      });
    } catch (error) {
      Swal.fire('ข้อผิดพลาด', error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                <Users className="w-8 h-8" />
                ระบบเช็คชื่อนักเรียนเข้าแถว
              </h1>
              <p className="text-gray-600 mt-1">โรงเรียนท่าบ่อพิทยาคม</p>
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
          disabled={loading || filteredStudents.length === 0}
        />

        {/* Student List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {loading ? (
            <LoadingSpinner />
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>ไม่พบนักเรียน</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-blue-50 rounded font-semibold text-sm">
                <div className="col-span-1">เลขที่</div>
                <div className="col-span-5 md:col-span-4">ชื่อ-สกุล</div>
                <div className="col-span-6 md:col-span-7">สถานะ</div>
              </div>

              {filteredStudents.map((student) => (
                <StudentAttendanceRow
                  key={student.id}
                  student={student}
                  statuses={statuses}
                  selectedStatus={attendanceRecords[student.id]}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleSaveAttendance}
              disabled={saving || filteredStudents.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              บันทึกข้อมูล
            </button>

            <button
              onClick={handleFetchFromSheet}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              ดูข้อมูลจาก Sheet
            </button>

            <button
              onClick={handleViewGoogleSheet}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              เปิด Google Sheet
            </button>

            <button
              onClick={handleSyncMissing}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Sync ข้อมูลที่ขาด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagpoleAttendancePage;