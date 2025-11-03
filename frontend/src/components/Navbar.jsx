import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoClose, IoMenuSharp, IoChevronDown, IoLogOut, IoSettings, IoPerson } from "react-icons/io5";
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import AvaterImg from "../assets/commentor.png";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';

{/* กำหนดเมนูหลักและเมนูย่อย */ }
const navLists = [
  { name: 'หน้าหลัก', path: '/' },
  {
    name: 'เกี่ยวกับโรงเรียน',
    path: '/about-us',
    dropdown: [
      { name: 'ประวัติโรงเรียน', path: '/about-us' },
      { name: 'วิสัยทัศน์และพันธกิจ', path: '/vision-mission' },
      { name: 'โครงสร้างสายงาน', path: '/school-board' },
      { name: 'บุคลากรและเจ้าหน้าที่', path: '/faculty-staff' },
    ],
  },
  { name: 'วิชาการ', path: '/privacy-policy' },
  { name: 'ข่าวและกิจกรรม', path: '/blogs' },
  {
    name: 'กิจกรรมนักเรียน',
    path: '#',
    dropdown: [
      { name: 'จำนวนนักเรียน', path: '/all-students' },
      { name: 'เช็คชื่อนักเรียนเข้าแถว', path: '/flagpoleattendance' },
      { name: 'บันทึกคะแนนความประพฤติ', path: 'behaviorscore' },
      { name: 'เช็คประวัติการเข้าแถว', path: '/student-attendance-history' },
      { name: 'เช็คคะแนนความประพฤติ', path: '/student-behavior-score' },
      { name: 'สภานักเรียน', path: '/student-council' },
      { name: 'ตารางเรียน', path: '/student-schedule' },
      { name: 'ชุมนุมวิชาการ', path: '/clubs' },
      { name: 'ฟอร์มเยี่ยมบ้านนักเรียน', path: '/home-visits' },
    ],
  },
  { name: 'การรับสมัคร', path: '/admissions' },
  { name: 'ติดต่อเรา', path: '/contact-us' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); {/* สถานะการเปิด/ปิดเมนูบนมือถือ */ }
  const [openDropdown, setOpenDropdown] = useState(null); {/* สถานะการเปิด/ปิด dropdown */ }
  const { user } = useSelector((state) => state.auth); {/* ดึงข้อมูลผู้ใช้จาก Redux store */ }
  const dispatch = useDispatch(); {/* ใช้ dispatch เพื่อส่ง action ไปยัง Redux store */ }
  const [logoutUser] = useLogoutUserMutation(); {/* ใช้ mutation สำหรับการ logout */ }

  {/* ฟังก์ชันเปิด/ปิดเมนูบนมือถือ */ }
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  {/* ฟังก์ชันเปิด/ปิด dropdown */ }
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  {/* ฟังก์ชันจัดการการ logout */ }
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <motion.header
      className='bg-white py-3 sm:py-4 border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className='container mx-auto flex justify-between items-center px-3 sm:px-4 md:px-5'>
        {/* ส่วนโลโก้และชื่อโรงเรียน - Mobile Optimized with Centered Alignment */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 min-w-0 flex-1 lg:flex-initial">
          <img 
            src="/logo.png" 
            alt="โรงเรียนท่าบ่อพิทยาคม" 
            className='h-9 sm:h-10 md:h-12 w-auto flex-shrink-0' 
          />
          <div className="min-w-0 flex-1 lg:flex-initial flex flex-col justify-center">
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-primary leading-none mb-0.5 mt-3">
              โรงเรียนท่าบ่อพิทยาคม
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-600 leading-none">
              Thabopitthayakhom School
            </p>
          </div>
        </Link>

        {/* เมนูสำหรับ Desktop Navigation */}
        <ul className='hidden lg:flex items-center gap-1 xl:gap-2 p-0 m-0'>
          {navLists.map((list, index) => (
            <li key={index} className="relative">
              {list.dropdown ? (
                <>
                  {/* ปุ่มเมนูที่มี dropdown */}
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-1.5 text-amber-600 hover:text-primary hover:bg-yellow-700/10 active:bg-yellow-700/20 px-3 py-2.5 rounded-lg font-medium text-sm xl:text-base transition-all touch-manipulation"
                  >
                    <span className="truncate">{list.name}</span>
                    <motion.div
                      animate={{ rotate: openDropdown === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                  {/* Dropdown เมนู */}
                  {openDropdown === index && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {list.dropdown.map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.path}
                          className="block text-gray-700 hover:text-primary hover:bg-yellow-700/10 active:bg-yellow-700/20 px-4 py-3 font-medium text-sm transition-all border-b border-gray-100 last:border-b-0"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="truncate block">{link.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                {/* เมนูทั่วไป */ },
                <NavLink
                  to={list.path}
                  className={({ isActive }) =>
                    `hover:text-primary hover:bg-yellow-700/10 active:bg-yellow-700/20 px-3 py-2.5 rounded-lg font-medium text-sm xl:text-base transition-all truncate block ${isActive ? "text-primary font-bold" : "text-amber-600"}`
                  }
                >
                  {list.name}
                </NavLink>
              )}
            </li>
          ))}

          {/* ส่วนผู้ใช้และปุ่มเข้าสู่ระบบ/ออกจากระบบ */}
          {user ? (
            <li className='flex gap-3 items-center'>
              <img 
                src={AvaterImg} 
                alt={user.name || "ผู้ใช้"} 
                className='w-9 h-9 rounded-full border-2 border-amber-200 flex-shrink-0' 
              />
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('user')}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-primary font-medium text-sm xl:text-base transition-colors"
                >
                  <span className="truncate max-w-[120px] xl:max-w-[150px]">{user.name}</span>
                  <motion.div
                    animate={{ rotate: openDropdown === 'user' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>
                {/* Dropdown เมนูผู้ใช้ */}
                {openDropdown === 'user' && (
                  <motion.div
                    className="absolute top-full right-0 mt-3 w-52 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ปุ่ม Dashboard สำหรับ Admin, Super Admin และ Teacher */}
                    {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'teacher') && (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-700/10 hover:text-primary font-medium text-sm transition-all border-b border-gray-100"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Settings className="mr-2.5 h-4 w-4 flex-shrink-0" /> 
                        <span className="truncate">แดชบอร์ด</span>
                      </Link>
                    )}
                    {/* ปุ่ม Profile */}
                    {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'teacher') && (
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-700/10 hover:text-primary font-medium text-sm transition-all border-b border-gray-100"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <User className="mr-2.5 h-4 w-4 flex-shrink-0" /> 
                        <span className="truncate">โปรไฟล์</span>
                      </Link>
                    )}

                    {/* ปุ่ม Logout */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium text-sm transition-all"
                    >
                      <LogOut className="mr-2.5 h-4 w-4 flex-shrink-0" /> 
                      <span className="truncate">ออกจากระบบ</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </li>
          ) : (
            {/* ปุ่มเข้าสู่ระบบสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน */ },
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink 
                to="/login" 
                className="text-gray-700 hover:text-primary hover:bg-yellow-700/10 active:bg-yellow-700/20 px-4 py-2.5 rounded-lg font-medium text-sm xl:text-base transition-all"
              >
                เข้าสู่ระบบ
              </NavLink>
            </motion.li>
          )}
        </ul>

        {/* ปุ่มเมนูสำหรับ Mobile Navigation - Touch Optimized */}
        <div className='flex items-center lg:hidden'>
          <button
            onClick={toggleMenu}
            className='flex items-center justify-center px-3 py-2.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 active:bg-gray-300 hover:text-primary transition-all touch-manipulation min-h-[44px] min-w-[44px]'
            aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          >
            {isMenuOpen ? <IoClose className='w-6 h-6' /> : <IoMenuSharp className='w-6 h-6' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Mobile First Design */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className='fixed top-[60px] sm:top-[68px] left-0 w-full h-[calc(100vh-60px)] sm:h-[calc(100vh-68px)] bg-white shadow-lg z-50 overflow-y-auto'
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <ul className='px-4 sm:px-5 py-4'>
              {navLists.map((list, index) => (
                <li key={index} className='border-b border-gray-100 last:border-b-0'>
                  {list.dropdown ? (
                    <>
                      {/* ปุ่มเมนูที่มี dropdown บน Mobile - Touch Optimized */}
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="flex items-center justify-between w-full py-3.5 text-gray-700 hover:text-primary active:text-primary hover:bg-yellow-700/5 active:bg-yellow-700/10 px-2 rounded-lg font-medium text-base touch-manipulation transition-all min-h-[48px]"
                      >
                        <span className="truncate flex-1 text-left">{list.name}</span>
                        <motion.div
                          animate={{ rotate: openDropdown === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0 ml-2"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.div>
                      </button>
                      {/* Dropdown เมนูบน Mobile */}
                      <AnimatePresence>
                        {openDropdown === index && (
                          <motion.div 
                            className="pl-4 sm:pl-5 pb-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {list.dropdown.map((link, idx) => (
                              <Link
                                key={idx}
                                to={link.path}
                                className="flex items-center py-3 text-gray-600 hover:text-primary active:text-primary hover:bg-yellow-700/5 active:bg-yellow-700/10 px-3 rounded-lg font-medium text-sm touch-manipulation transition-all min-h-[44px]"
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                              >
                                <span className="truncate">{link.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    {/* เมนูทั่วไปบน Mobile - Touch Optimized */ },
                    <NavLink
                      to={list.path}
                      className={({ isActive }) =>
                        `flex items-center py-3.5 px-2 rounded-lg font-medium text-base touch-manipulation transition-all min-h-[48px] ${
                          isActive 
                            ? "text-primary font-bold bg-yellow-700/10" 
                            : "text-gray-700 hover:text-primary hover:bg-yellow-700/5 active:bg-yellow-700/10"
                        }`
                      }
                      onClick={() => {
                        setIsMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <span className="truncate">{list.name}</span>
                    </NavLink>
                  )}
                </li>
              ))}
              {/* ส่วนผู้ใช้และปุ่มเข้าสู่ระบบ/ออกจากระบบบน Mobile */}
              {user ? (
                <li className='border-b border-gray-100 last:border-b-0'>
                  <button
                    onClick={() => toggleDropdown('user')}
                    className="flex items-center justify-between w-full py-3.5 px-2 text-gray-700 hover:text-primary active:text-primary hover:bg-yellow-700/5 active:bg-yellow-700/10 rounded-lg font-medium text-base touch-manipulation transition-all min-h-[48px]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img 
                        src={AvaterImg} 
                        alt={user.name || "ผู้ใช้"} 
                        className='w-8 h-8 rounded-full border-2 border-amber-200 flex-shrink-0' 
                      />
                      <span className="truncate">{user.name}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openDropdown === 'user' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-2"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>
                  {/* Dropdown เมนูผู้ใช้บน Mobile */}
                  <AnimatePresence>
                    {openDropdown === 'user' && (
                      <motion.div 
                        className="pl-4 sm:pl-5 pb-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* ปุ่ม Dashboard สำหรับ Admin, Super Admin และ Teacher บน Mobile */}
                        {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'teacher') && (
                          <Link
                            to="/dashboard"
                            className="flex items-center py-3 text-gray-600 hover:text-primary active:text-primary hover:bg-blue-700/5 active:bg-blue-700/10 px-3 rounded-lg font-medium text-sm touch-manipulation transition-all min-h-[44px]"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            <Settings className="mr-2.5 h-5 w-5 flex-shrink-0" /> 
                            <span className="truncate">แดชบอร์ด</span>
                          </Link>
                        )}
                        {/* ปุ่ม Profile บน Mobile */}
                        {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'teacher') && (
                          <Link
                            to="/profile"
                            className="flex items-center py-3 text-gray-600 hover:text-primary active:text-primary hover:bg-blue-700/5 active:bg-blue-700/10 px-3 rounded-lg font-medium text-sm touch-manipulation transition-all min-h-[44px]"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            <User className="mr-2.5 h-5 w-5 flex-shrink-0" /> 
                            <span className="truncate">โปรไฟล์</span>
                          </Link>
                        )}
                        {/* ปุ่ม Logout บน Mobile */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center w-full py-3 text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 px-3 rounded-lg font-medium text-sm touch-manipulation transition-all min-h-[44px]"
                        >
                          <LogOut className="mr-2.5 h-5 w-5 flex-shrink-0" /> 
                          <span className="truncate">ออกจากระบบ</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                {/* ปุ่มเข้าสู่ระบบสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอินบน Mobile */ },
                <li className='border-b border-gray-100 last:border-b-0'>
                  <NavLink
                    to="/login"
                    className="flex items-center py-3.5 px-2 text-gray-700 hover:text-primary active:text-primary hover:bg-yellow-700/5 active:bg-yellow-700/10 rounded-lg font-medium text-base touch-manipulation transition-all min-h-[48px]"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    <span className="truncate">เข้าสู่ระบบ</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;