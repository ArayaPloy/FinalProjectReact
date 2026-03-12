import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { IoChevronBack, IoSchool, IoBook, IoMedal, IoLibrary, IoPencil } from 'react-icons/io5';
import { useFetchTeachersQuery } from '../../redux/features/teachers/teachersApi';
import { useFetchSchoolInfoQuery } from '../../redux/features/about/aboutApi';
import { useGetAllStudentsQuery, useGetClassroomsQuery } from '../../services/studentsApi';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { getApiURL } from '../../utils/apiConfig';
import schoolRewards from '../../assets/images/school_rewards.jpg';

const LS_KEY = 'academic_info_v1';

const DEFAULT_INFO = {
    generalInfo: 'โรงเรียนท่าบ่อพิทยาคมเป็นโรงเรียนมัธยมศึกษาขนาดเล็ก สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาหนองคาย ก่อตั้งเมื่อปี พ.ศ. 2534 ปัจจุบันเปิดสอนระดับชั้นมัธยมศึกษาปีที่ 1 ถึงปีที่ 6',
    vision: 'เรียนดี   กีฬาเด่น   เน้นคุณธรรม   นำอาชีพ',
    area: '7 ไร่ 4 งาน',
    curriculumDesc: 'โรงเรียนใช้หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พ.ศ. 2551 (ปรับปรุง พ.ศ. 2560) โดยจัดการเรียนการสอน 8 กลุ่มสาระการเรียนรู้หลัก',
    subjects: 'ภาษาไทย\nคณิตศาสตร์\nวิทยาศาสตร์\nสังคมศึกษา\nสุขศึกษา\nศิลปะ\nการงานอาชีพ\nภาษาต่างประเทศ',
    juniorHours: '1,200',
    juniorDesc: 'เน้นพื้นฐานวิชาการและทักษะชีวิต',
    seniorHours: '1,400',
    seniorDesc: 'เน้นการเตรียมความพร้อมสู่ระดับอุดมศึกษา',
    awardTitle: 'งานศิลปหัตถกรรมนักเรียน ครั้งที่ 72',
    awardMeta: 'ปีการศึกษา 2567 ระดับเขตพื้นที่การศึกษา',
    goldCount: '29',
    silverCount: '3',
    bronzeCount: '1',
    totalAwards: '33',
    onetYear: 'ปีการศึกษา 2566',
    onetThai: '57.35',
    onetMath: '45.28',
    onetScience: '43.72',
    onetEnglish: '44.25',
    continuationRate: '85% ของนักเรียนชั้น ม.6 สามารถศึกษาต่อในระดับอุดมศึกษา',
    resources: 'ห้องสมุด|หนังสือกว่า 1,200 เล่ม\nห้องปฏิบัติการวิทยาศาสตร์|2 ห้อง\nห้องคอมพิวเตอร์|คอมพิวเตอร์ 35 เครื่อง\nห้องสมุดดิจิทัล|เรียนรู้ออนไลน์\nศูนย์การเรียนรู้มวยไทย|การสอนนอกบทเรียน\nศูนย์การเรียนรู้การเกษตรและวัฒนธรรม|การสอนนอกบทเรียน',
    rewardsImage: '',
};

