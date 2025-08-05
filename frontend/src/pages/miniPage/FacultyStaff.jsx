// บุคลากรและเจ้าหน้าที่
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoCall, IoMail, IoClose, IoSchool, IoBook, IoLocation } from 'react-icons/io5';
import admin1Img from '../../assets/images/teachers/admin1.jpg';
import admin2Img from '../../assets/images/teachers/admin2.jpg';
import thai1Img from '../../assets/images/teachers/thai1.jpg';
import thai2Img from '../../assets/images/teachers/thai2.jpg';
import math1Img from '../../assets/images/teachers/math1.jpg';
import math2Img from '../../assets/images/teachers/math2.jpg';
import science1Img from '../../assets/images/teachers/science1.jpg';
import science2Img from '../../assets/images/teachers/science2.jpg';    
import science3Img from '../../assets/images/teachers/science3.jpg';
import social1Img from '../../assets/images/teachers/social1.jpg';  
import social2Img from '../../assets/images/teachers/social2.jpg';
import health1Img from '../../assets/images/teachers/health1.jpg';
import art1Img from '../../assets/images/teachers/art1.jpg';
import foreign1Img from '../../assets/images/teachers/foreign1.jpg';
import foreign2Img from '../../assets/images/teachers/foreign2.jpg';
import support1Img from '../../assets/images/teachers/support1.jpg';
import support2Img from '../../assets/images/teachers/support2.jpg';

