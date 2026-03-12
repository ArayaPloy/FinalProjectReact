import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { showApiError } from '../../../utils/sweetAlertHelper';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import {
    useFetchCompleteHistoryQuery,
    useUpdateSchoolInfoMutation,
    useAddTimelineEventMutation,
    useUpdateTimelineEventMutation,
    useDeleteTimelineEventMutation
} from '../../../redux/features/about/aboutApi';
import { useFetchTeachersQuery } from '../../../redux/features/teachers/teachersApi';
import { getApiURL } from '../../../utils/apiConfig';
import { MdModeEdit, MdDelete, MdClose, MdSave, MdAdd } from 'react-icons/md';
import { formatDate } from '../../../utils/dateFormater';

import { DatePicker, Form, Input, ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/th'; // Import Thai locale
import thTH from 'antd/locale/th_TH';
import 'antd/dist/reset.css';

// Set moment to use Thai locale
moment.locale('th'); 

// Custom theme for DatePicker
const customTheme = {
    token: {
        colorPrimary: '#f59e0b', // amber-500
        colorPrimaryHover: '#d97706', // amber-600
        colorPrimaryActive: '#d97706',
        borderRadius: 8,
        controlHeight: 40,
        fontSize: 14,
    },
    components: {
        DatePicker: {
            hoverBorderColor: '#f59e0b',
            activeBorderColor: '#f59e0b',
            colorBorder: '#d1d5db', // gray-300
            colorBgElevated: '#ffffff',
            boxShadowSecondary: '0 0 0 2px rgba(245, 158, 11, 0.2)',
        },
    },
};

const SchoolHistoryAdmin = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = ['admin', 'super_admin'].includes((currentUser?.role || '').toLowerCase());

    const { data: historyData, error, isLoading, refetch } = useFetchCompleteHistoryQuery();
    const [updateSchoolInfo] = useUpdateSchoolInfoMutation();
    const [addTimelineEvent] = useAddTimelineEventMutation();
    const [updateTimelineEvent] = useUpdateTimelineEventMutation();
    const [deleteTimelineEvent] = useDeleteTimelineEventMutation();
    const { data: teachers = [] } = useFetchTeachersQuery();

    const [activeTab, setActiveTab] = useState('school-info');
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [showAddEvent, setShowAddEvent] = useState(false);

    const defaultSchoolInfo = {
        name: '',
        location: '',
        foundedDate: '',
        currentDirector: '',
        education_level: '',
        department: '',
        description: '',
        heroImage: '',
        director_image: '',
        director_quote: ''
    };

    const defaultEventForm = {
        date: null,
        title: '',
        description: ''
    };

    const [schoolInfoForm, setSchoolInfoForm] = useState(defaultSchoolInfo);
    const [eventForm, setEventForm] = useState(defaultEventForm);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [foundedDateMoment, setFoundedDateMoment] = useState(null);

    // States สำหรับ upload รูปภาพหลัก
    const [heroImageFile, setHeroImageFile] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState('');
    const [isUploadingHero, setIsUploadingHero] = useState(false);
    const [heroUploadError, setHeroUploadError] = useState('');

    // States สำหรับ upload รูปภาพผู้อำนวยการ
    const [directorImageFile, setDirectorImageFile] = useState(null);
    const [directorImagePreview, setDirectorImagePreview] = useState('');
    const [isUploadingDirector, setIsUploadingDirector] = useState(false);
    const [directorUploadError, setDirectorUploadError] = useState('');

    useEffect(() => {
        if (historyData?.schoolInfo) {
            setSchoolInfoForm({
                name: historyData.schoolInfo.name || '',
                location: historyData.schoolInfo.location || '',
                foundedDate: historyData.schoolInfo.foundedDate || '',
                currentDirector: historyData.schoolInfo.currentDirector || '',
                education_level: historyData.schoolInfo.education_level || '',
                department: historyData.schoolInfo.department || '',
                description: historyData.schoolInfo.description || '',
                heroImage: historyData.schoolInfo.heroImage || '',
                director_image: historyData.schoolInfo.director_image || '',
                director_quote: historyData.schoolInfo.director_quote || ''
            });
            // Convert foundedDate to moment object
            if (historyData.schoolInfo.foundedDate) {
                setFoundedDateMoment(moment(historyData.schoolInfo.foundedDate));
            }
        }
    }, [historyData]);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSchoolInfoChange = (e) => {
        const { name, value } = e.target;
        setSchoolInfoForm(prev => ({ ...prev, [name]: value || '' }));
    };

    const handleFoundedDateChange = (date) => {
        setFoundedDateMoment(date);
        if (date) {
            setSchoolInfoForm(prev => ({ ...prev, foundedDate: date.format('YYYY-MM-DD') }));
        } else {
            setSchoolInfoForm(prev => ({ ...prev, foundedDate: '' }));
        }
    };

    const validateImageFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) return 'กรุณาเลือกไฟล์รูปภาพ (JPEG, JPG, PNG, GIF, WEBP)';
        if (file.size > 5 * 1024 * 1024) return 'ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)';
        return null;
    };

    const handleHeroFileSelect = (e) => {
        const file = e.target.files[0];
        setHeroUploadError('');
        if (!file) return;
        const err = validateImageFile(file);
        if (err) { setHeroUploadError(err); return; }
        setHeroImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setHeroImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleHeroImageUpload = async () => {
        if (!heroImageFile) return;
        setIsUploadingHero(true);
        setHeroUploadError('');
        try {
            const formData = new FormData();
            formData.append('image', heroImageFile);
            const response = await fetch(getApiURL('/upload/image'), { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                setSchoolInfoForm(prev => ({ ...prev, heroImage: data.imageUrl }));
                setHeroImageFile(null);
                showNotification('อัปโหลดรูปภาพหลักสำเร็จ');
            } else {
                setHeroUploadError(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
            }
        } catch {
            setHeroUploadError('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองอีกครั้ง');
        } finally {
            setIsUploadingHero(false);
        }
    };

    const handleRemoveHeroImage = () => {
        setHeroImageFile(null);
        setHeroImagePreview('');
        setHeroUploadError('');
        setSchoolInfoForm(prev => ({ ...prev, heroImage: '' }));
    };

    const handleDirectorFileSelect = (e) => {
        const file = e.target.files[0];
        setDirectorUploadError('');
        if (!file) return;
        const err = validateImageFile(file);
        if (err) { setDirectorUploadError(err); return; }
        setDirectorImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setDirectorImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDirectorImageUpload = async () => {
        if (!directorImageFile) return;
        setIsUploadingDirector(true);
        setDirectorUploadError('');
        try {
            const formData = new FormData();
            formData.append('image', directorImageFile);
            const response = await fetch(getApiURL('/upload/teacher-image'), { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                setSchoolInfoForm(prev => ({ ...prev, director_image: data.imageUrl }));
                setDirectorImageFile(null);
                showNotification('อัปโหลดรูปภาพผู้อำนวยการสำเร็จ');
            } else {
                setDirectorUploadError(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
            }
        } catch {
            setDirectorUploadError('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองอีกครั้ง');
        } finally {
            setIsUploadingDirector(false);
        }
    };

    const handleRemoveDirectorImage = () => {
        setDirectorImageFile(null);
        setDirectorImagePreview('');
        setDirectorUploadError('');
        setSchoolInfoForm(prev => ({ ...prev, director_image: '' }));
    };

    const handleEventFormChange = (e) => {
        const { name, value } = e.target;
        setEventForm(prev => ({ ...prev, [name]: value || '' }));
    };

    const handleEventDateChange = (date, dateString, field) => {
        setEventForm(prev => ({ ...prev, [field]: date }));
    };

    const handleSaveSchoolInfo = async () => {
        try {
            await updateSchoolInfo(schoolInfoForm).unwrap();
            setIsEditing(false);
            showNotification('บันทึกข้อมูลโรงเรียนเรียบร้อยแล้ว');
            refetch();
        } catch (error) {
            if (error?.status === 403) {
                showApiError(error, '', 'บันทึกข้อมูลโรงเรียน');
            } else {
                showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
            }
            console.error('Error updating school info:', error);
        }
    };

    const handleAddEvent = async () => {
        try {
            // Format the payload to match the expected API format
            const payload = {
                title: eventForm.title,
                description: eventForm.description,
                date: eventForm.date ? eventForm.date.format('YYYY-MM-DD') : null,
                year: eventForm.date ? eventForm.date.format('YYYY') : null // Extract year from date
            };
            await addTimelineEvent(payload).unwrap();
            setShowAddEvent(false);
            setEventForm(defaultEventForm);
            showNotification('เพิ่มเหตุการณ์ใหม่เรียบร้อยแล้ว');
            refetch();
        } catch (error) {
            if (error?.status === 403) {
                showApiError(error, '', 'เพิ่มเหตุการณ์');
            } else {
                showNotification('เกิดข้อผิดพลาดในการเพิ่มเหตุการณ์', 'error');
            }
            console.error('Error adding event:', error);
        }
    };

    const handleUpdateEvent = async (eventId) => {
        try {
            // Format the payload to match the expected API format
            const payload = {
                title: eventForm.title,
                description: eventForm.description,
                date: eventForm.date ? eventForm.date.format('YYYY-MM-DD') : null,
                year: eventForm.date ? eventForm.date.format('YYYY') : null // Extract year from date
            };
            await updateTimelineEvent({ id: eventId, ...payload }).unwrap();
            setEditingEventId(null);
            setEventForm(defaultEventForm);
            showNotification('แก้ไขเหตุการณ์เรียบร้อยแล้ว');
            refetch();
        } catch (error) {
            if (error?.status === 403) {
                showApiError(error, '', 'แก้ไขเหตุการณ์');
            } else {
                showNotification('เกิดข้อผิดพลาดในการแก้ไขเหตุการณ์', 'error');
            }
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบเหตุการณ์นี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await deleteTimelineEvent(eventId).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'ลบสำเร็จ',
                    text: 'ลบเหตุการณ์เรียบร้อยแล้ว',
                    timer: 2000,
                    showConfirmButton: false
                });
                refetch();
            } catch (error) {
                showApiError(error, 'ไม่สามารถลบเหตุการณ์ได้', 'ลบเหตุการณ์');
                console.error('Error deleting event:', error);
            }
        }
    };

    const startEditingEvent = (event) => {
        setEditingEventId(event.id);
        // Convert date string to moment object for DatePicker
        const eventDate = event.date ? moment(event.date, 'YYYY-MM-DD') : null;
        setEventForm({
            date: eventDate,
            title: event.title || '',
            description: event.description || ''
        });
    };

    const cancelEditing = () => {
        setEditingEventId(null);
        setShowAddEvent(false);
        setEventForm(defaultEventForm);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
                    <div className="text-5xl mb-3">🔒</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
                    <p className="text-gray-500 text-sm">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
                </div>
            </div>
        );
    }

    const timelineEvents = historyData?.timeline || [];

    return (
        <ConfigProvider theme={customTheme} locale={thTH}>
            <div className="min-h-screen bg-gray-50 py-8">
                <AnimatePresence>
                    {notification.show && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header Navigation Tabs */}
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('school-info')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'school-info'
                                            ? 'border-amber-500 text-amber-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    ข้อมูลโรงเรียน
                                </button>
                                <button
                                    onClick={() => setActiveTab('timeline')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'timeline'
                                            ? 'border-amber-500 text-amber-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    ประวัติความเป็นมา
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* School Information Tab */}
                    {activeTab === 'school-info' && (
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ข้อมูลโรงเรียน</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isEditing
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    }`}
                                >
                                    {isEditing ? <><MdClose className="w-4 h-4" /> ยกเลิก</> : <><MdModeEdit className="w-4 h-4" /> แก้ไข</>}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">ชื่อโรงเรียน</label>
                                    <Input
                                        name="name"
                                        value={schoolInfoForm.name}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">ที่ตั้ง</label>
                                    <Input
                                        name="location"
                                        value={schoolInfoForm.location}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">วันที่ก่อตั้ง</label>
                                    {isEditing ? (
                                        <DatePicker
                                            value={foundedDateMoment}
                                            onChange={handleFoundedDateChange}
                                            className="w-full"
                                            placeholder="เลือกวันที่ก่อตั้ง"
                                            style={{ height: '40px' }}
                                            format="DD/MM/YYYY"
                                        />
                                    ) : (
                                        <Input
                                            value={schoolInfoForm.foundedDate ? moment(schoolInfoForm.foundedDate).format('DD/MM/YYYY') : ''}
                                            disabled
                                            className="w-full"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">ผู้อำนวยการปัจจุบัน</label>
                                    {isEditing ? (
                                        <select
                                            name="currentDirector"
                                            value={schoolInfoForm.currentDirector}
                                            onChange={handleSchoolInfoChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                                        >
                                            <option value="">— เลือกผู้อำนวยการ —</option>
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.name}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            value={schoolInfoForm.currentDirector}
                                            disabled
                                            className="w-full"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">ระดับการศึกษา</label>
                                    <Input
                                        name="education_level"
                                        value={schoolInfoForm.education_level}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">สำนักงานเขต</label>
                                    <Input
                                        name="department"
                                        value={schoolInfoForm.department}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">รายละเอียดโรงเรียน</label>
                                    <Input.TextArea
                                        name="description"
                                        rows={4}
                                        value={schoolInfoForm.description}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">รูปภาพปกพื้นหลัง</label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            {(heroImagePreview || schoolInfoForm.heroImage) && (
                                                <div className="relative">
                                                    <img
                                                        src={heroImagePreview || schoolInfoForm.heroImage}
                                                        alt="Hero preview"
                                                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveHeroImage}
                                                        className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm hover:bg-red-600"
                                                    >×</button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                onChange={handleHeroFileSelect}
                                                className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                                            />
                                            {heroImageFile && (
                                                <button
                                                    type="button"
                                                    onClick={handleHeroImageUpload}
                                                    disabled={isUploadingHero}
                                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 rounded-lg disabled:bg-gray-400"
                                                >
                                                    {isUploadingHero ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพหลัก'}
                                                </button>
                                            )}
                                            {heroUploadError && <p className="text-red-500 text-xs">{heroUploadError}</p>}
                                            {schoolInfoForm.heroImage && !heroImageFile && (
                                                <p className="text-green-600 text-xs">✓ รูปภาพพร้อมใช้งาน</p>
                                            )}
                                            <p className="text-xs text-gray-400">รองรับ: JPEG, PNG, GIF, WEBP (สูงสุด 5MB)</p>
                                        </div>
                                    ) : (
                                        schoolInfoForm.heroImage ? (
                                            <img src={schoolInfoForm.heroImage} alt="Hero" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
                                        ) : (
                                            <p className="text-gray-400 text-sm py-2">ยังไม่มีรูปภาพ</p>
                                        )
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">รูปภาพผู้อำนวยการ</label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            {(directorImagePreview || schoolInfoForm.director_image) && (
                                                <div className="relative">
                                                    <img
                                                        src={directorImagePreview || schoolInfoForm.director_image}
                                                        alt="Director preview"
                                                        className="w-32 h-40 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveDirectorImage}
                                                        className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full text-sm hover:bg-red-600"
                                                    >×</button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                onChange={handleDirectorFileSelect}
                                                className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                                            />
                                            {directorImageFile && (
                                                <button
                                                    type="button"
                                                    onClick={handleDirectorImageUpload}
                                                    disabled={isUploadingDirector}
                                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 rounded-lg disabled:bg-gray-400"
                                                >
                                                    {isUploadingDirector ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพผู้อำนวยการ'}
                                                </button>
                                            )}
                                            {directorUploadError && <p className="text-red-500 text-xs">{directorUploadError}</p>}
                                            {schoolInfoForm.director_image && !directorImageFile && (
                                                <p className="text-green-600 text-xs">✓ รูปภาพพร้อมใช้งาน</p>
                                            )}
                                            <p className="text-xs text-gray-400">รองรับ: JPEG, PNG, GIF, WEBP (สูงสุด 5MB)</p>
                                        </div>
                                    ) : (
                                        schoolInfoForm.director_image ? (
                                            <img src={schoolInfoForm.director_image} alt="Director" className="w-32 h-40 object-cover rounded-lg border border-gray-200" />
                                        ) : (
                                            <p className="text-gray-400 text-sm py-2">ยังไม่มีรูปภาพ</p>
                                        )
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">คำพูดผู้อำนวยการ</label>
                                    <Input.TextArea
                                        name="director_quote"
                                        rows={3}
                                        value={schoolInfoForm.director_quote}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleSaveSchoolInfo}
                                        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <MdSave className="w-4 h-4" /> บันทึกข้อมูล
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline Add / Edit Form */}
                    {activeTab === 'timeline' && (
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                            <button onClick={() => setShowAddEvent(!showAddEvent)}
                                    className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                {showAddEvent ? <><MdClose className="w-4 h-4" /> ยกเลิก</> : <><MdAdd className="w-4 h-4" /> เพิ่มเหตุการณ์</>}
                            </button>

                            {showAddEvent && (
                                <div className="mt-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">วันที่</label>
                                            <DatePicker
                                                value={eventForm.date}
                                                onChange={(date, dateString) => handleEventDateChange(date, dateString, 'date')}
                                                className="w-full"
                                                placeholder="เลือกวันที่"
                                                style={{ height: '40px' }}
                                                format="DD/MM/YYYY"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-sm font-medium">หัวข้อ</label>
                                            <Input
                                                name="title"
                                                value={eventForm.title}
                                                onChange={handleEventFormChange}
                                                placeholder="ใส่หัวข้อเหตุการณ์"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-sm font-medium">รายละเอียด</label>
                                            <Input.TextArea
                                                name="description"
                                                rows={4}
                                                value={eventForm.description}
                                                onChange={handleEventFormChange}
                                                placeholder="ใส่รายละเอียดเหตุการณ์"
                                            />
                                        </div>
                                        <div>
                                            <button
                                                onClick={handleAddEvent}
                                                className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                                            >
                                                <MdAdd className="w-4 h-4" /> เพิ่มเหตุการณ์
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline Events List */}
                    {activeTab === 'timeline' && timelineEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                            {editingEventId === event.id ? (
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">วันที่</label>
                                        <DatePicker
                                            value={eventForm.date}
                                            onChange={(date) => handleEventDateChange(date, null, 'date')}
                                            className="w-full"
                                            placeholder="เลือกวันที่"
                                            style={{ height: '40px' }}
                                            format="DD/MM/YYYY"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">หัวข้อ</label>
                                        <Input
                                            name="title"
                                            value={eventForm.title}
                                            onChange={handleEventFormChange}
                                            placeholder="ใส่หัวข้อเหตุการณ์"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">รายละเอียด</label>
                                        <Input.TextArea
                                            name="description"
                                            value={eventForm.description}
                                            onChange={handleEventFormChange}
                                            rows={4}
                                            placeholder="ใส่รายละเอียดเหตุการณ์"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleUpdateEvent(event.id)}
                                            className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <MdSave className="w-4 h-4" /> บันทึก
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <MdClose className="w-4 h-4" /> ยกเลิก
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            {event.year && (
                                                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium mr-2">
                                                    {event.year}
                                                </span>
                                            )}
                                            {event.date && (
                                                <span className="text-gray-600 text-sm">
                                                    {formatDate(event.date)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                                        <p className="text-gray-700">{event.description}</p>
                                    </div>
                                    <div className="flex space-x-2 ml-4 flex-shrink-0">
                                        <button 
                                            onClick={() => startEditingEvent(event)} 
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                        >
                                            <MdModeEdit className="w-4 h-4" /> แก้ไข
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteEvent(event.id)} 
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                        >
                                            <MdDelete className="w-4 h-4" /> ลบ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Empty state for timeline */}
                    {activeTab === 'timeline' && timelineEvents.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีเหตุการณ์ในไทม์ไลน์</h3>
                            <p className="text-gray-500 mb-6">เริ่มต้นสร้างประวัติความเป็นมาของโรงเรียนด้วยการเพิ่มเหตุการณ์แรก</p>
                            <button
                                onClick={() => setShowAddEvent(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium"
                            >
                                เพิ่มเหตุการณ์แรก
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ConfigProvider>
    );
};

export default SchoolHistoryAdmin;