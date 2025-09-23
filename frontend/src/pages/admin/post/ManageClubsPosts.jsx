import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    IoClose,
    IoCalendar,
    IoTime,
    IoFilter,
    IoAdd,
    IoTrash,
    IoCreate,
    IoSave,
    IoCheckmark,
    IoWarning,
} from 'react-icons/io5';

// Import the API hooks
import {
    useFetchClubsQuery,
    useFetchCategoriesQuery,
    useFetchClubStatsQuery,
    useClubManagement
} from '../../../redux/features/clubs/clubsApi'; // Adjust the path as needed

import {
    useFetchTeachersByDepartmentQuery
} from '../../../redux/features/teachers/teachersApi'; // Adjust the path as needed

const ManageClubsPosts = () => {
    // API hooks
    const { 
        data: clubsData = [], 
        isLoading: clubsLoading, 
        error: clubsError,
        refetch: refetchClubs 
    } = useFetchClubsQuery();
    
    const { 
        data: categoriesData = [], 
        isLoading: categoriesLoading 
    } = useFetchCategoriesQuery();
    
    const { 
        data: statsData, 
        isLoading: statsLoading 
    } = useFetchClubStatsQuery();

    const {
        data: teachersByDepartment = {},
        isLoading: teachersLoading
    } = useFetchTeachersByDepartmentQuery();

    const {
        createClub,
        updateClub,
        deleteClub,
        isCreating,
        isUpdating,
        isDeleting
    } = useClubManagement();

    // Local state
    const [activeTab, setActiveTab] = useState('clubs-list');
    const [editingClubId, setEditingClubId] = useState(null);
    const [showAddClub, setShowAddClub] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // Icon options
    const iconOptions = [
        { name: "IoColorPalette", component: <IoColorPalette className="text-green-600 text-2xl" />, color: "text-green-600" },
        { name: "IoFlask", component: <IoFlask className="text-blue-600 text-2xl" />, color: "text-blue-600" },
        { name: "IoCodeSlash", component: <IoCodeSlash className="text-purple-600 text-2xl" />, color: "text-purple-600" },
        { name: "IoMusicalNotes", component: <IoMusicalNotes className="text-red-600 text-2xl" />, color: "text-red-600" },
        { name: "IoLanguage", component: <IoLanguage className="text-yellow-600 text-2xl" />, color: "text-yellow-600" },
        { name: "IoBook", component: <IoBook className="text-indigo-600 text-2xl" />, color: "text-indigo-600" },
        { name: "IoFitness", component: <IoFitness className="text-orange-600 text-2xl" />, color: "text-orange-600" },
        { name: "IoChatbubbles", component: <IoChatbubbles className="text-pink-600 text-2xl" />, color: "text-pink-600" },
        { name: "IoRestaurant", component: <IoRestaurant className="text-amber-600 text-2xl" />, color: "text-amber-600" }
    ];

    // Default form state
    const defaultClubForm = {
        name: '',
        description: '',
        maxMembers: '20',
        teacherId: '',
        icon: 'IoColorPalette',
        category: 'ศิลปะและงานฝีมือ',
        registrationDeadline: '',
        isActive: true,
        meetingDay: '',
        meetingTime: '',
        location: '',
        requirements: ''
    };

    const [clubForm, setClubForm] = useState(defaultClubForm);

    // Categories including "ทั้งหมด" option
    const categories = ["ทั้งหมด", ...categoriesData];

    // Flatten teachers from all departments for dropdown
    const allTeachers = React.useMemo(() => {
        const teachers = [];
        Object.keys(teachersByDepartment).forEach(department => {
            teachersByDepartment[department].forEach(teacher => {
                teachers.push({
                    id: teacher.id,
                    name: `${teacher.namePrefix || ''} ${teacher.name}`.trim(),
                    department: department,
                    position: teacher.position,
                    level: teacher.level
                });
            });
        });
        return teachers.sort((a, b) => a.name.localeCompare(b.name));
    }, [teachersByDepartment]);

    // Helper function to get teacher name by ID
    const getTeacherNameById = (teacherId) => {
        const teacher = allTeachers.find(t => t.id === teacherId);
        return teacher ? teacher.name : 'ไม่พบข้อมูลครู';
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    // Handle form changes
    const handleClubFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setClubForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (value || '')
        }));
    };

    // Get icon component by name
    const getIconComponent = (iconName) => {
        const iconOption = iconOptions.find(option => option.name === iconName);
        return iconOption ? iconOption.component : <IoColorPalette className="text-green-600 text-2xl" />;
    };

    // Add new club
    const handleAddClub = async () => {
        if (!clubForm.name.trim() || !clubForm.description.trim()) {
            showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        try {
            const clubData = {
                ...clubForm,
                maxMembers: parseInt(clubForm.maxMembers) || 20,
                teacherId: clubForm.teacherId ? parseInt(clubForm.teacherId) : null,
                registrationDeadline: clubForm.registrationDeadline || null
            };

            const result = await createClub(clubData);
            
            if (result.success) {
                setShowAddClub(false);
                setClubForm(defaultClubForm);
                showNotification('เพิ่มชุมนุมใหม่เรียบร้อยแล้ว');
                refetchClubs(); // Refresh the clubs list
            } else {
                showNotification(result.error || 'เกิดข้อผิดพลาดในการเพิ่มชุมนุม', 'error');
            }
        } catch (error) {
            showNotification('เกิดข้อผิดพลาดในการเพิ่มชุมนุม', 'error');
            console.error('Error creating club:', error);
        }
    };

    // Start editing club
    const startEditingClub = (club) => {
        setEditingClubId(club.id);
        setClubForm({
            name: club.name || '',
            description: club.description || '',
            maxMembers: club.maxMembers?.toString() || '20',
            teacherId: club.teacherId?.toString() || '',
            icon: club.icon || 'IoColorPalette',
            category: club.category || 'ศิลปะและงานฝีมือ',
            registrationDeadline: club.registrationDeadline ? 
                new Date(club.registrationDeadline).toISOString().split('T')[0] : '',
            isActive: club.isActive !== undefined ? club.isActive : true,
            meetingDay: club.meetingDay || '',
            meetingTime: club.meetingTime || '',
            location: club.location || '',
            requirements: club.requirements || ''
        });
    };

    // Update club
    const handleUpdateClub = async (clubId) => {
        if (!clubForm.name.trim() || !clubForm.description.trim()) {
            showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        try {
            const updateData = {
                ...clubForm,
                maxMembers: parseInt(clubForm.maxMembers) || 20,
                teacherId: clubForm.teacherId ? parseInt(clubForm.teacherId) : null,
                registrationDeadline: clubForm.registrationDeadline || null
            };

            const result = await updateClub(clubId, updateData);
            
            if (result.success) {
                setEditingClubId(null);
                setClubForm(defaultClubForm);
                showNotification('แก้ไขข้อมูลชุมนุมเรียบร้อยแล้ว');
                refetchClubs(); // Refresh the clubs list
            } else {
                showNotification(result.error || 'เกิดข้อผิดพลาดในการแก้ไขชุมนุม', 'error');
            }
        } catch (error) {
            showNotification('เกิดข้อผิดพลาดในการแก้ไขชุมนุม', 'error');
            console.error('Error updating club:', error);
        }
    };

    // Delete club
    const handleDeleteClub = async (clubId) => {
        if (window.confirm('คุณต้องการลบชุมนุมนี้หรือไม่?')) {
            try {
                const result = await deleteClub(clubId);
                
                if (result.success) {
                    showNotification('ลบชุมนุมเรียบร้อยแล้ว');
                    refetchClubs(); // Refresh the clubs list
                } else {
                    showNotification(result.error || 'เกิดข้อผิดพลาดในการลบชุมนุม', 'error');
                }
            } catch (error) {
                showNotification('เกิดข้อผิดพลาดในการลบชุมนุม', 'error');
                console.error('Error deleting club:', error);
            }
        }
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingClubId(null);
        setShowAddClub(false);
        setClubForm(defaultClubForm);
    };

    // Filter clubs by category
    const filteredClubs = selectedCategory === "ทั้งหมด" 
        ? clubsData 
        : clubsData.filter(club => club.category === selectedCategory);

    // Check registration status
    const checkRegistrationStatus = (deadline) => {
        if (!deadline) return false;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        return today <= deadlineDate;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'ไม่ระบุ';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    // Handle refresh
    const handleRefresh = () => {
        refetchClubs();
        showNotification('รีเฟรชข้อมูลเรียบร้อยแล้ว');
    };

    // Loading state
    if (clubsLoading || categoriesLoading || teachersLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (clubsError) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <IoWarning className="text-red-500 text-6xl mx-auto mb-4" />
                    <p className="text-red-600 mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                    <button 
                        onClick={handleRefresh}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        ลองใหม่
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Notification */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                            notification.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                        }`}
                    >
                        <div className="flex items-center">
                            {notification.type === 'success' ? <IoCheckmark className="mr-2" /> : <IoWarning className="mr-2" />}
                            {notification.message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                จัดการชุมนุมวิชาการ
                            </h1>
                            <p className="text-gray-600">
                                เพิ่ม แก้ไข และจัดการข้อมูลชุมนุมวิชาการของโรงเรียน
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('clubs-list')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'clubs-list'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                รายการชุมนุม ({clubsData.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'settings'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                สถิติชุมนุม
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Clubs List Tab */}
                {activeTab === 'clubs-list' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Controls */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            กรองตามหมวดหมู่
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setShowAddClub(!showAddClub)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                                    disabled={isCreating}
                                >
                                    <IoAdd />
                                    <span>{showAddClub ? 'ยกเลิก' : 'เพิ่มชุมนุม'}</span>
                                </button>
                            </div>

                            {/* Add Club Form */}
                            {showAddClub && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 border-t pt-6"
                                >
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">เพิ่มชุมนุมใหม่</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ชื่อชุมนุม *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={clubForm.name}
                                                onChange={handleClubFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="เช่น ชุมนุมวิทยาศาสตร์"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ครูที่ปรึกษา
                                            </label>
                                            <select
                                                name="teacherId"
                                                value={clubForm.teacherId}
                                                onChange={handleClubFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">เลือกครูที่ปรึกษา (ไม่บังคับ)</option>
                                                {allTeachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.name} - {teacher.position} ({teacher.department})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                หมวดหมู่
                                            </label>
                                            <select
                                                name="category"
                                                value={clubForm.category}
                                                onChange={handleClubFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {categoriesData.map((category, index) => (
                                                    <option key={index} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                จำนวนสมาชิก
                                            </label>
                                            <input
                                                type="number"
                                                name="maxMembers"
                                                value={clubForm.maxMembers}
                                                onChange={handleClubFormChange}
                                                min="1"
                                                max="50"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ไอคอน
                                            </label>
                                            <select
                                                name="icon"
                                                value={clubForm.icon}
                                                onChange={handleClubFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {iconOptions.map((option, index) => (
                                                    <option key={index} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                วันปิดรับสมัคร
                                            </label>
                                            <input
                                                type="date"
                                                name="registrationDeadline"
                                                value={clubForm.registrationDeadline}
                                                onChange={handleClubFormChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                รายละเอียด *
                                            </label>
                                            <textarea
                                                name="description"
                                                value={clubForm.description}
                                                onChange={handleClubFormChange}
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="อธิบายเกี่ยวกับกิจกรรมและจุดประสงค์ของชุมนุม"
                                            />
                                        </div>

                                        <div className="md:col-span-2 flex space-x-2">
                                            <button
                                                onClick={handleAddClub}
                                                disabled={isCreating}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <IoSave />
                                                <span>{isCreating ? 'กำลังบันทึก...' : 'บันทึกชุมนุม'}</span>
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                disabled={isCreating}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                            >
                                                ยกเลิก
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Clubs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClubs.map((club, index) => {
                                const isOpen = checkRegistrationStatus(club.registrationDeadline);
                                
                                return (
                                    <motion.div
                                        key={club.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-lg shadow-md overflow-hidden"
                                    >
                                        {editingClubId === club.id ? (
                                            // Edit Form
                                            <div className="p-6">
                                                <h3 className="text-lg font-medium text-gray-700 mb-4">แก้ไขชุมนุม</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={clubForm.name}
                                                            onChange={handleClubFormChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            placeholder="ชื่อชุมนุม"
                                                        />
                                                    </div>

                                                    <div>
                                                        <select
                                                            name="teacherId"
                                                            value={clubForm.teacherId}
                                                            onChange={handleClubFormChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        >
                                                            <option value="">เลือกครูที่ปรึกษา</option>
                                                            {allTeachers.map((teacher) => (
                                                                <option key={teacher.id} value={teacher.id}>
                                                                    {teacher.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select
                                                            name="category"
                                                            value={clubForm.category}
                                                            onChange={handleClubFormChange}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        >
                                                            {categoriesData.map((category, index) => (
                                                                <option key={index} value={category}>
                                                                    {category}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        
                                                        <input
                                                            type="number"
                                                            name="maxMembers"
                                                            value={clubForm.maxMembers}
                                                            onChange={handleClubFormChange}
                                                            min="1"
                                                            max="50"
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            placeholder="จำนวน"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select
                                                            name="icon"
                                                            value={clubForm.icon}
                                                            onChange={handleClubFormChange}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        >
                                                            {iconOptions.map((option, index) => (
                                                                <option key={index} value={option.name}>
                                                                    {option.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        
                                                        <input
                                                            type="date"
                                                            name="registrationDeadline"
                                                            value={clubForm.registrationDeadline}
                                                            onChange={handleClubFormChange}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <textarea
                                                            name="description"
                                                            value={clubForm.description}
                                                            onChange={handleClubFormChange}
                                                            rows="3"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                            placeholder="รายละเอียด"
                                                        />
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateClub(club.id)}
                                                            disabled={isUpdating}
                                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            {isUpdating ? 'กำลังบันทึก...' : 'บันทึก'}
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            disabled={isUpdating}
                                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            ยกเลิก
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Display Mode
                                            <>
                                                <div className="p-6">
                                                    <div className="flex items-start mb-4">
                                                        <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                                            {getIconComponent(club.icon)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-1">{club.name}</h3>
                                                            <p className="text-blue-600 text-sm">{club.category}</p>
                                                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                                                club.isActive 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {club.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{club.description}</p>

                                                    <div className="space-y-2 text-sm">
                                                        {club.teacher && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">ครูที่ปรึกษา:</span>
                                                                <span className="text-gray-700 font-medium">
                                                                    {club.teacher.namePrefix} {club.teacher.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">จำนวนรับ:</span>
                                                            <span className="text-gray-700 font-medium">{club.maxMembers} คน</span>
                                                        </div>
                                                        {club.registrationDeadline && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">ปิดรับสมัคร:</span>
                                                                <span className="text-gray-700 font-medium">{formatDate(club.registrationDeadline)}</span>
                                                            </div>
                                                        )}
                                                        {club.meetingDay && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">วันประชุม:</span>
                                                                <span className="text-gray-700 font-medium">{club.meetingDay}</span>
                                                            </div>
                                                        )}
                                                        {club.meetingTime && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">เวลาประชุม:</span>
                                                                <span className="text-gray-700 font-medium">{club.meetingTime}</span>
                                                            </div>
                                                        )}
                                                        {club.location && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">สถานที่:</span>
                                                                <span className="text-gray-700 font-medium">{club.location}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {club.registrationDeadline && (
                                                        <div className={`mt-3 text-xs px-2 py-1 rounded ${
                                                            isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {isOpen ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex space-x-2">
                                                    <button
                                                        onClick={() => startEditingClub(club)}
                                                        disabled={isUpdating || isDeleting}
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                                                    >
                                                        <IoCreate />
                                                        <span>แก้ไข</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClub(club.id)}
                                                        disabled={isUpdating || isDeleting}
                                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                                                    >
                                                        <IoTrash />
                                                        <span>{isDeleting ? 'กำลังลบ...' : 'ลบ'}</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Empty State */}
                        {filteredClubs.length === 0 && (
                            <div className="col-span-full">
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <div className="text-6xl mb-4">🎭</div>
                                    <p className="text-gray-500 text-lg mb-2">
                                        {selectedCategory === "ทั้งหมด" ? "ยังไม่มีชุมนุมวิชาการ" : `ไม่มีชุมนุมในหมวดหมู่ "${selectedCategory}"`}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {selectedCategory === "ทั้งหมด" ? 'คลิก "เพิ่มชุมนุม" เพื่อเริ่มต้น' : 'ลองเปลี่ยนหมวดหมู่หรือเพิ่มชุมนุมใหม่'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Statistics */}
                        {!statsLoading && statsData && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">สถิติชุมนุม</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-blue-600 text-sm font-medium">จำนวนชุมนุมทั้งหมด</p>
                                                <p className="text-2xl font-bold text-blue-800">{statsData.totalClubs}</p>
                                            </div>
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <IoPeople className="text-blue-600 text-2xl" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-green-600 text-sm font-medium">ชุมนุมที่เปิดใช้งาน</p>
                                                <p className="text-2xl font-bold text-green-800">{statsData.activeClubs}</p>
                                            </div>
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <IoCheckmark className="text-green-600 text-2xl" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-amber-600 text-sm font-medium">เปิดรับสมัคร</p>
                                                <p className="text-2xl font-bold text-amber-800">{statsData.openForRegistration}</p>
                                            </div>
                                            <div className="bg-amber-100 p-2 rounded-lg">
                                                <IoCalendar className="text-amber-600 text-2xl" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-purple-600 text-sm font-medium">ที่นั่งรวมทั้งหมด</p>
                                                <p className="text-2xl font-bold text-purple-800">{statsData.totalCapacity}</p>
                                            </div>
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <IoPeople className="text-purple-600 text-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                        
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ManageClubsPosts;