import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

const VisionMission = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12"
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
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">วิสัยทัศน์และพันธกิจ</h1>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* ส่วนวิสัยทัศน์ */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        วิสัยทัศน์ (Vision)
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        "โรงเรียนท่าบ่อพิทยาคม มุ่งพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม
                        สร้างนวัตกรรมสู่สากล บนพื้นฐานของความเป็นไทย"
                    </p>
                </div>

                {/* ส่วนปรัชญา */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        ปรัชญา
                    </h2>
                    <div className="text-center mb-6">
                        <p className="text-3xl font-bold text-amber-900 mb-2">"สุวิชาโน ภวํ โหติ"</p>
                        <p className="text-lg text-gray-600">(ผู้รู้ดี เป็นผู้เจริญ)</p>
                    </div>
                </div>

                {/* ส่วนคติพจน์ */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        คติพจน์
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {[
                            { text: "เรียนดี", color: "bg-blue-100 text-blue-800" },
                            { text: "กีฬาเด่น", color: "bg-green-100 text-green-800" },
                            { text: "เน้นคุณธรรม", color: "bg-purple-100 text-purple-800" },
                            { text: "นำอาชีพ", color: "bg-amber-100 text-amber-800" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className={`p-4 rounded-lg ${item.color} font-semibold`}
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ส่วนพันธกิจ */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        พันธกิจ (Mission)
                    </h2>
                    <ul className="space-y-3">
                        {[
                            "พัฒนาผู้เรียนให้มีคุณภาพตามมาตรฐานการศึกษา",
                            "ส่งเสริมคุณธรรม จริยธรรม และค่านิยมที่พึงประสงค์",
                            "พัฒนาสื่อเทคโนโลยีและนวัตกรรมการเรียนรู้",
                            "ส่งเสริมสุขภาพกายและสุขภาพจิตของผู้เรียน",
                            "พัฒนาครูและบุคลากรทางการศึกษาให้มีคุณภาพ",
                            "ส่งเสริมการมีส่วนร่วมของชุมชนและภาคีเครือข่าย"
                        ].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-amber-600 mr-2">•</span>
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default VisionMission;