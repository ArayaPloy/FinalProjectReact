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
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'from-green-100 to-green-200';
    if (score >= 80) return 'from-blue-100 to-blue-200';
    if (score >= 70) return 'from-yellow-100 to-yellow-200';
    return 'from-red-100 to-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  เช็คคะแนนความประพฤติ
                </h1>
                <p className="text-amber-100 mt-1 flex items-center gap-2">
                  <i className="bi bi-search"></i>
                  ค้นหาคะแนนความประพฤติด้วยรหัสนักเรียน
                </p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Number Input */}
              <div className="md:col-span-2">
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
            {/* Student Info & Current Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Student Info */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                    <Users className="w-8 h-8 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">ข้อมูลนักเรียน</h2>
                    <p className="text-sm text-gray-500">รหัส {studentData.student.studentNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              {/* Current Score */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className={`bg-gradient-to-br ${getScoreBg(studentData.currentScore)} p-6 rounded-xl border-2 border-gray-200 text-center`}>
                  <div className="flex items-center justify-center mb-2">
                    <Award className={`w-12 h-12 ${getScoreColor(studentData.currentScore)}`} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 mb-2">คะแนนปัจจุบัน</p>
                  <p className={`text-5xl font-bold ${getScoreColor(studentData.currentScore)}`}>
                    {studentData.currentScore}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">/ 100 คะแนน</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {studentData.statistics.hasHistory && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="bi bi-bar-chart-fill text-amber-600"></i>
                  สถิติการบันทึก
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-700">คะแนนที่เพิ่ม</p>
                        <p className="text-2xl font-bold text-green-600">+{studentData.statistics.totalAdded}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-sm font-bold text-red-700">คะแนนที่หัก</p>
                        <p className="text-2xl font-bold text-red-600">-{studentData.statistics.totalDeducted}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-list-ul text-blue-600 text-3xl"></i>
                      <div>
                        <p className="text-sm font-bold text-blue-700">จำนวนบันทึก</p>
                        <p className="text-2xl font-bold text-blue-600">{studentData.statistics.totalRecords}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <i className="bi bi-clock-history text-amber-600"></i>
                  ประวัติการบันทึกคะแนน
                </h3>
              </div>

              {!studentData.statistics.hasHistory ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-4">
                    <Award className="w-12 h-12 text-green-600" />
                  </div>
                  <p className="text-green-600 font-bold text-xl mb-2">คะแนนเต็ม!</p>
                  <p className="text-gray-600 font-semibold">ไม่มีประวัติการเพิ่ม/ลดคะแนน</p>
                  <p className="text-gray-500 text-sm mt-2">นักเรียนคนนี้มีคะแนนความประพฤติเต็ม 100 คะแนน</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold">ลำดับ</th>
                        <th className="px-6 py-4 text-left font-bold">วันที่</th>
                        <th className="px-6 py-4 text-center font-bold">คะแนน</th>
                        <th className="px-6 py-4 text-left font-bold">หมายเหตุ</th>
                        <th className="px-6 py-4 text-center font-bold">คะแนนสะสม</th>
                        <th className="px-6 py-4 text-left font-bold">ผู้บันทึก</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.history.map((record, index) => (
                        <tr
                          key={record.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {new Date(record.date).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-lg ${
                                record.score > 0
                                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                  : 'bg-red-100 text-red-700 border-2 border-red-300'
                              }`}
                            >
                              {record.score > 0 ? '+' : ''}
                              {record.score}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {record.comments || <span className="text-gray-400">-</span>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-xl font-bold ${getScoreColor(record.currentScore)}`}>
                              {record.currentScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-600">
                            {record.recordedBy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Score Guide */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-800 mb-2">เกณฑ์การประเมิน</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-green-600">90-100:</span>
                      <span className="text-gray-700 ml-1">ดีมาก</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-600">80-89:</span>
                      <span className="text-gray-700 ml-1">ดี</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-yellow-600">70-79:</span>
                      <span className="text-gray-700 ml-1">ปานกลาง</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-red-600">&lt; 70:</span>
                      <span className="text-gray-700 ml-1">ควรปรับปรุง</span>
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
