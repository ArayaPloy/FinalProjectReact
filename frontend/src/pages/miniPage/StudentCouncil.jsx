import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoPeople, IoCalendar, IoTime } from 'react-icons/io5';
import schoolBoardImg from '../../assets/images/school-board.jpg';

const SchoolBoard = () => {
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
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* ปุ่มกลับ */}
                <Link
                    to="/"
                    className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
                >
                    <IoChevronBack className="mr-1" />
                    กลับสู่หน้าหลัก
                </Link>

                {/* หัวข้อหลัก */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">สภานักเรียนโรงเรียนท่าบ่อพิทยาคม</h1>
                    <p className="text-gray-600 mb-4">ประจำปีการศึกษา {boardInfo.year}</p>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* การ์ดข้อมูลสภานักเรียน */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                                <IoPeople size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">ประธานสภานักเรียน</h3>
                                <p className="text-gray-900 font-medium">{boardInfo.president}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                                <IoPeople size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">รองประธานสภานักเรียน</h3>
                                <div className="space-y-1">
                                    {boardInfo.vicePresidents.map((vicePresident, index) => (
                                        <p key={index} className="text-gray-900 font-medium">
                                            {vicePresident}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                                <IoPeople size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">จำนวนสมาชิก</h3>
                                <p className="text-gray-900 font-medium">{boardInfo.members} คน</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* รูปภาพสภานักเรียน */}
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-amber-200">
                        <img
                            src={schoolBoardImg}
                            alt="สภานักเรียนโรงเรียนท่าบ่อพิทยาคม"
                            className="w-full h-auto object-cover"
                        />
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-white">
                            <h3 className="text-xl font-bold text-center text-amber-800">สภานักเรียนโรงเรียนท่าบ่อพิทยาคม ปีการศึกษา {boardInfo.year}</h3>
                        </div>
                    </div>
                </motion.div>

                {/* ข้อมูลเพิ่มเติม */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                            <IoCalendar className="mr-2" /> ตารางประชุมสภานักเรียน
                        </h3>
                        <div className="space-y-2">
                            <p className="text-gray-700"><span className="font-medium">วันประชุม:</span> {boardInfo.meetingSchedule}</p>
                            <p className="text-gray-700 flex items-center">
                                <IoTime className="mr-2" />
                                <span className="font-medium">เวลา: </span> {boardInfo.meetingTime}
                            </p>
                            <p className="text-gray-700"><span className="font-medium">ที่ปรึกษา:</span> {boardInfo.advisor}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-amber-800 mb-4">หน้าที่ของสภานักเรียน</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>เป็นตัวแทนของนักเรียนในการเสนอความคิดเห็นและข้อเสนอแนะ</li>
                            <li>จัดกิจกรรมส่งเสริมความสามัคคีและพัฒนานักเรียน</li>
                            <li>เป็นสื่อกลางระหว่างนักเรียนและโรงเรียน</li>
                            <li>ส่งเสริมวินัยและรักษาระเบียบของโรงเรียน</li>
                            <li>จัดกิจกรรมเพื่อประโยชน์ต่อส่วนรวม</li>
                        </ul>
                    </div>
                </div>

                {/* คำคม */}
                <div className="bg-amber-100 rounded-xl shadow-sm p-6 text-center mb-8">
                    <blockquote className="text-amber-800 italic">
                        "สภานักเรียนคือหัวใจสำคัญของการพัฒนานักเรียน
                        เป็นสะพานเชื่อมระหว่างเพื่อนนักเรียนกับครูอาจารย์
                        และเป็นพลังขับเคลื่อนกิจกรรมดีๆ ในโรงเรียน"
                    </blockquote>
                    <p className="text-amber-900 font-medium mt-2">— {boardInfo.president} ประธานสภานักเรียน —</p>
                </div>
            </div>
        </motion.div>
    );
};

export default SchoolBoard;