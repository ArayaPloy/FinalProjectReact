import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Search, Calendar, Users, CheckCircle2, Clock, FileText, Heart, XCircle } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLazyGetStudentAttendanceHistoryQuery } from '../../services/studentPublicApi';
import { useGetAcademicYearsQuery, useGetCurrentSemesterQuery } from '../../services/academicApi';

const StudentAttendanceHistory = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [studentData, setStudentData] = useState(null);

  const { data: academicYears = [] } = useGetAcademicYearsQuery();
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const [trigger, { isLoading }] = useLazyGetStudentAttendanceHistoryQuery();

  // Auto-select current academic year and semester
  useEffect(() => {
    if (currentSemester && !selectedAcademicYear && !selectedSemester) {
      setSelectedAcademicYear(currentSemester.academicYearId.toString());
      setSelectedSemester(currentSemester.id.toString());
    }
  }, [currentSemester, selectedAcademicYear, selectedSemester]);

  // Filter semesters based on selected academic year
  const availableSemesters = selectedAcademicYear
    ? academicYears.find(y => y.id === parseInt(selectedAcademicYear))?.semesters || []
    : [];

  // Auto-search when academic year or semester changes (if student number exists)
  useEffect(() => {
    if (studentNumber.trim() && studentData) {
      handleSearch();
    }
  }, [selectedAcademicYear, selectedSemester]);

  const handleSearch = async () => {
    if (!studentNumber.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกรหัสนักเรียน',
        confirmButtonColor: '#D97706'
      });
      return;
    }

    try {
      const params = {
        studentNumber: parseInt(studentNumber),
      };

      if (selectedSemester) {
        params.semesterId = parseInt(selectedSemester);
      }

      const result = await trigger(params).unwrap();

      if (result.success) {
        setStudentData(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบข้อมูล',
        text: error.data?.message || 'ไม่พบข้อมูลนักเรียนในระบบ',
        confirmButtonColor: '#D97706'
      });
      setStudentData(null);
    }
  };

  const handleReset = () => {
    setStudentNumber('');
    setSelectedAcademicYear('');
    setSelectedSemester('');
    setStudentData(null);
  };

  // Status icon and color mapping
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  เช็คประวัติเข้าแถว
                </h1>
                <p className="text-amber-100 mt-1 flex items-center gap-2">
                  <i className="bi bi-search"></i>
                  ค้นหาประวัติการเข้าแถวด้วยรหัสนักเรียน
                </p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Student Number Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <i className="bi bi-person-badge text-amber-600"></i>
                  รหัสนักเรียน
                </label>
                <input
                  type="number"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="กรอกรหัสนักเรียน"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <i className="bi bi-calendar-event text-amber-600"></i>
                  ปีการศึกษา (ไม่บังคับ)
                </label>
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => {
                    setSelectedAcademicYear(e.target.value);
                    setSelectedSemester('');
                  }}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                >
                  <option value="">ทั้งหมด</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      ปีการศึกษา {parseInt(year.year)}
                      {year.isCurrent && ' (ปัจจุบัน)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <i className="bi bi-calendar3 text-amber-600"></i>
                  ภาคเรียน (ไม่บังคับ)
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                  disabled={!selectedAcademicYear}
                >
                  <option value="">ทั้งหมด</option>
                  {availableSemesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      ภาคเรียนที่ {semester.semesterNumber}
                      {semester.isCurrent && ' (ปัจจุบัน)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {studentData && (
          <>
            {/* Student Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                  <Users className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">ข้อมูลนักเรียน</h2>
                  <p className="text-sm text-gray-500">รหัส {studentData.student.studentNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                  <p className="text-lg font-bold text-gray-800">
                    {studentData.student.namePrefix}{studentData.student.fullName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">ห้องเรียน</p>
                  <p className="text-lg font-bold text-gray-800">{studentData.student.classRoom}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">จำนวนบันทึกทั้งหมด</p>
                  <p className="text-lg font-bold text-gray-800">{studentData.totalRecords} ครั้ง</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="bi bi-bar-chart-fill text-amber-600"></i>
                สถิติการเข้าแถว
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(studentData.statistics).map(([status, count]) => {
                  const config = getStatusConfig(status);
                  const Icon = config.icon;
                  return (
                    <div
                      key={status}
                      className={`${config.bg} ${config.border} border-2 p-4 rounded-xl flex flex-col items-center gap-2 hover:shadow-md transition-shadow`}
                    >
                      <Icon className={`w-8 h-8 ${config.color}`} />
                      <p className={`text-sm font-bold ${config.color}`}>{status}</p>
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                      <p className="text-xs text-gray-500">ครั้ง</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <i className="bi bi-list-ul text-amber-600"></i>
                  ประวัติการเข้าแถว ({studentData.records.length} รายการ)
                </h3>
              </div>
              {studentData.records.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-semibold text-lg">ไม่พบประวัติการเข้าแถว</p>
                  <p className="text-gray-500 text-sm mt-2">ยังไม่มีการบันทึกข้อมูลในช่วงเวลาที่เลือก</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold">ลำดับ</th>
                        <th className="px-6 py-4 text-left font-bold">วันที่</th>
                        <th className="px-6 py-4 text-left font-bold">สถานะ</th>
                        <th className="px-6 py-4 text-left font-bold">ปีการศึกษา / ภาคเรียน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.records.map((record, index) => {
                        const config = getStatusConfig(record.status);
                        const Icon = config.icon;
                        return (
                          <tr
                            key={record.id}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
                            <td className="px-6 py-4 font-semibold text-gray-700">
                              {new Date(record.date).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 ${config.bg} ${config.border} border-2 px-4 py-2 rounded-lg`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                                <span className={`font-bold ${config.color}`}>{record.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-700">
                              {record.semester ? (
                                <>
                                  {record.semester.academicYear} / ภาคที่ {record.semester.semesterNumber}
                                </>
                              ) : (
                                <span className="text-gray-400">ไม่ระบุ</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceHistory;