const AcademicInfo = () => {
    const [info, setInfo] = useState(DEFAULT_INFO);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(DEFAULT_INFO);
    const [rewardsFile, setRewardsFile] = useState(null);
    const [rewardsPreview, setRewardsPreview] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const user = useSelector(selectCurrentUser);
    const currentUserRole = typeof user?.role === 'object'
        ? user?.role?.roleName || user?.role?.name || 'user'
        : user?.role || 'user';
    const isAdmin = currentUserRole === 'admin' || currentUserRole === 'super_admin';

    const { data: teachers = [] } = useFetchTeachersQuery();
    const { data: schoolInfo } = useFetchSchoolInfoQuery();
    const { data: students = [] } = useGetAllStudentsQuery({});
    const { data: classrooms = [] } = useGetClassroomsQuery();

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

    const validateImageFile = (file) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ไม่ถูกต้อง', text: 'รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WebP, GIF)', confirmButtonColor: '#d97706' });
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: 'ขนาดไฟล์ต้องไม่เกิน 5MB', confirmButtonColor: '#d97706' });
            return false;
        }
        return true;
    };

    const handleRewardsFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && validateImageFile(file)) {
            setRewardsFile(file);
            setRewardsPreview(URL.createObjectURL(file));
        }
    };

    const uploadRewardsImage = async () => {
        if (!rewardsFile) return form.rewardsImage;
        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', rewardsFile);
            const res = await fetch(getApiURL('upload/image'), {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!res.ok) throw new Error('upload failed');
            const data = await res.json();
            return data.imageUrl || data.url || data.filePath || form.rewardsImage;
        } catch {
            Swal.fire({ icon: 'error', title: 'อัปโหลดรูปภาพไม่สำเร็จ', confirmButtonColor: '#d97706' });
            return form.rewardsImage;
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSave = async () => {
        const uploadedImageUrl = await uploadRewardsImage();
        const saved = { ...form, rewardsImage: uploadedImageUrl };
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(saved));
            setInfo(saved);
            setRewardsFile(null);
            setRewardsPreview('');
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
        }
    };

    const handleCancel = () => {
        setForm(info);
        setRewardsFile(null);
        setRewardsPreview('');
        setIsEditing(false);
    };

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
        document.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) event.preventDefault();
        }, { passive: false });
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) event.preventDefault();
            lastTouchEnd = now;
        }, false);
    }, []);

    const subjectsList = (info.subjects || '').split('\n').filter(Boolean);
    const resourcesList = (info.resources || '').split('\n').filter(Boolean).map(r => {
        const [name, desc] = r.split('|');
        return { name: name?.trim() || '', desc: desc?.trim() || '' };
    });
    const rewardsImgSrc = rewardsPreview
        || (info.rewardsImage
            ? (info.rewardsImage.startsWith('http')
                ? info.rewardsImage
                : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}/${info.rewardsImage}`)
            : '')
        || schoolRewards;

    const teacherCount = Array.isArray(teachers) ? teachers.length : 0;
    const studentCount = students?.total ?? (Array.isArray(students?.data) ? students.data.length : 0);
    const classroomCount = Array.isArray(classrooms) ? classrooms.length : 0;

    return (
        <section className="bg-gray-50 text-gray-800" style={{ minWidth: '320px' }}>
            {/* Hero */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
                <img src={schoolInfo?.heroImage || '/thabo_school.jpg'} alt="ข้อมูลวิชาการโรงเรียนท่าบ่อพิทยาคม" className="w-full h-[400px] object-cover" />
                <div className="container relative z-20 mx-auto px-4 py-20 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">ข้อมูลวิชาการ</h1>
                    <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">โรงเรียนท่าบ่อพิทยาคม</h2>
                    <p className="mx-auto max-w-2xl text-lg text-white/90">มุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม สู่มาตรฐานการศึกษาที่มีคุณภาพ</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Back + Edit Button */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <Link to="/" className="flex items-center text-amber-700 hover:text-amber-900 transition-colors text-sm sm:text-base">
                            <IoChevronBack className="mr-1" />
                            กลับหน้าหลัก
                        </Link>
                        {isAdmin && !isEditing && (
                            <button
                                onClick={() => { setForm(info); setIsEditing(true); }}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <IoPencil /> แก้ไขข้อมูลวิชาการ
                            </button>
                        )}
                    </div>

                    {/* Admin Edit Panel */}
                    {isAdmin && isEditing && (
                        <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-8 shadow">
                            <h3 className="text-lg font-bold text-amber-800 mb-6">แก้ไขข้อมูลวิชาการ</h3>

                            {/* ข้อมูลทั่วไป */}
                            <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">ข้อมูลทั่วไป</p>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">คำอธิบายโรงเรียน</label>
                                    <textarea name="generalInfo" value={form.generalInfo} onChange={handleChange} rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">วิสัยทัศน์</label>
                                        <input type="text" name="vision" value={form.vision} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">พื้นที่โรงเรียน</label>
                                        <input type="text" name="area" value={form.area} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                            </div>

                            {/* หลักสูตร */}
                            <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">หลักสูตรการศึกษา</p>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">คำอธิบายหลักสูตร</label>
                                    <textarea name="curriculumDesc" value={form.curriculumDesc} onChange={handleChange} rows={2}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">กลุ่มสาระการเรียนรู้ (1 รายการ/บรรทัด)</label>
                                    <textarea name="subjects" value={form.subjects} onChange={handleChange} rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ชั่วโมง/ปี (ม.ต้น)</label>
                                        <input type="text" name="juniorHours" value={form.juniorHours} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">คำอธิบาย ม.ต้น</label>
                                        <input type="text" name="juniorDesc" value={form.juniorDesc} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ชั่วโมง/ปี (ม.ปลาย)</label>
                                        <input type="text" name="seniorHours" value={form.seniorHours} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">คำอธิบาย ม.ปลาย</label>
                                        <input type="text" name="seniorDesc" value={form.seniorDesc} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                            </div>

                            {/* ผลงานทางวิชาการ */}
                            <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">ผลงานทางวิชาการที่โดดเด่น</p>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">รูปภาพผลงานทางวิชาการ</label>
                                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                                        <img src={rewardsImgSrc} alt="preview" className="w-full sm:w-64 h-36 object-cover rounded-lg border border-amber-300" />
                                        <div>
                                            <input type="file" accept="image/*" onChange={handleRewardsFileSelect}
                                                className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer" />
                                            <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG, WebP (ไม่เกิน 5MB)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อรางวัล/งาน</label>
                                        <input type="text" name="awardTitle" value={form.awardTitle} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">รายละเอียดปีการศึกษา</label>
                                        <input type="text" name="awardMeta" value={form.awardMeta} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">เหรียญทอง</label>
                                        <input type="text" name="goldCount" value={form.goldCount} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">เหรียญเงิน</label>
                                        <input type="text" name="silverCount" value={form.silverCount} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">เหรียญทองแดง</label>
                                        <input type="text" name="bronzeCount" value={form.bronzeCount} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">รางวัลทั้งหมด</label>
                                        <input type="text" name="totalAwards" value={form.totalAwards} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ปีการศึกษา O-NET</label>
                                        <input type="text" name="onetYear" value={form.onetYear} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ภาษาไทย (%)</label>
                                        <input type="text" name="onetThai" value={form.onetThai} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">คณิตศาสตร์ (%)</label>
                                        <input type="text" name="onetMath" value={form.onetMath} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">วิทยาศาสตร์ (%)</label>
                                        <input type="text" name="onetScience" value={form.onetScience} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ภาษาอังกฤษ (%)</label>
                                        <input type="text" name="onetEnglish" value={form.onetEnglish} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">อัตราการศึกษาต่อ</label>
                                        <input type="text" name="continuationRate" value={form.continuationRate} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                            </div>

                            {/* แหล่งเรียนรู้ */}
                            <p className="font-semibold text-amber-700 mb-3 border-b border-amber-200 pb-1">แหล่งเรียนรู้และสิ่งอำนวยความสะดวก</p>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">รายการแหล่งเรียนรู้ (รูปแบบ: ชื่อ|คำอธิบาย แต่ละรายการขึ้นบรรทัดใหม่)</label>
                                <textarea name="resources" value={form.resources} onChange={handleChange} rows={7}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono" />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={isUploadingImage}
                                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors">
                                    {isUploadingImage ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                                <button onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg text-sm transition-colors">
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ข้อมูลทั่วไป */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12 border-t-4 border-amber-500"
                    >
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-amber-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                                    <IoSchool className="text-amber-600 text-lg sm:text-xl md:text-2xl" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-amber-800">ข้อมูลทั่วไป</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{info.generalInfo}</p>
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">มีวิสัยทัศน์ "{info.vision}"</p>
                                </div>
                                <div>
                                    <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
                                        <h3 className="font-semibold text-amber-700 mb-2 text-sm sm:text-base">ข้อมูลพื้นฐาน</h3>
                                        <ul className="text-gray-700 space-y-1 text-sm sm:text-base">
                                            <li>จำนวนครู: {teacherCount > 0 ? `${teacherCount} คน` : 'กำลังโหลด...'}</li>
                                            <li>จำนวนนักเรียน: {studentCount > 0 ? `${studentCount} คน` : 'กำลังโหลด...'}</li>
                                            <li>จำนวนห้องเรียน: {classroomCount > 0 ? `${classroomCount} ห้อง` : 'กำลังโหลด...'}</li>
                                            <li>พื้นที่: {info.area}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* หลักสูตรการศึกษา */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12 border-t-4 border-amber-500"
                    >
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-amber-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                                    <IoBook className="text-amber-600 text-lg sm:text-xl md:text-2xl" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-amber-800">หลักสูตรการศึกษา</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน</h3>
                                    <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{info.curriculumDesc}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {subjectsList.map((subject, i) => (
                                            <motion.div key={i} whileHover={{ scale: 1.02 }}
                                                className="bg-amber-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-center text-amber-800 font-medium text-xs sm:text-sm">
                                                {subject}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">โครงสร้างเวลาเรียน</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm sm:text-base">มัธยมศึกษาตอนต้น</h4>
                                            <p className="text-gray-600 text-sm sm:text-base">{info.juniorHours} ชั่วโมง/ปี</p>
                                            <p className="text-gray-600 text-xs sm:text-sm">{info.juniorDesc}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm sm:text-base">มัธยมศึกษาตอนปลาย</h4>
                                            <p className="text-gray-600 text-sm sm:text-base">{info.seniorHours} ชั่วโมง/ปี</p>
                                            <p className="text-gray-600 text-xs sm:text-sm">{info.seniorDesc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ผลงานทางวิชาการ */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12 border-t-4 border-amber-500"
                    >
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-amber-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                                    <IoMedal className="text-amber-600 text-lg sm:text-xl md:text-2xl" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-amber-800">ผลงานทางวิชาการที่โดดเด่น (ล่าสุด)</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <motion.img src={rewardsImgSrc} alt="รางวัลโรงเรียนท่าบ่อพิทยาคม"
                                        className="w-full h-auto rounded-lg shadow-md mb-3 sm:mb-4" whileHover={{ scale: 1.01 }} />
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">{info.awardTitle}</h3>
                                    <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">{info.awardMeta}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                        <div className="bg-amber-100 p-2 rounded">
                                            <div className="text-amber-800 font-bold text-lg sm:text-xl">{info.goldCount}</div>
                                            <div className="text-xs text-gray-600">เหรียญทอง</div>
                                        </div>
                                        <div className="bg-gray-200 p-2 rounded">
                                            <div className="text-gray-800 font-bold text-lg sm:text-xl">{info.silverCount}</div>
                                            <div className="text-xs text-gray-600">เหรียญเงิน</div>
                                        </div>
                                        <div className="bg-amber-700 p-2 rounded">
                                            <div className="text-white font-bold text-lg sm:text-xl">{info.bronzeCount}</div>
                                            <div className="text-xs text-white">เหรียญทองแดง</div>
                                        </div>
                                        <div className="bg-blue-100 p-2 rounded">
                                            <div className="text-blue-800 font-bold text-lg sm:text-xl">{info.totalAwards}</div>
                                            <div className="text-xs text-blue-600">รางวัลทั้งหมด</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">ผลสัมฤทธิ์ทางการเรียน</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm sm:text-base">ผลการสอบ O-NET {info.onetYear}</h4>
                                            <ul className="list-disc pl-4 sm:pl-5 text-gray-700 space-y-1 text-sm sm:text-base">
                                                <li>ภาษาไทย: {info.onetThai}%</li>
                                                <li>คณิตศาสตร์: {info.onetMath}%</li>
                                                <li>วิทยาศาสตร์: {info.onetScience}%</li>
                                                <li>ภาษาอังกฤษ: {info.onetEnglish}%</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm sm:text-base">อัตราการศึกษาต่อ</h4>
                                            <p className="text-gray-700 text-sm sm:text-base">{info.continuationRate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* แหล่งเรียนรู้ */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12 border-t-4 border-amber-500"
                    >
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-amber-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                                    <IoLibrary className="text-amber-600 text-lg sm:text-xl md:text-2xl" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-amber-800 leading-tight">แหล่งเรียนรู้และสิ่งอำนวยความสะดวก</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                {resourcesList.map((r, i) => (
                                    <motion.div key={i} whileHover={{ y: -2 }}
                                        className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
                                        <h3 className="font-semibold text-amber-800 text-sm sm:text-base leading-tight mb-1">{r.name}</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">{r.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AcademicInfo;
