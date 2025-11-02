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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 sm:px-5 md:px-6 py-6 md:py-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl backdrop-blur-sm flex-shrink-0">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  เช็คประวัติเข้าแถว
                </h1>
                <p className="text-amber-100 mt-1 md:mt-1.5 flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                  <i className="bi bi-search flex-shrink-0"></i>
                  <span className="truncate">ค้นหาประวัติด้วยรหัสนักเรียน</span>
                </p>
              </div>
            </div>
          </div>

          {/* Search Section - Mobile First */}
          <div className="p-4 sm:p-5 md:p-6">
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-3 lg:gap-4">
              {/* Student Number Input */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                  <i className="bi bi-person-badge text-amber-600 text-base md:text-base"></i>
                  <span>รหัสนักเรียน</span>
                </label>
                <input
                  type="number"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="กรอกรหัสนักเรียน"
                  className="w-full px-4 py-3 md:py-3 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                  <i className="bi bi-calendar-event text-amber-600 text-base md:text-base"></i>
                  <span>ปีการศึกษา (ไม่บังคับ)</span>
                </label>
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => {
                    setSelectedAcademicYear(e.target.value);
                    setSelectedSemester('');
                  }}
                  className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
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
                <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                  <i className="bi bi-calendar3 text-amber-600 text-base md:text-base"></i>
                  <span>ภาคเรียน (ไม่บังคับ)</span>
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
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

              {/* Buttons - Mobile: Full Width Stack */}
              <div className="grid grid-cols-2 md:flex md:items-end gap-2 md:gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-amber-600 text-white px-4 md:px-6 py-3 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:bg-amber-700 active:bg-amber-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 touch-manipulation min-h-[48px] md:min-h-0 md:flex-1"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="truncate">{isLoading ? 'ค้นหา...' : 'ค้นหา'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-4 md:px-6 py-3 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:bg-gray-600 active:bg-gray-700 transition-all shadow-lg hover:shadow-xl touch-manipulation min-h-[48px] md:min-h-0"
                  title="รีเซ็ต"
                >
                  <i className="bi bi-arrow-clockwise text-lg md:text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {studentData && (
          <>
            {/* Student Info */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="p-2.5 md:p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg md:rounded-xl flex-shrink-0">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-amber-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">ข้อมูลนักเรียน</h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">รหัส {studentData.student.studentNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg md:rounded-xl border-2 border-gray-200">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                  <p className="text-base md:text-lg font-bold text-gray-800 break-words leading-tight">
                    {studentData.student.namePrefix}{studentData.student.fullName}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg md:rounded-xl border-2 border-gray-200">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">ห้องเรียน</p>
                  <p className="text-base md:text-lg font-bold text-gray-800 break-words leading-tight">{studentData.student.classRoom}</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg md:rounded-xl border-2 border-gray-200 sm:col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">จำนวนบันทึกทั้งหมด</p>
                  <p className="text-base md:text-lg font-bold text-gray-800">{studentData.totalRecords} ครั้ง</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                <i className="bi bi-bar-chart-fill text-amber-600 text-lg sm:text-xl flex-shrink-0"></i>
                <span className="truncate">สถิติการเข้าแถว</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {Object.entries(studentData.statistics).map(([status, count]) => {
                  const config = getStatusConfig(status);
                  const Icon = config.icon;
                  return (
                    <div
                      key={status}
                      className={`${config.bg} ${config.border} border-2 p-3 sm:p-4 rounded-lg md:rounded-xl flex flex-col items-center gap-2 hover:shadow-md transition-shadow touch-manipulation`}
                    >
                      <Icon className={`w-6 h-6 md:w-8 md:h-8 ${config.color} flex-shrink-0`} />
                      <p className={`text-xs sm:text-sm font-bold ${config.color} text-center`}>{status}</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{count}</p>
                      <p className="text-xs text-gray-500">ครั้ง</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
              <div className="px-4 sm:px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <h3 className="text-base sm:text-lg md:text-lg font-bold text-gray-800 flex items-center gap-2">
                  <i className="bi bi-list-ul text-amber-600 text-lg sm:text-xl flex-shrink-0"></i>
                  <span className="truncate">ประวัติการเข้าแถว ({studentData.records.length} รายการ)</span>
                </h3>
              </div>
              {studentData.records.length === 0 ? (
                <div className="p-8 sm:p-10 md:p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-3 md:mb-4">
                    <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-semibold text-base md:text-lg">ไม่พบประวัติการเข้าแถว</p>
                  <p className="text-gray-500 text-sm mt-2">ยังไม่มีการบันทึกข้อมูลในช่วงเวลาที่เลือก</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                        <tr>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">ลำดับ</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">วันที่</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">สถานะ</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">ปีการศึกษา / ภาคเรียน</th>
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
                              <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-700 text-sm md:text-base">{index + 1}</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-700 text-sm md:text-base">
                                {new Date(record.date).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'long'
                                })}
                              </td>
                              <td className="px-4 md:px-6 py-3 md:py-4">
                                <div className={`inline-flex items-center gap-2 ${config.bg} ${config.border} border-2 px-3 md:px-4 py-2 rounded-lg`}>
                                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${config.color} flex-shrink-0`} />
                                  <span className={`font-bold ${config.color} text-sm md:text-base`}>{record.status}</span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-700 text-sm md:text-base">
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

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3 p-4">
                    {studentData.records.map((record, index) => {
                      const config = getStatusConfig(record.status);
                      const Icon = config.icon;
                      return (
                        <div
                          key={record.id}
                          className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3 hover:border-amber-300 transition-colors touch-manipulation"
                        >
                          {/* Index Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <div className={`inline-flex items-center gap-2 ${config.bg} ${config.border} border-2 px-3 py-1.5 rounded-lg`}>
                              <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
                              <span className={`font-bold ${config.color} text-sm`}>{record.status}</span>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="flex items-start gap-2">
                            <i className="bi bi-calendar-check text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 mb-0.5">วันที่</p>
                              <p className="text-sm font-bold text-gray-800 leading-tight break-words">
                                {new Date(record.date).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'long'
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Academic Info */}
                          <div className="flex items-start gap-2">
                            <i className="bi bi-book text-gray-400 text-base flex-shrink-0 mt-0.5"></i>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 mb-0.5">ปีการศึกษา / ภาคเรียน</p>
                              <p className="text-sm font-bold text-gray-800 leading-tight">
                                {record.semester ? (
                                  <>
                                    {record.semester.academicYear} / ภาคที่ {record.semester.semesterNumber}
                                  </>
                                ) : (
                                  <span className="text-gray-400">ไม่ระบุ</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceHistory;
