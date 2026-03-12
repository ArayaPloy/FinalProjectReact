import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import Swal from 'sweetalert2';
import { MdModeEdit, MdDelete, MdAdd, MdMenuBook, MdSchool } from 'react-icons/md';
import {
    useGetScheduleQuery,
    useGetClassesQuery,
    useGetSubjectsQuery,
    useGetTeachersForScheduleQuery,
    useCreateScheduleEntryMutation,
    useUpdateScheduleEntryMutation,
    useDeleteScheduleEntryMutation,
} from '../../../services/classScheduleApi';
import { useGetAcademicYearsQuery } from '../../../services/academicApi';
import {
    useGetDepartmentsQuery,
    useGetAllTeachersQuery,
    useGetSubjectsQuery as useGetSubjectsWithTeachersQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useAssignTeacherMutation,
    useRemoveTeacherMutation,
} from '../../../services/subjectsApi';

// ── SweetAlert2 Toast (non-blocking top-end notification) ───
const SwalToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

// ============================================================
//  จัดการตารางเรียน — Admin / Super Admin only
// ============================================================

const DAYS = [
    { id: 1, name: 'จันทร์' },
    { id: 2, name: 'อังคาร' },
    { id: 3, name: 'พุธ' },
    { id: 4, name: 'พฤหัสบดี' },
    { id: 5, name: 'ศุกร์' },
];

const DAY_NAMES = DAYS.map((d) => d.name);

// วัน (ชื่อในไฟล์ CSV) → dayOfWeekId
const DAY_IMPORT_MAP = {
    'วันจันทร์': 1,
    'วันอังคาร': 2,
    'วันพุธ': 3,
    'วันพฤหัสบดี': 4,
    'วันศุกร์': 5,
};

// Parse หนึ่งบรรทัด CSV โดยรองรับ quoted fields เช่น "ค่า,ที่มีคอมม่า"
const parseCSVLine = (line) => {
    const result = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += ch;
            }
        } else {
            if (ch === '"') { inQuotes = true; }
            else if (ch === ',') { result.push(field); field = ''; }
            else { field += ch; }
        }
    }
    result.push(field);
    return result;
};

const DAY_COLOR_BAR = {
    'จันทร์':    'from-yellow-400 to-yellow-500',
    'อังคาร':    'from-pink-400   to-rose-500',
    'พุธ':       'from-green-400  to-emerald-500',
    'พฤหัสบดี': 'from-orange-400 to-amber-500',
    'ศุกร์':     'from-blue-400   to-indigo-500',
};

// ── Subject Form Modal (เพิ่ม / แก้ไขวิชา) ──────────────────
const SubjectFormModal = ({ isOpen, onClose, editSubject, departments, onSuccess }) => {
    const [createSubject, { isLoading: creating }] = useCreateSubjectMutation();
    const [updateSubject, { isLoading: updating }] = useUpdateSubjectMutation();
    const isEditing = !!editSubject;
    const [form, setForm] = useState({ codeSubject: '', name: '', description: '', departmentId: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setForm({
                codeSubject: editSubject?.codeSubject || '',
                name: editSubject?.name || '',
                description: editSubject?.description || '',
                departmentId: editSubject?.departmentId ? String(editSubject.departmentId) : '',
            });
            setErrors({});
        }
    }, [isOpen, editSubject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.codeSubject.trim()) errs.codeSubject = 'กรุณากรอกรหัสวิชา';
        else if (form.codeSubject.trim().length > 10) errs.codeSubject = 'ไม่เกิน 10 ตัวอักษร';
        if (!form.name.trim()) errs.name = 'กรุณากรอกชื่อวิชา';
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const payload = {
            codeSubject: form.codeSubject.trim(),
            name: form.name.trim(),
            description: form.description.trim() || null,
            departmentId: form.departmentId ? parseInt(form.departmentId) : null,
        };
        try {
            if (isEditing) {
                await updateSubject({ id: editSubject.id, ...payload }).unwrap();
                SwalToast.fire({ icon: 'success', title: 'แก้ไขวิชาเรียนสำเร็จ' });
            } else {
                await createSubject(payload).unwrap();
                SwalToast.fire({ icon: 'success', title: 'เพิ่มวิชาเรียนสำเร็จ' });
            }
            onClose();
        } catch (err) {
            setErrors({ submit: err?.data?.message || 'เกิดข้อผิดพลาด' });
        }
    };

    if (!isOpen) return null;
    const saving = creating || updating;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold flex items-center gap-2">
                        {isEditing ? <><MdModeEdit className="w-5 h-5" /> แก้ไขวิชาเรียน</> : <><MdAdd className="w-5 h-5" /> เพิ่มวิชาเรียนใหม่</>}
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            รหัสวิชา <span className="text-red-500">*</span>
                            <span className="text-gray-400 font-normal ml-1 text-xs">(ไม่เกิน 10 ตัวอักษร)</span>
                        </label>
                        <input
                            type="text" maxLength={10} value={form.codeSubject}
                            onChange={(e) => setForm((f) => ({ ...f, codeSubject: e.target.value }))}
                            placeholder="เช่น ค21102"
                            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.codeSubject ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.codeSubject && <p className="text-red-500 text-xs mt-1">{errors.codeSubject}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ชื่อวิชา <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" maxLength={100} value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="เช่น คณิตศาสตร์พื้นฐาน"
                            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">คำอธิบายวิชา</label>
                        <textarea
                            rows={3} value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            placeholder="อธิบายเนื้อหาวิชาโดยย่อ (ไม่บังคับ)"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">แผนก / กลุ่มสาระ</label>
                        <select
                            value={form.departmentId}
                            onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">— ไม่ระบุแผนก —</option>
                            {(departments || []).map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">{errors.submit}</div>
                    )}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มวิชา'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Teacher Assign Panel (sub-modal) ─────────────────────────
