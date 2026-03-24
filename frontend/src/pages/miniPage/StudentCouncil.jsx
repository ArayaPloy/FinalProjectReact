import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { IoChevronBack, IoPeople, IoCalendar, IoTime, IoPencil, IoImage } from 'react-icons/io5';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import schoolBoardImg from '../../assets/images/school-board.jpg';

const LS_KEY = 'student_council_v1';

const DEFAULT_INFO = {
    year: "2567",
    president: "นายจีรยุทธ ชาวรายโขง",
    vicePresident1: "นางสาวมนัสนันท์ แสงโชติ",
    vicePresident2: "นางสาวศิราธร คุณความดี",
    members: "22",
    advisor: "นางสาววิไลลักษณ์ อ่างแก้ว",
    meetingSchedule: "ทุกวันพฤหัสบดีของแต่ละสัปดาห์",
    meetingTime: "15.00 - 16.00 น.",
    imageBase64: "",
};

const SchoolBoard = () => {
    const [info, setInfo] = useState(DEFAULT_INFO);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(DEFAULT_INFO);
    const [previewImg, setPreviewImg] = useState('');
    const fileInputRef = useRef(null);

    const user = useSelector(selectCurrentUser);
    const currentUserRole = typeof user?.role === 'object'
        ? user?.role?.roleName || user?.role?.name || 'user'
        : user?.role || 'user';
    const isAdmin = currentUserRole === 'admin' || currentUserRole === 'super_admin';

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setInfo({ ...DEFAULT_INFO, ...parsed });
            }
        } catch { /* ignore */ }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ไม่ถูกต้อง', text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น', confirmButtonColor: '#d97706', confirmButtonText: 'ตกลง' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: 'ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB', confirmButtonColor: '#d97706', confirmButtonText: 'ตกลง' });
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPreviewImg(ev.target.result);
            setForm(prev => ({ ...prev, imageBase64: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(form));
            setInfo(form);
            setIsEditing(false);
            setPreviewImg('');
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
        }
    };

    const handleCancel = () => {
        setForm(info);
        setPreviewImg('');
        setIsEditing(false);
    };

    const displayImage = info.imageBase64 || schoolBoardImg;

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
                {/* ปุ่มกลับ + แก้ไข */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Link
                        to="/"
                        className="flex items-center text-amber-700 hover:text-amber-900 transition-colors text-sm sm:text-base"
                    >
                        <IoChevronBack className="mr-1" />
                        กลับสู่หน้าหลัก
                    </Link>
                    {isAdmin && !isEditing && (
                        <button
                            onClick={() => { setForm(info); setPreviewImg(''); setIsEditing(true); }}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <IoPencil /> แก้ไขข้อมูล
                        </button>
                    )}
                </div>

                {/* หัวข้อหลัก */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-2 px-4">
                        สภานักเรียนโรงเรียนท่าบ่อพิทยาคม
                    </h1>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">ประจำปีการศึกษา {info.year}</p>
                    <div className="w-16 sm:w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* Admin Edit Panel */}
                {isAdmin && isEditing && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-8 shadow">
                        <h3 className="text-lg font-bold text-amber-800 mb-6">แก้ไขข้อมูลสภานักเรียน</h3>

                        {/* รูปภาพ */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">รูปภาพสภานักเรียน</p>
                        <div className="mb-6">
                            <div className="flex items-center gap-4 flex-wrap">
                                <img
                                    src={previewImg || form.imageBase64 || schoolBoardImg}
                                    alt="preview"
                                    className="w-40 h-28 object-cover rounded-lg border-2 border-amber-200"
                                />
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 bg-white border-2 border-amber-400 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <IoImage /> เลือกรูปภาพ
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG — ไม่เกิน 5MB</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ข้อมูลทั่วไป */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">ข้อมูลทั่วไป</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ปีการศึกษา</label>
                                <input type="text" name="year" value={form.year} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">จำนวนสมาชิก (คน)</label>
                                <input type="text" name="members" value={form.members} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ประธานสภานักเรียน</label>
                                <input type="text" name="president" value={form.president} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">รองประธาน คนที่ 1</label>
                                <input type="text" name="vicePresident1" value={form.vicePresident1} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">รองประธาน คนที่ 2</label>
                                <input type="text" name="vicePresident2" value={form.vicePresident2} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        {/* ตารางประชุม */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">ตารางประชุม</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">วันประชุม</label>
                                <input type="text" name="meetingSchedule" value={form.meetingSchedule} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">เวลาประชุม</label>
                                <input type="text" name="meetingTime" value={form.meetingTime} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ครูที่ปรึกษา</label>
                                <input type="text" name="advisor" value={form.advisor} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleSave}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors">
                                บันทึก
                            </button>
                            <button onClick={handleCancel}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg text-sm transition-colors">
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                )}

                {/* การ์ดข้อมูลสภานักเรียน */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
                        <div className="flex items-start sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-amber-100 text-amber-600 mr-3 sm:mr-4 flex-shrink-0">
                                <IoPeople size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1">ประธานสภานักเรียน</h3>
                                <p className="text-gray-900 font-medium text-sm sm:text-base leading-tight">{info.president}</p>
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
                                    {[info.vicePresident1, info.vicePresident2].filter(Boolean).map((vp, i) => (
                                        <p key={i} className="text-gray-900 font-medium text-sm sm:text-base leading-tight">{vp}</p>
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
                                <p className="text-gray-900 font-medium text-sm sm:text-base">{info.members} คน</p>
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
                            src={displayImage}
                            alt="สภานักเรียนโรงเรียนท่าบ่อพิทยาคม"
                            className="w-full h-auto object-cover"
                        />
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-white">
                            <h3 className="text-lg sm:text-xl font-bold text-center text-amber-800 leading-tight">
                                สภานักเรียนโรงเรียนท่าบ่อพิทยาคม ปีการศึกษา {info.year}
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
                                <span className="font-medium">วันประชุม:</span> {info.meetingSchedule}
                            </p>
                            <p className="text-gray-700 flex items-start sm:items-center">
                                <IoTime className="mr-2 flex-shrink-0 mt-0.5 sm:mt-0" size={16} />
                                <span><span className="font-medium">เวลา:</span> {info.meetingTime}</span>
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">ที่ปรึกษา:</span> {info.advisor}
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
                        — {info.president} ประธานสภานักเรียน —
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SchoolBoard;