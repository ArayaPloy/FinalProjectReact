import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoChevronDown, IoCalendar, IoTime, IoImage } from 'react-icons/io5';


const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
const periods = ['คาบที่ 1', 'คาบที่ 2', 'คาบที่ 3', 'คาบที่ 4', 'พักเที่ยง', 'คาบที่ 5', 'คาบที่ 6', 'คาบที่ 7'];

const classSchedule = {
    '1/1': {
        schedule: {
            'จันทร์': ['ภาษาจีน', 'ภาษาจีน', 'ว21102 จิรนันท์', 'ว21102 จิรนันท์', '', 'อ22102 อุบล', 'ส22102 พรศิริ', 'ส20232 ธนพร'],
            'อังคาร': ['ค21202 เกษร', 'ส21103 ธนพร', 'อ21102 อุบล', 'ศ21102 ศุภชัย', '', 'อ21102 อุบล', 'ท21102 พรศิริ', 'แนะแนว วิไลลักษณ์'],
            'พุธ': ['ส21103 ธนพร', 'ค21102 เกษร', 'ท21102 พรศิริ', 'ศ21103 ทวีศักดิ์', '', 'ส20236 ศรีกัญญา', 'ว21102 จิรนันท์', 'สส/นน'],
            'พฤหัสบดี': ['ส21103 ธนพร', 'ค21102 เกษร', 'พ21104 ทวีศักดิ์', 'ว22104 สุรางคนา คอมฯ', '', 'ส21104 ศรีกัญญา', 'อ21102 อุบล', 'ชุมนุม'],
            'ศุกร์': ['ค21102 เกษร', 'อ21102 อุบล', 'ท21102 พรศิริ', 'ศ21102 ศุภชัย', '', 'PBL พรศิริ', 'PBL พรศิริ', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '1/2': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '2/1': {
        schedule: {
            'จันทร์': ['ว21102 จิรนันท์', 'ว21102 จิรนันท์', 'ค22102 ณัฐวุฒิ', 'พ22104 ทวีศักดิ์', '', 'อ22102 วราภรณ์', 'ส22103 ธนพร', 'ส22204 ศุภชัย'],
            'อังคาร': ['ท22102 พรศิริ', 'ค22102 ณัฐวุฒิ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20234 ธนพร', 'อ22102 วราภรณ์', 'แนะแนว อุบล'],
            'พุธ': ['อ22102 วราภรณ์', 'ส22104 ศรีกัญญา', 'ส22103 ธนพร', 'ค22102 ณัฐวุฒิ', '', 'ท22102 พรศิริ', 'ธรรมะ พระอาจารย์', 'สส/นน'],
            'พฤหัสบดี': ['ว22104 สุรางคนา คอมฯ', 'ศ22102 ศุภชัย', 'อ22202 วราภรณ์', 'พ22102 ทวีศักดิ์', '', 'ธรรมะ พระอาจารย์', '', 'ชุมนุม'],
            'ศุกร์': ['ว22102 จิรนันท์', 'ศ22102 ศุภชัย', 'ส22103 ธนพร', 'PBL จิรนันท์', '', 'PBL เกษร', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '2/2': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '3/1': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '3/2': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '4/1': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '5/1': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
    '6/1': {
        schedule: {
            'จันทร์': ['พ21104 ทวีศักดิ์', 'ท21102 พรศิริ', 'ภาษาจีน', 'ภาษาจีน', '', 'ส20232 ธนพร', 'ค21202 เกษร', 'อ21102 อุบล'],
            'อังคาร': ['ส21103 ธนพร', 'พ21103 ทวีศักดิ์', 'ศ21102 ศุภชัย', 'อ21102 อุบล', '', 'ท21102 พรศิริ', 'ว21102 จิรนันท์', 'แนะแนว จิรนันท์'],
            'พุธ': ['ค21102 เกษร', 'ท21102 พรศิริ', 'อ21102 อุบล', 'ว22104 สุรางคนา', '', 'อ21102 อุบล', 'ศ21102 ศุภชัย', 'สส/นน'],
            'พฤหัสบดี': ['ค21102 เกษร', 'ส21103 ธนพร', 'ส21103 ธนพร', 'อ21102 อุบล', '', 'ส21102 พรศิริ', 'ส21104 ศรีกัญญา', 'ชุมนุม'],
            'ศุกร์': ['อ21102 อุบล', 'ค21102 เกษร', 'ว21102 จิรนันท์', 'PBL ศุภชัย', '', 'PBL ศุภชัย', '', 'เพื่อสังคม สาธารณะประโยชน์']
        }
    },
};

const semesterInfo = {
    term: "1/2568",
    startDate: "15 พฤศจิกายน 2568",
    endDate: "31 มีนาคม 2569",
    totalWeeks: 71
};

const StudentSchedulePage = () => {
    const [selectedClass, setSelectedClass] = useState('1/1');
    const [showImageModal, setShowImageModal] = useState(false);

    const { schedule, image } = classSchedule[selectedClass];

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-12 justify-center">
                {/* Header Section */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-blue-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                        <div className="w-full lg:w-auto">
                            <div className="flex items-center mb-2">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-800 leading-tight">
                                    โรงเรียนท่าบ่อพิทยาคม
                                </h1>
                            </div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl text-blue-600">
                                ตารางเรียนประจำภาคเรียนที่ {semesterInfo.term}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full lg:w-auto">
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-xs sm:text-sm">
                                <div className="flex items-center">
                                    <IoCalendar className="mr-1 text-sm sm:text-base" />
                                    <span className="truncate">เริ่ม: {semesterInfo.startDate}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-xs sm:text-sm">
                                <div className="flex items-center">
                                    <IoCalendar className="mr-1 text-sm sm:text-base" />
                                    <span className="truncate">สิ้นสุด: {semesterInfo.endDate}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-xs sm:text-sm sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center">
                                    <IoTime className="mr-1 text-sm sm:text-base" />
                                    <span>รวม {semesterInfo.totalWeeks} สัปดาห์</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Selector */}
                <div className="mb-6 sm:mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        เลือกชั้นเรียน
                    </label>
                    <div className="relative max-w-sm">
                        <select
                            className="block w-full px-4 py-3 pr-10 text-sm sm:text-base rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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

                {/* Schedule Table - Desktop View */}
                <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 mb-8">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left rounded-tl-xl font-medium">วัน/คาบ</th>
                                {periods.map((period, index) => (
                                    <th
                                        key={index}
                                        className={`px-3 py-3 text-center font-medium ${index === periods.length - 1 ? 'rounded-tr-xl' : ''} ${period === 'พักเที่ยง' ? 'bg-yellow-500' : ''
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
                                    <td className="px-4 py-3 font-medium text-blue-800 bg-blue-50 sticky left-0">{day}</td>
                                    {periods.map((period, i) => {
                                        const subject = schedule?.[day]?.[i];
                                        const [code, teacher] = subject ? subject.split(' ') : [];

                                        return (
                                            <td
                                                key={i}
                                                className={`px-3 py-3 text-center text-sm ${period === 'พักเที่ยง' ? 'bg-yellow-50 font-semibold' : ''
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

                {/* Schedule Cards - Mobile/Tablet View */}
                <div className="lg:hidden space-y-4 mb-8">
                    {days.map((day) => (
                        <div key={day} className="bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                                <h3 className="font-medium text-lg">{day}</h3>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {periods.map((period, i) => {
                                        const subject = schedule?.[day]?.[i];
                                        const [code, teacher] = subject ? subject.split(' ') : [];

                                        if (period === 'พักเที่ยง') {
                                            return (
                                                <div key={i} className="sm:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                    <div className="text-center">
                                                        <span className="font-medium text-yellow-700">{period}</span>
                                                        <p className="text-sm text-yellow-600 mt-1">พักรับประทานอาหาร</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-blue-600 mb-1">{period}</span>
                                                    {subject ? (
                                                        <>
                                                            <span className="font-medium text-gray-800 text-sm leading-tight">{code || subject}</span>
                                                            {teacher && <span className="text-xs text-gray-500 mt-1">{teacher}</span>}
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs sm:text-sm text-gray-500 px-4">
                    * ตารางเรียนนี้อาจมีการเปลี่ยนแปลง โปรดตรวจสอบกับครูที่ปรึกษา
                </p>

                {/* Image Modal */}
                <AnimatePresence>
                    {showImageModal && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="relative bg-white rounded-lg sm:rounded-xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25 }}
                            >
                                <div className="sticky top-0 bg-white p-3 sm:p-4 border-b flex justify-between items-center z-10 rounded-t-lg sm:rounded-t-xl">
                                    <h3 className="text-lg sm:text-xl font-bold text-blue-800 truncate mr-4">
                                        ตารางเรียน ม.{selectedClass} - ภาคเรียนที่ {semesterInfo.term}
                                    </h3>
                                    <button
                                        onClick={() => setShowImageModal(false)}
                                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
                                    >
                                        <IoClose size={20} className="sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                                <div className="p-3 sm:p-4">
                                    <img
                                        src={image}
                                        alt={`ตารางเรียน ม.${selectedClass}`}
                                        className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                                    />
                                </div>
                                <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-b-lg sm:rounded-b-xl">
                                    <p className="mb-2">
                                        ตารางเรียนนี้แสดงวิชาที่เรียนในภาคเรียนที่ {semesterInfo.term} ของชั้น ม.{selectedClass} โดยมีการจัดเรียงตามวันและคาบเรียน
                                    </p>
                                    <p>
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