// รับ subjectId และดึงข้อมูลวิชาจาก subjectsApi โดยตรง
// เพื่อให้ข้อมูลอัปเดตทันทีหลัง assign/remove (ไม่ขึ้นกับ cache ของ classScheduleApi)
const TeacherAssignPanel = ({ subjectId, onClose }) => {
    // ดึงข้อมูลวิชาจาก subjectsApi — invalidated อัตโนมัติหลัง assign/remove
    const { data: subjectsRes, isLoading: subjectsLoading } = useGetSubjectsWithTeachersQuery();
    const { data: teachersRes, isLoading: teachersLoading } = useGetAllTeachersQuery();
    const [assignTeacher, { isLoading: assigning }] = useAssignTeacherMutation();
    const [removeTeacher, { isLoading: removing }] = useRemoveTeacherMutation();
    const [search, setSearch] = useState('');

    // หาวิชาจากข้อมูลล่าสุด (reactive)
    const allSubjects = subjectsRes?.data || [];
    const subject = allSubjects.find((s) => s.id === subjectId);

    const allTeachers = teachersRes?.data || [];
    const assignedIds = new Set((subject?.teachers || []).map((t) => t.id));

    const filtered = allTeachers.filter((t) =>
        !search || t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAssign = async (teacher) => {
        try {
            await assignTeacher({ subjectId, teacherId: teacher.id }).unwrap();
            // รายชื่อครูอัปเดตอัตโนมัติผ่าน RTK Query cache invalidation
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err?.data?.message || 'ไม่สามารถเพิ่มครูได้', confirmButtonText: 'ตกลง' });
        }
    };

    const handleRemove = async (teacher) => {
        const result = await Swal.fire({
            title: 'ยืนยันการนำครูออก',
            html: `<p>ต้องการนำ <strong>${teacher.name}</strong> ออกจากวิชา <strong>${subject?.codeSubject}</strong> ใช่ไหม?</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'นำออก',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;
        try {
            await removeTeacher({ subjectId, teacherId: teacher.id }).unwrap();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err?.data?.message || 'ไม่สามารถลบครูได้', confirmButtonText: 'ตกลง' });
        }
    };

    const isLoading = subjectsLoading || teachersLoading;

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                        <div>
                            <h2 className="text-white text-lg font-bold flex items-center gap-2">
                                <MdSchool className="w-5 h-5" /> จัดการครูผู้สอน
                            </h2>
                            {subject ? (
                                <p className="text-violet-200 text-xs mt-0.5">{subject.codeSubject} — {subject.name}</p>
                            ) : (
                                <p className="text-violet-200 text-xs mt-0.5 animate-pulse">กำลังโหลด...</p>
                            )}
                        </div>
                        <button onClick={onClose} className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">✕</button>
                    </div>

                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Section: ครูที่ assign แล้ว (reactive จาก subjectsApi cache) */}
                            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    ครูที่สอนวิชานี้ ({subject?.teachers?.length || 0} คน)
                                    <span className="ml-2 font-normal text-gray-400 normal-case">— อัปเดตอัตโนมัติ</span>
                                </p>
                                {!subject?.teachers?.length ? (
                                    <p className="text-sm text-gray-400 italic">ยังไม่มีครูผู้สอน กดปุ่ม + เพิ่ม ด้านล่าง</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {subject.teachers.map((t) => (
                                            <span key={t.id} className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-800 text-xs font-medium px-3 py-1.5 rounded-full">
                                                {t.name}
                                                <button
                                                    onClick={() => handleRemove(t)}
                                                    disabled={removing}
                                                    className="text-violet-400 hover:text-red-500 transition-colors disabled:opacity-50 leading-none ml-0.5"
                                                    title="นำออกจากวิชา"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section: ค้นหาและเพิ่มครู */}
                            <div className="px-5 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">เพิ่มครูผู้สอน</p>
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อครู..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                                />
                            </div>

                            {/* รายชื่อครูทั้งหมด */}
                            <div className="overflow-y-auto flex-1 px-5 py-3 space-y-1.5">
                                {filtered.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        {search ? 'ไม่พบครูที่ค้นหา' : 'ไม่มีข้อมูลครูในระบบ'}
                                    </div>
                                ) : (
                                    filtered.map((t) => {
                                        const isAssigned = assignedIds.has(t.id);
                                        return (
                                            <div
                                                key={t.id}
                                                className={`flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-colors ${
                                                    isAssigned
                                                        ? 'bg-violet-50 border-violet-200'
                                                        : 'bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50/40'
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{t.name}</p>
                                                </div>
                                                {isAssigned ? (
                                                    <span className="flex items-center gap-1 text-xs text-violet-600 font-semibold bg-violet-100 px-2.5 py-1 rounded-full flex-shrink-0">
                                                        ✓ สอนอยู่แล้ว
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAssign(t)}
                                                        disabled={assigning}
                                                        className="text-xs bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                                                    >
                                                        {assigning ? '...' : '+ เพิ่ม'}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}

                    <div className="px-5 py-2 border-t border-gray-100 flex-shrink-0">
                        <p className="text-xs text-gray-400">ครูที่เพิ่มที่นี่จะแสดงเป็น "ครูที่แนะนำ" ในฟอร์มเพิ่มคาบเรียน</p>
                    </div>
                </div>
            </div>
        </>
    );
};

// ── Subject Manage Panel Modal (รายการวิชาทั้งหมด) ──────────
const SubjectManagePanel = ({ isOpen, onClose, departments }) => {
    const [deleteSubject, { isLoading: deleting }] = useDeleteSubjectMutation();
    const [formOpen, setFormOpen] = useState(false);
    const [editSubject, setEditSubject] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [teacherPanelSubjectId, setTeacherPanelSubjectId] = useState(null);

    // ดึงข้อมูลวิชา+ครูจาก subjectsApi โดยตรง
    // เพื่อให้จำนวนครูอัปเดตทันทีหลัง assign/remove (ไม่ใช้ prop จาก classScheduleApi ซึ่ง cache ต่างกัน)
    const { data: subjectsRes } = useGetSubjectsWithTeachersQuery();
    const subjects = subjectsRes?.data || [];

    const filtered = useMemo(() =>
        subjects.filter((s) =>
            !search ||
            s.codeSubject.toLowerCase().includes(search.toLowerCase()) ||
            s.name.toLowerCase().includes(search.toLowerCase())
        ), [subjects, search]);

    const handleDelete = async (s) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบวิชา',
            html: `<p>ต้องการลบวิชา <strong>${s.codeSubject} — ${s.name}</strong> ใช่ไหม?</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;
        try {
            await deleteSubject(s.id).unwrap();
            SwalToast.fire({ icon: 'success', title: 'ลบวิชาเรียนสำเร็จ' });
        } catch (err) {
            SwalToast.fire({ icon: 'error', title: err?.data?.message || 'เกิดข้อผิดพลาด' });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                        <div>
                            <h2 className="text-white text-lg font-bold flex items-center gap-2"><MdMenuBook className="w-5 h-5" /> จัดการวิชาเรียน</h2>
                            <p className="text-emerald-100 text-xs mt-0.5">เพิ่ม แก้ไข และลบวิชาเรียน</p>
                        </div>
                        <button onClick={onClose} className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">✕</button>
                    </div>

                    {/* Toolbar */}
                    <div className="px-5 py-3 border-b border-gray-100 flex gap-3 flex-shrink-0">
                        <input
                            type="text"
                            placeholder="ค้นหารหัส / ชื่อวิชา..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <button
                            onClick={() => { setEditSubject(null); setFormOpen(true); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5 flex-shrink-0"
                        >
                            <MdAdd className="w-4 h-4" /> เพิ่มวิชา
                        </button>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1 px-5 py-3 space-y-2">
                        {filtered.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                {search ? 'ไม่พบวิชาที่ค้นหา' : 'ยังไม่มีวิชาเรียนในระบบ'}
                            </div>
                        ) : (
                            filtered.map((s) => (
                                <div key={s.id} className="flex items-center gap-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded-xl px-4 py-3 transition-colors">
                                    <span className="inline-flex min-w-[72px] items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 flex-shrink-0">
                                        {s.codeSubject}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{s.name}</p>
                                        {s.description && (
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{s.description}</p>
                                        )}
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            {s.department && (
                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                    {s.department?.name || s.department}
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                (s.teachers?.length || 0) > 0
                                                    ? 'bg-violet-100 text-violet-700'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {s.teachers?.length || 0} ครู
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5 flex-shrink-0">
                                        <button
                                            onClick={() => setTeacherPanelSubjectId(s.id)}
                                            className="inline-flex items-center gap-1 text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                                            title="จัดการครูผู้สอน"
                                        >
                                            <MdSchool className="w-3.5 h-3.5" /> ครูผู้สอน
                                        </button>
                                        <button
                                            onClick={() => { setEditSubject(s); setFormOpen(true); }}
                                            className="inline-flex items-center gap-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                                        >
                                            <MdModeEdit className="w-3.5 h-3.5" /> แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s)}
                                            disabled={deleting}
                                            className="inline-flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                                        >
                                            <MdDelete className="w-3.5 h-3.5" /> ลบ
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400">{subjects?.length || 0} วิชาในระบบ</p>
                    </div>
                </div>
            </div>

            {/* Sub-modal: ฟอร์มเพิ่ม/แก้ไขวิชา */}
            <SubjectFormModal
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditSubject(null); }}
                editSubject={editSubject}
                departments={departments}
                onSuccess={() => {}}
            />

            {/* Sub-modal: จัดการครูผู้สอน — ส่งแค่ subjectId เพื่อให้ panel ดึงข้อมูลเองจาก subjectsApi */}
            {teacherPanelSubjectId && (
                <TeacherAssignPanel
                    subjectId={teacherPanelSubjectId}
                    onClose={() => setTeacherPanelSubjectId(null)}
                />
            )}
        </>
    );
};

// ── Modal เพิ่ม / แก้ไขคาบเรียน ──────────────────────────
const ScheduleFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    editData,     // null = add mode, object = edit mode
    addContext,   // { dayId, dayName, periodNumber } — pre-fill for add mode
    subjects,
    teachers,
    maxCurrentPeriod,
}) => {
    const emptyForm = {
        dayOfWeekId: '',
        periodNumber: '',
        subjectId: '',
        teacherId: '',
        guestTeacherName: '',
        room: '',
        building: '',
    };

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            // หาค่า dayOfWeekId จากชื่อวัน
            const dayObj = DAYS.find((d) => d.name === editData.dayName);
            setForm({
                dayOfWeekId: dayObj ? String(dayObj.id) : '',
                periodNumber: String(editData.periodNumber || ''),
                subjectId: String(editData.subjectId || ''),
                teacherId: editData.teacherId ? String(editData.teacherId) : '',
                guestTeacherName: editData.guestTeacherName || '',
                room: editData.room || '',
                building: editData.building || '',
            });
        } else if (addContext) {
            setForm({
                ...emptyForm,
                dayOfWeekId: String(addContext.dayId),
                periodNumber: String(addContext.periodNumber),
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [editData, addContext, isOpen]);

    const validate = () => {
        const e = {};
        if (!form.dayOfWeekId) e.dayOfWeekId = 'กรุณาเลือกวัน';
        if (!form.periodNumber || isNaN(form.periodNumber) || Number(form.periodNumber) < 1)
            e.periodNumber = 'กรุณาระบุคาบที่ถูกต้อง (≥ 1)';
        if (!form.subjectId) e.subjectId = 'กรุณาเลือกวิชา';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSubmit({
            dayOfWeekId: Number(form.dayOfWeekId),
            periodNumber: Number(form.periodNumber),
            subjectId: Number(form.subjectId),
            teacherId: form.teacherId ? Number(form.teacherId) : null,
            guestTeacherName: !form.teacherId ? (form.guestTeacherName.trim() || null) : null,
            room: form.room.trim() || null,
            building: form.building.trim() || null,
        });
    };

    // ดึงข้อมูลวิชา+ครูจาก subjectsApi โดยตรง
    // ต้องวางไว้ก่อน early return เพื่อไม่ละเมิด Rules of Hooks
    // (cache ของ subjectsApi ถูก invalidate ทุกครั้งที่ assign/remove)
    const { data: freshSubjectsRes } = useGetSubjectsWithTeachersQuery();

    if (!isOpen) return null;

    const freshSubjects = freshSubjectsRes?.data || [];

    const selectedSubject = form.subjectId
        ? freshSubjects.find((s) => s.id === Number(form.subjectId))
        : null;
    const suggestedTeachers = selectedSubject?.teachers || [];
    const suggestedIds = new Set(suggestedTeachers.map((t) => t.id));
    const otherTeachers = (teachers || []).filter((t) => !suggestedIds.has(t.id));

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header — fixed */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-white text-lg font-bold flex items-center gap-2">
                        {editData ? <><MdModeEdit className="w-5 h-5" /> แก้ไขคาบเรียน</> : <><MdAdd className="w-5 h-5" /> เพิ่มคาบเรียน</>}
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                    {/* วันในสัปดาห์ */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            วันในสัปดาห์ <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.dayOfWeekId}
                            onChange={(e) => setForm((f) => ({ ...f, dayOfWeekId: e.target.value }))}
                            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.dayOfWeekId ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        >
                            <option value="">— เลือกวัน —</option>
                            {DAYS.map((d) => (
                                <option key={d.id} value={d.id}>วัน{d.name}</option>
                            ))}
                        </select>
                        {errors.dayOfWeekId && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeekId}</p>}
                    </div>

                    {/* คาบที่ */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            คาบที่ <span className="text-red-500">*</span>
                            <span className="text-gray-400 font-normal ml-1 text-xs">(ปัจจุบันมีสูงสุด {maxCurrentPeriod} คาบ)</span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={form.periodNumber}
                            onChange={(e) => setForm((f) => ({ ...f, periodNumber: e.target.value }))}
                            placeholder="เช่น 1, 2, 3 ..."
                            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.periodNumber ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.periodNumber && <p className="text-red-500 text-xs mt-1">{errors.periodNumber}</p>}
                    </div>

                    {/* วิชา */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            วิชา <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.subjectId}
                            onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value, teacherId: '' }))}
                            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.subjectId ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                        >
                            <option value="">— เลือกวิชา —</option>
                            {(subjects || []).map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.codeSubject} — {s.name}
                                </option>
                            ))}
                        </select>
                        {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId}</p>}
                    </div>

                    {/* ครูผู้สอน (optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ครูผู้สอน
                            <span className="text-gray-400 font-normal ml-1 text-xs">(ไม่บังคับ)</span>
                            {suggestedTeachers.length > 0 && (
                                <span className="ml-2 text-violet-600 font-normal text-xs">★ มีครูที่สอนวิชานี้ {suggestedTeachers.length} คน</span>
                            )}
                        </label>
                        <select
                            value={form.teacherId}
                            onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value, guestTeacherName: '' }))}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="">— ไม่ระบุครู (ครูรับเชิญ / ว่าง) —</option>
                            {suggestedTeachers.length > 0 && (
                                <optgroup label="★ ครูที่สอนวิชานี้">
                                    {suggestedTeachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </optgroup>
                            )}
                            <optgroup label={suggestedTeachers.length > 0 ? 'ครูทั้งหมด (อื่นๆ)' : 'ครูทั้งหมด'}>
                                {otherTeachers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}{t.department ? ` (${t.department})` : ''}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    {/* ครูรับเชิญ / ชั่วคราว — แสดงเมื่อยังไม่ได้เลือกครูในระบบ */}
                    {!form.teacherId && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                ชื่อครูผู้สอนชั่วคราว
                                <span className="text-gray-400 font-normal ml-1 text-xs">(ครูรับเชิญ / ต่างชาติ / ยังไม่ได้เพิ่มในระบบ)</span>
                            </label>
                            <input
                                type="text"
                                value={form.guestTeacherName}
                                onChange={(e) => setForm((f) => ({ ...f, guestTeacherName: e.target.value }))}
                                placeholder="เช่น นาย John Smith, ครูสมชาย"
                                maxLength={255}
                                className="w-full border border-amber-300 bg-amber-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-300"
                            />
                            <p className="text-amber-600 text-xs mt-1">ชื่อนี้จะแสดงในตารางแทนครูประจำ เมื่อมีชื่อครูสอนในระบบแล้วให้เลือกจากรายชื่อด้านบนแทน</p>
                        </div>
                    )}

                    {/* ห้องเรียน (optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ห้องเรียน
                            <span className="text-gray-400 font-normal ml-1 text-xs">(ไม่บังคับ)</span>
                        </label>
                        <input
                            type="text"
                            value={form.room}
                            onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
                            placeholder="เช่น ห้อง 301, ห้องคอมพิวเตอร์"
                            maxLength={50}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* ตึกเรียน */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ตึกเรียน
                            <span className="text-gray-400 font-normal ml-1 text-xs">(ไม่บังคับ)</span>
                        </label>
                        <input
                            type="text"
                            value={form.building}
                            onChange={(e) => setForm((f) => ({ ...f, building: e.target.value }))}
                            placeholder="เช่น ตึก 1, อาคารเฉลิมพระเกียรติ"
                            maxLength={100}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                </div>

                {/* Footer — fixed */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {editData ? 'บันทึกการแก้ไข' : 'เพิ่มคาบเรียน'}
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};

// ── Confirm Delete Modal ───────────────────────────────────
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isLoading, cellData }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
                    <h2 className="text-white text-lg font-bold">🗑️ ยืนยันการลบ</h2>
                </div>
                <div className="px-6 py-5">
                    <p className="text-gray-700">คุณต้องการลบคาบเรียนนี้ใช่ไหม?</p>
                    {cellData && (
                        <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 text-sm">
                            <p><span className="font-semibold">วิชา: </span>{cellData.subjectCode} — {cellData.subjectName}</p>
                            <p><span className="font-semibold">วัน: </span>วัน{cellData.dayName} คาบ {cellData.periodNumber}</p>
                        </div>
                    )}
                    <div className="flex gap-3 mt-5">
                        <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            ลบเลย
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Subject Detail Popup Modal ───────────────────────────────
const SubjectDetailModal = ({ cell, onClose }) => {
    if (!cell) return null;
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">รหัสวิชา</p>
                            <h2 className="text-white text-2xl font-bold mt-0.5">{cell.subjectCode}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <SubjectInfoRow label="ชื่อวิชา" value={cell.subjectName} />
                    {cell.subjectDescription && (
                        <SubjectInfoRow label="คำอธิบายรายวิชา" value={cell.subjectDescription} />
                    )}
                    <SubjectInfoRow
                        label="ครูผู้สอน"
                        value={cell.teacherName || cell.guestTeacherName || <span className="text-gray-400 italic text-sm">ยังไม่มีครูผู้สอน</span>}
                    />
                    {cell.subjectDepartment && (
                        <SubjectInfoRow label="กลุ่มสาระ / แผนก" value={cell.subjectDepartment} />
                    )}
                    <SubjectInfoRow label="ห้องเรียน" value={cell.room || '—'} />
                    {cell.building && (
                        <SubjectInfoRow label="ตึกเรียน" value={cell.building} />
                    )}
                </div>

                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

const SubjectInfoRow = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-gray-800 font-medium text-sm">{value ?? '—'}</p>
    </div>
);

// ── Import Preview Modal ────────────────────────────────────
const ImportPreviewModal = ({ isOpen, onClose, rows, subjects, teachers, allSemesters, targetClass, defaultSemesterId, onConfirm, isImporting }) => {
    const [targetSemesterId, setTargetSemesterId] = useState(defaultSemesterId || '');

    useEffect(() => {
        if (isOpen) setTargetSemesterId(defaultSemesterId || '');
    }, [isOpen, defaultSemesterId]);

    // สร้าง map: codeSubject (lowercase) → subject object
    const subjectMap = useMemo(() => {
        const m = {};
        for (const s of (subjects || [])) m[s.codeSubject?.toLowerCase()] = s;
        return m;
    }, [subjects]);

    // สร้าง map: teacher name (lowercase) → teacher object
    const teacherMap = useMemo(() => {
        const m = {};
        for (const t of (teachers || [])) m[t.name?.toLowerCase()] = t;
        return m;
    }, [teachers]);

    // Resolve แต่ละแถว: หา subjectId และ teacherId
    const resolvedRows = useMemo(() => rows.map((row) => {
        const subject = subjectMap[row.subjectCode?.toLowerCase()];
        const teacher = row.teacherName ? teacherMap[row.teacherName?.toLowerCase()] : null;
        return {
            ...row,
            subjectId: subject?.id ?? null,
            subjectResolved: !!subject,
            teacherId: teacher?.id ?? null,
            teacherResolved: !!teacher,
        };
    }), [rows, subjectMap, teacherMap]);

    const readyCount   = resolvedRows.filter((r) => r.subjectResolved).length;
    const skipCount    = resolvedRows.filter((r) => !r.subjectResolved).length;
    const guestCount   = resolvedRows.filter((r) => r.subjectResolved && r.teacherName && !r.teacherResolved).length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-white text-lg font-bold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            นำเข้าตารางเรียน — ม.{targetClass}
                        </h2>
                        <p className="text-blue-100 text-xs mt-0.5">ตรวจสอบข้อมูลก่อนนำเข้าจริง</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">✕</button>
                </div>

                {/* Summary chips */}
                <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-2 flex-shrink-0">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        📋 ทั้งหมด {resolvedRows.length} คาบ
                    </span>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        ✓ พร้อมนำเข้า {readyCount} คาบ
                    </span>
                    {skipCount > 0 && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            ✗ วิชาไม่พบ (ข้าม) {skipCount} คาบ
                        </span>
                    )}
                    {guestCount > 0 && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            ⚠ ครูรับเชิญ {guestCount} คาบ
                        </span>
                    )}
                </div>

                {/* Target semester selector */}
                <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        นำเข้าไปยังภาคเรียน
                        <span className="text-gray-400 font-normal ml-1 text-xs">(สามารถเปลี่ยนได้เพื่อคัดลอกไปภาคเรียนอื่น)</span>
                    </label>
                    <select
                        value={targetSemesterId}
                        onChange={(e) => setTargetSemesterId(e.target.value)}
                        className="w-full sm:w-80 border-2 border-blue-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">— ทุกภาคเรียน —</option>
                        {allSemesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.label}{s.isCurrent ? ' (ปัจจุบัน)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Preview table */}
                <div className="overflow-y-auto flex-1 px-4 py-3">
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                                <th className="border border-gray-200 px-3 py-2 text-center font-semibold w-8">#</th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">วัน</th>
                                <th className="border border-gray-200 px-3 py-2 text-center font-semibold w-14">คาบ</th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">รหัสวิชา</th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">ครูผู้สอน</th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">ห้อง</th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold">ตึก</th>
                                <th className="border border-gray-200 px-3 py-2 text-center font-semibold w-20">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resolvedRows.map((row, i) => (
                                <tr key={i} className={`border-b border-gray-100 ${row.subjectResolved ? 'bg-white' : 'bg-red-50/60'}`}>
                                    <td className="border border-gray-200 px-3 py-2 text-center text-gray-400">{i + 1}</td>
                                    <td className="border border-gray-200 px-3 py-2 text-gray-700">วัน{row.dayName}</td>
                                    <td className="border border-gray-200 px-3 py-2 text-center font-bold text-indigo-600">{row.periodNumber}</td>
                                    <td className="border border-gray-200 px-3 py-2">
                                        <span className={`font-mono font-semibold ${row.subjectResolved ? 'text-gray-800' : 'text-red-500 line-through'}`}>
                                            {row.subjectCode}
                                        </span>
                                        {!row.subjectResolved && (
                                            <span className="ml-1 text-red-400 text-[10px]">(ไม่พบ)</span>
                                        )}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 text-gray-600">
                                        {row.teacherName ? (
                                            row.teacherResolved ? (
                                                <span className="text-gray-700">{row.teacherName}</span>
                                            ) : (
                                                <span className="text-amber-600 italic">{row.teacherName} <span className="text-[10px] text-amber-400 not-italic">(ครูรับเชิญ)</span></span>
                                            )
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 text-gray-500">{row.room || '—'}</td>
                                    <td className="border border-gray-200 px-3 py-2 text-gray-500">{row.building || '—'}</td>
                                    <td className="border border-gray-200 px-3 py-2 text-center">
                                        {row.subjectResolved ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-sm">✓</span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 font-bold text-sm">✗</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
                    {skipCount > 0 && (
                        <p className="flex-1 self-center text-xs text-red-500">
                            ⚠ {skipCount} คาบที่วิชาไม่พบในระบบจะถูกข้ามโดยอัตโนมัติ
                        </p>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button type="button" onClick={onClose} className="border-2 border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            disabled={isImporting || readyCount === 0}
                            onClick={() => onConfirm(resolvedRows, targetSemesterId)}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
                        >
                            {isImporting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            นำเข้า {readyCount} คาบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────
const ManageClassSchedules = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = ['admin', 'super_admin'].includes((currentUser?.role || '').toLowerCase());

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSemesterId, setSelectedSemesterId] = useState('');

    // Modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);   // null = add, object = edit
    const [addContext, setAddContext] = useState(null); // { dayId, dayName, periodNumber } pre-fill for add
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [subjectPanelOpen, setSubjectPanelOpen] = useState(false);
    const [subjectPopup, setSubjectPopup] = useState(null);
    const [importPreviewOpen, setImportPreviewOpen] = useState(false);
    const [importRows, setImportRows] = useState([]);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef(null);

    // Queries
    const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
    const { data: academicData } = useGetAcademicYearsQuery();
    const { data: subjectsData } = useGetSubjectsQuery();
    const { data: teachersData } = useGetTeachersForScheduleQuery();
    const { data: departmentsData } = useGetDepartmentsQuery();

    const {
        data: scheduleData,
        isLoading: scheduleLoading,
        isFetching,
        refetch,
    } = useGetScheduleQuery(
        { className: selectedClass, semesterId: selectedSemesterId },
        { skip: !selectedClass }
    );

    // Mutations
    const [createEntry, { isLoading: creating }] = useCreateScheduleEntryMutation();
    const [updateEntry, { isLoading: updating }] = useUpdateScheduleEntryMutation();
    const [deleteEntry, { isLoading: deleting }] = useDeleteScheduleEntryMutation();

    // Derived
    const allSemesters = useMemo(() => {
        const src = Array.isArray(academicData) ? academicData : academicData?.data || [];
        const list = [];
        for (const year of src) {
            for (const sem of year.semesters || []) {
                list.push({ id: sem.id, label: `ปี ${year.year} เทอม ${sem.semesterNumber}`, isCurrent: sem.isCurrent });
            }
        }
        return list;
    }, [academicData]);

    const classesList = classesData?.data || (Array.isArray(classesData) ? classesData : []);
    const subjects = subjectsData?.data || (Array.isArray(subjectsData) ? subjectsData : []);
    const teachers = teachersData?.data || (Array.isArray(teachersData) ? teachersData : []);
    const departments = departmentsData?.data || [];

    // Auto-select defaults
    useEffect(() => {
        if (Array.isArray(classesList) && classesList.length && !selectedClass) {
            setSelectedClass(classesList[0].className);
        }
    }, [classesList, selectedClass]);

    useEffect(() => {
        if (allSemesters.length && !selectedSemesterId) {
            const current = allSemesters.find((s) => s.isCurrent);
            if (current) setSelectedSemesterId(String(current.id));
        }
    }, [allSemesters, selectedSemesterId]);

    const schedule = scheduleData?.data?.schedule || {};
    const rawMaxPeriod = scheduleData?.data?.maxPeriod || 7;
    const maxPeriod = Math.max(rawMaxPeriod, 7);
    const periods = Array.from({ length: maxPeriod }, (_, i) => i + 1);

    // Open add modal with pre-fill (from "+" click)
    const handleAddClick = (dayId, dayName, periodNumber) => {
        setEditData(null);
        setAddContext({ dayId, dayName, periodNumber });
        setFormOpen(true);
    };

    // Open edit modal
    const handleEditClick = (cell) => {
        setEditData(cell);
        setAddContext(null);
        setFormOpen(true);
    };

    // Submit add/edit
    const handleFormSubmit = async (values) => {
        try {
            if (editData) {
                // Edit mode
                await updateEntry({ id: editData.id, ...values }).unwrap();
                SwalToast.fire({ icon: 'success', title: 'แก้ไขคาบเรียนสำเร็จ' });
            } else {
                // Add mode — pass selectedClass + selectedSemesterId
                await createEntry({
                    ...values,
                    className: selectedClass,
                    semesterId: selectedSemesterId ? Number(selectedSemesterId) : undefined,
                }).unwrap();
                SwalToast.fire({ icon: 'success', title: 'เพิ่มคาบเรียนสำเร็จ' });
            }
            setFormOpen(false);
            refetch();
        } catch (err) {
            const msg = err?.data?.message || err?.message || 'เกิดข้อผิดพลาด';
            SwalToast.fire({ icon: 'error', title: msg });
        }
    };

    // Delete
    const handleDeleteClick = async (cellData) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ',
            html: `<p>ต้องการลบคาบเรียนนี้ใช่ไหม?</p><div class="swal2-html-container" style="font-size:0.875rem;color:#374151;margin-top:0.5rem"><p><b>วิชา:</b> ${cellData.subjectCode || ''} — ${cellData.subjectName || ''}</p><p><b>วัน:</b> วัน${cellData.dayName || ''} คาบ ${cellData.periodNumber || ''}</p></div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ลบเลย',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;
        try {
            await deleteEntry(cellData.id).unwrap();
            SwalToast.fire({ icon: 'success', title: 'ลบคาบเรียนสำเร็จ' });
            refetch();
        } catch (err) {
            const msg = err?.data?.message || 'เกิดข้อผิดพลาด';
            SwalToast.fire({ icon: 'error', title: msg });
        }
    };

    // ── Export schedule to CSV ──
    const handleExportExcel = () => {
        if (!selectedClass) {
            Swal.fire({ icon: 'warning', title: 'กรุณาเลือกห้องเรียน', text: 'กรุณาเลือกห้องเรียนก่อนส่งออก', confirmButtonText: 'ตกลง' });
            return;
        }

        const esc = (v) => {
            const s = String(v ?? '');
            return (s.includes(',') || s.includes('"') || s.includes('\n'))
                ? `"${s.replace(/"/g, '""')}"`
                : s;
        };

        const semesterLabel = allSemesters.find((s) => String(s.id) === String(selectedSemesterId))?.label || 'ทุกภาคเรียน';
        const today = new Date().toISOString().split('T')[0];

        const headerRow = ['ลำดับ', 'วัน', 'คาบที่', 'รหัสวิชา', 'ชื่อวิชา', 'ครูผู้สอน', 'ห้องเรียน', 'ตึกเรียน'];
        const dataRows = [];
        let idx = 1;
        for (const day of DAYS) {
            for (const period of periods) {
                const cell = schedule[day.name]?.[period];
                if (cell) {
                    dataRows.push([
                        idx++,
                        `วัน${day.name}`,
                        period,
                        cell.subjectCode || '',
                        cell.subjectName || '',
                        cell.teacherName || cell.guestTeacherName || '',
                        cell.room || '',
                        cell.building || '',
                    ]);
                }
            }
        }

        if (dataRows.length === 0) {
            Swal.fire({ icon: 'warning', title: 'ไม่มีข้อมูล', text: 'ตารางเรียนยังไม่มีข้อมูลคาบเรียน', confirmButtonText: 'ตกลง' });
            return;
        }

        const allRows = [
            [`ตารางเรียน ม.${selectedClass}`, `ภาคเรียน: ${semesterLabel}`, `ส่งออกวันที่: ${today}`],
            [],
            headerRow,
            ...dataRows,
        ];

        const csvContent = allRows.map((row) => row.map(esc).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `schedule_class_${selectedClass}_${today}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        SwalToast.fire({ icon: 'success', title: 'ส่งออกตารางเรียนสำเร็จ' });
    };

    // ── Import schedule from CSV ──
    const handleImportClick = () => {
        if (!selectedClass) {
            Swal.fire({ icon: 'warning', title: 'กรุณาเลือกห้องเรียน', text: 'กรุณาเลือกห้องเรียนก่อนนำเข้าข้อมูล', confirmButtonText: 'ตกลง' });
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = ''; // รีเซ็ตเพื่อให้เลือกไฟล์เดิมซ้ำได้

        const text = await file.text();
        const clean = text.replace(/^\uFEFF/, ''); // ลบ BOM
        const lines = clean.split(/\r?\n/);

        // รูปแบบ CSV ที่ export: แถว 0=ข้อมูลทั่วไป, แถว 1=ว่าง, แถว 2=header, แถว 3+=ข้อมูล
        const dataLines = lines.slice(3).filter((l) => l.trim());

        if (!dataLines.length) {
            Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูล', text: 'ไฟล์ไม่มีข้อมูลคาบเรียน หรือรูปแบบไม่ถูกต้อง กรุณาใช้ไฟล์ที่ส่งออกจากระบบนี้' });
            return;
        }

        const parsed = [];
        for (const line of dataLines) {
            const cols = parseCSVLine(line);
            if (cols.length < 4) continue;
            const dayRaw = cols[1]?.trim() || '';
            const dayOfWeekId = DAY_IMPORT_MAP[dayRaw];
            if (!dayOfWeekId) continue;
            const periodNumber = parseInt(cols[2]);
            if (!periodNumber) continue;
            parsed.push({
                dayOfWeekId,
                dayName: dayRaw.replace('วัน', ''),
                periodNumber,
                subjectCode: cols[3]?.trim() || '',
                subjectName: cols[4]?.trim() || '',
                teacherName: cols[5]?.trim() || '',
                room: cols[6]?.trim() || '',
                building: cols[7]?.trim() || '',
            });
        }

        if (!parsed.length) {
            Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูล', text: 'ไม่พบแถวข้อมูลที่ถูกต้องในไฟล์' });
            return;
        }

        setImportRows(parsed);
        setImportPreviewOpen(true);
    };

    const handleImportConfirm = async (resolvedRows, targetSemesterId) => {
        setImporting(true);
        let success = 0;
        let skipped = 0;
        let failed = 0;

        for (const row of resolvedRows) {
            if (!row.subjectResolved) { skipped++; continue; }
            try {
                await createEntry({
                    className: selectedClass,
                    dayOfWeekId: row.dayOfWeekId,
                    periodNumber: row.periodNumber,
                    subjectId: row.subjectId,
                    teacherId: row.teacherId || undefined,
                    guestTeacherName: (!row.teacherId && row.teacherName) ? row.teacherName : undefined,
                    room: row.room || undefined,
                    building: row.building || undefined,
                    semesterId: targetSemesterId ? Number(targetSemesterId) : undefined,
                }).unwrap();
                success++;
            } catch (err) {
                if (err?.status === 409 || err?.data?.message?.includes('มีข้อมูลอยู่แล้ว')) {
                    skipped++;
                } else {
                    failed++;
                }
            }
        }

        setImporting(false);
        setImportPreviewOpen(false);
        refetch();

        Swal.fire({
            icon: failed > 0 ? 'warning' : 'success',
            title: 'นำเข้าเสร็จสิ้น',
            html: `<p>นำเข้าสำเร็จ: <strong>${success}</strong> คาบ</p>${skipped > 0 ? `<p style="color:#6b7280">ข้าม (ซ้ำหรือวิชาไม่พบ): <strong>${skipped}</strong> คาบ</p>` : ''}${failed > 0 ? `<p style="color:#dc2626">ผิดพลาด: <strong>${failed}</strong> คาบ</p>` : ''}`,
            confirmButtonText: 'ตกลง',
        });
    };

    // ── Access denied ──
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 pb-12">
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-6 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">🗂️ จัดการตารางเรียน</h1>
                        <p className="text-indigo-200 text-sm mt-0.5">เพิ่ม แก้ไข และลบคาบเรียน</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSubjectPanelOpen(true)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 shadow"
                        >
                            <MdMenuBook className="w-4 h-4" /> จัดการวิชา
                        </button>
                        {selectedClass && (
                            <button
                                onClick={() => {
                                    setEditData(null);
                                    setAddContext(null);
                                    setFormOpen(true);
                                }}
                                className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 shadow"
                            >
                                <MdAdd className="w-4 h-4" /> เพิ่มคาบเรียน
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-6 space-y-4">

                {/* ── Selectors ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">เลือกตารางเรียน</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportExcel}
                                disabled={!selectedClass || scheduleLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                ส่งออก Excel
                            </button>
                            <button
                                onClick={handleImportClick}
                                disabled={!selectedClass || scheduleLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                นำเข้า Excel
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">ห้องเรียน</label>
                            {classesLoading ? (
                                <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                            ) : (
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full border-2 border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white cursor-pointer transition-all"
                                >
                                    <option value="">— เลือกห้องเรียน —</option>
                                    {classesList.map((c) => (
                                        <option key={c.id} value={c.className}>ม.{c.className}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">📆 ภาคเรียน</label>
                            <select
                                value={selectedSemesterId}
                                onChange={(e) => setSelectedSemesterId(e.target.value)}
                                className="w-full border-2 border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white cursor-pointer transition-all"
                            >
                                <option value="">— ทุกภาคเรียน —</option>
                                {allSemesters.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.label}{s.isCurrent ? ' (ปัจจุบัน)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Banner ── */}
                {selectedClass && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-5 py-3 flex items-center justify-between">
                        <p className="text-white font-bold">ตารางเรียน ม.{selectedClass}</p>
                        {(scheduleLoading || isFetching) && (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                )}

                {/* ── Content ── */}
                {!selectedClass ? (
                    <EmptyPrompt />
                ) : scheduleLoading ? (
                    <LoadingBlock />
                ) : (
                    <>
                        {/* Desktop Grid — วัน=แถว(Y), คาบ=คอลัมน์(X) */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse" style={{ minWidth: `${128 + periods.length * 120 + 64}px` }}>
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="w-28 border border-gray-200 px-3 py-3 text-xs font-bold text-gray-500 text-center bg-gray-100 sticky left-0 z-10">
                                                วัน / คาบ
                                            </th>
                                            {periods.map((period) => (
                                                <React.Fragment key={period}>
                                                    {period === 5 && (
                                                        <th className="w-14 border border-lime-200 px-1 py-3 bg-lime-50 text-center align-middle">
                                                            <div className="flex flex-col items-center justify-center gap-0.5">
                                                                <span className="text-base">🍽️</span>
                                                                <span className="text-lime-700 font-bold text-[10px] leading-tight">พัก</span>
                                                                <span className="text-lime-700 font-bold text-[10px] leading-tight">เที่ยง</span>
                                                            </div>
                                                        </th>
                                                    )}
                                                    <th className="min-w-[110px] border border-gray-200 px-2 py-3 text-center bg-gray-50">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="text-[10px] text-gray-400 font-semibold">คาบ</span>
                                                            <span className="text-lg font-extrabold text-indigo-600">{period}</span>
                                                        </div>
                                                    </th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DAYS.map((day, idx) => (
                                            <tr key={day.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="border border-gray-200 px-3 py-2 text-center bg-gray-50 sticky left-0 z-10">
                                                    <span className={`inline-block w-full bg-gradient-to-br ${DAY_COLOR_BAR[day.name]} text-white px-2 py-2 rounded-xl text-xs font-bold shadow-sm`}>
                                                        {day.name}
                                                    </span>
                                                </td>
                                                {periods.map((period) => {
                                                    const cell = schedule[day.name]?.[period] || null;
                                                    return (
                                                        <React.Fragment key={period}>
                                                            {period === 5 && (
                                                                <td className="border border-lime-200 bg-lime-50/60 w-14" />
                                                            )}
                                                            <td className="border border-gray-200 px-2 py-2 min-w-[110px] align-top">
                                                                {cell ? (
                                                                    <FilledCell
                                                                        cell={cell}
                                                                        onEdit={() => handleEditClick(cell)}
                                                                        onDelete={() => handleDeleteClick(cell)}
                                                                        onSubjectClick={() => setSubjectPopup(cell)}
                                                                    />
                                                                ) : (
                                                                    <AddCellButton
                                                                        onClick={() => handleAddClick(day.id, day.name, period)}
                                                                    />
                                                                )}
                                                            </td>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {DAYS.map((day) => {
                                const daySchedule = schedule[day.name] || {};
                                return (
                                    <div key={day.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className={`bg-gradient-to-r ${DAY_COLOR_BAR[day.name]} px-4 py-2.5`}>
                                            <span className="text-white font-bold text-base">วัน{day.name}</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {periods.map((period) => (
                                                <React.Fragment key={period}>
                                                    {period === 5 && (
                                                        <div className="bg-lime-50 px-4 py-2 text-lime-700 text-sm font-medium text-center">
                                                            🍽️ พักเที่ยง
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-3 px-4 py-3">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                                                            <span className="text-gray-500 font-bold text-sm">{period}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            {daySchedule[period] ? (
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <div className="min-w-0">
                                                                        <button
                                                                            onClick={() => setSubjectPopup(daySchedule[period])}
                                                                            className="text-indigo-700 font-bold text-sm truncate hover:text-indigo-900 hover:underline text-left transition-colors"
                                                                            title="กดดูรายละเอียดวิชา"
                                                                        >
                                                                            {daySchedule[period].subjectCode}
                                                                        </button>
                                                                        {daySchedule[period].teacherName && (
                                                                            <p className="text-gray-400 text-xs truncate">
                                                                                {shortName(daySchedule[period].teacherName)}
                                                                            </p>
                                                                        )}

                                                                    </div>
                                                                    <div className="flex gap-1 flex-shrink-0">
                                                                        <button
                                                                            onClick={() => handleEditClick(daySchedule[period])}
                                                                            className="w-7 h-7 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center transition-colors"
                                                                            title="แก้ไข"
                                                                        >
                                                                            <MdModeEdit className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteClick(daySchedule[period])}
                                                                            className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                                                                            title="ลบ"
                                                                        >
                                                                            <MdDelete className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleAddClick(day.id, day.name, period)}
                                                                    className="text-indigo-400 hover:text-indigo-600 text-sm font-medium flex items-center gap-1 transition-colors"
                                                                >
                                                                    <MdAdd className="w-4 h-4" /><span className="text-xs">เพิ่มวิชา</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-600 space-y-1">
                            <p className="flex items-center gap-1">คลิก <strong>+</strong> ในเซลล์ว่างเพื่อเพิ่มคาบเรียน</p>
                            <p className="flex items-center gap-1">คลิก <MdModeEdit className="inline w-3.5 h-3.5 flex-shrink-0" /><strong>แก้ไข</strong> เพื่อเปลี่ยนข้อมูลวิชาในคาบนั้น</p>
                        </div>
                    </>
                )}
            </div>

            {/* ── Modals ── */}
            <ScheduleFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                isLoading={creating || updating}
                editData={editData}
                addContext={addContext}
                subjects={subjects}
                teachers={teachers}
                maxCurrentPeriod={maxPeriod}
            />



            <SubjectManagePanel
                isOpen={subjectPanelOpen}
                onClose={() => setSubjectPanelOpen(false)}
                departments={departments}
            />

            <SubjectDetailModal
                cell={subjectPopup}
                onClose={() => setSubjectPopup(null)}
            />

            <ImportPreviewModal
                isOpen={importPreviewOpen}
                onClose={() => setImportPreviewOpen(false)}
                rows={importRows}
                subjects={subjects}
                teachers={teachers}
                allSemesters={allSemesters}
                targetClass={selectedClass}
                defaultSemesterId={selectedSemesterId}
                onConfirm={handleImportConfirm}
                isImporting={importing}
            />
        </div>
    );
};

// ── Small helpers ──────────────────────────────────────────
// ตัดคำนำหน้าชื่อ (เพศ) + นามสกุลออก เหลือแค่ชื่อแรก
// หมายเหตุ: คงคำว่า "ครู" / "อาจารย์" ไว้ เพราะครูรับเชิญอาจใช้เป็นชื่อแสดง
const shortName = (name) => {
    if (!name) return '';
    const stripped = name.replace(/^(นางสาว|นาง|นาย|เด็กชาย|เด็กหญิง)/, '').trim();
    return stripped.split(/\s+/)[0] || stripped;
};
const FilledCell = ({ cell, onEdit, onDelete, onSubjectClick }) => (
    <div className="group relative min-h-[60px] flex flex-col gap-1 p-1.5">
        <button
            onClick={onSubjectClick}
            className="text-indigo-700 font-bold text-xs text-center leading-tight hover:text-indigo-900 hover:underline transition-colors"
            title="กดดูรายละเอียดวิชา"
        >
            {cell.subjectCode}
        </button>
        {cell.teacherName && (
            <p className="text-gray-400 text-[10px] text-center leading-tight truncate">
                {shortName(cell.teacherName)}
            </p>
        )}

        {/* Action buttons — shown on hover */}
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 justify-center transition-opacity mt-auto">
            <button
                onClick={onEdit}
                className="inline-flex items-center gap-0.5 text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md transition-colors font-medium"
            >
                <MdModeEdit className="w-3 h-3" /> แก้ไข
            </button>
            <button
                onClick={onDelete}
                className="inline-flex items-center gap-0.5 text-[10px] bg-red-50 hover:bg-red-100 text-red-600 px-2 py-0.5 rounded-md transition-colors font-medium"
            >
                <MdDelete className="w-3 h-3" /> ลบ
            </button>
        </div>
    </div>
);

const AddCellButton = ({ onClick }) => (
    <div className="min-h-[60px] flex items-center justify-center">
        <button
            onClick={onClick}
            className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 flex items-center justify-center text-gray-300 hover:text-indigo-500 text-lg transition-all"
            title="เพิ่มคาบเรียน"
        >
            +
        </button>
    </div>
);

const EmptyPrompt = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
        <div className="mb-3"><MdSchool className="w-16 h-16 text-gray-300 mx-auto" /></div>
        <p className="text-gray-500 font-medium">กรุณาเลือกห้องเรียนเพื่อจัดการตารางสอน</p>
    </div>
);

const LoadingBlock = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
    </div>
);

export default ManageClassSchedules;