// Enhanced staff data with additional details
const staffData = {
    administration: [
        {
            id: 1,
            name: "นายชำนาญวิทย์ ประเสริฐ",
            position: "ผู้อำนวยการสถานศึกษา",
            education: "ปริญญาโท",
            major: "การบริหารการศึกษา",
            email: "-",
            phone: "081-234-5678",
            address: "-",
            image: admin1Img
        },
        {
            id: 2,
            name: "นางพิชญา สุวงศ์",
            position: "รองผู้อำนวยการสถานศึกษา",
            education: "ปริญญาโท",
            major: "ภาษาไทย",
            email: "pitchaya@thabopit.ac.th",
            phone: "087-215-3025",
            address: "277 หมู่ที่ 3 ซอย 13 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย 43130",
            image: admin2Img
        }
    ],
    thai: [
        {
            id: 1,
            name: "นางอามร คำเสมอ",
            position: "ครูวิทยฐานะ คศ.3 หัวหน้ากลุ่มสาระการเรียนรู้ภาษาไทย",
            education: "ปริญญาตรี",
            major: "ภาษาไทย",
            email: "amon@thabopit.ac.th",
            phone: "083-456-7890",
            address: "-",
            image: thai1Img
        },
        {
            id: 2,
            name: "นางพรศิริ พิมพ์พา",
            position: "ครูวิทยฐานะ คศ.3",
            education: "ปริญญาโท",
            major: "หลักสูตรนวัตกรรมและการจัดการเรียนรู้",
            email: "pornsiri@thabopit.ac.th",
            phone: "084-567-8901",
            address: "-",
            image: thai2Img
        }
    ],
    math: [
        {
            id: 1,
            name: "นางเกษร ผาสุข",
            position: "ครูวิทยฐานะ คศ.3 หัวหน้ากลุ่มสาระการเรียนรู้คณิตศาสตร์",
            education: "ปริญญาตรี",
            major: "คณิตศาสตร์",
            email: "kesorn@thabopit.ac.th",
            phone: "085-678-9012",
            address: "-",
            image: math1Img
        },
        {
            id: 2,
            name: "นายณัฐวุฒิ เจริญกุล",
            position: "ครูวิทยฐานะ คศ.3",
            education: "ปริญญาโท",
            major: "คณิตศาสตร์",
            email: "nutthawut@thabopit.ac.th",
            phone: "086-789-0123",
            address: "-",
            image: math2Img
        }
    ],
    science: [
        {
            id: 1,
            name: "นางสาววิไลลักษณ์ อ่างแก้ว",
            position: "ครูวิทยฐานะ คศ.3 หัวหน้ากลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
            education: "ปริญญาโท",
            major: "วิทยาศาสตร์เคมี",
            email: "wilailak@thabopit.ac.th",
            phone: "087-890-1234",
            address: "-",
            image: science1Img
        },
        {
            id: 2,
            name: "นางสาวสุรางคณา เหลืองกิจไพบูลย์",
            position: "ครูวิทยฐานะ คศ.1",
            education: "ปริญญาโท",
            major: "คอมพิวเตอร์",
            email: "surangkana@thabopit.ac.th",
            phone: "088-901-2345",
            address: "-",
            image: science2Img
        },
        {
            id: 3,
            name: "นางสาวจีรนันท์ พรหมพิภักดิ์",
            position: "พนักงานราชการ",
            education: "ปริญญาตรี",
            major: "วิทยาศาสตร์",
            email: "jeerananmaneerat@thabopit.ac.th",
            phone: "089-012-3456",
            address: "-",
            image: science3Img
        }
    ],
    social: [
        {
            id: 1,
            name: "นางสาวศิริกัญญา กาอุปมุง",
            position: "ครูผู้ช่วย หัวหน้ากลุ่มสาระการเรียนรู้สังคมศึกษาฯ",
            education: "ปริญญาตรี",
            major: "สังคมศึกษา",
            email: "silikanya@thabopit.ac.th",
            phone: "090-123-4567",
            address: "-",
            image: social1Img
        },
        {
            id: 2,
            name: "นางสาวกมลชนก รีวงษา",
            position: "ครูอัตราจ้าง",
            education: "ปริญญาตรี",
            major: "-",
            email: "-",
            phone: "-",
            address: "-",
            image: social2Img
        }
    ],
    health: [
        {
            id: 1,
            name: "นายทวีศักดิ์ มณีรัตน์",
            position: "ครูวิทยฐานะ คศ.3 หัวหน้ากลุ่มสาระการเรียนรู้สุขศึกษาฯ",
            education: "ปริญญาตรี",
            major: "พลศึกษา",
            email: "taweesak@thabopit.ac.th",
            phone: "091-234-5678",
            address: "-",
            image: health1Img
        }
    ],
    art: [
        {
            id: 1,
            name: "นายศุภชัย โคตรชมภู",
            position: "ครูวิทยฐานะ คศ.3 หัวหน้ากลุ่มสาระการเรียนรู้ศิลปะ",
            education: "ปริญญาตรี",
            major: "ศิลปศึกษา",
            email: "suphachai@thabopit.ac.th",
            phone: "092-345-6789",
            address: "-",
            image: art1Img
        }
    ],
    foreign: [
        {
            id: 1,
            name: "นางอุบล แสงโสดา",
            position: "ครูวิทยฐานะ คศ.3",
            education: "ปริญญาตรี",
            major: "ภาษาอังกฤษ",
            email: "ubon@thabopit.ac.th",
            phone: "093-456-7890",
            address: "-",
            image: foreign1Img
        },
        {
            id: 2,
            name: "นางวราภรณ์ แสงแก้ว",
            position: "พนักงานราชการ",
            education: "ปริญญาตรี",
            major: "ภาษาอังกฤษ",
            email: "waraporn@thabopit.ac.th",
            phone: "094-567-8901",
            address: "-",
            image: foreign2Img
        }
    ],
    support: [
        {
            id: 1,
            name: "นายธีรพงษ์ หมอยาเก่า",
            position: "ธุรการโรงเรียน",
            education: "ปริญญาตรี",
            major: "ภาษาไทย",
            email: "-",
            phone: "095-678-9012",
            address: "-",
            image: support1Img
        },
        {
            id: 2,
            name: "นายลาญู น้อยโสภา",
            position: "นักการภารโรง",
            education: "-",
            major: "-",
            email: "",
            phone: "096-789-0123",
            address: "-",
            image: support2Img
        }
    ]
};

