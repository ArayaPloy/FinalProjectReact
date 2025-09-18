import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoPeople, IoCalendar, IoTime } from 'react-icons/io5';
import schoolBoardImg from '../../assets/images/school-board.jpg';

const SchoolBoard = () => {
    // Set viewport meta tag to prevent zooming issues on mobile
    useEffect(() => {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        } else {
            metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }

        // Prevent zoom on double-tap for iOS
        document.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }, []);

    // ข้อมูลสภานักเรียน
    const boardInfo = {
        year: "2567",
        president: "นายจีรยุทธ ชาวรายโขง",
        vicePresidents: [
            "นางสาวมนัสนันท์ แสงโชติ",
            "นางสาวศิราธร คุณความดี"
        ],
        members: 22,
        advisor: "นางสาววิไลลักษณ์ อ่างแก้ว",
        meetingSchedule: "ทุกวันพฤหัสบดีของแต่ละสัปดาห์",
        meetingTime: "15.00 - 16.00 น."
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-6 sm:py-8"
            style={{ minWidth: '320px' }}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* ปุ่มกลับ */}
                <Link
                    to="/"
                    className="flex items-center text-amber-700 hover:text-amber-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
                >
                    <IoChevronBack className="mr-1" />
                    กลับสู่หน้าหลัก
                </Link>

                {/* หัวข้อหลัก */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-2 px-4">
                        สภานักเรียนโรงเรียนท่าบ่อพิทยาคม
                    </h1>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">ประจำปีการศึกษา {boardInfo.year}</p>
                    <div className="w-16 sm:w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* การ์ดข้อมูลสภานักเรียน */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <div className="flex items-start sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-amber-100 text-amber-600 mr-3 sm:mr-4 flex-shrink-0">
                                <IoPeople size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">ประธานสภานักเรียน</h3>
                                <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">{boardInfo.president}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <div className="flex items-start sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-amber-100 text-amber-600 mr-3 sm:mr-4 flex-shrink-0">
                                <IoPeople size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">รองประธานสภานักเรียน</h3>
                                <div className="space-y-1">
                                    {boardInfo.vicePresidents.map((vicePresident, index) => (
                                        <p key={index} className="text-gray-900 font-medium text-sm sm:text-base leading-tight">
                                            {vicePresident}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <div className="flex items-start sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-amber-100 text-amber-600 mr-3 sm:mr-4 flex-shrink-0">
                                <IoPeople size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">จำนวนสมาชิก</h3>
                                <p className="text-gray-900 font-medium text-sm sm:text-base">{boardInfo.members} คน</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* รูปภาพสภานักเรียน */}
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border-2 sm:border-4 border-amber-200">
                        <img
                            src={schoolBoardImg}
                            alt="สภานักเรียนโรงเรียนท่าบ่อพิทยาคม"
                            className="w-full h-auto object-cover"
                        />
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-white">
                            <h3 className="text-lg sm:text-xl font-bold text-center text-amber-800 leading-tight">
                                สภานักเรียนโรงเรียนท่าบ่อพิทยาคม ปีการศึกษา {boardInfo.year}
                            </h3>
                        </div>
                    </div>
                </motion.div>

                {/* ข้อมูลเพิ่มเติม */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-3 sm:mb-4 flex items-center">
                            <IoCalendar className="mr-2 flex-shrink-0" size={20} />
                            <span>ตารางประชุมสภานักเรียน</span>
                        </h3>
                        <div className="space-y-2 text-sm sm:text-base">
                            <p className="text-gray-700">
                                <span className="font-medium">วันประชุม:</span> {boardInfo.meetingSchedule}
                            </p>
                            <p className="text-gray-700 flex items-start sm:items-center">
                                <IoTime className="mr-2 flex-shrink-0 mt-0.5 sm:mt-0" size={16} />
                                <span><span className="font-medium">เวลา:</span> {boardInfo.meetingTime}</span>
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">ที่ปรึกษา:</span> {boardInfo.advisor}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-3 sm:mb-4">หน้าที่ของสภานักเรียน</h3>
                        <ul className="list-disc pl-4 sm:pl-5 space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                            <li>เป็นตัวแทนของนักเรียนในการเสนอความคิดเห็นและข้อเสนอแนะ</li>
                            <li>จัดกิจกรรมส่งเสริมความสามัคคีและพัฒนานักเรียน</li>
                            <li>เป็นสื่อกลางระหว่างนักเรียนและโรงเรียน</li>
                            <li>ส่งเสริมวินัยและรักษาระเบียบของโรงเรียน</li>
                            <li>จัดกิจกรรมเพื่อประโยชน์ต่อส่วนรวม</li>
                        </ul>
                    </div>
                </div>

                {/* คำคม */}
                <div className="bg-amber-100 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 text-center mb-6 sm:mb-8">
                    <blockquote className="text-amber-800 italic text-sm sm:text-base leading-relaxed">
                        "สภานักเรียนคือหัวใจสำคัญของการพัฒนานักเรียน
                        เป็นสะพานเชื่อมระหว่างเพื่อนนักเรียนกับครูอาจารย์
                        และเป็นพลังขับเคลื่อนกิจกรรมดีๆ ในโรงเรียน"
                    </blockquote>
                    <p className="text-amber-900 font-medium mt-2 text-sm sm:text-base">
                        — {boardInfo.president} ประธานสภานักเรียน —
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SchoolBoard;