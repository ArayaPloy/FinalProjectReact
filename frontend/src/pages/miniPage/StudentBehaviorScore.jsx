import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Search, Users, TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLazyGetStudentBehaviorScoreQuery } from '../../services/studentPublicApi';

const StudentBehaviorScore = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [studentData, setStudentData] = useState(null);

  const [trigger, { isLoading }] = useLazyGetStudentBehaviorScoreQuery();

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
      const result = await trigger(parseInt(studentNumber)).unwrap();

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
    setStudentData(null);
  };

  // Score color based on value
  const getScoreColor = (score) => {
    if (score >= 100) return 'text-green-600';      // ดีมาก
    if (score >= 70) return 'text-blue-600';        // ดี
    if (score >= 1) return 'text-yellow-600';       // ควรปรับปรุง
    return 'text-red-600';                          // ไม่ผ่าน (≤ 0)
  };

  const getScoreBg = (score) => {
    if (score >= 100) return 'from-green-100 to-green-200';      // ดีมาก
    if (score >= 70) return 'from-blue-100 to-blue-200';         // ดี
    if (score >= 1) return 'from-yellow-100 to-yellow-200';      // ควรปรับปรุง
    return 'from-red-100 to-red-200';                            // ไม่ผ่าน (≤ 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 md:py-8 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 sm:px-5 md:px-6 py-6 md:py-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-white bg-opacity-20 rounded-lg md:rounded-xl backdrop-blur-sm flex-shrink-0">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  เช็คคะแนนความประพฤติ
                </h1>
                <p className="text-amber-100 mt-1 md:mt-1.5 flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                  <i className="bi bi-search flex-shrink-0"></i>
                  <span className="truncate">ค้นหาคะแนนด้วยรหัสนักเรียน</span>
                </p>
              </div>
            </div>
          </div>

          {/* Search Section - Mobile First */}
          <div className="p-4 sm:p-5 md:p-6">
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
              {/* Student Number Input */}
              <div className="md:col-span-2">
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

        {/* Results - Mobile Optimized */}
        {studentData && (
          <>
            {/* Student Info & Current Score - Mobile First */}
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-4 lg:gap-6 mb-4 md:mb-6">
              {/* Student Info */}
              <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="p-2.5 md:p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg md:rounded-xl flex-shrink-0">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-xl font-bold text-gray-800 leading-tight">ข้อมูลนักเรียน</h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">รหัส {studentData.student.studentNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-gray-200">
                    <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-1">ชื่อ-นามสกุล</p>
                    <p className="text-base md:text-lg font-bold text-gray-800 leading-tight break-words">
                      {studentData.student.namePrefix}{studentData.student.fullName}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-gray-200">
                    <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-1">ห้องเรียน</p>
                    <p className="text-base md:text-lg font-bold text-gray-800">{studentData.student.classRoom}</p>
                  </div>
                </div>
              </div>

              {/* Current Score - Mobile Optimized */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
                <div className={`bg-gradient-to-br ${getScoreBg(studentData.currentScore)} p-5 md:p-6 rounded-xl border-2 border-gray-200 text-center`}>
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Award className={`w-10 h-10 md:w-12 md:h-12 ${getScoreColor(studentData.currentScore)}`} />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">คะแนนปัจจุบัน</p>
                  <p className={`text-4xl md:text-5xl font-bold ${getScoreColor(studentData.currentScore)} leading-none`}>
                    {studentData.currentScore}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">/ 100 คะแนน</p>
                </div>
              </div>
            </div>

            {/* Statistics - Mobile Optimized */}
            {studentData.statistics.hasHistory && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <i className="bi bi-bar-chart-fill text-amber-600 text-lg md:text-xl"></i>
                  <span>สถิติการบันทึก</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-4 md:p-4 rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-bold text-green-700 leading-tight">คะแนนที่เพิ่ม</p>
                        <p className="text-xl md:text-2xl font-bold text-green-600 leading-tight mt-0.5">+{studentData.statistics.totalAdded}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-4 md:p-4 rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-7 h-7 md:w-8 md:h-8 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-bold text-red-700 leading-tight">คะแนนที่หัก</p>
                        <p className="text-xl md:text-2xl font-bold text-red-600 leading-tight mt-0.5">-{studentData.statistics.totalDeducted}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-4 md:p-4 rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-list-ul text-blue-600 text-2xl md:text-3xl flex-shrink-0"></i>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-bold text-blue-700 leading-tight">จำนวนบันทึก</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 leading-tight mt-0.5">{studentData.statistics.totalRecords}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History - Mobile Optimized */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
              <div className="px-4 sm:px-5 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                  <i className="bi bi-clock-history text-amber-600 text-lg md:text-xl"></i>
                  <span>ประวัติการบันทึกคะแนน</span>
                </h3>
              </div>

              {!studentData.statistics.hasHistory ? (
                <div className="p-8 md:p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-3 md:mb-4">
                    <Award className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
                  </div>
                  <p className="text-green-600 font-bold text-lg md:text-xl mb-1 md:mb-2">คะแนนเต็ม!</p>
                  <p className="text-gray-600 font-semibold text-sm md:text-base">ไม่มีประวัติการเพิ่ม/ลดคะแนน</p>
                  <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">นักเรียนคนนี้มีคะแนนความประพฤติเต็ม 100 คะแนน</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                        <tr>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">ลำดับ</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">วันที่</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center font-bold text-sm md:text-base">คะแนน</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">หมายเหตุ</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center font-bold text-sm md:text-base">คะแนนสะสม</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-left font-bold text-sm md:text-base">ผู้บันทึก</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentData.history.map((record, index) => (
                          <tr
                            key={record.id}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-700 text-sm md:text-base">{index + 1}</td>
                            <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-700 text-sm md:text-base whitespace-nowrap">
                              {new Date(record.date).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-base md:text-lg ${
                                  record.score > 0
                                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                    : 'bg-red-100 text-red-700 border-2 border-red-300'
                                }`}
                              >
                                {record.score > 0 ? '+' : ''}
                                {record.score}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700 text-sm md:text-base">
                              {record.comments || <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                              <span className={`text-lg md:text-xl font-bold ${getScoreColor(record.currentScore)}`}>
                                {record.currentScore}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-600 text-sm md:text-base">
                              {record.recordedBy}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden p-3 space-y-3">
                    {studentData.history.map((record, index) => (
                      <div
                        key={record.id}
                        className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md font-bold text-sm">
                              #{index + 1}
                            </span>
                            <span className="text-xs text-gray-500 font-semibold">
                              {new Date(record.date).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg font-bold text-base ${
                              record.score > 0
                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                : 'bg-red-100 text-red-700 border-2 border-red-300'
                            }`}
                          >
                            {record.score > 0 ? '+' : ''}
                            {record.score}
                          </span>
                        </div>
                        
                        {record.comments && (
                          <div className="bg-white p-2.5 rounded-md border border-gray-200">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">หมายเหตุ:</p>
                            <p className="text-sm text-gray-700 leading-relaxed break-words">{record.comments}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">คะแนนสะสม</p>
                            <p className={`text-xl font-bold ${getScoreColor(record.currentScore)}`}>
                              {record.currentScore}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-semibold">ผู้บันทึก</p>
                            <p className="text-sm font-semibold text-gray-700">{record.recordedBy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Score Guide - Mobile Optimized */}
            <div className="mt-4 md:mt-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-2.5 md:gap-3">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 md:mt-1" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-blue-800 mb-2 md:mb-2 text-sm md:text-base">เกณฑ์การประเมิน</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    <div className="bg-white p-2.5 md:p-3 rounded-lg border border-blue-200">
                      <div className="font-bold text-green-600 text-sm md:text-sm">≥ 100:</div>
                      <div className="text-gray-700 text-xs md:text-sm mt-0.5">ดีมาก</div>
                    </div>
                    <div className="bg-white p-2.5 md:p-3 rounded-lg border border-blue-200">
                      <div className="font-bold text-blue-600 text-sm md:text-sm">70-99:</div>
                      <div className="text-gray-700 text-xs md:text-sm mt-0.5">ดี</div>
                    </div>
                    <div className="bg-white p-2.5 md:p-3 rounded-lg border border-blue-200">
                      <div className="font-bold text-yellow-600 text-sm md:text-sm">1-69:</div>
                      <div className="text-gray-700 text-xs md:text-sm mt-0.5">ควรปรับปรุง</div>
                    </div>
                    <div className="bg-white p-2.5 md:p-3 rounded-lg border border-blue-200">
                      <div className="font-bold text-red-600 text-sm md:text-sm">≤ 0:</div>
                      <div className="text-gray-700 text-xs md:text-sm mt-0.5">ไม่ผ่าน</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentBehaviorScore;
