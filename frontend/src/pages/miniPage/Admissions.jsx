import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { IoChevronBack, IoCalendar, IoTime, IoBook, IoPeople, IoLocation, IoSchool, IoPencil } from 'react-icons/io5';
import { useGetAdmissionsInfoQuery, useUpdateAdmissionsInfoMutation } from '../../services/admissionsApi';
import { useFetchSchoolInfoQuery } from '../../redux/features/about/aboutApi';
import { useGetCurrentAcademicYearQuery } from '../../services/academicApi';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { getApiURL } from '../../utils/apiConfig';
import admissionBannerDefault from '../../assets/images/student_register.jpg';

const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

const formatThaiDateRange = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const eMonth = THAI_MONTHS[e.getMonth()];
    const eYear = e.getFullYear() + 543;
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
        return `${s.getDate()} - ${e.getDate()} ${eMonth} ${eYear}`;
    }
    return `${s.getDate()} ${THAI_MONTHS[s.getMonth()]} ${s.getFullYear() + 543} - ${e.getDate()} ${eMonth} ${eYear}`;
};

const calcDuration = (start, end) => {
    if (!start || !end) return '';
    const diff = Math.round((new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00')) / 86400000) + 1;
    return diff > 0 ? `${diff} วัน` : '';
};

const formatTimeRange = (start, end) => {
    if (!start || !end) return '';
    const fmt = (t) => t.replace(':', '.');
    return `${fmt(start)} - ${fmt(end)} น.`;
};

const parseTimeInput = (rangeStr, index) => {
    // "08.30 - 16.30 น." → index 0 = "08:30", index 1 = "16:30"
    if (!rangeStr) return '';
    const clean = rangeStr.replace(/ น\.?$/, '').trim();
    const parts = clean.split(' - ');
    if (!parts[index]) return '';
    return parts[index].trim().replace('.', ':');
};

const parseBEDateToISO = (day, monthName, yearBE) => {
    const monthIndex = THAI_MONTHS.indexOf(monthName.trim());
    if (monthIndex === -1) return '';
    const yearCE = parseInt(yearBE) - 543;
    return `${yearCE}-${String(monthIndex + 1).padStart(2, '0')}-${String(parseInt(day)).padStart(2, '0')}`;
};

const parseDateRange = (rangeStr) => {
    if (!rangeStr) return { start: '', end: '' };
    // same month: "20 - 24 มีนาคม 2568"
    const sameMonth = rangeStr.match(/^(\d+)\s*-\s*(\d+)\s+(.+?)\s+(\d{4})$/);
    if (sameMonth) {
        const [, d1, d2, month, year] = sameMonth;
        return { start: parseBEDateToISO(d1, month, year), end: parseBEDateToISO(d2, month, year) };
    }
    // diff month: "20 มีนาคม 2568 - 3 เมษายน 2568"
    const diffMonth = rangeStr.match(/^(\d+)\s+(.+?)\s+(\d{4})\s*-\s*(\d+)\s+(.+?)\s+(\d{4})$/);
    if (diffMonth) {
        const [, d1, m1, y1, d2, m2, y2] = diffMonth;
        return { start: parseBEDateToISO(d1, m1, y1), end: parseBEDateToISO(d2, m2, y2) };
    }
    return { start: '', end: '' };
};

const DEFAULT_INFO = {
    bannerImage: '',
    dateRange: '20 - 24 มีนาคม 2568',
    duration: '5 วัน',
    timeRange: '08.30 - 16.30 น.',
    lunchBreak: '12.00 - 13.00 น.',
    location: 'หอประชุมโรงเรียนท่าบ่อพิทยาคม',
    mapUrl: 'https://maps.app.goo.gl/JjyLSd5zevNbi7W69',
    grade1Info: 'มัธยมศึกษาปีที่ 1 (จำนวน 2 ห้องเรียน 80 คน)',
    grade4Info: 'มัธยมศึกษาปีที่ 4 (จำนวน 2 ห้องเรียน 80 คน)',
    documents: 'สำเนาทะเบียนบ้าน (นักเรียนและผู้ปกครอง)\nรูปถ่ายขนาด 1.5 นิ้ว (แต่งเครื่องแบบนักเรียน)\nเอกสารแสดงผลการเรียน (ปพ.1)\nสำเนาบัตรประชาชน (นักเรียนและผู้ปกครอง) จำนวน 2 ชุด\nสำเนาสูติบัตรนักเรียน (ใบเกิด)\nสำเนาทะเบียนฉบับสมบูรณ์ (กรณีเปลี่ยนชื่อ-นามสกุล)',
    conditions: 'นักเรียนชั้น ม.1 ต้องสำเร็จการศึกษาชั้น ป.6 หรือเทียบเท่า\nนักเรียนชั้น ม.4 ต้องสำเร็จการศึกษาชั้น ม.3 หรือเทียบเท่า\nกรณีมีผู้สมัครเกินจำนวนรับ จะพิจารณาตามเกณฑ์ของโรงเรียน\nรายงานตัว/มอบตัว วันที่ 04 เมษายน 2568',
    contactName: 'ครูวิไลลักษณ์ อ่างแก้ว',
    contactPhone: '084-548-0055',
    facebookUrl: 'https://www.facebook.com/share/p/1BtR4T1s3s/',
    facebookName: 'โรงเรียนท่าบ่อพิทยาคม',
};

const Admissions = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(DEFAULT_INFO);
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [admStartDate, setAdmStartDate] = useState('');
    const [admEndDate, setAdmEndDate] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [lunchStartTime, setLunchStartTime] = useState('');
    const [lunchEndTime, setLunchEndTime] = useState('');

    const user = useSelector(selectCurrentUser);
    const currentUserRole = typeof user?.role === 'object'
        ? user?.role?.roleName || user?.role?.name || 'user'
        : user?.role || 'user';
    const isAdmin = currentUserRole === 'admin' || currentUserRole === 'super_admin';

    const { data: admissionsInfo, isLoading } = useGetAdmissionsInfoQuery();
    const { data: schoolInfo } = useFetchSchoolInfoQuery();
    const { data: currentYear } = useGetCurrentAcademicYearQuery();
    const [updateAdmissionsInfo, { isLoading: isSaving }] = useUpdateAdmissionsInfoMutation();

    useEffect(() => {
        if (admissionsInfo) {
            setForm({
                bannerImage: admissionsInfo.bannerImage || DEFAULT_INFO.bannerImage,
                dateRange: admissionsInfo.dateRange || DEFAULT_INFO.dateRange,
                duration: admissionsInfo.duration || DEFAULT_INFO.duration,
                timeRange: admissionsInfo.timeRange || DEFAULT_INFO.timeRange,
                lunchBreak: admissionsInfo.lunchBreak || DEFAULT_INFO.lunchBreak,
                location: admissionsInfo.location || DEFAULT_INFO.location,
                mapUrl: admissionsInfo.mapUrl || DEFAULT_INFO.mapUrl,
                grade1Info: admissionsInfo.grade1Info || DEFAULT_INFO.grade1Info,
                grade4Info: admissionsInfo.grade4Info || DEFAULT_INFO.grade4Info,
                documents: admissionsInfo.documents || DEFAULT_INFO.documents,
                conditions: admissionsInfo.conditions || DEFAULT_INFO.conditions,
                contactName: admissionsInfo.contactName || DEFAULT_INFO.contactName,
                contactPhone: admissionsInfo.contactPhone || DEFAULT_INFO.contactPhone,
                facebookUrl: admissionsInfo.facebookUrl || DEFAULT_INFO.facebookUrl,
                facebookName: admissionsInfo.facebookName || DEFAULT_INFO.facebookName,
            });
        }
    }, [admissionsInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleStartDateChange = (e) => {
        const val = e.target.value;
        setAdmStartDate(val);
        if (val && admEndDate) {
            setForm(prev => ({
                ...prev,
                dateRange: formatThaiDateRange(val, admEndDate),
                duration: calcDuration(val, admEndDate),
            }));
        }
    };

    const handleEndDateChange = (e) => {
        const val = e.target.value;
        setAdmEndDate(val);
        if (admStartDate && val) {
            setForm(prev => ({
                ...prev,
                dateRange: formatThaiDateRange(admStartDate, val),
                duration: calcDuration(admStartDate, val),
            }));
        }
    };

    const handleOpenTimeChange = (e) => {
        const val = e.target.value;
        setOpenTime(val);
        setForm(prev => ({ ...prev, timeRange: formatTimeRange(val, closeTime) }));
    };

    const handleCloseTimeChange = (e) => {
        const val = e.target.value;
        setCloseTime(val);
        setForm(prev => ({ ...prev, timeRange: formatTimeRange(openTime, val) }));
    };

    const handleLunchStartChange = (e) => {
        const val = e.target.value;
        setLunchStartTime(val);
        setForm(prev => ({ ...prev, lunchBreak: formatTimeRange(val, lunchEndTime) }));
    };

    const handleLunchEndChange = (e) => {
        const val = e.target.value;
        setLunchEndTime(val);
        setForm(prev => ({ ...prev, lunchBreak: formatTimeRange(lunchStartTime, val) }));
    };

    const validateImageFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ไม่ถูกต้อง', text: 'รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WebP, GIF)', confirmButtonColor: '#d97706' });
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: 'ขนาดไฟล์ต้องไม่เกิน 5MB', confirmButtonColor: '#d97706' });
            return false;
        }
        return true;
    };

    const handleBannerFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && validateImageFile(file)) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerUpload = async () => {
        if (!bannerFile) return form.bannerImage;
        setIsUploadingBanner(true);
        try {
            const formData = new FormData();
            formData.append('image', bannerFile);
            const response = await fetch(getApiURL('upload/image'), {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.imageUrl || data.url || data.filePath || '';
        } catch {
            Swal.fire({ icon: 'error', title: 'อัปโหลดรูปภาพไม่สำเร็จ', confirmButtonColor: '#d97706' });
            return form.bannerImage;
        } finally {
            setIsUploadingBanner(false);
        }
    };

    const handleSave = async () => {
        try {
            const uploadedBannerImage = await handleBannerUpload();
            const payload = { ...form, bannerImage: uploadedBannerImage };
            await updateAdmissionsInfo(payload).unwrap();
            setBannerFile(null);
            setBannerPreview('');
            setAdmStartDate('');
            setAdmEndDate('');
            setOpenTime('');
            setCloseTime('');
            setLunchStartTime('');
            setLunchEndTime('');
            setIsEditing(false);
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'ข้อมูลการรับสมัครถูกอัปเดตแล้ว', timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
        }
    };

    const handleCancel = () => {
        if (admissionsInfo) {
            setForm({
                bannerImage: admissionsInfo.bannerImage || DEFAULT_INFO.bannerImage,
                dateRange: admissionsInfo.dateRange || DEFAULT_INFO.dateRange,
                duration: admissionsInfo.duration || DEFAULT_INFO.duration,
                timeRange: admissionsInfo.timeRange || DEFAULT_INFO.timeRange,
                lunchBreak: admissionsInfo.lunchBreak || DEFAULT_INFO.lunchBreak,
                location: admissionsInfo.location || DEFAULT_INFO.location,
                mapUrl: admissionsInfo.mapUrl || DEFAULT_INFO.mapUrl,
                grade1Info: admissionsInfo.grade1Info || DEFAULT_INFO.grade1Info,
                grade4Info: admissionsInfo.grade4Info || DEFAULT_INFO.grade4Info,
                documents: admissionsInfo.documents || DEFAULT_INFO.documents,
                conditions: admissionsInfo.conditions || DEFAULT_INFO.conditions,
                contactName: admissionsInfo.contactName || DEFAULT_INFO.contactName,
                contactPhone: admissionsInfo.contactPhone || DEFAULT_INFO.contactPhone,
                facebookUrl: admissionsInfo.facebookUrl || DEFAULT_INFO.facebookUrl,
                facebookName: admissionsInfo.facebookName || DEFAULT_INFO.facebookName,
            });
        } else {
            setForm(DEFAULT_INFO);
        }
        setBannerFile(null);
        setBannerPreview('');
        setAdmStartDate('');
        setAdmEndDate('');
        setOpenTime('');
        setCloseTime('');
        setLunchStartTime('');
        setLunchEndTime('');
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

    const displayYear = currentYear?.year || '...';

    const documentsList = (form.documents || '').split('\n').filter(Boolean);
    const conditionsList = (form.conditions || '').split('\n').filter(Boolean);

    const bannerSrc = bannerPreview
        || (form.bannerImage
            ? (form.bannerImage.startsWith('http')
                ? form.bannerImage
                : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}/${form.bannerImage}`)
            : '')
        || admissionBannerDefault;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-amber-600 text-lg">กำลังโหลดข้อมูล...</div>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 text-gray-800" style={{ minWidth: '320px' }}>
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
                <img
                    src={schoolInfo?.heroImage || '/thabo_school.jpg'}
                    alt="รับสมัครนักเรียนโรงเรียนท่าบ่อพิทยาคม"
                    className="w-full h-[400px] object-cover"
                />
                <div className="container relative z-20 mx-auto px-4 py-20 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        รับสมัครนักเรียนใหม่
                    </h1>
                    <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
                        ปีการศึกษา {displayYear}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-white/90">
                        โรงเรียนท่าบ่อพิทยาคม เปิดรับสมัครนักเรียนชั้น ม.1 และ ม.4
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Back Button + Edit Button Row */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <Link
                            to="/"
                            className="flex items-center text-amber-700 hover:text-amber-900 transition-colors text-sm sm:text-base"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <motion.div animate={{ x: isHovered ? -3 : 0 }} transition={{ type: 'spring', stiffness: 500 }}>
                                <IoChevronBack className="mr-1" />
                            </motion.div>
                            กลับหน้าหลัก
                        </Link>
                        {isAdmin && !isEditing && (
                            <button
                                onClick={() => {
                                    const { start, end } = parseDateRange(form.dateRange);
                                    setAdmStartDate(start);
                                    setAdmEndDate(end);
                                    setOpenTime(parseTimeInput(form.timeRange, 0));
                                    setCloseTime(parseTimeInput(form.timeRange, 1));
                                    setLunchStartTime(parseTimeInput(form.lunchBreak, 0));
                                    setLunchEndTime(parseTimeInput(form.lunchBreak, 1));
                                    setIsEditing(true);
                                }}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <IoPencil /> แก้ไขข้อมูลการรับสมัคร
                            </button>
                        )}
                    </div>

                    {/* Admin Edit Panel */}
                    {isAdmin && isEditing && (
                        <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-8 shadow">
                            <h3 className="text-lg font-bold text-amber-800 mb-6">แก้ไขข้อมูลการรับสมัคร</h3>

                            {/* Banner Image Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">รูปภาพประชาสัมพันธ์</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <img
                                        src={bannerSrc}
                                        alt="banner preview"
                                        className="w-full sm:w-64 h-36 object-cover rounded-lg border border-amber-300"
                                    />
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerFileSelect}
                                            className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG, WebP (ไม่เกิน 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">วันเริ่มรับสมัคร</label>
                                    <input type="date" value={admStartDate} onChange={handleStartDateChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">วันสิ้นสุดรับสมัคร</label>
                                    <input type="date" value={admEndDate} onChange={handleEndDateChange}
                                        min={admStartDate || undefined}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                {admStartDate && admEndDate && (
                                    <div className="md:col-span-2 bg-white border border-amber-300 rounded-lg px-4 py-2.5 text-sm text-amber-800">
                                        <span className="font-medium">ช่วงวันที่รับสมัคร: </span>
                                        {form.dateRange}
                                        <span className="text-amber-600 ml-2">({form.duration})</span>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">เวลาเปิดรับสมัคร</label>
                                    <div className="flex items-center gap-2">
                                        <input type="time" value={openTime} onChange={handleOpenTimeChange}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                        <span className="text-gray-500 text-sm">ถึง</span>
                                        <input type="time" value={closeTime} onChange={handleCloseTimeChange}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    {openTime && closeTime && (
                                        <p className="text-xs text-amber-700 mt-1">{form.timeRange}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">หยุดพักกลางวัน</label>
                                    <div className="flex items-center gap-2">
                                        <input type="time" value={lunchStartTime} onChange={handleLunchStartChange}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                        <span className="text-gray-500 text-sm">ถึง</span>
                                        <input type="time" value={lunchEndTime} onChange={handleLunchEndChange}
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    {lunchStartTime && lunchEndTime && (
                                        <p className="text-xs text-amber-700 mt-1">{form.lunchBreak}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">สถานที่รับสมัคร</label>
                                    <input type="text" name="location" value={form.location} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ลิงก์แผนที่ (Google Maps URL)</label>
                                    <input type="text" name="mapUrl" value={form.mapUrl} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ข้อมูลระดับชั้น ม.1</label>
                                    <input type="text" name="grade1Info" value={form.grade1Info} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ข้อมูลระดับชั้น ม.4</label>
                                    <input type="text" name="grade4Info" value={form.grade4Info} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อผู้ติดต่อ</label>
                                    <input type="text" name="contactName" value={form.contactName} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทรผู้ติดต่อ</label>
                                    <input type="text" name="contactPhone" value={form.contactPhone} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อ Facebook</label>
                                    <input type="text" name="facebookName" value={form.facebookName} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">ลิงก์ Facebook URL</label>
                                    <input type="text" name="facebookUrl" value={form.facebookUrl} onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">เอกสารที่ต้องเตรียม (แต่ละรายการขึ้นบรรทัดใหม่)</label>
                                    <textarea name="documents" value={form.documents} onChange={handleChange} rows={6}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">เงื่อนไขการรับสมัคร (แต่ละรายการขึ้นบรรทัดใหม่)</label>
                                    <textarea name="conditions" value={form.conditions} onChange={handleChange} rows={6}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y" />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || isUploadingBanner}
                                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
                                >
                                    {isSaving || isUploadingBanner ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg text-sm transition-colors"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Banner Image */}
                    <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
                        <motion.img
                            src={bannerSrc}
                            alt="รับสมัครนักเรียนโรงเรียนท่าบ่อพิทยาคม"
                            className="w-full h-auto object-cover"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        />
                    </div>

                    {/* Admission Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden mb-8 sm:mb-12 border-t-4 border-amber-500">
                        <div className="md:flex">
                            <div className="md:w-full p-4 sm:p-6 md:p-8">
                                <div className="flex items-center mb-6 sm:mb-8">
                                    <div className="bg-amber-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                                        <IoSchool className="text-amber-600 text-lg sm:text-xl md:text-2xl" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">
                                        รายละเอียดการรับสมัคร ปีการศึกษา {displayYear}
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
                                                <p className="text-gray-600 text-sm sm:text-base">{form.dateRange}</p>
                                                <p className="text-gray-500 text-xs sm:text-sm mt-1">(ระยะเวลารับสมัคร {form.duration})</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                                <IoTime className="text-amber-600 text-base sm:text-lg md:text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">เวลาเปิดรับสมัคร</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">{form.timeRange}</p>
                                                <p className="text-gray-500 text-xs sm:text-sm mt-1">(หยุดรับสมัครเวลา {form.lunchBreak})</p>
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
                                                <p className="text-gray-600 text-sm sm:text-base">{form.location}</p>
                                                {form.mapUrl && (
                                                    <a
                                                        href={form.mapUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-amber-700 hover:underline mt-1 inline-flex items-center text-xs sm:text-sm"
                                                    >
                                                        ดูแผนที่ <span className="ml-1">↗</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                                <IoBook className="text-amber-600 text-base sm:text-lg md:text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">ระดับชั้นที่เปิดรับ</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">{form.grade1Info}</p>
                                                <p className="text-gray-600 text-sm sm:text-base">{form.grade4Info}</p>
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
                                        {documentsList.map((doc, i) => <li key={i}>{doc}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-amber-800 mb-3 sm:mb-4 flex items-center">
                                        <IoPeople className="mr-2 text-amber-600 text-base sm:text-lg" />
                                        เงื่อนไขการรับสมัคร
                                    </h3>
                                    <ul className="list-disc pl-4 sm:pl-5 text-gray-700 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                                        {conditionsList.map((cond, i) => <li key={i}>{cond}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-6 text-center">
                                <p className="text-amber-700 font-medium text-sm sm:text-base mb-2">
                                    สอบถามเพิ่มเติม: {form.contactName} โทร. {form.contactPhone} (เวลาราชการ)
                                </p>
                                {form.facebookUrl && (
                                    <p className="text-amber-700 font-medium text-sm sm:text-base">
                                        หรือที่เพจ Facebook:{' '}
                                        <a
                                            href={form.facebookUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-amber-900"
                                        >
                                            {form.facebookName}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Admissions;