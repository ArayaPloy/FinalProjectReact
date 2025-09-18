import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoCalendar, IoTime, IoBook, IoPeople, IoLocation, IoSchool } from 'react-icons/io5';
import admissionBanner from '../../assets/images/student_register.jpg'; // เปลี่ยนเป็นรูปแนวนอนแบบแบนเนอร์
import thaboSchool from '../../assets/images/thabo_school.jpg';

const Admissions = () => {
    const [isHovered, setIsHovered] = useState(false);

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

    return (
        <section className="bg-gray-50 text-gray-800" style={{ minWidth: '320px' }}>
            {/* Hero Section - คงรูปภาพเดิม */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
                <img
                    src={thaboSchool}
                    alt="รับสมัครนักเรียนโรงเรียนท่าบ่อพิทยาคม"
                    className="w-full h-[400px] object-cover"
                />
                <div className="container relative z-20 mx-auto px-4 py-20 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        รับสมัครนักเรียนใหม่
                    </h1>
                    <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
                        ปีการศึกษา 2568
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-white/90">
                        โรงเรียนท่าบ่อพิทยาคม เปิดรับสมัครนักเรียนชั้น ม.1 และ ม.4
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="flex items-center text-amber-700 hover:text-amber-900 transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <motion.div
                            animate={{ x: isHovered ? -3 : 0 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                        >
                            <IoChevronBack className="mr-1" />
                        </motion.div>
                        กลับหน้าหลัก
                    </Link>

                    {/* Banner Image - คงรูปภาพเดิม */}
                    <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
                        <motion.img
                            src={admissionBanner}
                            alt="รับสมัครนักเรียนโรงเรียนท่าบ่อพิทยาคม"
                            className="w-full h-auto object-cover"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        />
                    </div>

                    {/* Admission Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12 border-t-4 border-amber-500">
                        <div className="md:flex">
                            {/* Details Section */}
                            <div className="md:w-full p-4 sm:p-6 md:p-8">
                                <div className="flex items-center mb-6 sm:mb-8">
                                    <div className="bg-amber-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                                        <IoSchool className="text-amber-600 text-lg sm:text-xl md:text-2xl" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">
                                        รายละเอียดการรับสมัคร ปีการศึกษา 2568
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                                <IoCalendar className="text-amber-600 text-base sm:text-lg md:text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">วันที่รับสมัคร</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">20 - 24 มีนาคม 2568</p>
                                                <p className="text-gray-500 text-xs sm:text-sm mt-1">(ระยะเวลารับสมัคร 5 วัน)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                                <IoTime className="text-amber-600 text-base sm:text-lg md:text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">เวลาเปิดรับสมัคร</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">08.30 - 16.30 น.</p>
                                                <p className="text-gray-500 text-xs sm:text-sm mt-1">(หยุดรับสมัครเวลา 12.00 - 13.00 น.)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                                <IoLocation className="text-amber-600 text-base sm:text-lg md:text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">สถานที่รับสมัคร</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">หอประชุมโรงเรียนท่าบ่อพิทยาคม</p>
                                                <a
                                                    href="https://maps.app.goo.gl/JjyLSd5zevNbi7W69"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-amber-700 hover:underline mt-1 inline-flex items-center text-xs sm:text-sm"
                                                >
                                                    ดูแผนที่ <span className="ml-1">↗</span>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                                <IoBook className="text-amber-600 text-base sm:text-lg md:text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">ระดับชั้นที่เปิดรับ</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">มัธยมศึกษาปีที่ 1 (จำนวน 2 ห้องเรียน 80 คน)</p>
                                                <p className="text-gray-600 text-sm sm:text-base">มัธยมศึกษาปีที่ 4 (จำนวน 2 ห้องเรียน 80 คน)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-amber-50 p-4 sm:p-6 md:p-8 border-t border-amber-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-amber-800 mb-3 sm:mb-4 flex items-center">
                                        <IoPeople className="mr-2 text-amber-600 text-base sm:text-lg" />
                                        เอกสารที่ต้องเตรียม
                                    </h3>
                                    <ul className="list-disc pl-4 sm:pl-5 text-gray-700 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                                        <li>สำเนาทะเบียนบ้าน (นักเรียนและผู้ปกครอง)</li>
                                        <li>รูปถ่ายขนาด 1.5 นิ้ว (แต่งเครื่องแบบนักเรียน)</li>
                                        <li>เอกสารแสดงผลการเรียน (ปพ.1)</li>
                                        <li>สำเนาบัตรประชาชน (นักเรียนและผู้ปกครอง) จำนวน 2 ชุด</li>
                                        <li>สำเนาสูติบัตรนักเรียน (ใบเกิด)</li>
                                        <li>สำเนาทะเบียนฉบับสมบูรณ์ (กรณีเปลี่ยนชื่อ-นามสกุล)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-amber-800 mb-3 sm:mb-4 flex items-center">
                                        <IoPeople className="mr-2 text-amber-600 text-base sm:text-lg" />
                                        เงื่อนไขการรับสมัคร
                                    </h3>
                                    <ul className="list-disc pl-4 sm:pl-5 text-gray-700 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                                        <li>นักเรียนชั้น ม.1 ต้องสำเร็จการศึกษาชั้น ป.6 หรือเทียบเท่า</li>
                                        <li>นักเรียนชั้น ม.4 ต้องสำเร็จการศึกษาชั้น ม.3 หรือเทียบเท่า</li>
                                        <li>กรณีมีผู้สมัครเกินจำนวนรับ จะพิจารณาตามเกณฑ์ของโรงเรียน</li>
                                        <li>รายงานตัว/มอบตัว วันที่ 04 เมษายน 2568</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-6 text-center">
                                <p className="text-amber-700 font-medium text-sm sm:text-base mb-2">
                                    สอบถามเพิ่มเติม: ครูวิไลลักษณ์ อ่างแก้ว โทร. 084-548-0055 (เวลาราชการ)
                                </p>
                                <p className="text-amber-700 font-medium text-sm sm:text-base">
                                    หรือที่เพจ Facebook: <a href="https://www.facebook.com/share/p/1BtR4T1s3s/" target="_blank" rel="noopener noreferrer"
                                        className="underline hover:text-amber-900">โรงเรียนท่าบ่อพิทยาคม</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Admissions;