import React, { useState, useEffect, useMemo } from 'react';
import { Award, TrendingUp, TrendingDown, Save, RotateCcw, AlertCircle, Info, BookOpen, Users, CheckCircle } from 'lucide-react';

const mockClassList = ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.3/2'];

const mockStudents = [
    { id: 1, studentId: '66001', fullName: 'ด.ช.สมชาย ใจดี', classRoom: 'ม.1/1', currentScore: 100 },
    { id: 2, studentId: '66002', fullName: 'ด.ญ.สมหญิง รักเรียน', classRoom: 'ม.1/1', currentScore: 95 },
    { id: 3, studentId: '66003', fullName: 'ด.ช.วิชัย มานะดี', classRoom: 'ม.1/1', currentScore: 80 },
    { id: 4, studentId: '66004', fullName: 'ด.ญ.วิภา ขยัน', classRoom: 'ม.1/1', currentScore: 90 },
    { id: 5, studentId: '66005', fullName: 'ด.ช.สมศักดิ์ เรียนดี', classRoom: 'ม.1/1', currentScore: 85 },
    { id: 6, studentId: '66006', fullName: 'ด.ญ.สุดา มีมารยาท', classRoom: 'ม.1/1', currentScore: 92 },
];

const addScoreCriteria = [
    { id: 1, points: 5, description: 'รักษาความสะอาด/เก็บของที่มีราคาไม่เกิน 50 บาท/ช่วยเหลือครูหรือคนอื่นเสมอ/เป็นตัวแทนเข้าร่วมแข่งขันระดับ ร.ร.' },
    { id: 2, points: 10, description: 'ช่วยเหลือกิจกรรม ร.ร./เก็บของที่มีราคามากกว่า 50 บาท/เป็นตัวแทนเข้าร่วมแข่งขันระดับอำเภอ' },
    { id: 3, points: 20, description: 'เป็นตัวแทนเข้าร่วมแข่งขันต่าง ๆ ระดับจังหวัด/เข้าร่วมประชุม/อบรมสัมมนา/เรียนดีความประพฤติดีอย่างสม่ำเสมอ' },
    { id: 4, points: 30, description: 'เป็นตัวแทนเข้าร่วมแข่งขันระดับภาค/เข้าร่วมบริจาคเลือด' },
    { id: 5, points: 50, description: 'นำชื่อเสียงมาสู่โรงเรียน' }
];

const deductScoreCriteria = [
    { id: 6, points: -5, description: 'มาสาย/แต่งกายผิดระเบียบ/เสียงดัง/ห้องสกปรก/พูดจาหยาบคาย/ทานอาหารในเวลาเรียน' },
    { id: 7, points: -10, description: 'ขาดเรียนเกิน 3 วัน/ออกนอกบริเวณโรงเรียน/ทรงผมไม่เหมาะสม/ไม่สวมหมวกนิรภัย' },
    { id: 8, points: -20, description: 'หนีเรียน/สูบบุหรี่/เล่นการพนัน/ลักขโมย/ทะเลาะวิวาท/ไม่เข้าร่วมกิจกรรม/เที่ยวกลางคืน' },
    { id: 9, points: -30, description: 'เสพยาเสพติด/ทะเลาะวิวาทระหว่างโรงเรียน/พกพาอาวุธ/นำโทรศัพท์หรือสื่อลามกมาโรงเรียน/ก่าวร้าวครูอาจารย์' },
    { id: 10, points: -50, description: 'ซื้อขายยาเสพติด/นำความเสื่อมเสียมาสู่โรงเรียน' }
];

