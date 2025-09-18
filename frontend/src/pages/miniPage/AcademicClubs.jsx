import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    IoWarning,
    IoSearch,
    IoCaretUp,
    IoCaretDown
} from 'react-icons/io5';

// Import API hooks
import {
    useFetchClubsQuery,
    useFetchCategoriesQuery
} from '../../redux/features/clubs/clubsApi';

const AcademicClubs = () => {
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

    // API hooks
    const {
        data: clubsData = [],
        isLoading: clubsLoading,
        error: clubsError
    } = useFetchClubsQuery({ isActive: true });

    const {
        data: categoriesData = [],
        isLoading: categoriesLoading
    } = useFetchCategoriesQuery();

    // State สำหรับ Modal และการกรอง
    const [selectedClub, setSelectedClub] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    
    // State ใหม่สำหรับ Pagination, Search และ Sorting
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [clubsPerPage, setClubsPerPage] = useState(9);

    // หมวดหมู่ชุมนุม - include "ทั้งหมด" option
    const categories = ["ทั้งหมด", ...(categoriesData || [])];

    // Icon mapping for dynamic display
    const iconMapping = {
        'IoColorPalette': <IoColorPalette className="text-green-600 text-2xl" />,
        'IoFlask': <IoFlask className="text-blue-600 text-2xl" />,
        'IoCodeSlash': <IoCodeSlash className="text-purple-600 text-2xl" />,
        'IoMusicalNotes': <IoMusicalNotes className="text-red-600 text-2xl" />,
        'IoLanguage': <IoLanguage className="text-yellow-600 text-2xl" />,
        'IoBook': <IoBook className="text-indigo-600 text-2xl" />,
        'IoFitness': <IoFitness className="text-orange-600 text-2xl" />,
        'IoChatbubbles': <IoChatbubbles className="text-pink-600 text-2xl" />,
        'IoRestaurant': <IoRestaurant className="text-amber-600 text-2xl" />
    };

    // Get icon component by name
    const getIconComponent = (iconName) => {
        return iconMapping[iconName] || <IoColorPalette className="text-green-600 text-2xl" />;
    };

    // ฟังก์ชันตรวจสอบสถานะการรับสมัคร
    const checkRegistrationStatus = (deadline) => {
        if (!deadline) return "ไม่ระบุวันปิดรับสมัคร";
        const today = new Date();
        const deadlineDate = new Date(deadline);
        return today <= deadlineDate ? "กำลังเปิดรับสมัครนักเรียน" : "ปิดรับสมัครนักเรียน";
    };

    // ฟังก์ชันจัดรูปแบบวันที่
    const formatDate = (dateString) => {
        if (!dateString) return 'ไม่ระบุ';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'รูปแบบวันที่ไม่ถูกต้อง';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options);
    };

    // กรองและเรียงลำดับชุมนุม
    const filteredAndSortedClubs = useMemo(() => {
        if (!clubsData) return [];
        
        // กรองตามหมวดหมู่
        let filtered = activeCategory === "ทั้งหมด"
            ? clubsData.filter(club => club.isActive)
            : clubsData.filter(club => club.category === activeCategory && club.isActive);

        // กรองตามคำค้นหา
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(club => 
                club.name.toLowerCase().includes(query) ||
                club.description.toLowerCase().includes(query) ||
                (club.teacher && club.teacher.name.toLowerCase().includes(query)) ||
                (club.category && club.category.toLowerCase().includes(query))
            );
        }

        // เรียงลำดับ
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortField) {
                case "name":
                    aValue = a.name || '';
                    bValue = b.name || '';
                    break;
                case "category":
                    aValue = a.category || '';
                    bValue = b.category || '';
                    break;
                case "teacher":
                    aValue = a.teacher ? a.teacher.name : '';
                    bValue = b.teacher ? b.teacher.name : '';
                    break;
                case "members":
                    aValue = a.maxMembers || 0;
                    bValue = b.maxMembers || 0;
                    break;
                case "deadline":
                    aValue = a.registrationDeadline ? new Date(a.registrationDeadline) : new Date(0);
                    bValue = b.registrationDeadline ? new Date(b.registrationDeadline) : new Date(0);
                    break;
                default:
                    aValue = a.name || '';
                    bValue = b.name || '';
            }
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === "asc" 
                    ? aValue.localeCompare(bValue, 'th') 
                    : bValue.localeCompare(aValue, 'th');
            } else {
                return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
            }
        });

        return filtered;
    }, [clubsData, activeCategory, searchQuery, sortField, sortDirection]);

    // คำนวณ Pagination
    const indexOfLastClub = currentPage * clubsPerPage;
    const indexOfFirstClub = indexOfLastClub - clubsPerPage;
    const currentClubs = filteredAndSortedClubs.slice(indexOfFirstClub, indexOfLastClub);
    const totalPages = Math.ceil(filteredAndSortedClubs.length / clubsPerPage);

    // ฟังก์ชันเปลี่ยนหน้า
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // ฟังก์ชันเปลี่ยนการเรียงลำดับ
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setCurrentPage(1); // รีเซ็ตไปหน้าที่ 1 เมื่อเปลี่ยนการเรียงลำดับ
    };

    // ฟังก์ชันเปิด Modal
    const handleJoinClick = (club) => {
        setSelectedClub(club);
        setShowModal(true);
    };

    // ฟังก์ชันเปลี่ยนจำนวนรายการต่อหน้า
    const handleClubsPerPageChange = (e) => {
        setClubsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // รีเซ็ตไปหน้าที่ 1 เมื่อเปลี่ยนจำนวนรายการต่อหน้า
    };

    // Loading state
    if (clubsLoading || categoriesLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex items-center justify-center"
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดข้อมูลชุมนุม...</p>
                </div>
            </motion.div>
        );
    }

    // Error state
    if (clubsError) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex items-center justify-center"
            >
                <div className="text-center">
                    <IoWarning className="text-red-500 text-6xl mx-auto mb-4" />
                    <p className="text-red-600 mb-4 text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                    <p className="text-gray-600 mb-6">ไม่สามารถโหลดข้อมูลชุมนุมได้ในขณะนี้</p>
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <IoChevronBack className="mr-1" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-4 px-4 md:py-8"
            style={{ minWidth: '320px' }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header - Mobile First */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
                    <Link
                        to="/"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 md:mb-0"
                    >
                        <IoChevronBack className="mr-1" />
                        กลับหน้าหลัก
                    </Link>
                    <div className="text-center md:flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-1">ชุมนุมวิชาการ</h1>
                        <p className="text-sm text-gray-600">มีทั้งหมด {filteredAndSortedClubs.length} ชุมนุม</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 mb-6 md:mb-8 border border-blue-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาชุมนุม, คำอธิบาย, ครูที่ปรึกษา..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            {/* ปุ่มกรองหมวดหมู่สำหรับ Mobile */}
                            <div className="relative md:hidden">
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg"
                                >
                                    <IoFilter />
                                    {activeCategory}
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                        {categories.map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setActiveCategory(category);
                                                    setShowCategoryDropdown(false);
                                                    setCurrentPage(1);
                                                }}
                                                className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${activeCategory === category ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Dropdown การจัดเรียงสำหรับ Mobile */}
                            <div className="relative md:hidden">
                                <select
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={`${sortField}-${sortDirection}`}
                                    onChange={(e) => {
                                        const [field, direction] = e.target.value.split('-');
                                        setSortField(field);
                                        setSortDirection(direction);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="name-asc">เรียงตามชื่อ (ก-ฮ)</option>
                                    <option value="name-desc">เรียงตามชื่อ (ฮ-ก)</option>
                                    <option value="category-asc">เรียงตามหมวดหมู่ (ก-ฮ)</option>
                                    <option value="category-desc">เรียงตามหมวดหมู่ (ฮ-ก)</option>
                                    <option value="teacher-asc">เรียงตามครูที่ปรึกษา (ก-ฮ)</option>
                                    <option value="teacher-desc">เรียงตามครูที่ปรึกษา (ฮ-ก)</option>
                                    <option value="members-desc">รับสมาชิกมากที่สุด</option>
                                    <option value="members-asc">รับสมาชิกน้อยที่สุด</option>
                                    <option value="deadline-asc">ปิดรับสมัครเร็วที่สุด</option>
                                    <option value="deadline-desc">ปิดรับสมัครช้าที่สุด</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* แท็บหมวดหมู่และการจัดเรียงสำหรับ Desktop */}
                    <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="hidden md:flex flex-wrap gap-2 items-center">
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm transition-colors ${activeCategory === category
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                            <span className="text-sm text-gray-600">เรียงตาม:</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { field: "name", label: "ชื่อ" },
                                    { field: "category", label: "หมวดหมู่" },
                                    { field: "teacher", label: "ครูที่ปรึกษา" },
                                    { field: "members", label: "จำนวนสมาชิก" },
                                    { field: "deadline", label: "ปิดรับสมัคร" }
                                ].map(({ field, label }) => (
                                    <button
                                        key={field}
                                        onClick={() => handleSort(field)}
                                        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${sortField === field
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {label}
                                        {sortField === field && (
                                            sortDirection === "asc" ? <IoCaretUp className="ml-1" /> : <IoCaretDown className="ml-1" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 mb-6 md:mb-8 border border-blue-100">
                    <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-2 md:mb-3">เกี่ยวกับชุมนุมวิชาการ</h2>
                    <p className="text-gray-700 text-sm md:text-base">
                        ชุมนุมวิชาการเป็นกิจกรรมที่ส่งเสริมทักษะเฉพาะทางให้นักเรียน ได้เลือกตามความสนใจ
                        โดยมีครูผู้เชี่ยวชาญเป็นที่ปรึกษา นักเรียนสามารถสมัครได้ภาคเรียนละ 1 ชุมนุม
                    </p>
                </div>

                {/* Empty State */}
                {filteredAndSortedClubs.length === 0 && (
                    <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-8 text-center">
                        <div className="text-6xl mb-4">🎭</div>
                        <p className="text-gray-500 text-lg mb-2">
                            {searchQuery 
                                ? `ไม่พบผลลัพธ์สำหรับ "${searchQuery}"`
                                : activeCategory === "ทั้งหมด"
                                    ? "ยังไม่มีชุมนุมวิชาการที่เปิดรับสมัคร"
                                    : `ไม่มีชุมนุมในหมวดหมู่ "${activeCategory}" ที่เปิดรับสมัคร`
                            }
                        </p>
                        <p className="text-gray-400 text-sm">
                            {searchQuery
                                ? 'ลองเปลี่ยนคำค้นหาหรือล้างการค้นหา'
                                : activeCategory === "ทั้งหมด"
                                    ? 'กรุณาติดตามข่าวสารเพิ่มเติม'
                                    : 'ลองเปลี่ยนหมวดหมู่หรือดูชุมนุมอื่น'
                            }
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                ล้างการค้นหา
                            </button>
                        )}
                    </div>
                )}

                {/* Clubs Grid - Mobile First */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {currentClubs.map((club, index) => {
                        const registrationStatus = checkRegistrationStatus(club.registrationDeadline);
                        const isOpen = registrationStatus === "กำลังเปิดรับสมัครนักเรียน";

                        return (
                            <motion.div
                                key={club.id || `club-${index}`}
                                whileHover={{ y: -3 }}
                                className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex items-start mb-3 md:mb-4">
                                        <div className="bg-blue-50 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                                            {getIconComponent(club.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{club.name}</h3>
                                            <p className="text-blue-600 text-sm md:text-base">{club.category}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 line-clamp-3">
                                        {club.description}
                                    </p>

                                    <div className="space-y-2 text-xs md:text-sm mb-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-gray-500">
                                                <IoPeople className="mr-1" />
                                                <span>รับ {club.maxMembers} คน</span>
                                            </div>
                                            {club.teacher && (
                                                <div className="text-gray-700 font-medium text-right">
                                                    {club.teacher.namePrefix} {club.teacher.name}
                                                </div>
                                            )}
                                        </div>

                                        {club.meetingDay && (
                                            <div className="flex items-center text-gray-500">
                                                <IoCalendar className="mr-1" />
                                                <span>วัน{club.meetingDay}</span>
                                                {club.meetingTime && <span> เวลา {club.meetingTime}</span>}
                                            </div>
                                        )}

                                        {club.location && (
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-1">📍</span>
                                                <span>{club.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* แสดงสถานะการรับสมัคร */}
                                    <div className={`text-xs md:text-sm p-2 rounded-md mb-2 md:mb-3 ${isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {registrationStatus}
                                        {club.registrationDeadline && !isOpen && (
                                            <span className="block text-xs mt-1">
                                                ปิดรับสมัครเมื่อ: {formatDate(club.registrationDeadline)}
                                            </span>
                                        )}
                                        {club.registrationDeadline && isOpen && (
                                            <span className="block text-xs mt-1">
                                                ปิดรับสมัคร: {formatDate(club.registrationDeadline)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 md:px-6 py-2 md:py-3 border-t border-gray-200">
                                    <button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm md:text-base"
                                        onClick={() => handleJoinClick(club)}
                                    >
                                        ดูรายละเอียดเพิ่มเติม
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {filteredAndSortedClubs.length > 0 && (
                    <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">แสดง:</span>
                            <select
                                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                value={clubsPerPage}
                                onChange={handleClubsPerPageChange}
                            >
                                <option value={6}>6</option>
                                <option value={9}>9</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                            </select>
                            <span className="text-sm text-gray-600">รายการต่อหน้า</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                หน้า {currentPage} จาก {totalPages}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ก่อนหน้า
                                </button>
                                
                                {/* แสดงปุ่ม页码 */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`px-3 py-1 rounded-lg border ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ถัดไป
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Info */}
                <div className="mt-6 md:mt-8 bg-blue-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-blue-200">
                    <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-2">ข้อกำหนดการสมัคร</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm md:text-base">
                        <li>นักเรียนสามารถสมัครได้ภาคเรียนละ 1 ชุมนุม</li>
                        <li>ต้องเข้าร่วมกิจกรรมอย่างน้อย 80% ของทั้งหมด</li>
                        <li>ปิดรับสมัครภายในสัปดาห์ที่ 2 ของภาคเรียน</li>
                        <li>มีสิทธิ์เปลี่ยนชุมนุมได้ภายใน 2 สัปดาห์แรก</li>
                    </ul>
                </div>
            </div>

            {/* Modal สำหรับสมัครชุมนุม */}
            <AnimatePresence>
                {showModal && selectedClub && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg md:rounded-xl max-w-md w-full p-4 md:p-6 relative mx-2 max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            style={{ minWidth: '280px' }}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 md:top-4 right-2 md:right-4 text-gray-500 hover:text-gray-700 z-10"
                            >
                                <IoClose size={20} />
                            </button>

                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-blue-50 p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                                    {getIconComponent(selectedClub.icon)}
                                </div>
                                <div className="flex-1 pr-8">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{selectedClub.name}</h3>
                                    <p className="text-blue-600 text-sm">{selectedClub.category}</p>
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">รายละเอียดชุมนุม</h4>
                                    <p className="text-gray-700 text-sm md:text-base">
                                        {selectedClub.description}
                                    </p>
                                </div>

                                {selectedClub.requirements && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">ข้อกำหนดเพิ่มเติม</h4>
                                        <p className="text-gray-700 text-sm md:text-base">
                                            {selectedClub.requirements}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">ข้อมูลชุมนุม</h4>

                                    {selectedClub.teacher && (
                                        <p className="text-gray-700 text-sm md:text-base mb-1">
                                            <span className="font-medium">ครูที่ปรึกษา:</span> {selectedClub.teacher.namePrefix} {selectedClub.teacher.name}
                                        </p>
                                    )}

                                    <p className="text-gray-700 text-sm md:text-base mb-1">
                                        <span className="font-medium">จำนวนที่รับ:</span> {selectedClub.maxMembers} คน
                                    </p>

                                    {selectedClub.meetingDay && (
                                        <p className="text-gray-700 text-sm md:text-base mb-1">
                                            <span className="font-medium">วันประชุม:</span> วัน{selectedClub.meetingDay}
                                            {selectedClub.meetingTime && ` เวลา ${selectedClub.meetingTime}`}
                                        </p>
                                    )}

                                    {selectedClub.location && (
                                        <p className="text-gray-700 text-sm md:text-base mb-1">
                                            <span className="font-medium">สถานที่:</span> {selectedClub.location}
                                        </p>
                                    )}

                                    <p className="text-gray-700 text-sm md:text-base mb-1">
                                        <span className="font-medium">สถานะ:</span> {checkRegistrationStatus(selectedClub.registrationDeadline)}
                                    </p>

                                    {selectedClub.registrationDeadline && (
                                        <p className="text-gray-700 text-sm md:text-base">
                                            <span className="font-medium">ปิดรับสมัคร:</span> {formatDate(selectedClub.registrationDeadline)}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-medium">📝 วิธีสมัคร:</span> กรุณาติดต่อครูที่ปรึกษาชุมนุมโดยตรง เพื่อสมัครและรับข้อมูลเพิ่มเติมเกี่ยวกับการเข้าร่วมกิจกรรม
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2 md:mt-4 text-sm md:text-base transition-colors"
                                >
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AcademicClubs;