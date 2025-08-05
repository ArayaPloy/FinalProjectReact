import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    IoChevronBack,
    IoPeople,
    IoBook,
    IoColorPalette,
    IoCodeSlash,
    IoFlask,
    IoMusicalNotes,
    IoLanguage,
    IoFitness,
    IoChatbubbles,
    IoRestaurant,
    IoClose
} from 'react-icons/io5';

const AcademicClubs = () => {
    // ข้อมูลชุมนุมวิชาการ
    const clubs = [
        {
            id: 1,
            name: "ชุมนุมพับกระดาษรีไซเคิล",
            description: "เรียนรู้การรีไซเคิลขยะด้วยการพับกระดาษให้สวยงามและนำไปใช้ประโยชน์",
            maxMembers: 20,
            teacher: "ครูสมชาย ดำรงกิจ",
            icon: <IoColorPalette className="text-green-600 text-2xl" />,
            category: "ศิลปะและงานฝีมือ"
        },
        {
            id: 2,
            name: "ชุมนุมวิทยาศาสตร์",
            description: "ค้นคว้าและทดลองทางวิทยาศาสตร์ พัฒนาทักษะการคิดวิเคราะห์",
            maxMembers: 25,
            teacher: "ครูจีรนันท์ วัฒนา",
            icon: <IoFlask className="text-blue-600 text-2xl" />,
            category: "วิทยาศาสตร์"
        },
        {
            id: 3,
            name: "ชุมนุมโปรแกรมมิ่ง",
            description: "เรียนรู้การเขียนโปรแกรมพื้นฐานและพัฒนาแอปพลิเคชันอย่างง่าย",
            maxMembers: 20,
            teacher: "ครูสุรางคนา เทพปัญญา",
            icon: <IoCodeSlash className="text-purple-600 text-2xl" />,
            category: "เทคโนโลยี"
        },
        {
            id: 4,
            name: "ชุมนุมดนตรีสากล",
            description: "ฝึกทักษะการเล่นเครื่องดนตรีสากลและการร้องเพลง",
            maxMembers: 15,
            teacher: "ครูศุภชัย ศิลปเจริญ",
            icon: <IoMusicalNotes className="text-red-600 text-2xl" />,
            category: "ดนตรี"
        },
        {
            id: 5,
            name: "ชุมนุมภาษาจีน",
            description: "เรียนรู้ทักษะภาษาจีนพื้นฐานและวัฒนธรรมจีนที่น่าสนใจ",
            maxMembers: 20,
            teacher: "ครูอุบลรัตน์ ใจกว้าง",
            icon: <IoLanguage className="text-yellow-600 text-2xl" />,
            category: "ภาษา"
        },
        {
            id: 6,
            name: "ชุมนุมวรรณกรรม",
            description: "พัฒนาทักษะการเขียนเชิงสร้างสรรค์และการวิเคราะห์วรรณกรรม",
            maxMembers: 15,
            teacher: "ครูพรศิริ วรรณศิลป์",
            icon: <IoBook className="text-indigo-600 text-2xl" />,
            category: "ภาษาและวรรณกรรม"
        },
        {
            id: 7,
            name: "ชุมนุมมวยไชยา",
            description: "เรียนรู้ศิลปะการต่อสู้ไทยโบราณแบบมวยไชยา เพื่อสุขภาพและป้องกันตัว",
            maxMembers: 20,
            teacher: "ครูทวีศักดิ์ เก่งรอบด้าน",
            icon: <IoFitness className="text-orange-600 text-2xl" />,
            category: "กีฬา"
        },
        {
            id: 8,
            name: "ชุมนุมภาษาพาเพลิน",
            description: "สนุกกับการเรียนรู้ภาษาและวัฒนธรรมจากทั่วโลกผ่านกิจกรรมสร้างสรรค์",
            maxMembers: 25,
            teacher: "ครูวราภรณ์ พูดได้หลายภาษา",
            icon: <IoChatbubbles className="text-pink-600 text-2xl" />,
            category: "ภาษา"
        },
        {
            id: 9,
            name: "ชุมนุมศิลปะการทำอาหาร",
            description: "เรียนรู้ทักษะพื้นฐานการทำอาหารไทยและนานาชาติ พัฒนาความคิดสร้างสรรค์ผ่านการปรุงอาหาร",
            maxMembers: 18,
            teacher: "ครูอรุณี ใจอร่อย",
            icon: <IoRestaurant className="text-amber-600 text-2xl" />,
            category: "ศิลปะและงานฝีมือ"
        }
    ];

    // State สำหรับ Modal
    const [selectedClub, setSelectedClub] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // หมวดหมู่ชุมนุม
    const categories = [...new Set(clubs.map(club => club.category))];

    // ฟังก์ชันเปิด Modal
    const handleJoinClick = (club) => {
        setSelectedClub(club);
        setShowModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <IoChevronBack className="mr-1" />
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-3xl font-bold text-center text-blue-800">ชุมนุมวิชาการ</h1>
                    <div className="w-6"></div> {/* สำหรับจัดวางให้สมดุล */}
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
                    <h2 className="text-xl font-semibold text-blue-700 mb-3">เกี่ยวกับชุมนุมวิชาการ</h2>
                    <p className="text-gray-700">
                        ชุมนุมวิชาการเป็นกิจกรรมที่ส่งเสริมทักษะเฉพาะทางให้นักเรียน ได้เลือกตามความสนใจ
                        โดยมีครูผู้เชี่ยวชาญเป็นที่ปรึกษา นักเรียนสามารถสมัครได้ภาคเรียนละ 1 ชุมนุม
                    </p>
                </div>

                {/* Club Categories */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">หมวดหมู่ชุมนุม</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clubs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <motion.div
                            key={club.id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start mb-4">
                                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                        {club.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
                                        <p className="text-blue-600">{club.category}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">{club.description}</p>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center text-gray-500">
                                        <IoPeople className="mr-1" />
                                        <span>รับ {club.maxMembers} คน</span>
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                        {club.teacher}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                                    onClick={() => handleJoinClick(club)}
                                >
                                    สมัครชุมนุม
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">ข้อกำหนดการสมัคร</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>นักเรียนสามารถสมัครได้ภาคเรียนละ 1 ชุมนุม</li>
                        <li>ต้องเข้าร่วมกิจกรรมอย่างน้อย 80% ของทั้งหมด</li>
                        <li>ปิดรับสมัครภายในสัปดาห์ที่ 2 ของภาคเรียน</li>
                        <li>มีสิทธิ์เปลี่ยนชุมนุมได้ภายใน 2 สัปดาห์แรก</li>
                    </ul>
                </div>
            </div>

            {/* Modal สำหรับสมัครชุมนุม */}
            <AnimatePresence>
                {showModal && selectedClub && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl max-w-md w-full p-6 relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <IoClose size={24} />
                            </button>

                            <div className="flex items-center mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                    {selectedClub.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{selectedClub.name}</h3>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    หากนักเรียนสนใจสมัครชุมนุมวิชา <span className="font-semibold">{selectedClub.name}</span> โปรดติดต่อครูประจำชุมนุมเพื่อสมัคร
                                </p>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-800 mb-2">ข้อมูลติดต่อครูที่ปรึกษา</h4>
                                    <p className="text-gray-700">
                                        <span className="font-medium">ชื่อ:</span> {selectedClub.teacher}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-medium">จำนวนที่รับ:</span> {selectedClub.maxMembers} คน
                                    </p>
                                </div>

                                <p className="text-sm text-gray-500">
                                    * กรุณาติดต่อครูที่ปรึกษาเพื่อรับข้อมูลเพิ่มเติมเกี่ยวกับการสมัครและเวลาประชุม
                                </p>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-4"
                                >
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AcademicClubs;