const BehaviorScorePage = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [scoreRecords, setScoreRecords] = useState({});
    const [originalScoreRecords, setOriginalScoreRecords] = useState({});
    const [showCriteria, setShowCriteria] = useState(true);
    const [bulkScoreMode, setBulkScoreMode] = useState(false);
    const [bulkCriteria, setBulkCriteria] = useState(null);
    const [bulkComment, setBulkComment] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    const filteredStudents = useMemo(() => {
        if (!mockStudents || mockStudents.length === 0) return [];
        let filtered = mockStudents.filter(s => s.classRoom === selectedClass);
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(student =>
                student.fullName?.toLowerCase().includes(query) ||
                student.studentId?.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [selectedClass, searchQuery]);

    const scoreStats = useMemo(() => {
        const total = filteredStudents.length;
        const recorded = filteredStudents.filter(student =>
            scoreRecords[student.id] !== null && scoreRecords[student.id] !== undefined
        ).length;
        const notRecorded = total - recorded;
        const totalAdded = Object.values(scoreRecords).reduce((sum, record) => {
            if (record && record.points && record.points > 0) return sum + record.points;
            return sum;
        }, 0);
        const totalDeducted = Object.values(scoreRecords).reduce((sum, record) => {
            if (record && record.points && record.points < 0) return sum + record.points;
            return sum;
        }, 0);
        return { total, recorded, notRecorded, totalAdded, totalDeducted };
    }, [filteredStudents, scoreRecords]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(scoreRecords) !== JSON.stringify(originalScoreRecords);
    }, [scoreRecords, originalScoreRecords]);

    useEffect(() => {
        if (mockClassList.length > 0 && !selectedClass) {
            setSelectedClass(mockClassList[0]);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (filteredStudents.length === 0) return;
        const defaultRecords = {};
        filteredStudents.forEach((student) => {
            defaultRecords[student.id] = null;
        });
        setScoreRecords(defaultRecords);
        setOriginalScoreRecords(defaultRecords);
    }, [selectedClass, filteredStudents.length]);

    const handleScoreChange = (studentId, criteriaId, points, description) => {
        setScoreRecords((prev) => {
            if (prev[studentId]?.criteriaId === criteriaId) {
                return { ...prev, [studentId]: null };
            }
            return { ...prev, [studentId]: { criteriaId, points, description, comment: '' } };
        });
    };

    const handleCommentChange = (studentId, comment) => {
        setScoreRecords((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], comment }
        }));
    };

    const handleToggleStudent = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            }
            return [...prev, studentId];
        });
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };

    const handleBulkScoreChange = (criteriaId, points, description) => {
        setBulkCriteria({ criteriaId, points, description });
    };

    const handleApplyBulkScore = () => {
        if (!bulkCriteria || selectedStudents.length === 0 || !bulkComment.trim()) {
            alert('กรุณาเลือกคะแนน เลือกนักเรียน และกรอกเหตุผล');
            return;
        }
        const newRecords = { ...scoreRecords };
        selectedStudents.forEach(studentId => {
            newRecords[studentId] = { ...bulkCriteria, comment: bulkComment };
        });
        setScoreRecords(newRecords);
        setBulkScoreMode(false);
        setSelectedStudents([]);
        setBulkCriteria(null);
        setBulkComment('');
        alert('บันทึกคะแนนสำเร็จ');
    };

    const handleCancelBulk = () => {
        setBulkScoreMode(false);
        setSelectedStudents([]);
        setBulkCriteria(null);
        setBulkComment('');
    };

    const handleReset = () => {
        if (window.confirm('ยืนยันการยกเลิก?')) {
            setScoreRecords({ ...originalScoreRecords });
        }
    };

    const handleSave = () => {
        const records = Object.entries(scoreRecords)
            .filter(([_, record]) => record !== null)
            .map(([studentId, record]) => ({ studentId: parseInt(studentId), ...record }));
        if (records.length === 0) {
            alert('กรุณาบันทึกคะแนนอย่างน้อย 1 คน');
            return;
        }
        if (window.confirm(`ยืนยันการบันทึก ${records.length} คน?`)) {
            alert('บันทึกสำเร็จ');
            setOriginalScoreRecords({ ...scoreRecords });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-12">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-purple-600">
                    <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-3">
                        <Award className="w-8 h-8" />
                        ระบบบันทึกคะแนนความประพฤตินักเรียน
                    </h1>
                    <p className="text-gray-600 mt-2">โรงเรียนท่าบ่อพิทยาคม</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">เลือกห้องเรียน</label>
                            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg">
                                {mockClassList.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">ค้นหานักเรียน</label>
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ชื่อ หรือ รหัสนักเรียน" className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <button onClick={() => setShowCriteria(!showCriteria)} className="flex items-center justify-between w-full">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                            เกณฑ์การให้คะแนนความประพฤติ
                        </h2>
                        <span className="text-2xl">{showCriteria ? '−' : '+'}</span>
                    </button>
                    {showCriteria && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />เกณฑ์การเพิ่มคะแนน
                                </h3>
                                {addScoreCriteria.map((c) => (
                                    <div key={c.id} className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm">+{c.points}</span>
                                        <p className="text-sm mt-2">{c.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5" />เกณฑ์การหักคะแนน
                                </h3>
                                {deductScoreCriteria.map((c) => (
                                    <div key={c.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">{c.points}</span>
                                        <p className="text-sm mt-2">{c.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {filteredStudents.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">สถิติของห้องเรียน</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600">นักเรียนทั้งหมด</div>
                                <div className="text-2xl font-bold text-purple-600">{scoreStats.total}</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600">บันทึกแล้ว</div>
                                <div className="text-2xl font-bold text-blue-600">{scoreStats.recorded}</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600">ยังไม่บันทึก</div>
                                <div className="text-2xl font-bold text-orange-600">{scoreStats.notRecorded}</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600">คะแนนที่เพิ่ม</div>
                                <div className="text-2xl font-bold text-green-600">+{scoreStats.totalAdded}</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600">คะแนนที่หัก</div>
                                <div className="text-2xl font-bold text-red-600">{scoreStats.totalDeducted}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800">โหมดบันทึกกลุ่ม</h3>
                            <p className="text-sm text-gray-600">เลือกนักเรียนหลายคนเพื่อบันทึกคะแนนพร้อมกัน</p>
                        </div>
                        <button onClick={() => setBulkScoreMode(!bulkScoreMode)}
                            className={`px-6 py-2 rounded-lg font-semibold ${bulkScoreMode ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {bulkScoreMode ? 'ปิดโหมดกลุ่ม' : 'เปิดโหมดกลุ่ม'}
                        </button>
                    </div>
                </div>

                {bulkScoreMode && (
                    <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-purple-700 mb-4">
                            บันทึกคะแนนกลุ่ม ({selectedStudents.length} คน)
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">เลือกคะแนน:</label>
                                <div className="grid grid-cols-5 gap-2 mb-2">
                                    {addScoreCriteria.map((c) => (
                                        <button key={c.id} onClick={() => handleBulkScoreChange(c.id, c.points, c.description)}
                                            className={`px-4 py-2 rounded-lg font-semibold ${bulkCriteria?.criteriaId === c.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                            +{c.points}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {deductScoreCriteria.map((c) => (
                                        <button key={c.id} onClick={() => handleBulkScoreChange(c.id, c.points, c.description)}
                                            className={`px-4 py-2 rounded-lg font-semibold ${bulkCriteria?.criteriaId === c.id ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>
                                            {c.points}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {bulkCriteria && (
                                <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                                    <span className={`px-3 py-1 rounded-lg font-bold ${bulkCriteria.points > 0 ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                                        {bulkCriteria.points > 0 ? '+' : ''}{bulkCriteria.points}
                                    </span>
                                    <p className="text-sm mt-2">{bulkCriteria.description}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold mb-2">เหตุผล/รายละเอียด</label>
                                <textarea value={bulkComment} onChange={(e) => setBulkComment(e.target.value)}
                                    placeholder="ตัวอย่าง: 7 เม.ย.66 (คาบ PBL) นักเรียนช่วยเหลืองานกิจกรรม"
                                    className="w-full px-3 py-2 border rounded-lg" rows="3" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleApplyBulkScore} disabled={!bulkCriteria || selectedStudents.length === 0}
                                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">
                                    บันทึกคะแนนกลุ่ม ({selectedStudents.length} คน)
                                </button>
                                <button onClick={handleCancelBulk} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold">
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {bulkScoreMode && filteredStudents.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <button onClick={handleSelectAll} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
                            {selectedStudents.length === filteredStudents.length ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">ไม่พบรายชื่อนักเรียน</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredStudents.map((student, index) => {
                                const record = scoreRecords[student.id];
                                const isSelected = record !== null;
                                const isChecked = selectedStudents.includes(student.id);
                                return (
                                    <div key={student.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {bulkScoreMode && (
                                                    <input type="checkbox" checked={isChecked}
                                                        onChange={() => handleToggleStudent(student.id)}
                                                        className="w-5 h-5" />
                                                )}
                                                <div className="bg-purple-100 text-purple-700 font-bold w-10 h-10 rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{student.fullName}</div>
                                                    <div className="text-sm text-gray-500">รหัส: {student.studentId}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">คะแนนปัจจุบัน</div>
                                                <div className="text-xl font-bold">{student.currentScore}</div>
                                            </div>
                                        </div>
                                        {!bulkScoreMode && (
                                            <>
                                                <div className="mb-3">
                                                    <div className="text-sm font-semibold mb-2">เพิ่มคะแนน:</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {addScoreCriteria.map((c) => (
                                                            <button key={c.id}
                                                                onClick={() => handleScoreChange(student.id, c.id, c.points, c.description)}
                                                                className={`px-4 py-2 rounded-lg font-semibold ${record?.criteriaId === c.id ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                                                +{c.points}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="text-sm font-semibold mb-2">หักคะแนน:</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {deductScoreCriteria.map((c) => (
                                                            <button key={c.id}
                                                                onClick={() => handleScoreChange(student.id, c.id, c.points, c.description)}
                                                                className={`px-4 py-2 rounded-lg font-semibold ${record?.criteriaId === c.id ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>
                                                                {c.points}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <label className="block text-sm font-semibold mb-2">รายละเอียดเพิ่มเติม</label>
                                                        <textarea value={record?.comment || ''}
                                                            onChange={(e) => handleCommentChange(student.id, e.target.value)}
                                                            placeholder="ตัวอย่าง: 7 เม.ย.66 (คาบ PBL) นักเรียนเก็บเงินได้ 100 บาท"
                                                            className="w-full px-3 py-2 border rounded-lg" rows="2" />
                                                        {record && record.points && (
                                                            <div className="mt-2 text-sm">
                                                                <span className={`font-semibold ${record.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {record.points > 0 ? '+' : ''}{record.points} คะแนน:
                                                                </span>
                                                                <span className="ml-2">{record.description}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={handleSave} disabled={!hasChanges}
                                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2">
                                <Save className="w-5 h-5" />บันทึกข้อมูล
                            </button>
                            <button onClick={handleReset} disabled={!hasChanges}
                                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2">
                                <RotateCcw className="w-5 h-5" />ยกเลิก
                            </button>
                        </div>
                        {hasChanges && (
                            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                <span className="text-sm font-semibold text-orange-700">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BehaviorScorePage;