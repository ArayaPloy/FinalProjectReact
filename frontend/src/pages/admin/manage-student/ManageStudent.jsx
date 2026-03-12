import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import Swal from 'sweetalert2';
import { Plus, Search, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MdModeEdit, MdToggleOn, MdToggleOff } from 'react-icons/md';
import {
    useGetAllStudentsQuery,
    useGetClassroomsFullQuery,
    useGetGendersQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useToggleStudentMutation,
    useImportStudentsMutation,
} from '../../../services/studentsApi';

const SwalToast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false,
    timer: 2500, timerProgressBar: true,
});

const NAME_PREFIXES = ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นางสาว', 'นาง', 'ด.ช.', 'ด.ญ.'];
const GUARDIAN_PREFIXES = ['นาย', 'นาง', 'นางสาว', 'พ่อ', 'แม่'];
const DEFAULT_FORM = {
    namePrefix: 'เด็กชาย', firstName: '', lastName: '', genderId: '',
    dob: '', nationality: 'ไทย', weight: '', height: '', disease: '', phoneNumber: '',
    studentNumber: '', homeroomClassId: '',
    guardianNamePrefix: 'นาย', guardianFirstName: '', guardianLastName: '',
    guardianRelation: '', guardianOccupation: '', guardianMonthlyIncome: '', emergencyContact: '',
    address: '', houseType: '', houseMaterial: '', utilities: '', studyArea: '',
};

const parseCSVLine = (line) => {
    const values = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') { inQuote = !inQuote; }
        else if (line[i] === ',' && !inQuote) { values.push(cur); cur = ''; }
        else { cur += line[i]; }
    }
    values.push(cur);
    return values;
};

const parseCSV = (text) => {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
        const vals = parseCSVLine(line);
        const row = {};
        headers.forEach((h, i) => { row[h] = (vals[i] || '').trim().replace(/^"|"$/g, ''); });
        return row;
    }).filter(row => Object.values(row).some(v => v));
};

// Map Thai column headers (from export) → English field names (for import backend)
const THAI_TO_FIELD = {
    'รหัสนักเรียน': 'studentNumber',
    'คำนำหน้า': 'namePrefix',
    'ชื่อ': 'firstName',
    'นามสกุล': 'lastName',
    'เพศ': 'genderName',
    'ห้องเรียน': 'className',
    'วันเกิด': 'dob',
    'สัญชาติ': 'nationality',
    'น้ำหนัก(กก.)': 'weight',
    'ส่วนสูง(ซม.)': 'height',
    'โรคประจำตัว': 'disease',
    'เบอร์โทรนักเรียน': 'phoneNumber',
    'คำนำหน้าผู้ปกครอง': 'guardianNamePrefix',
    'ชื่อผู้ปกครอง': 'guardianFirstName',
    'นามสกุลผู้ปกครอง': 'guardianLastName',
    'ความสัมพันธ์': 'guardianRelation',
    'อาชีพผู้ปกครอง': 'guardianOccupation',
    'รายได้ต่อเดือน(บาท)': 'guardianMonthlyIncome',
    'เบอร์ฉุกเฉิน': 'emergencyContact',
    'ที่อยู่': 'address',
    'ประเภทที่พัก': 'houseType',
    'วัสดุก่อสร้าง': 'houseMaterial',
    'สาธารณูปโภค': 'utilities',
    'บริเวณที่เรียน': 'studyArea',
};

// Strip Excel formula prefix: ="value" → value, =12345 → 12345
// After CSV parsing, =" wrapping becomes just = prefix (quotes stripped by parser)
const stripExcelFormula = (v) => {
    if (typeof v === 'string' && v.startsWith('=')) return v.slice(1);
    return v;
};

// Normalize each row: rename Thai keys → English field names, strip Excel formula wrappers
const normalizeImportRows = (rows) =>
    rows.map(row => {
        const out = {};
        Object.entries(row).forEach(([k, v]) => {
            const mapped = THAI_TO_FIELD[k] || k; // pass through if already English
            out[mapped] = stripExcelFormula(v);
        });
        return out;
    });

// SVG icons matching ManageClassSchedules style
const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const ImportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

