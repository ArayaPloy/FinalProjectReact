import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useFetchCompleteHistoryQuery,
    useUpdateSchoolInfoMutation,
    useAddTimelineEventMutation,
    useUpdateTimelineEventMutation,
    useDeleteTimelineEventMutation
} from '../../../redux/features/about/aboutApi';

import { DatePicker, Form, Input, ConfigProvider } from 'antd';
import moment from 'moment';
import 'antd/dist/reset.css'; // Make sure to import Ant Design styles

// Custom theme configuration for DatePicker
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
    const { data: historyData, error, isLoading, refetch } = useFetchCompleteHistoryQuery();
    const [updateSchoolInfo] = useUpdateSchoolInfoMutation();
    const [addTimelineEvent] = useAddTimelineEventMutation();
    const [updateTimelineEvent] = useUpdateTimelineEventMutation();
    const [deleteTimelineEvent] = useDeleteTimelineEventMutation();

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
        year: null,
        date: null,
        title: '',
        description: ''
    };

    const [schoolInfoForm, setSchoolInfoForm] = useState(defaultSchoolInfo);
    const [eventForm, setEventForm] = useState(defaultEventForm);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

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
            showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
            console.error('Error updating school info:', error);
        }
    };

    const handleAddEvent = async () => {
        try {
            // Format the payload to match the expected API format
            const payload = {
                ...eventForm,
                year: eventForm.year ? eventForm.year.format('YYYY') : null,
                date: eventForm.date ? eventForm.date.format('YYYY-MM-DD') : null
            };
            await addTimelineEvent(payload).unwrap();
            setShowAddEvent(false);
            setEventForm(defaultEventForm);
            showNotification('เพิ่มเหตุการณ์ใหม่เรียบร้อยแล้ว');
            refetch();
        } catch (error) {
            showNotification('เกิดข้อผิดพลาดในการเพิ่มเหตุการณ์', 'error');
            console.error('Error adding event:', error);
        }
    };

    const handleUpdateEvent = async (eventId) => {
        try {
            // Format the payload to match the expected API format
            const payload = {
                ...eventForm,
                year: eventForm.year ? eventForm.year.format('YYYY') : null,
                date: eventForm.date ? eventForm.date.format('YYYY-MM-DD') : null
            };
            await updateTimelineEvent({ id: eventId, ...payload }).unwrap();
            setEditingEventId(null);
            setEventForm(defaultEventForm);
            showNotification('แก้ไขเหตุการณ์เรียบร้อยแล้ว');
            refetch();
        } catch (error) {
            showNotification('เกิดข้อผิดพลาดในการแก้ไขเหตุการณ์', 'error');
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('คุณต้องการลบเหตุการณ์นี้หรือไม่?')) {
            try {
                await deleteTimelineEvent(eventId).unwrap();
                showNotification('ลบเหตุการณ์เรียบร้อยแล้ว');
                refetch();
            } catch (error) {
                showNotification('เกิดข้อผิดพลาดในการลบเหตุการณ์', 'error');
                console.error('Error deleting event:', error);
            }
        }
    };

    const startEditingEvent = (event) => {
        setEditingEventId(event.id);
        setEventForm({
            year: event.year ? moment(event.year.toString(), 'YYYY') : null,
            date: event.date ? moment(event.date) : null, // moment can auto-parse ISO dates
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

    const timelineEvents = historyData?.timeline || [];

    return (
        <ConfigProvider theme={customTheme}>
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
                            <nav className="flex space-x-8 px-6">
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
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">ข้อมูลโรงเรียน</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        isEditing
                                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    }`}
                                >
                                    {isEditing ? 'ยกเลิก' : 'แก้ไข'}
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
                                    <Input
                                        name="foundedDate"
                                        value={schoolInfoForm.foundedDate}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">ผู้อำนวยการปัจจุบัน</label>
                                    <Input
                                        name="currentDirector"
                                        value={schoolInfoForm.currentDirector}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
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
                                    <label className="block mb-2 text-sm font-medium text-gray-700">แผนก</label>
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
                                    <label className="block mb-2 text-sm font-medium text-gray-700">รูปภาพหลัก</label>
                                    <Input
                                        name="heroImage"
                                        value={schoolInfoForm.heroImage}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">รูปภาพผู้อำนวยการ</label>
                                    <Input
                                        name="director_image"
                                        value={schoolInfoForm.director_image}
                                        onChange={handleSchoolInfoChange}
                                        disabled={!isEditing}
                                        className="w-full"
                                    />
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
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
                                    >
                                        บันทึกข้อมูล
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline Add / Edit Form */}
                    {activeTab === 'timeline' && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <button onClick={() => setShowAddEvent(!showAddEvent)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                {showAddEvent ? 'ยกเลิก' : 'เพิ่มเหตุการณ์'}
                            </button>

                            {showAddEvent && (
                                <div className="mt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">ปี</label>
                                            <DatePicker
                                                picker="year"
                                                value={eventForm.year}
                                                onChange={(date, dateString) => handleEventDateChange(date, dateString, 'year')}
                                                className="w-full"
                                                placeholder="เลือกปี"
                                                style={{ height: '40px' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">วันที่</label>
                                            <DatePicker
                                                value={eventForm.date}
                                                onChange={(date, dateString) => handleEventDateChange(date, dateString, 'date')}
                                                className="w-full"
                                                placeholder="เลือกวันที่"
                                                style={{ height: '40px' }}
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
                                        <div className="md:col-span-2">
                                            <button
                                                onClick={handleAddEvent}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                                            >
                                                เพิ่มเหตุการณ์
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">ปี</label>
                                        <DatePicker
                                            picker="year"
                                            value={eventForm.year}
                                            onChange={(date) => handleEventDateChange(date, null, 'year')}
                                            className="w-full"
                                            placeholder="เลือกปี"
                                            style={{ height: '40px' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">วันที่</label>
                                        <DatePicker
                                            value={eventForm.date}
                                            onChange={(date) => handleEventDateChange(date, null, 'date')}
                                            className="w-full"
                                            placeholder="เลือกวันที่"
                                            style={{ height: '40px' }}
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
                                            value={eventForm.description}
                                            onChange={handleEventFormChange}
                                            rows={4}
                                            placeholder="ใส่รายละเอียดเหตุการณ์"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex space-x-2">
                                        <button
                                            onClick={() => handleUpdateEvent(event.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            บันทึก
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            ยกเลิก
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
                                                    {moment(event.date).format('DD/MM/YYYY')}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                                        <p className="text-gray-700">{event.description}</p>
                                    </div>
                                    <div className="flex space-x-2 ml-4 flex-shrink-0">
                                        <button 
                                            onClick={() => startEditingEvent(event)} 
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                        >
                                            แก้ไข
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteEvent(event.id)} 
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            ลบ
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