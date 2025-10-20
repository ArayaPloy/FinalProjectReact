import React, { useState, useEffect, useMemo } from 'react';
import { Award, TrendingUp, TrendingDown, Save, RotateCcw, AlertCircle, Info, BookOpen, Users, Calendar } from 'lucide-react';

// Mock data - ในการใช้งานจริงจะดึงจาก API
const mockClassList = ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.3/2'];

const mockStudents = [
    { id: 1, studentId: '66001', fullName: 'ด.ช.สมชาย ใจดี', classRoom: 'ม.1/1', currentScore: 100 },
    { id: 2, studentId: '66002', fullName: 'ด.ญ.สมหญิง รักเรียน', classRoom: 'ม.1/1', currentScore: 95 },
    { id: 3, studentId: '66003', fullName: 'ด.ช.วิชัย มานะดี', classRoom: 'ม.1/1', currentScore: 80 },
    { id: 4, studentId: '66004', fullName: 'ด.ญ.วิภา ขยัน', classRoom: 'ม.1/1', currentScore: 90 },
];

// เกณฑ์การเพิ่มคะแนน
const addScoreCriteria = [
    { id: 1, points: 5, description: 'รักษาความสะอาด/เก็บของที่มีราคาไม่เกิน 50 บาท/ช่วยเหลือครูหรือคนอื่นเสมอ/เป็นตัวแทนเข้าร่วมแข่งขันระดับ ร.ร./อื่น ๆ ที่เทียบเท่า' },
    { id: 2, points: 10, description: 'ช่วยเหลือกิจกรรม ร.ร./เก็บของที่มีราคามากกว่า 50 บาท/ชี้ช่องทางให้ครูรู้แหล่งอบายมุข/เป็นตัวแทนเข้าร่วมแข่งขันระดับอำเภอ/อื่น ๆ ที่เทียบเท่า' },
    { id: 3, points: 20, description: 'เป็นตัวแทนเข้าร่วมแข่งขันต่าง ๆ ระดับจังหวัด/เข้าร่วมประชุม/อบรมสัมมนา/เรียนดีความประพฤติดีอย่างสม่ำเสมอ/อื่น ๆ ที่เทียบเท่า' },
    { id: 4, points: 30, description: 'เป็นตัวแทนเข้าร่วมแข่งขันระดับภาค/เข้าร่วมบริจาคเลือด/อื่น ๆ ที่เทียบเท่า' },
    { id: 5, points: 50, description: 'นำชื่อเสียงมาสู่โรงเรียน' }
];

// เกณฑ์การหักคะแนน
const deductScoreCriteria = [
    { id: 6, points: -5, description: 'มาสาย/แต่งกายผิดระเบียบ/เสียงดัง/ห้องและเขตรับผิดชอบสกปรก/พูดจาหยาบคาย/ทานอาหารในเวลาเรียน/ใส่เครื่องประดับไม่เหมาะสม/ไม่เข้าเรียนตามตาราง/ไม่เดินแถวอย่างเป็นระเบียบ/อื่น ๆ ที่เทียบเท่า' },
    { id: 7, points: -10, description: 'ขาดเรียนเกิน 3 วัน/ออกนอกบริเวณโรงเรียน/ทรงผมไม่เหมาะสม/นำแก้วน้ำออกนอกบริเวณ/ไม่สวมหมวกนิรภัย/อื่น ๆ ที่เทียบเท่า' },
    { id: 8, points: -20, description: 'หนีเรียน/สูบบุหรี่/เล่นการพนัน/ลักขโมย/ทะเลาะวิวาท/ไม่เข้าร่วมกิจกรรม/เที่ยวกลางคืน/อื่น ๆ ที่เทียบเท่า' },
    { id: 9, points: -30, description: 'เสพยาเสพติดอื่น/ทะเลาะวิวาทระหว่างโรงเรียน/พกพาอาวุธ/ชูสาว/นำโทรศัพท์หรือสื่อลามกมาโรงเรียน/ก่าวร้าวครูอาจารย์/อื่น ๆ ที่เทียบเท่า' },
    { id: 10, points: -50, description: 'ซื้อขายยาเสพติด/นำความเสื่อมเสียมาสู่โรงเรียน (พบคณะกรรมการฝ่ายปกครอง)' }
];

