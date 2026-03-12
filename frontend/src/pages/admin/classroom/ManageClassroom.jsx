import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { MdModeEdit, MdBlock } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const jsonHeaders = { 'Content-Type': 'application/json' };
const fetchOpts = { headers: jsonHeaders, credentials: 'include' };

// ─── Modal สำหรับ เพิ่ม / แก้ไข ห้องเรียน ───────────────────────────────
const ClassroomModal = ({ isOpen, onClose, onSave, classroom, teachers, academicYears }) => {
    const isEdit = !!classroom;
    const [form, setForm] = useState({
        className: '',
        homeroomTeacherId: '',
        academicYearId: '',
        maxStudents: 40,
        room: '',
        floor: '',
        building: '',
        isActive: true,
    });

    useEffect(() => {
        if (classroom) {
            setForm({
                className: classroom.className || '',
                homeroomTeacherId: classroom.homeroomTeacher?.id || '',
                academicYearId: classroom.academicYear?.id || '',
                maxStudents: classroom.maxStudents || 40,
                room: classroom.room || '',
                floor: classroom.floor || '',
                building: classroom.building || '',
                isActive: classroom.isActive !== false,
            });
        } else {
            setForm({ className: '', homeroomTeacherId: '', academicYearId: '', maxStudents: 40, room: '', floor: '', building: '', isActive: true });
        }
    }, [classroom, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.className.trim()) {
            Swal.fire({ icon: 'warning', title: 'กรุณากรอกชื่อห้อง', confirmButtonColor: '#4f46e5', confirmButtonText: 'ตกลง' });
            return;
        }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white">{isEdit ? '✏️ แก้ไขห้องเรียน' : '➕ เพิ่มห้องเรียนใหม่'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* ชื่อห้อง */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อห้อง <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.className}
                            onChange={e => setForm(p => ({ ...p, className: e.target.value }))}
                            placeholder="เช่น 1/1, 2/3"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* ครูประจำชั้น */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">ครูประจำชั้น</label>
                        <select
                            value={form.homeroomTeacherId}
                            onChange={e => setForm(p => ({ ...p, homeroomTeacherId: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- ยังไม่กำหนด --</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ปีการศึกษา */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">ปีการศึกษา</label>
                        <select
                            value={form.academicYearId}
                            onChange={e => setForm(p => ({ ...p, academicYearId: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- ไม่ระบุ --</option>
                            {academicYears.map(y => (
                                <option key={y.id} value={y.id}>
                                    {y.year}{y.isCurrent ? ' (ปัจจุบัน)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* จำนวนนักเรียนสูงสุด */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">จำนวนนักเรียนสูงสุด</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={form.maxStudents}
                            onChange={e => setForm(p => ({ ...p, maxStudents: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* ห้อง / ชั้น / อาคาร */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">ห้อง</label>
                            <input
                                type="text"
                                value={form.room}
                                onChange={e => setForm(p => ({ ...p, room: e.target.value }))}
                                placeholder="เช่น 101"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">ชั้น</label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={form.floor}
                                onChange={e => setForm(p => ({ ...p, floor: e.target.value }))}
                                placeholder="1"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">อาคาร</label>
                            <input
                                type="text"
                                value={form.building}
                                onChange={e => setForm(p => ({ ...p, building: e.target.value }))}
                                placeholder="เช่น อาคาร 1"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* สถานะ */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={form.isActive}
                            onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                            className="w-4 h-4 accent-indigo-600"
                        />
                        <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">เปิดใช้งาน</label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                        >
                            {isEdit ? 'บันทึกการแก้ไข' : 'สร้างห้องเรียน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── ManageClassroom page ─────────────────────────────────────────────────
const ManageClassroom = () => {    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = ['admin', 'super_admin'].includes((currentUser?.role || '').toLowerCase());
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [search, setSearch] = useState('');

    // ─── fetch ───────────────────────────────────────────────────────────────
    const fetchClassrooms = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/classrooms`, fetchOpts);
            const json = await res.json();
            if (json.success) setClassrooms(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchTeachers = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/teachers`, fetchOpts);
            const json = await res.json();
            if (json.success) setTeachers(json.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchAcademicYears = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/academic-years`, fetchOpts);
            const json = await res.json();
            // academic-years API returns a plain array
            setAcademicYears(Array.isArray(json) ? json : (json.data || []));
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchClassrooms();
        fetchTeachers();
        fetchAcademicYears();
    }, [fetchClassrooms, fetchTeachers, fetchAcademicYears]);

    // ─── CRUD ─────────────────────────────────────────────────────────────────
    const handleSave = async (form) => {
        const url = editingClassroom
            ? `${API_URL}/classrooms/${editingClassroom.id}`
            : `${API_URL}/classrooms`;
        const method = editingClassroom ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                ...fetchOpts,
                body: JSON.stringify(form),
            });
            const json = await res.json();

            if (json.success) {
                Swal.fire({ icon: 'success', title: 'สำเร็จ!', text: json.message, confirmButtonColor: '#4f46e5', timer: 1500, showConfirmButton: false });
                setModalOpen(false);
                setEditingClassroom(null);
                fetchClassrooms();
            } else {
                Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: json.message, confirmButtonColor: '#ef4444', confirmButtonText: 'ตกลง' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message, confirmButtonColor: '#ef4444', confirmButtonText: 'ตกลง' });
        }
    };

    const handleDelete = async (classroom) => {
        const result = await Swal.fire({
            title: `ปิดการใช้งานห้อง "${classroom.className}" ?`,
            html: classroom.studentCount > 0
                ? `<p class="text-yellow-600">มีนักเรียน <strong>${classroom.studentCount}</strong> คนในห้องนี้</p><p class="mt-1">ห้องนี้จะถูก<strong>ปิดการใช้งาน</strong></p>`
                : '<p>ห้องนี้จะถูก<strong>ปิดการใช้งาน</strong></p>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d97706',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ปิดการใช้งาน',
            cancelButtonText: 'ยกเลิก',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API_URL}/classrooms/${classroom.id}`, {
                method: 'DELETE',
                ...fetchOpts,
            });
            const json = await res.json();

            if (json.success) {
                Swal.fire({ icon: 'success', title: 'สำเร็จ', text: json.message, confirmButtonColor: '#4f46e5', timer: 1800, showConfirmButton: false });
                fetchClassrooms();
            } else {
                Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: json.message, confirmButtonColor: '#ef4444', confirmButtonText: 'ตกลง' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: err.message, confirmButtonColor: '#ef4444', confirmButtonText: 'ตกลง' });
        }
    };

    // ─── filtered list ────────────────────────────────────────────────────────
    const filtered = classrooms.filter(c => {
        const q = search.toLowerCase();
        return (
            c.className?.toLowerCase().includes(q) ||
            c.homeroomTeacher?.fullName?.toLowerCase().includes(q)
        );
    });

    // ─── render ───────────────────────────────────────────────────────────────
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

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">🏫 จัดการห้องเรียน</h1>
                    <p className="text-sm text-gray-500 mt-1">กำหนดครูประจำชั้น, สถานที่, และจำนวนนักเรียน</p>
                </div>
                <button
                    onClick={() => { setEditingClassroom(null); setModalOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                >
                    ➕ เพิ่มห้องเรียน
                </button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="ค้นหาห้องเรียน, ครูประจำชั้น..."
                    className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'ห้องทั้งหมด', value: classrooms.length, color: 'bg-indigo-50 text-indigo-700' },
                    { label: 'เปิดใช้งาน', value: classrooms.filter(c => c.isActive).length, color: 'bg-green-50 text-green-700' },
                    { label: 'ปิดใช้งาน', value: classrooms.filter(c => !c.isActive).length, color: 'bg-red-50 text-red-700' },
                    { label: 'นักเรียนรวม', value: classrooms.reduce((s, c) => s + (c.studentCount || 0), 0), color: 'bg-amber-50 text-amber-700' },
                ].map((s, i) => (
                    <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-xs font-medium mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-5xl mb-3">🏫</p>
                    <p className="font-semibold">{search ? 'ไม่พบห้องที่ค้นหา' : 'ยังไม่มีห้องเรียน'}</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">ห้อง</th>
                                    <th className="px-4 py-3 text-left">ครูประจำชั้น</th>
                                    <th className="px-4 py-3 text-center">นักเรียน</th>
                                    <th className="px-4 py-3 text-left hidden sm:table-cell">สถานที่</th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">ปีการศึกษา</th>
                                    <th className="px-4 py-3 text-center">สถานะ</th>
                                    <th className="px-4 py-3 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(classroom => (
                                    <tr key={classroom.id} className="hover:bg-gray-50 transition-colors">
                                        <td className={`px-4 py-3 ${!classroom.isActive ? 'opacity-40' : ''}`}>
                                            <span className="font-bold text-indigo-700 text-base">{classroom.className}</span>
                                        </td>
                                        <td className={`px-4 py-3 ${!classroom.isActive ? 'opacity-40' : ''}`}>
                                            {classroom.homeroomTeacher ? (
                                                <span className="text-gray-700">{classroom.homeroomTeacher.fullName}</span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">ยังไม่กำหนด</span>
                                            )}
                                        </td>
                                        <td className={`px-4 py-3 text-center ${!classroom.isActive ? 'opacity-40' : ''}`}>
                                            <span className={`font-semibold ${classroom.studentCount >= (classroom.maxStudents || 40) ? 'text-red-600' : 'text-gray-700'}`}>
                                                {classroom.studentCount}
                                            </span>
                                            <span className="text-gray-400 text-xs">/{classroom.maxStudents || '—'}</span>
                                        </td>
                                        <td className={`px-4 py-3 hidden sm:table-cell text-gray-600 text-xs ${!classroom.isActive ? 'opacity-40' : ''}`}>
                                            {[classroom.building ? `อาคาร ${classroom.building}` : null, classroom.floor ? `ชั้น ${classroom.floor}` : null, classroom.room ? `ห้อง ${classroom.room}` : null].filter(Boolean).join(' ') || '—'}
                                        </td>
                                        <td className={`px-4 py-3 hidden md:table-cell text-gray-600 text-xs ${!classroom.isActive ? 'opacity-40' : ''}`}>
                                            {classroom.academicYear
                                                ? <span className="flex items-center gap-1">
                                                    {classroom.academicYear.year}
                                                    {classroom.academicYear.isCurrent && <span className="bg-green-100 text-green-700 px-1.5 rounded-full text-xs">ปัจจุบัน</span>}
                                                </span>
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${classroom.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {classroom.isActive ? 'เปิด' : 'ปิด'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => { setEditingClassroom(classroom); setModalOpen(true); }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                                >
                                                    <MdModeEdit className="w-4 h-4" /> แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(classroom)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    <MdBlock className="w-4 h-4" /> ปิด
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <ClassroomModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingClassroom(null); }}
                onSave={handleSave}
                classroom={editingClassroom}
                teachers={teachers}
                academicYears={academicYears}
            />
        </div>
    );
};

export default ManageClassroom;
