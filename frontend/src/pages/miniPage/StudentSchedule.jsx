import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetScheduleQuery, useGetClassesQuery } from '../../services/classScheduleApi';
import { useGetAcademicYearsQuery } from '../../services/academicApi';

// ============================================================
//  ตารางเรียนนักเรียน — เชื่อมต่อ API จริง
// ============================================================

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

// สีแถบหัวคอลัมน์ (gradient)
const DAY_COLOR_BAR = {
    'จันทร์':    'from-yellow-400 to-yellow-500',
    'อังคาร':    'from-pink-400   to-rose-500',
    'พุธ':       'from-green-400  to-emerald-500',
    'พฤหัสบดี': 'from-orange-400 to-amber-500',
    'ศุกร์':     'from-blue-400   to-indigo-500',
};

// สีพื้นหลังเซลล์
const DAY_CELL_BG = {
    'จันทร์':    'bg-yellow-50  border-yellow-100',
    'อังคาร':    'bg-pink-50    border-pink-100',
    'พุธ':       'bg-green-50   border-emerald-100',
    'พฤหัสบดี': 'bg-orange-50  border-amber-100',
    'ศุกร์':     'bg-blue-50    border-blue-100',
};

// ── Modal รายละเอียดวิชา ───────────────────────────────────
const SubjectModal = ({ cell, onClose }) => {
    if (!cell) return null;
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                    <InfoRow label="ชื่อวิชา" value={cell.subjectName} />
                    {cell.subjectDescription && (
                        <InfoRow label="คำอธิบายรายวิชา" value={cell.subjectDescription} />
                    )}
                    <InfoRow
                        label="ครูผู้สอน"
                        value={cell.teacherName || <span className="text-gray-400 italic text-sm">ยังไม่มีครูผู้สอน</span>}
                    />
                    <InfoRow label="ห้องเรียน" value={cell.room || '—'} />
                    {cell.building && (
                        <InfoRow label="ตึกเรียน" value={cell.building} />
                    )}
                    {cell.subjectDepartment && (
                        <InfoRow label="กลุ่มสาระ" value={cell.subjectDepartment} />
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

const InfoRow = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-gray-800 font-medium text-sm">{value ?? '—'}</p>
    </div>
);

// ── Helper: ตัดคำนำหน้าออก เหลือแค่ firstName ─────────────
const extractFirstName = (fullName) => {
    if (!fullName) return null;
    const stripped = fullName.replace(/^(นางสาว|นาง|นาย|เด็กชาย|เด็กหญิง)/, '').trim();
    return stripped.split(' ')[0] || stripped;
};

// ── ScheduleCell ───────────────────────────────────────────
const ScheduleCell = ({ cell, onSubjectClick, onTeacherClick }) => {
    if (!cell) {
        return (
            <div className="h-[72px] flex items-center justify-center">
                <span className="text-gray-300 text-base">—</span>
            </div>
        );
    }
    const firstName = extractFirstName(cell.teacherName);
    return (
        <div className="h-[72px] flex flex-col items-center justify-center gap-1 px-2 py-2">
            <button
                onClick={() => onSubjectClick(cell)}
                className="text-indigo-700 font-extrabold text-sm sm:text-base hover:text-indigo-900 hover:underline text-center leading-tight transition-colors"
                title="คลิกดูรายละเอียดวิชา"
            >
                {cell.subjectCode}
            </button>
            {firstName ? (
                <button
                    onClick={() => onTeacherClick(cell)}
                    className="text-gray-600 text-xs sm:text-sm font-medium hover:text-indigo-600 hover:underline text-center leading-tight transition-colors"
                    title={`ดูข้อมูลครู ${cell.teacherName}`}
                >
                    {firstName}
                </button>
            ) : (
                <span className="text-gray-400 text-xs italic">—</span>
            )}
        </div>
    );
};

// ── Empty / Loading helpers ────────────────────────────────
const EmptyState = ({ icon, text, sub }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-dashed border-amber-200 p-12 text-center">
        <div className="text-5xl mb-3">{icon}</div>
        <p className="text-gray-500 font-medium">{text}</p>
        {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
    </div>
);

const LoadingState = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 text-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">กำลังโหลดตารางเรียน...</p>
    </div>
);

// ── Main Component ─────────────────────────────────────────
const StudentSchedulePage = () => {
    const navigate = useNavigate();

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSemesterId, setSelectedSemesterId] = useState('');
    const [subjectPopup, setSubjectPopup] = useState(null);

    // Fetch
    const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
    const { data: academicData } = useGetAcademicYearsQuery();
    const { data: scheduleData, isLoading: scheduleLoading, isFetching } = useGetScheduleQuery(
        { className: selectedClass, semesterId: selectedSemesterId },
        { skip: !selectedClass }
    );

    // สร้าง list semester จาก academic years
    const allSemesters = useMemo(() => {
        const src = Array.isArray(academicData) ? academicData : academicData?.data || [];
        const list = [];
        for (const year of src) {
            for (const sem of year.semesters || []) {
                list.push({
                    id: sem.id,
                    label: `ปี ${year.year} เทอม ${sem.semesterNumber}`,
                    isCurrent: sem.isCurrent,
                });
            }
        }
        return list;
    }, [academicData]);

    // Auto-select: ห้องแรก + ภาคเรียนปัจจุบัน
    useEffect(() => {
        const classes = classesData?.data || classesData || [];
        if (Array.isArray(classes) && classes.length && !selectedClass) {
            setSelectedClass(classes[0].className);
        }
    }, [classesData, selectedClass]);

    useEffect(() => {
        if (allSemesters.length && !selectedSemesterId) {
            const current = allSemesters.find((s) => s.isCurrent);
            if (current) setSelectedSemesterId(String(current.id));
        }
    }, [allSemesters, selectedSemesterId]);

    // Schedule data
    const schedule = scheduleData?.data?.schedule || {};
    const rawMaxPeriod = scheduleData?.data?.maxPeriod || 7;
    const maxPeriod = Math.max(rawMaxPeriod, 7);
    const periods = Array.from({ length: maxPeriod }, (_, i) => i + 1);

    const classesList = classesData?.data || (Array.isArray(classesData) ? classesData : []);

    const handleSubjectClick = (cell) => setSubjectPopup(cell);

    const handleTeacherClick = (cell) => {
        if (!cell?.teacherName) return;
        const firstName = cell.teacherName.trim().split(' ')[0] || cell.teacherName;
        navigate(
            `/faculty-staff?search=${encodeURIComponent(firstName)}${cell.teacherId ? `&teacherId=${cell.teacherId}` : ''}`
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-12">
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-8 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold drop-shadow">📅 ตารางเรียนนักเรียน</h1>
                    <p className="text-amber-100 mt-1 text-sm">โรงเรียนท่าบ่อพิทยาคม</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-6 space-y-4">

                {/* ── Selectors ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row gap-4">

                        {/* ห้องเรียน */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                🏫 ห้องเรียน
                            </label>
                            {classesLoading ? (
                                <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                            ) : (
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full border-2 border-amber-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white cursor-pointer transition-all"
                                >
                                    <option value="">— เลือกห้องเรียน —</option>
                                    {classesList.map((c) => (
                                        <option key={c.id} value={c.className}>
                                            ม.{c.className}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* ภาคเรียน */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                📆 ภาคเรียน
                            </label>
                            <select
                                value={selectedSemesterId}
                                onChange={(e) => setSelectedSemesterId(e.target.value)}
                                className="w-full border-2 border-amber-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white cursor-pointer transition-all"
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
                    <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl px-5 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-xs font-medium">ตารางเรียนชั้น</p>
                            <p className="text-white text-xl font-bold">มัธยมศึกษาปีที่ {selectedClass}</p>
                        </div>
                        {(scheduleLoading || isFetching) && (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                )}

                {/* ── Content ── */}
                {!selectedClass ? (
                    <EmptyState icon="📚" text="กรุณาเลือกห้องเรียนเพื่อดูตารางสอน" />
                ) : scheduleLoading ? (
                    <LoadingState />
                ) : Object.keys(schedule).length === 0 ? (
                    <EmptyState
                        icon="🗓️"
                        text="ยังไม่มีข้อมูลตารางเรียนของห้องนี้"
                        sub="ผู้ดูแลระบบสามารถเพิ่มข้อมูลตารางเรียนได้ที่แผงควบคุม"
                    />
                ) : (
                    <>
                        {/* ── Desktop Table — วันเป็นแถว (Y), คาบเป็นคอลัมน์ (X) ── */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse" style={{ minWidth: `${120 + periods.length * 120 + 80}px` }}>
                                    <thead>
                                        <tr className="border-b-2 border-amber-200 bg-amber-50">
                                            {/* มุมซ้ายบน */}
                                            <th className="w-32 border-r-2 border-amber-200 px-4 py-4 text-sm font-bold text-amber-700 text-center bg-amber-100 sticky left-0 z-10">
                                                วัน / คาบ
                                            </th>
                                            {periods.map((period) => (
                                                <React.Fragment key={period}>
                                                    {period === 5 && (
                                                        <th className="w-16 border-r border-lime-300 px-1 py-4 bg-lime-50 text-center align-middle">
                                                            <div className="flex flex-col items-center justify-center gap-0.5">
                                                                <span className="text-lg">🍽️</span>
                                                                <span className="text-lime-700 font-bold text-[11px] leading-tight">พัก</span>
                                                                <span className="text-lime-700 font-bold text-[11px] leading-tight">เที่ยง</span>
                                                            </div>
                                                        </th>
                                                    )}
                                                    <th className="min-w-[120px] border-r border-amber-100 px-2 py-4 text-center bg-amber-50">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="text-xs text-amber-600 font-semibold">คาบที่</span>
                                                            <span className="text-xl font-extrabold text-amber-600">{period}</span>
                                                        </div>
                                                    </th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DAYS.map((day, idx) => (
                                            <tr
                                                key={day}
                                                className={`border-b border-gray-100 transition-colors hover:brightness-95 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                                            >
                                                {/* หัวแถว — วัน */}
                                                <td className="border-r-2 border-amber-200 px-3 py-2 text-center bg-amber-50 sticky left-0 z-10">
                                                    <span className={`inline-block w-full bg-gradient-to-br ${DAY_COLOR_BAR[day]} text-white px-2 py-2 rounded-xl text-sm font-bold shadow-sm`}>
                                                        {day}
                                                    </span>
                                                </td>
                                                {/* เซลล์แต่ละคาบ */}
                                                {periods.map((period) => {
                                                    const cell = schedule[day]?.[period] || null;
                                                    return (
                                                        <React.Fragment key={period}>
                                                            {period === 5 && (
                                                                <td className="border-r border-lime-300 bg-lime-50/60" />
                                                            )}
                                                            <td className={`border-r border-gray-100 align-middle p-0 ${cell ? DAY_CELL_BG[day] : ''}`}>
                                                                <ScheduleCell
                                                                    cell={cell}
                                                                    onSubjectClick={handleSubjectClick}
                                                                    onTeacherClick={handleTeacherClick}
                                                                />
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

                        {/* ── Mobile Cards ── */}
                        <div className="md:hidden space-y-3">
                            {DAYS.map((day) => {
                                const daySchedule = schedule[day] || {};
                                const hasCells = Object.values(daySchedule).some(Boolean);
                                return (
                                    <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        {/* หัวการ์ดวัน */}
                                        <div className={`bg-gradient-to-r ${DAY_COLOR_BAR[day]} px-4 py-3 flex items-center gap-2`}>
                                            <span className="text-white font-extrabold text-lg">วัน{day}</span>
                                            <span className="text-white/70 text-sm font-normal ml-auto">{Object.keys(daySchedule).length} คาบ</span>
                                        </div>

                                        {!hasCells ? (
                                            <div className="px-4 py-5 text-gray-400 text-sm text-center">
                                                — ไม่มีคาบเรียน —
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {periods.map((period) => {
                                                    const cell = daySchedule[period];
                                                    return (
                                                        <React.Fragment key={period}>
                                                            {period === 5 && (
                                                                <div className="bg-lime-50 px-4 py-2.5 flex items-center gap-2">
                                                                    <span className="text-lg">🍽️</span>
                                                                    <span className="text-lime-700 text-sm font-semibold">พักเที่ยง</span>
                                                                </div>
                                                            )}
                                                            <div className={`flex items-center gap-3 px-4 py-3 ${cell ? DAY_CELL_BG[day] : ''}`}>
                                                                {/* เลขคาบ */}
                                                                <div className="flex-shrink-0 w-14 h-14 bg-white/70 border-2 border-amber-200 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                                                                    <span className="text-amber-500 text-[10px] font-semibold leading-none">คาบที่</span>
                                                                    <span className="text-amber-700 font-extrabold text-2xl leading-tight">{period}</span>
                                                                </div>

                                                                {/* รายวิชา */}
                                                                <div className="flex-1 min-w-0">
                                                                    {cell ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleSubjectClick(cell)}
                                                                                className="text-indigo-700 font-extrabold text-base hover:underline hover:text-indigo-900 leading-tight block transition-colors"
                                                                            >
                                                                                {cell.subjectCode}
                                                                            </button>
                                                                            {cell.subjectName && (
                                                                                <p className="text-gray-500 text-xs mt-0.5 truncate">{cell.subjectName}</p>
                                                                            )}
                                                                            {cell.teacherName ? (
                                                                                <button
                                                                                    onClick={() => handleTeacherClick(cell)}
                                                                                    className="text-gray-700 text-sm font-medium hover:text-indigo-600 hover:underline mt-1 flex items-center gap-1 transition-colors"
                                                                                >
                                                                                    <span className="text-base">👩‍🏫</span>
                                                                                    <span>{extractFirstName(cell.teacherName)}</span>
                                                                                </button>
                                                                            ) : (
                                                                                <span className="text-gray-400 text-xs italic mt-1 block">ยังไม่มีครูผู้สอน</span>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-gray-400 text-sm italic">— ว่าง —</span>
                                                                    )}
                                                                </div>

                                                                {/* ห้อง */}
                                                                {cell?.room && (
                                                                    <span className="flex-shrink-0 text-xs text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm">
                                                                        🏫 {cell.room}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── หมายเหตุ ── */}
                        <div className="bg-white border border-amber-100 rounded-2xl px-4 py-3 flex flex-wrap gap-4 text-sm text-gray-600 shadow-sm">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-3 rounded bg-indigo-600"></span>
                                <strong className="text-indigo-700">รหัสวิชา</strong> — กดเพื่อดูรายละเอียด
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-base">👩‍🏫</span>
                                <strong className="text-gray-700">ชื่อครู</strong> — กดเพื่อดูข้อมูลครูผู้สอน
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Subject Detail Modal */}
            <SubjectModal cell={subjectPopup} onClose={() => setSubjectPopup(null)} />
        </div>
    );
};

export default StudentSchedulePage;
