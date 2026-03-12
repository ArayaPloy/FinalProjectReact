import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { IoChevronBack, IoPencil } from 'react-icons/io5';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';

const LS_KEY = 'vision_mission_v1';

const DEFAULT_INFO = {
    vision: 'โรงเรียนท่าบ่อพิทยาคม มุ่งพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม สร้างนวัตกรรมสู่สากล บนพื้นฐานของความเป็นไทย',
    philosophyThai: 'สุวิชาโน ภวํ โหติ',
    philosophyTrans: 'ผู้รู้ดี เป็นผู้เจริญ',
    motto: 'เรียนดี\nกีฬาเด่น\nเน้นคุณธรรม\nนำอาชีพ',
    missions: 'พัฒนาผู้เรียนให้มีคุณภาพตามมาตรฐานการศึกษา\nส่งเสริมคุณธรรม จริยธรรม และค่านิยมที่พึงประสงค์\nพัฒนาสื่อเทคโนโลยีและนวัตกรรมการเรียนรู้\nส่งเสริมสุขภาพกายและสุขภาพจิตของผู้เรียน\nพัฒนาครูและบุคลากรทางการศึกษาให้มีคุณภาพ\nส่งเสริมการมีส่วนร่วมของชุมชนและภาคีเครือข่าย',
};

const MOTTO_COLORS = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-amber-100 text-amber-800',
];

const VisionMission = () => {
    const [info, setInfo] = useState(DEFAULT_INFO);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(DEFAULT_INFO);

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

    const handleSave = () => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(form));
            setInfo(form);
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
        }
    };

    const handleCancel = () => {
        setForm(info);
        setIsEditing(false);
    };

    const mottoList = (info.motto || '').split('\n').filter(Boolean);
    const missionList = (info.missions || '').split('\n').filter(Boolean);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* ปุ่มกลับ + แก้ไข */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="flex items-center text-amber-700 hover:text-amber-900 transition-colors"
                    >
                        <IoChevronBack className="mr-1" />
                        กลับสู่หน้าหลัก
                    </Link>
                    {isAdmin && !isEditing && (
                        <button
                            onClick={() => { setForm(info); setIsEditing(true); }}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <IoPencil /> แก้ไขข้อมูล
                        </button>
                    )}
                </div>

                {/* หัวข้อหลัก */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">วิสัยทัศน์และพันธกิจ</h1>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* Admin Edit Panel */}
                {isAdmin && isEditing && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-8 shadow">
                        <h3 className="text-lg font-bold text-amber-800 mb-6">แก้ไขวิสัยทัศน์และพันธกิจ</h3>

                        {/* วิสัยทัศน์ */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">วิสัยทัศน์ (Vision)</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">ข้อความวิสัยทัศน์</label>
                            <textarea name="vision" value={form.vision} onChange={handleChange} rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y" />
                        </div>

                        {/* ปรัชญา */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">ปรัชญา</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">ปรัชญาภาษาบาลี</label>
                                <input type="text" name="philosophyThai" value={form.philosophyThai} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">คำแปล</label>
                                <input type="text" name="philosophyTrans" value={form.philosophyTrans} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                        </div>

                        {/* คติพจน์ */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">คติพจน์</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">รายการคติพจน์ (1 รายการ/บรรทัด)</label>
                            <textarea name="motto" value={form.motto} onChange={handleChange} rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono" />
                        </div>

                        {/* พันธกิจ */}
                        <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">พันธกิจ (Mission)</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">รายการพันธกิจ (1 รายการ/บรรทัด)</label>
                            <textarea name="missions" value={form.missions} onChange={handleChange} rows={7}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono" />
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

                {/* ส่วนวิสัยทัศน์ */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        วิสัยทัศน์ (Vision)
                    </h2>
                    <p className="text-gray-700 leading-relaxed">"{info.vision}"</p>
                </div>

                {/* ส่วนปรัชญา */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        ปรัชญา
                    </h2>
                    <div className="text-center mb-6">
                        <p className="text-3xl font-bold text-amber-900 mb-2">"{info.philosophyThai}"</p>
                        <p className="text-lg text-gray-600">({info.philosophyTrans})</p>
                    </div>
                </div>

                {/* ส่วนคติพจน์ */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                        คติพจน์
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {mottoList.map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className={`p-4 rounded-lg ${MOTTO_COLORS[index % MOTTO_COLORS.length]} font-semibold`}
                            >
                                {item}
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
                        {missionList.map((item, index) => (
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