import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
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
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
} from '../../../services/subjectsApi';

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
                onSuccess('✅ แก้ไขวิชาเรียนสำเร็จ');
            } else {
                await createSubject(payload).unwrap();
                onSuccess('✅ เพิ่มวิชาเรียนสำเร็จ');
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
                    <h2 className="text-white text-lg font-bold">
                        {isEditing ? '✏️ แก้ไขวิชาเรียน' : '➕ เพิ่มวิชาเรียนใหม่'}
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

// ── Subject Manage Panel Modal (รายการวิชาทั้งหมด) ──────────
const SubjectManagePanel = ({ isOpen, onClose, subjects, departments, onToast }) => {
    const [deleteSubject, { isLoading: deleting }] = useDeleteSubjectMutation();
    const [formOpen, setFormOpen] = useState(false);
    const [editSubject, setEditSubject] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() =>
        (subjects || []).filter((s) =>
            !search ||
            s.codeSubject.toLowerCase().includes(search.toLowerCase()) ||
            s.name.toLowerCase().includes(search.toLowerCase())
        ), [subjects, search]);

    const handleDelete = async (s) => {
        if (!window.confirm(`ลบวิชา "${s.codeSubject} — ${s.name}" ใช่ไหม?`)) return;
        try {
            await deleteSubject(s.id).unwrap();
            onToast('✅ ลบวิชาเรียนสำเร็จ');
        } catch (err) {
            onToast(`❌ ${err?.data?.message || 'เกิดข้อผิดพลาด'}`, 'error');
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
                            <h2 className="text-white text-lg font-bold">📚 จัดการวิชาเรียน</h2>
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
                            ➕ เพิ่มวิชา
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
                                        {s.department && (
                                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                {s.department}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-1.5 flex-shrink-0">
                                        <button
                                            onClick={() => { setEditSubject(s); setFormOpen(true); }}
                                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                                        >
                                            ✏️ แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s)}
                                            disabled={deleting}
                                            className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2.5 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                                        >
                                            🗑️
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
                onSuccess={(msg) => onToast(msg)}
            />
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
                teacherId: String(editData.teacherId || ''),
                guestTeacherName: editData.guestTeacherName || '',
                room: editData.room || '',
                building: editData.building || '',
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [editData, isOpen]);

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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold">
                        {editData ? '✏️ แก้ไขคาบเรียน' : '➕ เพิ่มคาบเรียน'}
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
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
                            onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
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
                        </label>
                        <select
                            value={form.teacherId}
                            onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value, guestTeacherName: '' }))}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="">— ไม่ระบุครู (ครูรับเชิญ / ว่าง) —</option>
                            {(teachers || []).map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}{t.department ? ` (${t.department})` : ''}
                                </option>
                            ))}
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
                            <p className="text-amber-600 text-xs mt-1">⚡ ชื่อนี้จะแสดงในตารางแทนครูประจำ เมื่อครูเข้ารับการเรียนการสอนในระบบแล้วให้เลือกจากรายชื่อด้านบนแทน</p>
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

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
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

