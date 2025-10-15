import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Download, Upload } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ClassSelect from '../components/common/ClassSelect';
import api from '../services/api';
import { attendanceService } from '../services/attendanceService';
import {
    showSuccess,
    showError,
    showConfirm,
    showDeleteConfirm,
    showLoading,
    closeAlert,
} from '../utils/sweetAlertHelper';
import Swal from 'sweetalert2';

const StudentsManage = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classList, setClassList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        studentId: '',
        namePrefix: 'เด็กชาย',
        fullName: '',
        genderId: 1,
        classRoom: '',
        studentNumber: '',
    });

    useEffect(() => {
        fetchClasses();
        fetchStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [students, selectedClass, searchQuery]);

    const fetchClasses = async () => {
        try {
            const data = await attendanceService.getClasses();
            setClassList(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data.data);
        } catch (error) {
            showError('ข้อผิดพลาด', 'ไม่สามารถโหลดรายชื่อนักเรียนได้');
        } finally {
            setLoading(false);
        }
    };

    const filterStudents = () => {
        let filtered = students;

        if (selectedClass) {
            filtered = filtered.filter((s) => s.classRoom === selectedClass);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.fullName.toLowerCase().includes(query) ||
                    s.studentId.toLowerCase().includes(query) ||
                    s.studentNumber.toString().includes(query)
            );
        }

        setFilteredStudents(filtered);
    };

    const handleOpenModal = (student = null) => {
        if (student) {
            setEditingStudent(student);
            setFormData({
                studentId: student.studentId,
                namePrefix: student.namePrefix || 'เด็กชาย',
                fullName: student.fullName,
                genderId: student.genderId,
                classRoom: student.classRoom,
                studentNumber: student.studentNumber,
            });
        } else {
            setEditingStudent(null);
            setFormData({
                studentId: '',
                namePrefix: 'เด็กชาย',
                fullName: '',
                genderId: 1,
                classRoom: '',
                studentNumber: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingStudent(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.studentId || !formData.fullName || !formData.classRoom || !formData.studentNumber) {
            showError('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const result = await showConfirm(
            editingStudent ? 'ยืนยันการแก้ไข' : 'ยืนยันการเพิ่มนักเรียน',
            `ชื่อ: ${formData.fullName}\nห้อง: ${formData.classRoom}\nเลขที่: ${formData.studentNumber}`
        );

        if (!result.isConfirmed) return;

        showLoading('กำลังบันทึก...', 'กรุณารอสักครู่');

        try {
            if (editingStudent) {
                // Update
                await api.put(`/students/${editingStudent.id}`, formData);
                showSuccess('แก้ไขสำเร็จ', 'บันทึกข้อมูลนักเรียนเรียบร้อย');
            } else {
                // Create
                await api.post('/students', formData);
                showSuccess('เพิ่มสำเร็จ', 'เพิ่มนักเรียนใหม่เรียบร้อย');
            }

            fetchStudents();
            handleCloseModal();
        } catch (error) {
            showError('ข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleDelete = async (student) => {
        const result = await showDeleteConfirm(`${student.fullName} (${student.studentId})`);

        if (!result.isConfirmed) return;

        showLoading('กำลังลบ...', 'กรุณารอสักครู่');

        try {
            await api.delete(`/students/${student.id}`);
            showSuccess('ลบสำเร็จ', 'ลบข้อมูลนักเรียนเรียบร้อย');
            fetchStudents();
        } catch (error) {
            showError('ข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถลบข้อมูลได้');
        }
    };

    const handleImportFromSheet = async () => {
        const result = await showConfirm(
            'นำเข้านักเรียนจาก Google Sheets',
            'ระบบจะดึงข้อมูลนักเรียนจาก Google Sheets และนำเข้าสู่ฐานข้อมูล'
        );

        if (!result.isConfirmed) return;

        showLoading('กำลังนำเข้า...', 'กรุณารอสักครู่');

        try {
            const result = await attendanceService.importStudentsFromSheet();
            showSuccess('นำเข้าสำเร็จ!', `นำเข้านักเรียน ${result.imported} คน`);
            fetchStudents();
        } catch (error) {
            showError('ข้อผิดพลาด', error.message);
        }
    };

    const handleExport = () => {
        const headers = ['รหัสนักเรียน', 'คำนำหน้า', 'ชื่อ-สกุล', 'ห้อง', 'เลขที่'];
        const rows = filteredStudents.map((s) => [
            s.studentId,
            s.namePrefix || '',
            s.fullName,
            s.classRoom,
            s.studentNumber,
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `students_${selectedClass || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        showSuccess('ส่งออกสำเร็จ', 'ดาวน์โหลดไฟล์รายชื่อนักเรียนเรียบร้อย', 2000);
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
                                จัดการข้อมูลนักเรียน
                            </h1>
                            <p className="text-gray-600 mt-1">เพิ่ม แก้ไข ลบ นักเรียน</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleImportFromSheet}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                            >
                                <Upload className="w-5 h-5" />
                                Import จาก Sheet
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={filteredStudents.length === 0}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors disabled:opacity-50"
                            >
                                <Download className="w-5 h-5" />
                                Export CSV
                            </button>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                เพิ่มนักเรียน
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ClassSelect
                            label="กรองตามห้อง"
                            value={selectedClass}
                            onChange={setSelectedClass}
                            options={classList}
                            placeholder="-- ทุกห้อง --"
                        />
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Search className="w-4 h-4 inline mr-1" />
                                ค้นหา
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ชื่อ, รหัส, เลขที่..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>ไม่พบนักเรียน</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                แสดง {filteredStudents.length} จาก {students.length} คน
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                รหัสนักเรียน
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ชื่อ-สกุล
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ห้อง
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                เลขที่
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                จัดการ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {student.studentId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.namePrefix} {student.fullName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.classRoom}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.studentNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <button
                                                        onClick={() => handleOpenModal(student)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        <Edit2 className="w-5 h-5 inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-5 h-5 inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Student ID */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        รหัสนักเรียน <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        disabled={!!editingStudent}
                                    />
                                </div>

                                {/* Name Prefix & Full Name */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">คำนำหน้า</label>
                                        <select
                                            value={formData.namePrefix}
                                            onChange={(e) => setFormData({ ...formData, namePrefix: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="เด็กชาย">เด็กชาย</option>
                                            <option value="เด็กหญิง">เด็กหญิง</option>
                                            <option value="นาย">นาย</option>
                                            <option value="นางสาว">นางสาว</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            ชื่อ-สกุล <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        เพศ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.genderId}
                                        onChange={(e) => setFormData({ ...formData, genderId: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value={1}>ชาย</option>
                                        <option value={2}>หญิง</option>
                                    </select>
                                </div>

                                {/* Class & Student Number */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            ห้องเรียน <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.classRoom}
                                            onChange={(e) => setFormData({ ...formData, classRoom: e.target.value })}
                                            placeholder="เช่น ม.1/1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            เลขที่ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.studentNumber}
                                            onChange={(e) => setFormData({ ...formData, studentNumber: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        {editingStudent ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsManage;