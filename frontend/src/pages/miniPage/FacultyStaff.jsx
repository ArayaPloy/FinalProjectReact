// บุคลากรและเจ้าหน้าที่ - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoCall, IoMail, IoClose, IoSchool, IoBook, IoLocation, IoPersonOutline } from 'react-icons/io5';
import { useFetchTeachersByDepartmentQuery, useFetchDepartmentsQuery } from '../../redux/features/teachers/teachersApi';

const FacultyStaff = () => {
    const [activeTab, setActiveTab] = useState('administration');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data from API
    const {
        data: teachersByDepartment = {},
        isLoading: teachersLoading,
        error: teachersError
    } = useFetchTeachersByDepartmentQuery();

    const {
        data: departments = [],
        isLoading: departmentsLoading
    } = useFetchDepartmentsQuery();

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

    // Department tab mapping
    const departmentTabs = {
        administration: 'คณะผู้บริหาร',
        thai: 'กลุ่มสาระภาษาไทย',
        math: 'กลุ่มสาระคณิตศาสตร์',
        science: 'กลุ่มสาระวิทยาศาสตร์และเทคโนโลยี',
        social: 'กลุ่มสาระสังคมศึกษาฯ',
        health: 'กลุ่มสาระสุขศึกษาฯ',
        art: 'กลุ่มสาระศิลปะ',
        foreign: 'กลุ่มสาระภาษาต่างประเทศ',
        support: 'เจ้าหน้าที่สนับสนุน'
    };

    // Filter staff based on search term
    const currentStaff = teachersByDepartment[activeTab] || [];
    const filteredStaff = currentStaff.filter(staff =>
        staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.namePrefix?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle staff member click
    const handleStaffClick = (staff) => {
        console.log('🔍 Selected staff image data:', {
            id: staff.id,
            name: staff.name,
            image: staff.image,
            originalImage: staff.image
        });
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStaff(null);
    };

    // Helper function to render info with icon
    const renderInfo = (value, icon, className = "") => {
        if (!value || value === '-' || value === '') return null;
        return (
            <div className={`flex items-center text-xs sm:text-sm mt-1 ${className}`}>
                {icon}
                <span className="ml-1 break-words">{value}</span>
            </div>
        );
    };

    // FIXED: Helper function to get image source
    // FIXED: Helper function to get image source
    const getImageSrc = (staff) => {
        console.log('🖼️ Getting image for staff:', {
            id: staff?.id,
            name: staff?.name,
            image: staff?.image,
            imageType: typeof staff?.image
        });

        // Check if staff and image exist and are not empty
        if (!staff || !staff.image || staff.image === '' || staff.image === '-' || staff.image === null) {
            console.log('⚠️ No image found, using default');
            return '/src/assets/images/teachers/admin1.jpg';
        }

        // ADDED: Clean up the image path by removing extra quotes
        let cleanImagePath = staff.image;
        if (typeof cleanImagePath === 'string') {
            // Remove surrounding quotes (both single and double)
            cleanImagePath = cleanImagePath.replace(/^['"]|['"]$/g, '');
        }

        // If it's already a full URL (starts with http)
        if (cleanImagePath.startsWith('http')) {
            console.log('✅ Using full URL:', cleanImagePath);
            return cleanImagePath;
        }


        // Remove leading slash if it exists to avoid double slashes
        const imagePath = cleanImagePath.startsWith('/') ? cleanImagePath.substring(1) : cleanImagePath;

        const fullImageUrl = `${imagePath}`;
        console.log('✅ Constructed image URL:', fullImageUrl);

        // Add this to test if the URL is reachable
        fetch(fullImageUrl)
            .then(response => {
                if (response.ok) {
                    console.log('✅ Image URL is reachable');
                } else {
                    console.log('❌ Image URL returns error:', response.status);
                }
            })
            .catch(error => {
                console.log('❌ Image URL failed to fetch:', error);
            });

        return fullImageUrl;
    };

    // Add debug effect to log the data when it loads
    useEffect(() => {
        if (teachersByDepartment && Object.keys(teachersByDepartment).length > 0) {
            console.log('📊 Teachers data loaded:', teachersByDepartment);

            // Log first teacher's image data for debugging
            const firstDept = Object.keys(teachersByDepartment)[0];
            const firstTeacher = teachersByDepartment[firstDept]?.[0];
            if (firstTeacher) {
                console.log('🔍 First teacher image debug:', {
                    department: firstDept,
                    teacher: firstTeacher.name,
                    image: firstTeacher.image,
                    imageType: typeof firstTeacher.image,
                    finalImageSrc: getImageSrc(firstTeacher)
                });
            }
        }
    }, [teachersByDepartment]);

    // Loading state
    if (teachersLoading || departmentsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-4 sm:py-6 md:py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-amber-800">กำลังโหลดข้อมูลบุคลากร...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (teachersError) {
        console.error('❌ Teachers API Error:', teachersError);
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-4 sm:py-6 md:py-8 flex items-center justify-center">
                <div className="text-center">
                    <IoPersonOutline className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl text-gray-600 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                    <p className="text-gray-500">ไม่สามารถเชื่อมต่อฐานข้อมูลได้</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-4 sm:py-6 md:py-8"
            style={{ minWidth: '320px' }}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back button */}
                <Link
                    to="/"
                    className="flex items-center text-amber-700 hover:text-amber-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
                >
                    <IoChevronBack className="mr-1" />
                    กลับสู่หน้าหลัก
                </Link>

                {/* Main title */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-2">บุคลากรและเจ้าหน้าที่</h1>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-4">ผู้บริหาร คณะครู และเจ้าหน้าที่โรงเรียนท่าบ่อพิทยาคม</p>
                    <div className="w-16 sm:w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Sidebar Menu */}
                    <div className="w-full lg:w-64 bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 h-fit lg:sticky lg:top-4">
                        <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-3 sm:mb-4">ฝ่ายบริหารและบุคลากร</h3>
                        <ul className="space-y-1 sm:space-y-2">
                            {Object.entries(departmentTabs).map(([tabId, tabName]) => {
                                const hasTeachers = teachersByDepartment[tabId] && teachersByDepartment[tabId].length > 0;
                                return (
                                    <li key={tabId}>
                                        <button
                                            onClick={() => {
                                                setActiveTab(tabId);
                                                setSearchTerm(''); // Reset search when changing tabs
                                            }}
                                            className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm relative ${activeTab === tabId
                                                ? 'bg-amber-100 text-amber-800 font-medium'
                                                : 'text-gray-700 hover:bg-amber-50'
                                                } ${!hasTeachers ? 'opacity-50' : ''}`}
                                            disabled={!hasTeachers}
                                        >
                                            {tabName}
                                            {hasTeachers && (
                                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-200 text-amber-800 text-xs px-1.5 py-0.5 rounded-full">
                                                    {teachersByDepartment[tabId].length}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Main content */}
                    <div className="flex-1">
                        {/* Search box */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
                            <input
                                type="text"
                                placeholder="ค้นหาบุคลากร..."
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Selected department title */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-3 sm:mb-4">
                                {departmentTabs[activeTab]}
                            </h2>

                            {/* Staff list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {filteredStaff.map((staff) => (
                                    <motion.div
                                        key={staff.id}
                                        whileHover={{ y: -2 }}
                                        className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => handleStaffClick(staff)}
                                    >
                                        <div className="flex p-3 sm:p-4">
                                            <div className="flex-shrink-0 mr-3 sm:mr-4">
                                                <img
                                                    src={getImageSrc(staff)}
                                                    alt={staff.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-200"
                                                    onError={(e) => {
                                                        console.log('❌ Image failed to load:', e.target.src);
                                                        e.target.src = "/src/assets/images/teachers/admin1.jpg";
                                                    }}
                                                    onLoad={() => {
                                                        console.log('✅ Image loaded successfully:', getImageSrc(selectedStaff));
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight mb-1">
                                                    {staff.namePrefix && `${staff.namePrefix} `}{staff.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {staff.position}
                                                    {staff.level && ` ${staff.level}`}
                                                </p>

                                                {/* Email */}
                                                {renderInfo(staff.email, <IoMail className="text-amber-600 flex-shrink-0" />)}

                                                {/* Phone */}
                                                {renderInfo(staff.phone, <IoCall className="text-green-600 flex-shrink-0" />)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredStaff.length === 0 && currentStaff.length === 0 && (
                                <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                                    <IoPersonOutline className="mx-auto text-4xl mb-2" />
                                    ยังไม่มีข้อมูลบุคลากรในหน่วยงานนี้
                                </div>
                            )}

                            {filteredStaff.length === 0 && currentStaff.length > 0 && (
                                <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                                    <IoPersonOutline className="mx-auto text-4xl mb-2" />
                                    ไม่พบบุคลากรที่ตรงกับการค้นหา "{searchTerm}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Staff Detail Modal */}
                {isModalOpen && selectedStaff && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-lg sm:rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-amber-800">ข้อมูลบุคลากร</h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        <IoClose size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                                    <div className="flex-shrink-0 text-center md:text-left">
                                        <img
                                            src={getImageSrc(selectedStaff)}
                                            alt={selectedStaff.name}
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-amber-200 mx-auto md:mx-0"
                                            onError={(e) => {
                                                console.log('❌ Modal image failed to load:', e.target.src);
                                                e.target.src = '/src/assets/images/teachers/admin1.jpg';
                                            }}
                                            onError={(e) => {
                                                console.log('❌ Modal image failed to load:', e.target.src);
                                                e.target.src = '/src/assets/images/teachers/admin1.jpg';
                                            }}
                                            onLoad={() => {
                                                console.log('✅ Modal image loaded successfully:', getImageSrc(selectedStaff));
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-800">ชื่อ-สกุล</h4>
                                                <p className="text-gray-700 text-sm sm:text-base">
                                                    {selectedStaff.namePrefix && `${selectedStaff.namePrefix} `}
                                                    {selectedStaff.name}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-800">ตำแหน่ง</h4>
                                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                                    {selectedStaff.position}
                                                    {selectedStaff.level && ` ${selectedStaff.level}`}
                                                </p>
                                            </div>
                                            {selectedStaff.department && (
                                                <div>
                                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">หน่วยงาน</h4>
                                                    <p className="text-gray-700 text-sm sm:text-base">{selectedStaff.department}</p>
                                                </div>
                                            )}
                                            {selectedStaff.education && selectedStaff.education !== '-' && (
                                                <div>
                                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">วุฒิการศึกษา</h4>
                                                    <p className="text-gray-700 text-sm sm:text-base">{selectedStaff.education}</p>
                                                </div>
                                            )}
                                            {selectedStaff.major && selectedStaff.major !== '-' && (
                                                <div>
                                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">วิชาเอก</h4>
                                                    <p className="text-gray-700 text-sm sm:text-base">{selectedStaff.major}</p>
                                                </div>
                                            )}
                                            {selectedStaff.nationality && selectedStaff.nationality !== '-' && (
                                                <div>
                                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">สัญชาติ</h4>
                                                    <p className="text-gray-700 text-sm sm:text-base">{selectedStaff.nationality}</p>
                                                </div>
                                            )}
                                            {selectedStaff.biography && selectedStaff.biography !== '-' && (
                                                <div>
                                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">ประวัติ</h4>
                                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{selectedStaff.biography}</p>
                                                </div>
                                            )}
                                            {selectedStaff.specializations && selectedStaff.specializations !== '-' && (
                                                <div>
                                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">ความเชี่ยวชาญ</h4>
                                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{selectedStaff.specializations}</p>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-800">ข้อมูลติดต่อ</h4>
                                                <div className="space-y-1">
                                                    {renderInfo(selectedStaff.phone, <IoCall className="text-green-600 flex-shrink-0" />, "text-gray-700")}
                                                    {renderInfo(selectedStaff.email, <IoMail className="text-amber-600 flex-shrink-0" />, "text-gray-700")}
                                                    {renderInfo(selectedStaff.address, <IoLocation className="text-blue-600 flex-shrink-0" />, "text-gray-700")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default FacultyStaff;