const BehaviorScorePage = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [scoreRecords, setScoreRecords] = useState({});
    const [originalScoreRecords, setOriginalScoreRecords] = useState({});
    const [showCriteria, setShowCriteria] = useState(true);

    const filteredStudents = useMemo(() => {
        if (!mockStudents || mockStudents.length === 0) return [];

        let filtered = mockStudents.filter(s => s.classRoom === selectedClass);

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                student =>
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
            if (record && record.points > 0) return sum + record.points;
            return sum;
        }, 0);

        const totalDeducted = Object.values(scoreRecords).reduce((sum, record) => {
            if (record && record.points < 0) return sum + record.points;
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
                return {
                    ...prev,
                    [studentId]: null,
                };
            }

            return {
                ...prev,
                [studentId]: { criteriaId, points, description, comment: '' },
            };
        });
    };

    const handleCommentChange = (studentId, comment) => {
        setScoreRecords((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], comment }
        }));
    };

    const handleReset = () => {
        if (window.confirm('ยืนยันการยกเลิก?\nการเปลี่ยนแปลงทั้งหมดจะถูกยกเลิก')) {
            setScoreRecords({ ...originalScoreRecords });
        }
    };

    const handleSave = () => {
        const records = Object.entries(scoreRecords)
            .filter(([_, record]) => record !== null && record !== undefined)
            .map(([studentId, record]) => ({
                studentId: parseInt(studentId),
                ...record,
            }));

        if (records.length === 0) {
            alert('กรุณาบันทึกคะแนนอย่างน้อย 1 คน');
            return;
        }

        const notRecordedCount = filteredStudents.length - records.length;
        const warningText = notRecordedCount > 0
            ? `\n⚠️ ยังมี ${notRecordedCount} คนที่ยังไม่ได้บันทึก`
            : '';

        if (window.confirm(`ยืนยันการบันทึก?\nจะบันทึกคะแนนความประพฤติ\n${records.length} คน\nวันที่ ${selectedDate}\nห้อง ${selectedClass}${warningText}`)) {
            alert('บันทึกสำเร็จ!\nบันทึกข้อมูลคะแนนความประพฤติเรียบร้อยแล้ว');
            setOriginalScoreRecords({ ...scoreRecords });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-purple-600">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Award className="w-8 h-8" />
                                </div>
                                ระบบบันทึกคะแนนความประพฤตินักเรียน
                            </h1>
                            <p className="text-gray-600 mt-2 ml-1">โรงเรียนท่าบ่อพิทยาคม</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                วันที่บันทึก
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                เลือกห้องเรียน
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {mockClassList.map((cls) => (
                                    <option key={cls} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="bi bi-search inline mr-1"></i>
                                ค้นหานักเรียน
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ชื่อ หรือ รหัสนักเรียน"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* เกณฑ์การให้คะแนน */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <button
                        onClick={() => setShowCriteria(!showCriteria)}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                            เกณฑ์การให้คะแนนความประพฤติ
                        </h2>
                        <i className={`bi bi-chevron-${showCriteria ? 'up' : 'down'} text-xl text-gray-600`}></i>
                    </button>

                    {showCriteria && (
                        <div className="mt-4 space-y-4">
                            {/* เกณฑ์การเพิ่มคะแนน */}
                            <div>
                                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    เกณฑ์การเพิ่มคะแนน
                                </h3>
                                <div className="space-y-2">
                                    {addScoreCriteria.map((criteria) => (
                                        <div key={criteria.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-start gap-3">
                                                <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm min-w-[60px] text-center">
                                                    +{criteria.points}
                                                </span>
                                                <p className="text-sm text-gray-700 flex-1">{criteria.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* เกณฑ์การหักคะแนน */}
                            <div>
                                <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5" />
                                    เกณฑ์การหักคะแนน
                                </h3>
                                <div className="space-y-2">
                                    {deductScoreCriteria.map((criteria) => (
                                        <div key={criteria.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <div className="flex items-start gap-3">
                                                <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm min-w-[60px] text-center">
                                                    {criteria.points}
                                                </span>
                                                <p className="text-sm text-gray-700 flex-1">{criteria.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* คำแนะนำ */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    วิธีการบันทึกคะแนน
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                                    <li>เลือกห้องเรียนและวันที่ที่ต้องการบันทึก</li>
                                    <li>คลิกที่ปุ่มคะแนนที่ตรงกับพฤติกรรมของนักเรียน</li>
                                    <li>กรอกรายละเอียดเพิ่มเติม เช่น "วัน เดือน พ.ศ. (คาบ/วิชา) นักเรียน... (เหตุผลที่เพิ่ม/หัก)"</li>
                                    <li>ตัวอย่าง: "7 เม.ย.66 (คาบ PBL) นักเรียนเก็บเงินได้ 100 บาท"</li>
                                    <li>คลิกปุ่ม "บันทึกข้อมูล" เพื่อบันทึก</li>
                                </ol>
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                {filteredStudents.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">นักเรียนทั้งหมด</div>
                                <div className="text-2xl font-bold text-purple-600">{scoreStats.total}</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">บันทึกแล้ว</div>
                                <div className="text-2xl font-bold text-blue-600">{scoreStats.recorded}</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">ยังไม่บันทึก</div>
                                <div className="text-2xl font-bold text-orange-600">{scoreStats.notRecorded}</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">คะแนนที่เพิ่ม</div>
                                <div className="text-2xl font-bold text-green-600">+{scoreStats.totalAdded}</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">คะแนนที่หัก</div>
                                <div className="text-2xl font-bold text-red-600">{scoreStats.totalDeducted}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student List */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                                <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">ไม่พบรายชื่อนักเรียน</p>
                            <p className="text-gray-400 text-sm mt-1">กรุณาเลือกห้องเรียนหรือตรวจสอบคำค้นหา</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredStudents.map((student, index) => {
                                const record = scoreRecords[student.id];
                                const isSelected = record !== null && record !== undefined;

                                return (
                                    <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        {/* Student Info */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 text-purple-700 font-bold w-10 h-10 rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">{student.fullName}</div>
                                                    <div className="text-sm text-gray-500">รหัส: {student.studentId}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">คะแนนปัจจุบัน</div>
                                                <div className="text-xl font-bold text-gray-800">{student.currentScore}</div>
                                            </div>
                                        </div>

                                        {/* Score Buttons */}
                                        <div className="mb-3">
                                            <div className="text-sm font-semibold text-gray-700 mb-2">เพิ่มคะแนน:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {addScoreCriteria.map((criteria) => (
                                                    <button
                                                        key={criteria.id}
                                                        onClick={() => handleScoreChange(student.id, criteria.id, criteria.points, criteria.description)}
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${record?.criteriaId === criteria.id
                                                                ? 'bg-green-600 text-white shadow-md'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                    >
                                                        +{criteria.points}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="text-sm font-semibold text-gray-700 mb-2">หักคะแนน:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {deductScoreCriteria.map((criteria) => (
                                                    <button
                                                        key={criteria.id}
                                                        onClick={() => handleScoreChange(student.id, criteria.id, criteria.points, criteria.description)}
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${record?.criteriaId === criteria.id
                                                                ? 'bg-red-600 text-white shadow-md'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            }`}
                                                    >
                                                        {criteria.points}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comment Field */}
                                        {isSelected && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={record?.comment || ''}
                                                    onChange={(e) => handleCommentChange(student.id, e.target.value)}
                                                    placeholder="ตัวอย่าง: 7 เม.ย.66 (คาบ PBL) นักเรียนเก็บเงินได้ 100 บาท"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    rows="2"
                                                />
                                                {isSelected && (
                                                    <div className="mt-2 text-sm">
                                                        <span className={`font-semibold ${record.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {record.points > 0 ? '+' : ''}{record.points} คะแนน:
                                                        </span>
                                                        <span className="text-gray-600 ml-2">{record.description}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={filteredStudents.length === 0 || !hasChanges}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Save className="w-5 h-5" />
                                บันทึกข้อมูล
                            </button>

                            <button
                                onClick={handleReset}
                                disabled={!hasChanges}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <RotateCcw className="w-5 h-5" />
                                ยกเลิก
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