const FacultyStaff = () => {
    const [activeTab, setActiveTab] = useState('administration');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredStaff = staffData[activeTab].filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle staff member click
    const handleStaffClick = (staff) => {
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
        if (!value || value === '-') return null;
        return (
            <div className={`flex items-center text-sm mt-1 ${className}`}>
                {icon}
                <span className="ml-1">{value}</span>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back button */}
                <Link
                    to="/"
                    className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
                >
                    <IoChevronBack className="mr-1" />
                    กลับสู่หน้าหลัก
                </Link>

                {/* Main title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">บุคลากรและเจ้าหน้าที่</h1>
                    <p className="text-gray-600 mb-4">ผู้บริหาร คณะครู และเจ้าหน้าที่โรงเรียนท่าบ่อพิทยาคม</p>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Menu */}
                    <div className="w-full lg:w-64 bg-white rounded-xl shadow-md p-4 h-fit sticky top-4">
                        <h3 className="text-lg font-semibold text-amber-800 mb-4">ฝ่ายบริหารและบุคลากร</h3>
                        <ul className="space-y-2">
                            {Object.keys(staffData).map((tabId) => {
                                const tabNames = {
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
                                return (
                                    <li key={tabId}>
                                        <button
                                            onClick={() => {
                                                setActiveTab(tabId);
                                                setSearchTerm(''); // Reset search when changing tabs
                                            }}
                                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === tabId ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:bg-amber-50'}`}
                                        >
                                            {tabNames[tabId]}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Main content */}
                    <div className="flex-1">
                        {/* Search box */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <input
                                type="text"
                                placeholder="ค้นหาบุคลากร..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Selected department title */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-2xl font-bold text-amber-800 mb-4">
                                {{
                                    administration: 'คณะผู้บริหาร',
                                    thai: 'กลุ่มสาระภาษาไทย',
                                    math: 'กลุ่มสาระคณิตศาสตร์',
                                    science: 'กลุ่มสาระวิทยาศาสตร์และเทคโนโลยี',
                                    social: 'กลุ่มสาระสังคมศึกษาฯ',
                                    health: 'กลุ่มสาระสุขศึกษาฯ',
                                    art: 'กลุ่มสาระศิลปะ',
                                    foreign: 'กลุ่มสาระภาษาต่างประเทศ',
                                    support: 'เจ้าหน้าที่สนับสนุน'
                                }[activeTab]}
                            </h2>

                            {/* Staff list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredStaff.map((staff) => (
                                    <motion.div
                                        key={staff.id}
                                        whileHover={{ y: -5 }}
                                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer"
                                        onClick={() => handleStaffClick(staff)}
                                    >
                                        <div className="flex p-4">
                                            <div className="flex-shrink-0 mr-4">
                                                <img
                                                    src={staff.image}
                                                    alt={staff.name}
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-200"
                                                    onError={(e) => {
                                                        e.target.src = '/images/default-teacher.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800">{staff.name}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{staff.position}</p>

                                                {/* Email */}
                                                {renderInfo(staff.email, <IoMail className="text-amber-600" />)}

                                                {/* Phone */}
                                                {renderInfo(staff.phone, <IoCall className="text-green-600" />)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredStaff.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    ไม่พบบุคลากรที่ตรงกับการค้นหา
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
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-amber-800">ข้อมูลบุคลากร</h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <IoClose size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedStaff.image}
                                            alt={selectedStaff.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-amber-200 mx-auto"
                                            onError={(e) => {
                                                e.target.src = '/images/default-teacher.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">ชื่อ-สกุล</h4>
                                                <p className="text-gray-700">{selectedStaff.name}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">ตำแหน่ง</h4>
                                                <p className="text-gray-700">{selectedStaff.position}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">วุฒิการศึกษา</h4>
                                                <p className="text-gray-700">{selectedStaff.education}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">วิชาเอก</h4>
                                                <p className="text-gray-700">{selectedStaff.major}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">ข้อมูลติดต่อ</h4>
                                                <div className="space-y-1">
                                                    {renderInfo(selectedStaff.phone, <IoCall className="text-green-600" />, "text-gray-700")}
                                                    {renderInfo(selectedStaff.email, <IoMail className="text-amber-600" />, "text-gray-700")}
                                                    {renderInfo(selectedStaff.address, <IoLocation className="text-blue-600" />, "text-gray-700")}
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