// ─── Import Preview Modal ──────────────────────────────────────────────────────
const ImportPreviewModal = ({ isOpen, onClose, rows, classroomsFull, onConfirm, isImporting }) => {
    if (!isOpen) return null;
    const classNames = new Set(classroomsFull.map(c => c.className));
    const thCls = 'px-2 py-2 text-left text-xs font-semibold whitespace-nowrap';
    const tdCls = 'px-2 py-1.5 text-xs text-gray-700 whitespace-nowrap';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[96vw] max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
                    <h2 className="text-base font-bold text-gray-800">
                        ตรวจสอบข้อมูลก่อนนำเข้า <span className="text-blue-600">({rows.length} รายการ)</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="text-sm border-collapse" style={{ minWidth: '1600px' }}>
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-blue-600 text-white">
                                <th className={thCls}>#</th>
                                <th className={thCls}>รหัสนักเรียน</th>
                                <th className={thCls}>ชื่อ-นามสกุล</th>
                                <th className={thCls}>เพศ</th>
                                <th className={thCls}>วันเกิด</th>
                                <th className={thCls}>สัญชาติ</th>
                                <th className={thCls}>น้ำหนัก</th>
                                <th className={thCls}>ส่วนสูง</th>
                                <th className={thCls}>โรคประจำตัว</th>
                                <th className={thCls}>เบอร์โทรนักเรียน</th>
                                <th className={thCls}>ห้องเรียน</th>
                                <th className={thCls}>ผู้ปกครอง</th>
                                <th className={thCls}>ความสัมพันธ์</th>
                                <th className={thCls}>อาชีพ</th>
                                <th className={thCls}>รายได้/เดือน</th>
                                <th className={thCls}>เบอร์ฉุกเฉิน</th>
                                <th className={thCls}>ที่อยู่</th>
                                <th className={thCls}>ประเภทที่พัก</th>
                                <th className={thCls}>วัสดุก่อสร้าง</th>
                                <th className={thCls}>สาธารณูปโภค</th>
                                <th className={thCls}>บริเวณที่เรียน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className={`${tdCls} text-gray-400 text-center`}>{i + 1}</td>
                                    <td className={`${tdCls} font-mono font-bold text-blue-700`}>{row.studentNumber || '-'}</td>
                                    <td className={`${tdCls} font-semibold text-gray-800`}>
                                        {[row.namePrefix, row.firstName, row.lastName].filter(Boolean).join(' ') || '-'}
                                    </td>
                                    <td className={tdCls}>{row.genderName || '-'}</td>
                                    <td className={tdCls}>{row.dob || '-'}</td>
                                    <td className={tdCls}>{row.nationality || '-'}</td>
                                    <td className={`${tdCls} text-center`}>{row.weight || '-'}</td>
                                    <td className={`${tdCls} text-center`}>{row.height || '-'}</td>
                                    <td className={tdCls}>{row.disease || '-'}</td>
                                    <td className={tdCls}>{row.phoneNumber || '-'}</td>
                                    <td className={tdCls}>
                                        {row.className ? (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                                classNames.has(row.className)
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {row.className}{!classNames.has(row.className) ? ' (ไม่พบ)' : ''}
                                            </span>
                                        ) : <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className={tdCls}>
                                        {[row.guardianNamePrefix, row.guardianFirstName, row.guardianLastName].filter(Boolean).join(' ') || '-'}
                                    </td>
                                    <td className={tdCls}>{row.guardianRelation || '-'}</td>
                                    <td className={tdCls}>{row.guardianOccupation || '-'}</td>
                                    <td className={tdCls}>{row.guardianMonthlyIncome || '-'}</td>
                                    <td className={tdCls}>{row.emergencyContact || '-'}</td>
                                    <td className={`${tdCls} max-w-[120px] truncate`} title={row.address}>{row.address || '-'}</td>
                                    <td className={tdCls}>{row.houseType || '-'}</td>
                                    <td className={tdCls}>{row.houseMaterial || '-'}</td>
                                    <td className={tdCls}>{row.utilities || '-'}</td>
                                    <td className={tdCls}>{row.studyArea || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t flex-shrink-0 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">* รหัสนักเรียนซ้ำจะถูกข้ามอัตโนมัติ</p>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={() => onConfirm(rows)}
                            disabled={isImporting}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                        >
                            {isImporting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {isImporting ? 'กำลังนำเข้า...' : `นำเข้า ${rows.length} รายการ`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Shared form field helpers (must be outside modal to preserve React identity) ─
const FORM_INPUT_CLS = 'w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm';

const Field = ({ label, required, children }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

// ─── Student Form Modal ────────────────────────────────────────────────────────
const StudentFormModal = ({
    isOpen, editingStudent, formData, onChange, onSubmit, isSaving, onClose, genders, classroomsFull
}) => {
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => { if (isOpen) setActiveTab(0); }, [isOpen]);
    if (!isOpen) return null;

    const TABS = ['ข้อมูลส่วนตัว', 'รหัส/ห้องเรียน', 'ผู้ปกครอง', 'ที่อยู่'];
    const cls = FORM_INPUT_CLS;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl">
                    <h2 className="text-lg font-bold text-white">
                        {editingStudent ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b bg-gray-50">
                    {TABS.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`flex-1 px-2 py-2.5 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${activeTab === i
                                ? 'border-blue-500 text-blue-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Tab 0: Personal */}
                    {activeTab === 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="คำนำหน้า" required>
                                <select value={formData.namePrefix} onChange={e => onChange('namePrefix', e.target.value)} className={cls}>
                                    {NAME_PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </Field>
                            <Field label="เพศ" required>
                                <select value={formData.genderId} onChange={e => onChange('genderId', e.target.value)} className={cls}>
                                    <option value="">-- เลือกเพศ --</option>
                                    {genders.map(g => <option key={g.id} value={g.id}>{g.genderName}</option>)}
                                </select>
                            </Field>
                            <Field label="ชื่อ" required>
                                <input type="text" value={formData.firstName} onChange={e => onChange('firstName', e.target.value)} className={cls} placeholder="ชื่อ" />
                            </Field>
                            <Field label="นามสกุล" required>
                                <input type="text" value={formData.lastName} onChange={e => onChange('lastName', e.target.value)} className={cls} placeholder="นามสกุล" />
                            </Field>
                            <Field label="วันเกิด">
                                <input type="date" value={formData.dob} onChange={e => onChange('dob', e.target.value)} className={cls} />
                            </Field>
                            <Field label="สัญชาติ">
                                <input type="text" value={formData.nationality} onChange={e => onChange('nationality', e.target.value)} className={cls} placeholder="ไทย" />
                            </Field>
                            <Field label="โรคประจำตัว">
                                <input type="text" value={formData.disease} onChange={e => onChange('disease', e.target.value)} className={cls} placeholder="-" />
                            </Field>
                            <Field label="เบอร์โทรนักเรียน">
                                <input type="text" value={formData.phoneNumber} onChange={e => onChange('phoneNumber', e.target.value)} className={cls} placeholder="08xxxxxxxx" />
                            </Field>
                            <Field label="น้ำหนัก (กก.)">
                                <input type="number" value={formData.weight} onChange={e => onChange('weight', e.target.value)} className={cls} placeholder="45" />
                            </Field>
                            <Field label="ส่วนสูง (ซม.)">
                                <input type="number" value={formData.height} onChange={e => onChange('height', e.target.value)} className={cls} placeholder="160" />
                            </Field>
                        </div>
                    )}

                    {/* Tab 1: Student ID / Classroom */}
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            <Field label="รหัสนักเรียน">
                                <input
                                    type="number"
                                    value={formData.studentNumber}
                                    onChange={e => onChange('studentNumber', e.target.value)}
                                    className={cls}
                                    placeholder="เช่น 12345"
                                />
                            </Field>
                            <Field label="ห้องเรียน / ครูประจำชั้น">
                                <select
                                    value={formData.homeroomClassId}
                                    onChange={e => onChange('homeroomClassId', e.target.value)}
                                    className={cls}
                                >
                                    <option value="">-- ยังไม่กำหนดห้องเรียน --</option>
                                    {classroomsFull.map(c => (
                                        <option key={c.id} value={c.id}>
                                            ห้อง {c.className}{c.teacherName ? ` — ${c.teacherName}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {formData.homeroomClassId && (
                                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                                        ครูประจำชั้น: {classroomsFull.find(c => c.id.toString() === formData.homeroomClassId)?.teacherName || '-'}
                                    </p>
                                )}
                            </Field>
                        </div>
                    )}

                    {/* Tab 2: Guardian */}
                    {activeTab === 2 && (
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="คำนำหน้าผู้ปกครอง">
                                <select value={formData.guardianNamePrefix} onChange={e => onChange('guardianNamePrefix', e.target.value)} className={cls}>
                                    {GUARDIAN_PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </Field>
                            <Field label="ความสัมพันธ์">
                                <input type="text" value={formData.guardianRelation} onChange={e => onChange('guardianRelation', e.target.value)} className={cls} placeholder="เช่น บิดา, มารดา" />
                            </Field>
                            <Field label="ชื่อผู้ปกครอง">
                                <input type="text" value={formData.guardianFirstName} onChange={e => onChange('guardianFirstName', e.target.value)} className={cls} placeholder="ชื่อ" />
                            </Field>
                            <Field label="นามสกุลผู้ปกครอง">
                                <input type="text" value={formData.guardianLastName} onChange={e => onChange('guardianLastName', e.target.value)} className={cls} placeholder="นามสกุล" />
                            </Field>
                            <Field label="อาชีพ">
                                <input type="text" value={formData.guardianOccupation} onChange={e => onChange('guardianOccupation', e.target.value)} className={cls} placeholder="เช่น เกษตรกร" />
                            </Field>
                            <Field label="รายได้ต่อเดือน (บาท)">
                                <input type="text" value={formData.guardianMonthlyIncome} onChange={e => onChange('guardianMonthlyIncome', e.target.value)} className={cls} placeholder="15000" />
                            </Field>
                            <div className="col-span-2">
                                <Field label="เบอร์ฉุกเฉิน">
                                    <input type="text" value={formData.emergencyContact} onChange={e => onChange('emergencyContact', e.target.value)} className={cls} placeholder="08xxxxxxxx" />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Address */}
                    {activeTab === 3 && (
                        <div className="space-y-3">
                            <Field label="ที่อยู่">
                                <textarea
                                    value={formData.address}
                                    onChange={e => onChange('address', e.target.value)}
                                    className={`${cls} resize-none`}
                                    rows={3}
                                    placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="ประเภทที่พัก">
                                    <input type="text" value={formData.houseType} onChange={e => onChange('houseType', e.target.value)} className={cls} placeholder="เช่น บ้านเดี่ยว" />
                                </Field>
                                <Field label="วัสดุก่อสร้าง">
                                    <input type="text" value={formData.houseMaterial} onChange={e => onChange('houseMaterial', e.target.value)} className={cls} placeholder="เช่น คอนกรีต" />
                                </Field>
                                <Field label="สาธารณูปโภค">
                                    <input type="text" value={formData.utilities} onChange={e => onChange('utilities', e.target.value)} className={cls} placeholder="เช่น ไฟฟ้า, น้ำประปา" />
                                </Field>
                                <Field label="บริเวณที่เรียน">
                                    <input type="text" value={formData.studyArea} onChange={e => onChange('studyArea', e.target.value)} className={cls} placeholder="เช่น ห้องนอน" />
                                </Field>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t bg-gray-50 rounded-b-2xl">
                    <div className="flex items-center gap-1.5">
                        {TABS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${activeTab === i ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                            ยกเลิก
                        </button>
                        {activeTab < TABS.length - 1 && (
                            <button onClick={() => setActiveTab(activeTab + 1)} className="px-4 py-2 rounded-xl bg-gray-700 text-white font-bold hover:bg-gray-800 transition-colors text-sm">
                                ถัดไป →
                            </button>
                        )}
                        <button
                            onClick={onSubmit}
                            disabled={isSaving}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                        >
                            {isSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {isSaving ? 'กำลังบันทึก...' : editingStudent ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ManageStudent = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = ['admin', 'super_admin'].includes((currentUser?.role || '').toLowerCase());

    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(20);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [isSaving, setIsSaving] = useState(false);

    const [importPreviewOpen, setImportPreviewOpen] = useState(false);
    const [importRows, setImportRows] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);

    const { data: studentsRes, isLoading, refetch } = useGetAllStudentsQuery({ includeDeleted: true });
    const { data: genders = [] } = useGetGendersQuery();
    const { data: classroomsFull = [] } = useGetClassroomsFullQuery();
    const [createStudent] = useCreateStudentMutation();
    const [updateStudent] = useUpdateStudentMutation();
    const [toggleStudent] = useToggleStudentMutation();
    const [importStudents, { isLoading: isImportLoading }] = useImportStudentsMutation();

    const rawStudents = studentsRes?.data || [];

    // Deduplicate by studentNumber — prefer active (non-deleted) over inactive duplicates
    // Students without a studentNumber are excluded
    const allStudents = useMemo(() => {
        const map = new Map();
        rawStudents.filter(s => s.studentNumber).forEach(s => {
            const key = `sn_${s.studentNumber}`;
            if (!map.has(key) || map.get(key).isDeleted) {
                map.set(key, s);
            }
        });
        return Array.from(map.values());
    }, [rawStudents]);

    const classesList = useMemo(() => (
        [...new Set(allStudents.map(s => s.classRoom).filter(Boolean))].sort()
    ), [allStudents]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return allStudents.filter(s => {
            const matchSearch = !search
                || s.fullName.toLowerCase().includes(q)
                || s.studentNumber?.toString().includes(q);
            const matchClass = !filterClass || s.classRoom === filterClass;
            const matchStatus = filterStatus === 'all'
                || (filterStatus === 'active' && !s.isDeleted)
                || (filterStatus === 'inactive' && s.isDeleted);
            return matchSearch && matchClass && matchStatus;
        });
    }, [allStudents, search, filterClass, filterStatus]);

    const totalPages = Math.ceil(filtered.length / recordsPerPage);
    const paginated = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    useEffect(() => { setCurrentPage(1); }, [search, filterClass, filterStatus, recordsPerPage]);

    const renderPagination = () => {
        if (filtered.length === 0 || totalPages <= 0) return null;
        return (
            <div className="mb-2 border-b border-gray-200 pb-2 px-4 sm:px-5 pt-2.5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>แสดง</span>
                        <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))} className="px-2 py-1.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span>รายการ/หน้า</span>
                        {totalPages > 1 && <span className="text-gray-400">|</span>}
                        {totalPages > 1 && <span>หน้า <span className="font-bold text-indigo-700">{currentPage}</span> / <span className="font-bold text-indigo-700">{totalPages}</span></span>}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="หน้าแรก"><ChevronLeft className="w-3.5 h-3.5 inline" /><ChevronLeft className="w-3.5 h-3.5 inline -ml-2" /></button>
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-4 h-4 inline mr-1" /><span className="hidden sm:inline">ก่อนหน้า</span></button>
                            <div className="hidden md:flex items-center gap-1">
                                {[...Array(totalPages)].map((_, idx) => {
                                    const p = idx + 1;
                                    const show = p === 1 || p === 2 || p === totalPages || p === totalPages - 1 || Math.abs(p - currentPage) <= 1;
                                    if (!show && p === 3 && currentPage > 4) return <span key={p} className="px-2 text-gray-400">...</span>;
                                    if (!show && p === totalPages - 2 && currentPage < totalPages - 3) return <span key={p} className="px-2 text-gray-400">...</span>;
                                    if (!show) return null;
                                    return <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${currentPage === p ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'}`}>{p}</button>;
                                })}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><span className="hidden sm:inline">ถัดไป</span><ChevronRight className="w-4 h-4 inline ml-1" /></button>
                            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title="หน้าสุดท้าย"><ChevronRight className="w-3.5 h-3.5 inline" /><ChevronRight className="w-3.5 h-3.5 inline -ml-2" /></button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleOpenAdd = () => {
        setEditingStudent(null);
        setFormData(DEFAULT_FORM);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (s) => {
        setEditingStudent(s);
        setFormData({
            namePrefix: s.namePrefix || 'เด็กชาย',
            firstName: s.firstName || '',
            lastName: s.lastName || '',
            genderId: s.genderId?.toString() || '',
            dob: s.dob ? s.dob.toString().slice(0, 10) : '',
            nationality: s.nationality || 'ไทย',
            weight: s.weight?.toString() || '',
            height: s.height?.toString() || '',
            disease: s.disease || '',
            phoneNumber: s.phoneNumber || '',
            studentNumber: s.studentNumber?.toString() || '',
            homeroomClassId: s.homeroomClassId?.toString() || '',
            guardianNamePrefix: s.guardianNamePrefix || 'นาย',
            guardianFirstName: s.guardianFirstName || '',
            guardianLastName: s.guardianLastName || '',
            guardianRelation: s.guardianRelation || '',
            guardianOccupation: s.guardianOccupation || '',
            guardianMonthlyIncome: s.guardianMonthlyIncome || '',
            emergencyContact: s.emergencyContact || '',
            address: s.address || '',
            houseType: s.houseType || '',
            houseMaterial: s.houseMaterial || '',
            utilities: s.utilities || '',
            studyArea: s.studyArea || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.genderId) {
            Swal.fire({
                icon: 'warning', title: 'กรุณากรอกข้อมูลที่จำเป็น',
                text: 'ชื่อ, นามสกุล, และเพศ', confirmButtonText: 'ตกลง', confirmButtonColor: '#2563EB',
            });
            return;
        }
        setIsSaving(true);
        try {
            if (editingStudent) {
                await updateStudent({ id: editingStudent.id, ...formData }).unwrap();
                SwalToast.fire({ icon: 'success', title: 'แก้ไขข้อมูลสำเร็จ' });
            } else {
                await createStudent(formData).unwrap();
                SwalToast.fire({ icon: 'success', title: 'เพิ่มนักเรียนสำเร็จ' });
            }
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            Swal.fire({
                icon: 'error', title: 'เกิดข้อผิดพลาด',
                text: error.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonText: 'ตกลง', confirmButtonColor: '#DC2626',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (s) => {
        const isActivating = s.isDeleted;
        const action = isActivating ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน';
        const result = await Swal.fire({
            icon: 'question',
            title: `${action}นักเรียน?`,
            html: `<b>${s.fullName}</b>`,
            showCancelButton: true,
            confirmButtonText: action,
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: isActivating ? '#16A34A' : '#DC2626',
            cancelButtonColor: '#6B7280',
        });
        if (!result.isConfirmed) return;
        try {
            const res = await toggleStudent(s.id).unwrap();
            SwalToast.fire({ icon: 'success', title: res.message });
            refetch();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.data?.message || 'ดำเนินการไม่สำเร็จ' });
        }
    };

    // Export currently-filtered students as CSV (respects all active filters)
    const handleExportStudents = () => {
        if (filtered.length === 0) {
            Swal.fire({ icon: 'warning', title: 'ไม่มีข้อมูล', text: 'ไม่มีรายชื่อนักเรียนในผลการกรองปัจจุบัน', confirmButtonText: 'ตกลง' });
            return;
        }
        const esc = (v) => {
            const str = String(v ?? '');
            return (str.includes(',') || str.includes('"') || str.includes('\n'))
                ? `"${str.replace(/"/g, '""')}"` : str;
        };
        const today = new Date().toISOString().split('T')[0];
        const classLabel = filterClass || 'ทุกห้อง';
        const headers = [
            'ลำดับ', 'รหัสนักเรียน', 'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'เพศ',
            'วันเกิด', 'สัญชาติ', 'น้ำหนัก(กก.)', 'ส่วนสูง(ซม.)', 'โรคประจำตัว', 'เบอร์โทรนักเรียน',
            'ห้องเรียน', 'ครูประจำชั้น', 'สถานะ',
            'คำนำหน้าผู้ปกครอง', 'ชื่อผู้ปกครอง', 'นามสกุลผู้ปกครอง', 'ความสัมพันธ์', 'อาชีพผู้ปกครอง', 'รายได้ต่อเดือน(บาท)', 'เบอร์ฉุกเฉิน',
            'ที่อยู่', 'ประเภทที่พัก', 'วัสดุก่อสร้าง', 'สาธารณูปโภค', 'บริเวณที่เรียน',
        ];
        const dataRows = filtered.map((s, i) => [
            i + 1,
            s.studentNumber ? `="${s.studentNumber}"` : '',
            s.namePrefix || '',
            s.firstName || '',
            s.lastName || '',
            s.genders?.genderName || '',
            s.dob ? `="${s.dob.toString().slice(0, 10)}"` : '',
            s.nationality || '',
            s.weight || '',
            s.height || '',
            s.disease || '',
            s.phoneNumber ? `="${s.phoneNumber}"` : '',
            s.classRoom ? `="${s.classRoom}"` : '',
            s.teacherName || '',
            s.isDeleted ? 'ปิดใช้งาน' : 'ใช้งาน',
            s.guardianNamePrefix || '',
            s.guardianFirstName || '',
            s.guardianLastName || '',
            s.guardianRelation || '',
            s.guardianOccupation || '',
            s.guardianMonthlyIncome || '',
            s.emergencyContact ? `="${s.emergencyContact}"` : '',
            s.address || '',
            s.houseType || '',
            s.houseMaterial || '',
            s.utilities || '',
            s.studyArea || '',
        ]);
        const csv = [headers, ...dataRows].map(row => row.map(esc).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_${classLabel}_${today}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        SwalToast.fire({ icon: 'success', title: `ส่งออก ${filtered.length} รายการสำเร็จ` });
    };

    // Download blank CSV template for importing students
    const handleDownloadTemplate = () => {
        const headers = [
            'studentNumber', 'namePrefix', 'firstName', 'lastName', 'genderName', 'className',
            'dob', 'nationality', 'weight', 'height', 'disease', 'phoneNumber',
            'guardianNamePrefix', 'guardianFirstName', 'guardianLastName', 'guardianRelation', 'guardianOccupation', 'guardianMonthlyIncome', 'emergencyContact',
            'address', 'houseType', 'houseMaterial', 'utilities', 'studyArea',
        ];
        const sample = [
            '12345', 'เด็กชาย', 'สมชาย', 'ใจดี', 'ชาย', 'ม.1/1',
            '2014-01-15', 'ไทย', '45', '150', '-', '08xxxxxxxx',
            'นาย', 'สมหมาย', 'ใจดี', 'บิดา', 'เกษตรกร', '15000', '08xxxxxxxx',
            '1/1 ถ.สุขุมวิท ต.บางนา อ.บางนา จ.กรุงเทพฯ', 'บ้านเดี่ยว', 'คอนกรีต', 'ไฟฟ้า,น้ำประปา', 'ห้องนอน',
        ];
        const escTpl = (v) => (v.includes(',') || v.includes('"') || v.includes('\n'))
            ? `"${v.replace(/"/g, '""')}"` : v;
        const csv = [headers, sample].map(r => r.map(escTpl).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'import_students_template.csv';
        a.click();
        URL.revokeObjectURL(url);
        SwalToast.fire({ icon: 'info', title: 'ดาวน์โหลด Template สำเร็จ' });
    };

    const handleImportClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = (ev.target.result || '').replace(/^\uFEFF/, '');
            const rawRows = parseCSV(text);
            if (rawRows.length === 0) {
                Swal.fire({ icon: 'warning', title: 'ไม่พบข้อมูล', text: 'ไม่มีแถวข้อมูลในไฟล์' });
                return;
            }
            const rows = normalizeImportRows(rawRows);
            setImportRows(rows);
            setImportPreviewOpen(true);
        };
        reader.readAsText(file, 'UTF-8');
    };

    const handleImportConfirm = async (rows) => {
        setIsImporting(true);
        try {
            const result = await importStudents({ students: rows }).unwrap();
            setImportPreviewOpen(false);
            setImportRows([]);
            Swal.fire({
                icon: 'success', title: 'นำเข้าสำเร็จ',
                text: result.message, confirmButtonText: 'ตกลง', confirmButtonColor: '#2563EB',
            });
            refetch();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.data?.message || 'นำเข้าไม่สำเร็จ' });
        } finally {
            setIsImporting(false);
        }
    };

    const totalActive = allStudents.filter(s => !s.isDeleted).length;
    const totalInactive = allStudents.filter(s => s.isDeleted).length;

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
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-5 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6" /> จัดการข้อมูลนักเรียน
                        </h1>
                        <p className="text-blue-200 text-sm mt-0.5">เพิ่ม แก้ไข เปิด/ปิดการใช้งาน และนำเข้าข้อมูลนักเรียน</p>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-sm transition-colors shadow"
                    >
                        <Plus className="w-4 h-4" /> เพิ่มนักเรียน
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-5 space-y-4">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500 font-semibold">ทั้งหมด</p>
                        <p className="text-xl sm:text-3xl font-bold text-blue-700 leading-none mt-1">{allStudents.length}</p>
                        <p className="text-sm text-gray-400 mt-0">คน</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 font-semibold">เปิดใช้งาน</p>
                        <p className="text-xl sm:text-3xl font-bold text-green-600 leading-none mt-1">{totalActive}</p>
                        <p className="text-sm text-gray-400 mt-0">คน</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border-l-4 border-red-400">
                        <p className="text-sm text-gray-500 font-semibold">ปิดใช้งาน</p>
                        <p className="text-xl sm:text-3xl font-bold text-red-500 leading-none mt-1">{totalInactive}</p>
                        <p className="text-sm text-gray-400 mt-0">คน</p>
                    </div>
                </div>

                {/* Filter + Export/Import card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                    {/* Top row: section label + action buttons */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-sm font-semibold text-gray-600">ค้นหานักเรียน</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportStudents}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all"
                            >
                                <ExportIcon /> ส่งออก Excel
                            </button>
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm transition-all"
                                title="ดาวน์โหลด Template สำหรับนำเข้าข้อมูล"
                            >
                                <ExportIcon /> Template
                            </button>
                            <button
                                onClick={handleImportClick}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all"
                            >
                                <ImportIcon /> นำเข้า Excel
                            </button>
                            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                        </div>
                    </div>
                    {/* Filters row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน..."
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm transition-all"
                            />
                        </div>
                        <select
                            value={filterClass}
                            onChange={e => setFilterClass(e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 text-sm font-semibold text-gray-700 transition-all"
                        >
                            <option value="">ทุกห้อง</option>
                            {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 text-sm font-semibold text-gray-700 transition-all"
                        >
                            <option value="active">เปิดใช้งาน</option>
                            <option value="inactive">ปิดใช้งาน</option>
                            <option value="all">ทั้งหมด</option>
                        </select>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        แสดง <span className="font-bold text-blue-600">{filtered.length}</span> รายการ
                        {filtered.length !== allStudents.length && ` (จากทั้งหมด ${allStudents.length} คน)`}
                    </p>
                </div>

                {/* Table card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0">
                                <Users className="w-4 h-4" />
                            </span>
                            รายชื่อนักเรียน
                        </h2>
                        {!isLoading && (
                            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                                {filtered.length} คน
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-semibold">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Users className="w-16 h-16 mb-3 opacity-30" />
                            <p className="font-semibold text-lg">ไม่พบข้อมูลนักเรียน</p>
                            <p className="text-sm mt-1">ลองปรับตัวกรองหรือเพิ่มนักเรียนใหม่</p>
                        </div>
                    ) : (
                        <>
                            {/* Pagination */}
                            {renderPagination()}

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr className="bg-indigo-600 text-white">
                                                <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ลำดับ</th>
                                                <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">รหัส</th>
                                                <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ชื่อ-นามสกุล</th>
                                                <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">เพศ</th>
                                                <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ห้องเรียน</th>
                                                <th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">ครูประจำชั้น</th>
                                                <th className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap">สถานะ</th>
                                                <th className="px-3 py-3 text-center text-sm font-semibold whitespace-nowrap">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginated.map((s, idx) => (
                                                <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-3 text-sm text-gray-500 font-semibold">
                                                        {(currentPage - 1) * recordsPerPage + idx + 1}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm font-semibold whitespace-nowrap">
                                                        {s.studentNumber || '-'}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm">{s.fullName}</td>
                                                    <td className="px-3 py-3 text-sm whitespace-nowrap">{s.genders?.genderName || '-'}</td>
                                                    <td className="px-3 py-3">
                                                        {s.classRoom
                                                            ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">{s.classRoom}</span>
                                                            : <span className="text-gray-400 text-xs">-</span>}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm">{s.teacherName || '-'}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        {s.isDeleted
                                                            ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">ปิดใช้งาน</span>
                                                            : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">ใช้งาน</span>}
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleOpenEdit(s)}
                                                                className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors touch-manipulation border border-amber-200"
                                                                title="แก้ไข"
                                                            >
                                                                <MdModeEdit className="w-4 h-4 flex-shrink-0" />
                                                                <span>แก้ไข</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggle(s)}
                                                                className={`inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-manipulation border ${s.isDeleted ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'}`}
                                                                title={s.isDeleted ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'}
                                                            >
                                                                {s.isDeleted
                                                                    ? <><MdToggleOff className="w-5 h-5 flex-shrink-0" /><span>เปิด</span></>
                                                                    : <><MdToggleOn className="w-5 h-5 flex-shrink-0" /><span>ปิด</span></>}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden p-3 space-y-3">
                                {paginated.map((s, idx) => (
                                    <div
                                        key={s.id}
                                        className={`border rounded-xl p-4 ${s.isDeleted ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-white'}`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                    <span className="text-xs text-gray-400 font-semibold">#{(currentPage - 1) * recordsPerPage + idx + 1}</span>
                                                    {s.studentNumber && <span className="text-xs font-mono font-bold text-blue-600">{s.studentNumber}</span>}
                                                    {s.classRoom && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">{s.classRoom}</span>}
                                                </div>
                                                <p className="font-bold text-gray-800 text-sm truncate">{s.fullName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {s.genders?.genderName || ''}{s.teacherName ? ` • ${s.teacherName}` : ''}
                                                </p>
                                            </div>
                                            {s.isDeleted
                                                ? <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">ปิดใช้งาน</span>
                                                : <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">ใช้งาน</span>}
                                        </div>
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => handleOpenEdit(s)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold transition-colors border border-amber-200"
                                            >
                                                <MdModeEdit size={15} /> แก้ไข
                                            </button>
                                            <button
                                                onClick={() => handleToggle(s)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors border ${s.isDeleted ? 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200' : 'bg-red-50 hover:bg-red-100 text-red-500 border-red-200'}`}
                                            >
                                                {s.isDeleted
                                                    ? <><MdToggleOff size={17} /> เปิดใช้งาน</>
                                                    : <><MdToggleOn size={17} /> ปิดใช้งาน</>}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <StudentFormModal
                isOpen={isModalOpen}
                editingStudent={editingStudent}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSaving={isSaving}
                onClose={() => setIsModalOpen(false)}
                genders={genders}
                classroomsFull={classroomsFull}
            />
            <ImportPreviewModal
                isOpen={importPreviewOpen}
                onClose={() => { setImportPreviewOpen(false); setImportRows([]); }}
                rows={importRows}
                classroomsFull={classroomsFull}
                onConfirm={handleImportConfirm}
                isImporting={isImporting || isImportLoading}
            />
        </div>
    );
};

export default ManageStudent;
