import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoChevronDown, IoCalendar, IoTime, IoImage, IoChevronBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import m1_1Img from '../../assets/images/1t.jpg';
import m1_2Img from '../../assets/images/1-2t.jpg';
import m2Img from '../../assets/images/2t.jpg';
import m3_1Img from '../../assets/images/3t.jpg';
import m3_2Img from '../../assets/images/3-2t.jpg';
import m4Img from '../../assets/images/4t.jpg';
import m5Img from '../../assets/images/5t.jpg';
import m6Img from '../../assets/images/6t.jpg';

const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
const periods = ['คาบที่ 1', 'คาบที่ 2', 'คาบที่ 3', 'คาบที่ 4', 'พักเที่ยง', 'คาบที่ 5', 'คาบที่ 6', 'คาบที่ 7'];

const classSchedule = {
    '1/1': {
        image: m1_1Img,
        schedule: {
            'จันทร์': ['ภาษาจีน', 'ภาษาจีน', 'ว21102 จิรนันท์', 'ว21102 จิรนันท์', '', 'อ22102 อุบล', 'ส22102 พรศิริ', 'ส20232 ธนพร'],
            'อังคาร': ['ค21202 เกษร', 'ส21103 ธนพร', 'อ21102 อุบล', 'ศ21102 ศุภชัย', '', 'อ21102 อุบล', 'ท21102 พรศิริ', 'แนะแนว วิไลลักษณ์'],
            'พุธ': ['ส21103 ธนพร', 'ค21102 เกษร', 'ท21102 พรศิริ', 'ศ21103 ทวีศักดิ์', '', 'ส20236 ศรีกัญญา', 'ว21102 จิรนันท์', 'สส/นน'],
            'พฤหัสบดี': ['ส21103 ธนพร', 'ค21102 เกษร', 'พ21104 ทวีศักดิ์', 'ว22104 สุรางคนา คอมฯ', '', 'ส21104 ศรีกัญญา', 'อ21102 อุบล', 'ชุมนุม'],
            'ศุกร์': ['ค21102 เกษร', 'อ21102 อุบล', 'ท21102 พรศิริ', 'ศ21102 ศุภชัย', '', 'PBL พรศิริ', 'PBL พรศิริ', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '1/2': {
        image: m1_2Img,
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '2/1': {
        image: m2Img,
        schedule: {
            'จันทร์': ['ว21102 จิรนันท์', 'ว21102 จิรนันท์', 'ค22102 ณัฐวุฒิ', 'พ22104 ทวีศักดิ์', '', 'อ22102 วราภรณ์', 'ส22103 ธนพร', 'ส22204 ศุภชัย'],
            'อังคาร': ['ท22102 พรศิริ', 'ค22102 ณัฐวุฒิ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20234 ธนพร', 'อ22102 วราภรณ์', 'แนะแนว อุบล'],
            'พุธ': ['อ22102 วราภรณ์', 'ส22104 ศรีกัญญา', 'ส22103 ธนพร', 'ค22102 ณัฐวุฒิ', '', 'ท22102 พรศิริ', 'ธรรมะ พระอาจารย์', 'สส/นน'],
            'พฤหัสบดี': ['ว22104 สุรางคนา คอมฯ', 'ศ22102 ศุภชัย', 'อ22202 วราภรณ์', 'พ22102 ทวีศักดิ์', '', 'ธรรมะ พระอาจารย์', '', 'ชุมนุม'],
            'ศุกร์': ['ว22102 จิรนันท์', 'ศ22102 ศุภชัย', 'ส22103 ธนพร', 'PBL จิรนันท์', '', 'PBL เกษร', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '3/1': {
        image: m3_1Img,
        schedule: {
            'จันทร์': ['อ23102 อุบล', 'พ23104 ทวีศักดิ์', 'ท23102 อามร', 'ส23202 วราภรณ์', '', 'ค23102 เกษร', 'จัดนุภาพ', 'จัดนุภาพ'],
            'อังคาร': ['ว23102 สุรางคนา', 'พ23104 ทวีศักดิ์', 'ส23103 ศรีกัญญา', 'ศ23102 ศุภชัย', '', 'ค23102 เกษร', 'แนะแนว เกษร', 'ส23103 ธนพร'],
            'พุธ': ['อ23102 อุบล', 'ค23202 ณัฐวุฒิ', 'ค23102 เกษร', 'ศ23102 ศุภชัย', '', 'ส23103 ธนพร', 'ส23103 ธนพร', 'สส/นน'],
            'พฤหัสบดี': ['ส23206 วราภรณ์', 'อ23202 วราภรณ์', 'อ23102 อุบล', 'ท23102 อามร', '', 'ว23102 สุรางคนา', 'ธรรมะ พระอาจารย์', 'ชุมนุม'],
            'ศุกร์': ['ส23103 ธนพร', 'ท23102 อามร', 'ว23102 สุรางคนา', 'PBL ศรีกัญญา', '', 'PBL ศรีกัญญา', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '3/2': {
        image: m3_2Img,
        schedule: {
            'จันทร์': ['ส23206 วราภรณ์', 'ส23103 ธนพร', 'ค23102 เกษร', 'ศ23102 ศุภชัย', '', 'ว23102 สุรางคนา', 'จัดนุภาพ', 'จัดนุภาพ'],
            'อังคาร': ['อ23202 วราภรณ์', 'อ23202 วราภรณ์', 'ว23102 สุรางคนา', 'ศ23102 สุรางคนา', '', 'ส23103 ธนพร', 'แนะแนว สุรางคนา', 'ส23103 ธนพร'],
            'พุธ': ['ท23102 อามร', 'พ23103 ทวีศักดิ์', 'ส20236 ศรีกัญญา', 'อ23102 อุบล', '', 'ศ23102 ศุภชัย', 'ว23102 สุรางคนา', 'สส/นน'],
            'พฤหัสบดี': ['อ23102 อุบล', 'พ23104 ทวีศักดิ์', 'ท23102 อามร', 'ค23102 เกษร', '', 'ส23103 ธนพร', 'ธรรมะ พระอาจารย์', 'ชุมนุม'],
            'ศุกร์': ['ค23202 ณัฐวุฒิ', 'พ23202 ทวีศักดิ์', 'ว23202 วราภรณ์', 'PBL อามร', '', 'PBL อามร', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '4/1': {
        image: m4Img,
        schedule: {
            'จันทร์': ['ว31102 วิไลลักษณ์', 'ว31102 วิไลลักษณ์', 'อ31102 วราภรณ์', 'ท31102 อามร', '', 'ศ31104 ศรีกัญญา', 'ภาษาจีน', 'ภาษาจีน'],
            'อังคาร': ['พ31102 ทวีศักดิ์', 'ค31102 เกษร', 'อ31102 วราภรณ์', 'ว31242 จิรนันท์', '', 'ศ31102 ศุภชัย', 'ท31102 อามร', 'ค31102 เกษร'],
            'พุธ': ['ว31102 สุรางคนา', 'ว31102 สุรางคนา', 'ว31222 วิทย์', 'ว31222 วิทย์', '', 'อ31102 วราภรณ์', 'ค31202 ณัฐวุฒิ', 'ค31102 เกษร'],
            'พฤหัสบดี': ['ส30232 ศรีกัญญา', 'ส31103 ศรีกัญญา', 'ว31242 จิรนันท์', 'ว31242 จิรนันท์', '', 'ว31202 วิไลลักษณ์', 'ว31222 วิไลลักษณ์', 'ชุมนุม'],
            'ศุกร์': ['PBL พรศิริ', 'ค31202 ณัฐวุฒิ', 'ค31202 ณัฐวุฒิ', 'ศ31103 ศรีกัญญา', '', 'แนะแนว ทวีศักดิ์', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '5/1': {
        image: m5Img,
        schedule: {
            'จันทร์': ['ว32102 สุรางคนา', 'ว32102 สุรางคนา', 'ส32103 ศรีกัญญา', 'ค32102 ณัฐวุฒิ', '', 'ค32202 ณัฐวุฒิ', 'ภาษาจีน', 'ภาษาจีน'],
            'อังคาร': ['ว32244 จิรนันท์', 'ว32244 จิรนันท์', 'ค32102 ณัฐวุฒิ', 'ค32102 ณัฐวุฒิ', '', 'ว32224 วิไลลักษณ์', 'ท32102 อามร', 'อ32102 อุบล'],
            'พุธ': ['ว32204 วิไลลักษณ์', 'ว32204 วิไลลักษณ์', 'ท32102 อามร', 'ส32104 ศรีกัญญา', '', 'พ32102 ทวีศักดิ์', 'อ32102 อุบล', 'ส32102 ณัฐวุฒิ'],
            'พฤหัสบดี': ['ค32202 ณัฐวุฒิ', 'ค32202 ณัฐวุฒิ', 'ศ32102 ศุภชัย', 'ว32204 วิไลลักษณ์', '', 'อ32102 อุบล', 'ว32244 จิรนันท์', 'ชุมนุม'],
            'ศุกร์': ['ส30234 ศรีกัญญา', 'พ32202 ทวีศักดิ์', 'ว32224 วิไลลักษณ์', 'อ32202 วราภรณ์', '', 'PBL วราภรณ์', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '6/1': {
        image: m6Img,
        schedule: {
            'จันทร์': ['ค33102 ณัฐวุฒิ', 'ค33102 ณัฐวุฒิ', 'ว33226 วิไลลักษณ์', 'ว33226 วิไลลักษณ์', '', 'ศ33102 ศุภชัย', 'ว33246 จิรนันท์', 'แนะแนว วราภรณ์'],
            'อังคาร': ['ว33102 วิไลลักษณ์', 'ว33102 วิไลลักษณ์', 'ส33102 ศรีกัญญา', 'พ33102 ทวีศักดิ์', '', 'วิชาชีพ รุ่งเรือง', 'วิชาชีพ รุ่งเรือง', 'วิชาชีพ รุ่งเรือง'],
            'พุธ': ['ค33202 ณัฐวุฒิ', 'อ33202 วราภรณ์', 'ว33246 จิรนันท์', 'พ33102 ทวีศักดิ์', '', 'ส33102 ศรีกัญญา', 'ว33226 วิไลลักษณ์', 'ชุมนุม'],
            'พฤหัสบดี': ['ว33206 วิไลลักษณ์', 'ว33206 วิไลลักษณ์', 'พ33102 ทวีศักดิ์', 'ค33202 ณัฐวุฒิ', '', 'อ33102 วราภรณ์', 'ส33206 อามร', 'ชุมนุม'],
            'ศุกร์': ['ว33206 วิไลลักษณ์', 'อ33102 วราภรณ์', 'พ33102 ทวีศักดิ์', 'ค33202 ณัฐวุฒิ', '', 'PBL สุรางคนา', 'PBL ณัฐวุฒิ', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    }
};

const semesterInfo = {
    term: "1/2568",
    startDate: "15 พฤศจิกายน 2567",
    endDate: "31 มีนาคม 2568",
    totalWeeks: 20
};

const StudentSchedulePage = () => {
    const [selectedClass, setSelectedClass] = useState('1/1');
    const [showImageModal, setShowImageModal] = useState(false);

    const { schedule, image } = classSchedule[selectedClass];

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="flex items-center mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
                                    โรงเรียนท่าบ่อพิทยาคม
                                </h1>
                            </div>
                            <h2 className="text-xl md:text-2xl text-blue-600">
                                ตารางเรียนประจำภาคเรียนที่ {semesterInfo.term}
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 md:mt-0">
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm">
                                <div className="flex items-center">
                                    <IoCalendar className="mr-1" />
                                    <span>เริ่ม: {semesterInfo.startDate}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm">
                                <div className="flex items-center">
                                    <IoCalendar className="mr-1" />
                                    <span>สิ้นสุด: {semesterInfo.endDate}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm col-span-2 md:col-span-1">
                                <div className="flex items-center">
                                    <IoTime className="mr-1" />
                                    <span>รวม {semesterInfo.totalWeeks} สัปดาห์</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Selector */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        เลือกชั้นเรียน
                    </label>
                    <div className="relative">
                        <select
                            className="block w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="1/1">มัธยมศึกษาปีที่ 1/1</option>
                            <option value="1/2">มัธยมศึกษาปีที่ 1/2</option>
                            <option value="2/1">มัธยมศึกษาปีที่ 2/1</option>
                            <option value="3/1">มัธยมศึกษาปีที่ 3/1</option>
                            <option value="3/2">มัธยมศึกษาปีที่ 3/2</option>
                            <option value="4/1">มัธยมศึกษาปีที่ 4/1</option>
                            <option value="5/1">มัธยมศึกษาปีที่ 5/1</option>
                            <option value="6/1">มัธยมศึกษาปีที่ 6/1</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                            <IoChevronDown />
                        </div>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 mb-8">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left rounded-tl-xl">วัน/คาบ</th>
                                {periods.map((period, index) => (
                                    <th
                                        key={index}
                                        className={`px-3 py-3 text-center ${index === periods.length - 1 ? 'rounded-tr-xl' : ''} ${
                                            period === 'พักเที่ยง' ? 'bg-yellow-500' : ''
                                        }`}
                                    >
                                        {period}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {days.map((day) => (
                                <tr key={day} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-blue-800 bg-blue-50">{day}</td>
                                    {periods.map((period, i) => {
                                        const subject = schedule?.[day]?.[i];
                                        const [code, teacher] = subject ? subject.split(' ') : [];

                                        return (
                                            <td 
                                                key={i} 
                                                className={`px-3 py-3 text-center text-sm ${
                                                    period === 'พักเที่ยง' ? 'bg-yellow-50 font-semibold' : ''
                                                }`}
                                            >
                                                {period === 'พักเที่ยง' ? (
                                                    <span className="text-yellow-700">พักรับประทานอาหาร</span>
                                                ) : subject ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-800">{code || subject}</span>
                                                        {teacher && <span className="text-xs text-gray-500">{teacher}</span>}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* View Image Button */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setShowImageModal(true)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                        <IoImage className="mr-2" />
                        ดูรูปตารางเรียน ม.{selectedClass}
                    </button>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500">
                    * ตารางเรียนนี้อาจมีการเปลี่ยนแปลง โปรดตรวจสอบกับครูที่ปรึกษา
                </p>

                {/* Image Modal */}
                <AnimatePresence>
                    {showImageModal && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25 }}
                            >
                                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                                    <h3 className="text-xl font-bold text-blue-800">
                                        ตารางเรียน ม.{selectedClass} - ภาคเรียนที่ {semesterInfo.term}
                                    </h3>
                                    <button
                                        onClick={() => setShowImageModal(false)}
                                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <IoClose size={24} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <img
                                        src={image}
                                        alt={`ตารางเรียน ม.${selectedClass}`}
                                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                                    />
                                </div>
                                <div className="p-2 text-sm text-gray-500">
                                    <p>
                                        ตารางเรียนนี้แสดงวิชาที่เรียนในภาคเรียนที่ {semesterInfo.term} ของชั้น ม.{selectedClass} โดยมีการจัดเรียงตามวันและคาบเรียน
                                    </p>
                                    <p className="mt-2">
                                        หากมีข้อสงสัยหรือคำถามเพิ่มเติม สามารถติดต่อครูที่ปรึกษาได้
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default StudentSchedulePage;