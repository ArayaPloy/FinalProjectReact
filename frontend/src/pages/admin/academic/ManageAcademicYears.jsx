import React, { useState } from 'react';
import { MdModeEdit, MdDelete, MdCheckCircle } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import {
  useGetAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useSetCurrentAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useUpdateSemesterMutation,
  useSetCurrentSemesterMutation,
} from '../../../services/academicApi';
import Swal from 'sweetalert2';
import { showApiError } from '../../../utils/sweetAlertHelper';

const ManageAcademicYears = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = ['admin', 'super_admin'].includes((currentUser?.role || '').toLowerCase());

  const { data: academicYears = [], isLoading, refetch } = useGetAcademicYearsQuery();
  const [createAcademicYear, { isLoading: isCreating }] = useCreateAcademicYearMutation();
  const [updateAcademicYear] = useUpdateAcademicYearMutation();
  const [setCurrentAcademicYear] = useSetCurrentAcademicYearMutation();
  const [deleteAcademicYear] = useDeleteAcademicYearMutation();
  const [updateSemester] = useUpdateSemesterMutation();
  const [setCurrentSemester] = useSetCurrentSemesterMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    year: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  const [semesterFormData, setSemesterFormData] = useState({
    startDate: '',
    endDate: '',
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      year: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    });
    setEditingYear(null);
    setShowCreateModal(false);
  };

  const resetSemesterForm = () => {
    setSemesterFormData({
      startDate: '',
      endDate: '',
    });
    setEditingSemester(null);
  };

  // Handle create/update academic year
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingYear) {
        await updateAcademicYear({
          id: editingYear.id,
          ...formData,
        }).unwrap();

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'อัปเดตปีการศึกษาเรียบร้อย',
          confirmButtonColor: '#D97706',
          confirmButtonText: 'ตกลง'
        });
      } else {
        await createAcademicYear(formData).unwrap();

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'สร้างปีการศึกษาเรียบร้อย',
          confirmButtonColor: '#D97706',
          confirmButtonText: 'ตกลง'
        });
      }

      resetForm();
      refetch();
    } catch (error) {
      showApiError(error, 'ไม่สามารถบันทึกข้อมูลได้', 'บันทึกข้อมูลปีการศึกษา');
    }
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setFormData({
      year: year.year,
      startDate: year.startDate.split('T')[0],
      endDate: year.endDate.split('T')[0],
      isCurrent: year.isCurrent,
    });
    setShowCreateModal(true);
  };

  // Handle set current year
  const handleSetCurrent = async (yearId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการเปลี่ยนแปลง',
      html: 'ต้องการตั้งเป็นปีการศึกษาปัจจุบันหรือไม่?<br><small class="text-gray-600">ระบบจะตั้งภาคเรียนที่ 1 เป็นภาคปัจจุบันอัตโนมัติ</small>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D97706',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        // ตั้งปีการศึกษาเป็นปัจจุบัน
        await setCurrentAcademicYear(yearId).unwrap();
        
        // หาภาคเรียนที่ 1 ของปีนี้และตั้งเป็นภาคปัจจุบัน
        const selectedYear = academicYears.find(year => year.id === yearId);
        if (selectedYear && selectedYear.semesters.length > 0) {
          const firstSemester = selectedYear.semesters.find(sem => sem.semesterNumber === 1);
          if (firstSemester) {
            await setCurrentSemester(firstSemester.id).unwrap();
          }
        }
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'ตั้งเป็นปีการศึกษาปัจจุบันและภาคเรียนที่ 1 แล้ว',
          confirmButtonColor: '#D97706',
          confirmButtonText: 'ตกลง'
        });
        refetch();
      } catch (error) {
        showApiError(error, 'ไม่สามารถดำเนินการได้', 'ตั้งปีการศึกษาปัจจุบัน');
      }
    }
  };

  // Handle delete
  const handleDelete = async (yearId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      html: '<p class="text-gray-700">ต้องการลบปีการศึกษานี้หรือไม่?</p><p class="text-sm text-red-600 mt-2"><i class="bi bi-exclamation-triangle mr-1"></i><strong>คำเตือน:</strong> การลบจะไม่สามารถกู้คืนได้</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        await deleteAcademicYear(yearId).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'ลบปีการศึกษาและภาคเรียนทั้งหมดแล้ว',
          confirmButtonColor: '#D97706',
          confirmButtonText: 'ตกลง'
        });
        refetch();
      } catch (error) {
        if (error?.status === 403) {
          showApiError(error, '', 'ลบปีการศึกษา');
          return;
        }
        // จัดการ error message ที่มีรายละเอียด
        const errorMessage = error.data?.message || 'ไม่สามารถลบได้';
        const errorDetail = error.data?.detail || '';
        const errorSuggestion = error.data?.suggestion || '';

        let htmlContent = `<p class="text-gray-700 mb-2">${errorMessage}</p>`;
        if (errorDetail) {
          htmlContent += `<p class="text-sm text-gray-600 mb-2">${errorDetail}</p>`;
        }
        if (errorSuggestion) {
          htmlContent += `<p class="text-sm text-blue-600"><i class="bi bi-lightbulb mr-1"></i>${errorSuggestion}</p>`;
        }

        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถลบได้!',
          html: htmlContent,
          confirmButtonColor: '#D97706',
          width: '600px',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };

  // Handle edit semester
  const handleEditSemester = (semester) => {
    setEditingSemester(semester);
    setSemesterFormData({
      startDate: semester.startDate.split('T')[0],
      endDate: semester.endDate.split('T')[0],
    });
  };

  // Handle update semester
  const handleUpdateSemester = async (e) => {
    e.preventDefault();

    try {
      await updateSemester({
        id: editingSemester.id,
        ...semesterFormData,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'อัปเดตภาคเรียนเรียบร้อย',
        confirmButtonColor: '#D97706',
        confirmButtonText: 'ตกลง'
      });

      resetSemesterForm();
      refetch();
    } catch (error) {
      showApiError(error, 'ไม่สามารถบันทึกข้อมูลได้', 'บันทึกข้อมูลภาคเรียน');
    }
  };

  const handleSetCurrentSemester = async (semesterId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการเปลี่ยนแปลง',
      text: 'ต้องการตั้งเป็นภาคเรียนปัจจุบันหรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D97706',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        await setCurrentSemester(semesterId).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'ตั้งเป็นภาคเรียนปัจจุบันแล้ว',
          confirmButtonColor: '#D97706',
          confirmButtonText: 'ตกลง'
        });
        refetch();
      } catch (error) {
        showApiError(error, 'ไม่สามารถดำเนินการได้', 'ตั้งภาคเรียนปัจจุบัน');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-gray-500 text-sm">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <i className="bi bi-arrow-repeat animate-spin text-4xl text-amber-600 mb-4"></i>
          <p className="text-gray-600 font-semibold">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <i className="bi bi-calendar-check text-4xl"></i>
                จัดการปีการศึกษาและภาคเรียน
              </h1>
              <p className="text-amber-100 mt-2">
                จัดการข้อมูลปีการศึกษาและภาคเรียนของโรงเรียน
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <i className="bi bi-plus-circle text-xl"></i>
              เพิ่มปีการศึกษา
            </button>
          </div>
        </div>

        {/* Academic Years List */}
        <div className="space-y-6">
          {academicYears.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <i className="bi bi-inbox text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-semibold text-lg">ยังไม่มีข้อมูลปีการศึกษา</p>
              <p className="text-gray-400 text-sm mt-2">เริ่มต้นโดยการเพิ่มปีการศึกษาใหม่</p>
            </div>
          ) : (
            academicYears.map((year) => (
              <div
                key={year.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  year.isCurrent ? 'ring-4 ring-amber-300' : ''
                }`}
              >
                {/* Year Header */}
                <div className={`p-6 ${year.isCurrent ? 'bg-gradient-to-r from-amber-100 to-amber-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          ปีการศึกษา {parseInt(year.year)}
                        </h2>
                        {year.isCurrent && (
                          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <i className="bi bi-check-circle-fill"></i>
                            ปีปัจจุบัน
                          </span>
                        )}
                        {!year.isActive && (
                          <span className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            ปิดใช้งาน
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm font-semibold">
                        <i className="bi bi-calendar-range text-amber-600 mr-2"></i>
                        {new Date(year.startDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(year.endDate).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!year.isCurrent && year.isActive && (
                        <button
                          onClick={() => handleSetCurrent(year.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          title="ตั้งเป็นปีปัจจุบัน"
                        >
                          <MdCheckCircle className="w-4 h-4" />
                          ตั้งเป็นปีปัจจุบัน
                        </button>
                      )}
                      {year.isActive && (
                        <button
                          onClick={() => handleEdit(year)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          <MdModeEdit className="w-4 h-4" />
                          แก้ไข
                        </button>
                      )}
                      {!year.isCurrent && year.isActive && (
                        <button
                          onClick={() => handleDelete(year.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="ลบปีการศึกษาและภาคเรียนทั้งหมด (ไม่สามารถกู้คืนได้)"
                        >
                          <MdDelete className="w-4 h-4" />
                          ลบ
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Semesters */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="bi bi-calendar3 text-amber-600"></i>
                    ภาคเรียน
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {year.semesters.map((semester) => (
                      <div
                        key={semester.id}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          semester.isCurrent
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                              ภาคเรียนที่ {semester.semesterNumber}
                              {semester.isCurrent && (
                                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                                  ภาคปัจจุบัน
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(semester.startDate).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              -{' '}
                              {new Date(semester.endDate).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!semester.isCurrent && semester.isActive && (
                              <button
                                onClick={() => handleSetCurrentSemester(semester.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                title="ตั้งเป็นภาคปัจจุบัน"
                              >
                                <MdCheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditSemester(semester)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                              <MdModeEdit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <i className="bi bi-calendar-plus"></i>
                {editingYear ? 'แก้ไขปีการศึกษา' : 'เพิ่มปีการศึกษาใหม่'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ปีการศึกษา (พ.ศ.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="เช่น: 2568"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  <i className="bi bi-info-circle mr-1"></i>
                  ระบุปี พ.ศ. เท่านั้น
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันเริ่มต้น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันสิ้นสุด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                    className="w-5 h-5 text-amber-600 focus:ring-2 focus:ring-amber-500 rounded"
                  />
                  <span className="font-semibold text-gray-700">ตั้งเป็นปีการศึกษาปัจจุบัน</span>
                </label>
                <p className="text-sm text-gray-600 ml-8 mt-1">
                  <i className="bi bi-info-circle mr-1"></i>
                  การเลือกนี้จะเปลี่ยนปีปัจจุบันเป็นปีนี้ทันที
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-semibold flex items-center gap-2">
                  <i className="bi bi-lightbulb text-lg"></i>
                  หมายเหตุ
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-6 space-y-1 list-disc">
                  <li>ระบบจะสร้างภาคเรียนที่ 1 และ 2 อัตโนมัติ</li>
                  <li>วันที่จะถูกแบ่งครึ่งเพื่อกำหนดภาคเรียน</li>
                  <li>สามารถแก้ไขวันที่ของแต่ละภาคได้ภายหลัง</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                      กำลังบันทึก...
                    </>
                  ) : editingYear ? (
                    'บันทึกการแก้ไข'
                  ) : (
                    'สร้างปีการศึกษา'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Semester Modal */}
      {editingSemester && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <i className="bi bi-calendar3"></i>
                แก้ไขภาคเรียนที่ {editingSemester.semesterNumber}
              </h2>
            </div>

            <form onSubmit={handleUpdateSemester} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันเริ่มต้น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={semesterFormData.startDate}
                    onChange={(e) =>
                      setSemesterFormData({ ...semesterFormData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    วันสิ้นสุด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={semesterFormData.endDate}
                    onChange={(e) =>
                      setSemesterFormData({ ...semesterFormData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetSemesterForm}
                  className="flex-1 bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAcademicYears;