// ── Toast notification ─────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };
    return (
        <div className={`fixed top-4 right-4 z-[60] ${colors[type] || 'bg-gray-700'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            <span>{message}</span>
            <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">✕</button>
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
    const [toast, setToast] = useState(null);
    const [subjectPanelOpen, setSubjectPanelOpen] = useState(false);

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

    const showToast = (message, type = 'success') => setToast({ message, type });

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
                showToast('✅ แก้ไขคาบเรียนสำเร็จ');
            } else {
                // Add mode — pass selectedClass + selectedSemesterId
                await createEntry({
                    ...values,
                    className: selectedClass,
                    semesterId: selectedSemesterId ? Number(selectedSemesterId) : undefined,
                }).unwrap();
                showToast('✅ เพิ่มคาบเรียนสำเร็จ');
            }
            setFormOpen(false);
            refetch();
        } catch (err) {
            const msg = err?.data?.message || err?.message || 'เกิดข้อผิดพลาด';
            showToast(`❌ ${msg}`, 'error');
        }
    };

    // Delete
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteEntry(deleteTarget.id).unwrap();
            showToast('✅ ลบคาบเรียนสำเร็จ');
            setDeleteTarget(null);
            refetch();
        } catch (err) {
            const msg = err?.data?.message || 'เกิดข้อผิดพลาด';
            showToast(`❌ ${msg}`, 'error');
            setDeleteTarget(null);
        }
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
                            📚 จัดการวิชา
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
                                ➕ เพิ่มคาบเรียน
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-6 space-y-4">

                {/* ── Selectors ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">🏫 ห้องเรียน</label>
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
                        {/* Desktop Grid */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[750px] border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="w-24 border border-gray-200 px-3 py-3 text-xs font-bold text-gray-500 text-center bg-gray-100">
                                                คาบ / วัน
                                            </th>
                                            {DAY_NAMES.map((day) => (
                                                <th key={day} className="border border-gray-200 px-2 py-3 text-center">
                                                    <span className={`inline-block bg-gradient-to-br ${DAY_COLOR_BAR[day]} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm`}>
                                                        {day}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {periods.map((period, idx) => (
                                            <React.Fragment key={period}>
                                                {/* พักเที่ยง */}
                                                {period === 5 && (
                                                    <tr className="bg-lime-50">
                                                        <td colSpan={6} className="border border-lime-200 py-2 text-center">
                                                            <span className="text-lime-700 font-semibold text-sm">🍽️ พักเที่ยง</span>
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                                                    <td className="border border-gray-200 px-3 py-2 text-center bg-gray-50">
                                                        <span className="text-gray-600 font-bold text-sm">คาบ {period}</span>
                                                    </td>
                                                    {DAYS.map((day) => {
                                                        const cell = schedule[day.name]?.[period] || null;
                                                        return (
                                                            <td key={day.id} className="border border-gray-200 px-2 py-2 min-w-[130px] align-top">
                                                                {cell ? (
                                                                    <FilledCell
                                                                        cell={cell}
                                                                        onEdit={() => handleEditClick(cell)}
                                                                        onDelete={() => setDeleteTarget(cell)}
                                                                    />
                                                                ) : (
                                                                    <AddCellButton
                                                                        onClick={() => handleAddClick(day.id, day.name, period)}
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </React.Fragment>
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
                                                                        <p className="text-indigo-700 font-bold text-sm truncate">
                                                                            {daySchedule[period].subjectCode}
                                                                        </p>
                                                                        {daySchedule[period].teacherName && (
                                                                            <p className="text-gray-400 text-xs truncate">
                                                                                {daySchedule[period].teacherName}
                                                                            </p>
                                                                        )}
                                                                        {daySchedule[period].room && (
                                                                            <p className="text-gray-300 text-[11px] truncate">🏫 {daySchedule[period].room}</p>
                                                                        )}
                                                                        {daySchedule[period].building && (
                                                                            <p className="text-gray-300 text-[11px] truncate">🏢 {daySchedule[period].building}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-1 flex-shrink-0">
                                                                        <button
                                                                            onClick={() => handleEditClick(daySchedule[period])}
                                                                            className="w-7 h-7 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs transition-colors"
                                                                            title="แก้ไข"
                                                                        >
                                                                            ✏️
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setDeleteTarget(daySchedule[period])}
                                                                            className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center text-xs transition-colors"
                                                                            title="ลบ"
                                                                        >
                                                                            🗑️
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleAddClick(day.id, day.name, period)}
                                                                    className="text-indigo-400 hover:text-indigo-600 text-sm font-medium flex items-center gap-1 transition-colors"
                                                                >
                                                                    ➕ <span className="text-xs">เพิ่มวิชา</span>
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
                            <p>➕ คลิก <strong>เพิ่ม (+)</strong> ในเซลล์ว่างเพื่อเพิ่มคาบเรียน</p>
                            <p>✏️ คลิก <strong>แก้ไข</strong> เพื่อเปลี่ยนข้อมูลวิชาในคาบนั้น</p>
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
                subjects={subjects}
                teachers={teachers}
                maxCurrentPeriod={maxPeriod}
            />

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                isLoading={deleting}
                cellData={deleteTarget}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <SubjectManagePanel
                isOpen={subjectPanelOpen}
                onClose={() => setSubjectPanelOpen(false)}
                subjects={subjects}
                departments={departments}
                onToast={(msg, type = 'success') => showToast(msg, type)}
            />
        </div>
    );
};

// ── Small helpers ──────────────────────────────────────────
const FilledCell = ({ cell, onEdit, onDelete }) => (
    <div className="group relative min-h-[60px] flex flex-col gap-1 p-1.5">
        <p className="text-indigo-700 font-bold text-xs text-center leading-tight">
            {cell.subjectCode}
        </p>
        {cell.teacherName && (
            <p className="text-gray-400 text-[10px] text-center leading-tight truncate">
                {cell.teacherName}
            </p>
        )}
        {cell.room && (
            <p className="text-gray-400 text-[10px] text-center leading-tight truncate">
                🏫 {cell.room}
            </p>
        )}
        {cell.building && (
            <p className="text-gray-400 text-[10px] text-center leading-tight truncate">
                🏢 {cell.building}
            </p>
        )}
        {/* Action buttons — shown on hover */}
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 justify-center transition-opacity mt-auto">
            <button
                onClick={onEdit}
                className="text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-0.5 rounded-md transition-colors font-medium"
            >
                ✏️ แก้ไข
            </button>
            <button
                onClick={onDelete}
                className="text-[10px] bg-red-100 hover:bg-red-200 text-red-600 px-2 py-0.5 rounded-md transition-colors font-medium"
            >
                🗑️ ลบ
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
        <div className="text-5xl mb-3">🏫</div>
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
