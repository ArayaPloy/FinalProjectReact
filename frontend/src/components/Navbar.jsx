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
      { name: 'บันทึกคะแนนความประพฤติ', path: 'behaviorscore' }, /* https://docs.google.com/spreadsheets/d/1oAISG4M-Qq4XialIfivbE07ehZHGdf05ppNO-996ouw/edit?gid=0#gid=0 */
      { name: 'สภานักเรียน', path: '/student-council' },
      { name: 'ตารางเรียน', path: '/student-schedule' },
      { name: 'ชุมนุมวิชาการ', path: '/clubs' },
      { name: 'เช็คชื่อนักเรียนเข้าชุมนุม', path: '/clubattendance' },
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
      className='bg-white py-4 border-b sticky top-0 z-50'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className='container mx-auto flex justify-between px-5 items-center'>
        {/* ส่วนโลโก้และชื่อโรงเรียน */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className='h-12' />
          <div>
            <h1 className="text-lg font-bold text-primary p-0 m-0">โรงเรียนท่าบ่อพิทยาคม</h1>
            <p className="text-xs text-gray-600 p-0 m-0">Thabopitthayakhom School</p>
          </div>
        </Link>

        {/* เมนูสำหรับ Desktop Navigation */}
        <ul className='hidden lg:flex items-center gap-2 p-0 m-0'>
          {navLists.map((list, index) => (
            <li key={index} className="relative">
              {list.dropdown ? (
                <>
                  {/* ปุ่มเมนูที่มี dropdown */}
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-1 text-amber-600 hover:text-primary hover:bg-yellow-700/10 px-3 py-2 rounded-lg"
                  >
                    {list.name}
                    <motion.div
                      animate={{ rotate: openDropdown === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                  {/* Dropdown เมนู */}
                  {openDropdown === index && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {list.dropdown.map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.path}
                          className="block text-gray-700 hover:text-primary  hover:bg-yellow-700/10 px-3 py-2 rounded-lg"
                        >
                          {link.name}
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
                    `hover:text-primary hover:bg-yellow-700/10 px-3 py-2 rounded-lg  ${isActive ? "text-primary font-semibold" : "text-amber-600"}`
                  }
                >
                  {list.name}
                </NavLink>
              )}
            </li>
          ))}

          {/* ส่วนผู้ใช้และปุ่มเข้าสู่ระบบ/ออกจากระบบ */}
          {user ? (
            <li className='flex gap-4 items-center'>
              <img src={AvaterImg} alt="" className='size-8 rounded-full' />
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('user')}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary"
                >
                  {user.name}
                  <motion.div
                    animate={{ rotate: openDropdown === 'user' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>
                {/* Dropdown เมนูผู้ใช้ */}
                {openDropdown === 'user' && (
                  <motion.div
                    className="absolute top-full right-0 mt-4 w-48 bg-white border border-gray-300 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ปุ่ม Dashboard สำหรับ Admin */}
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-700/10 rounded-lg hover:text-primary"
                      >
                        <Settings className="mr-2 h-4 w-4" /> แดชบอร์ด
                      </Link>
                    )}
                    {/* ปุ่ม Profile */}
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-700/10 rounded-lg hover:text-primary"
                      >
                        <User className="mr-2 h-4 w-4" /> โปรไฟล์
                      </Link>)}

                    {/* ปุ่ม Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                    </button>
                  </motion.div>
                )}
              </div>
            </li>
          ) : (
            {/* ปุ่มเข้าสู่ระบบสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน */ },
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink to="/login" className="text-gray-700 hover:text-primary">
                เข้าสู่ระบบ
              </NavLink>
            </motion.div>
          )}
        </ul>

        {/* ปุ่มเมนูสำหรับ Mobile Navigation */}
        <div className='flex items-center lg:hidden'>
          <button
            onClick={toggleMenu}
            className='flex items-center px-3 py-2 bg-gray-100 rounded text-gray-700 hover:text-primary'
          >
            {isMenuOpen ? <IoClose className='size-6' /> : <IoMenuSharp className='size-6' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='fixed top-[84px] left-0 w-full h-[calc(100vh-84px)] bg-white shadow-sm z-50 overflow-y-auto'>
          <ul className='px-4'>
            {navLists.map((list, index) => (
              <li key={index} className='mt-5'>
                {list.dropdown ? (
                  <>
                    {/* ปุ่มเมนูที่มี dropdown บน Mobile */}
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-primary"
                    >
                      {list.name}
                      <motion.div
                        animate={{ rotate: openDropdown === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                    {/* Dropdown เมนูบน Mobile */}
                    {openDropdown === index && (
                      <div className="pl-4">
                        {list.dropdown.map((link, idx) => (
                          <Link
                            key={idx}
                            to={link.path}
                            className="block py-2 text-gray-700 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  {/* เมนูทั่วไปบน Mobile */ },
                  <NavLink
                    to={list.path}
                    className={({ isActive }) =>
                      `block py-2 ${isActive ? "text-primary font-semibold" : "text-gray-700"}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {list.name}
                  </NavLink>
                )}
              </li>
            ))}
            {/* ส่วนผู้ใช้และปุ่มเข้าสู่ระบบ/ออกจากระบบบน Mobile */}
            {user ? (
              <li className='mt-5'>
                <button
                  onClick={() => toggleDropdown('user')}
                  className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    <img src={AvaterImg} alt="" className='size-8 rounded-full' />
                    {user.name}
                  </div>
                  <motion.div
                    animate={{ rotate: openDropdown === 'user' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>
                {/* Dropdown เมนูผู้ใช้บน Mobile */}
                {openDropdown === 'user' && (
                  <div className="pl-4">
                    {/* ปุ่ม Dashboard สำหรับ Admin บน Mobile */}
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        to="/dashboard"
                        className="flex items-center py-2 text-gray-700 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" /> แดชบอร์ด
                      </Link>
                    )}
                    {/* ปุ่ม Profile บน Mobile */}
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        to="/profile"
                        className="flex items-center py-2 text-gray-700 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" /> โปรไฟล์
                      </Link>)}
                    {/* ปุ่ม Logout บน Mobile */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center py-2 text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </li>
            ) : (
              {/* ปุ่มเข้าสู่ระบบสำหรับผู้ใช้ที่ยังไม่ได้ล็อกอินบน Mobile */ },
              <li className='mt-5'>
                <NavLink
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;