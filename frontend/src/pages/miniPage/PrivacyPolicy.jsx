import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoChevronBack, IoSchool, IoBook, IoMedal, IoLibrary } from "react-icons/io5";
import thaboSchool from "../../assets/images/thabo_school.jpg";
import schoolRewards from "../../assets/images/school_rewards.jpg";

const AcademicInfo = () => {
  return (
    <section className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
        <img
          src={thaboSchool}
          alt="ข้อมูลวิชาการโรงเรียนท่าบ่อพิทยาคม"
          className="w-full h-[400px] object-cover"
        />
        <div className="container relative z-20 mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            ข้อมูลวิชาการ
          </h1>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
            โรงเรียนท่าบ่อพิทยาคม
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            มุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม สู่มาตรฐานการศึกษาที่มีคุณภาพ
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/" className="flex items-center text-amber-700 hover:text-amber-900 transition-colors">
              <IoChevronBack className="mr-1" />
              กลับหน้าหลัก
            </Link>
          </div>

          {/* School Overview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-amber-500"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <IoSchool className="text-amber-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-amber-800">ข้อมูลทั่วไป</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    โรงเรียนท่าบ่อพิทยาคมเป็นโรงเรียนมัธยมศึกษาขนาดเล็ก สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาหนองคาย
                    ก่อตั้งเมื่อปี พ.ศ. 2534 ปัจจุบันเปิดสอนระดับชั้นมัธยมศึกษาปีที่ 1 ถึงปีที่ 6
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    มีวิสัยทัศน์ "เรียนดี   กีฬาเด่น   เน้นคุณธรรม   นำอาชีพ"
                  </p>
                </div>
                <div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-700 mb-2">ข้อมูลพื้นฐาน</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>จำนวนครู: 13 คน</li>
                      <li>จำนวนนักเรียน: 153 คน</li>
                      <li>จำนวนห้องเรียน: 8 ห้อง</li>
                      <li>พื้นที่: 7 ไร่ 4 งาน</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Curriculum Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-amber-500"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <IoBook className="text-amber-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-amber-800">หลักสูตรการศึกษา</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    โรงเรียนใช้หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พ.ศ. 2551 (ปรับปรุง พ.ศ. 2560)
                    โดยจัดการเรียนการสอน 8 กลุ่มสาระการเรียนรู้หลัก
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "ภาษาไทย", "คณิตศาสตร์", "วิทยาศาสตร์", "สังคมศึกษา",
                      "สุขศึกษา", "ศิลปะ", "การงานอาชีพ", "ภาษาต่างประเทศ"
                    ].map((subject, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        className="bg-amber-50 px-3 py-2 rounded text-center text-amber-800 font-medium"
                      >
                        {subject}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">โครงสร้างเวลาเรียน</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700">มัธยมศึกษาตอนต้น</h4>
                      <p className="text-gray-600">1,200 ชั่วโมง/ปี</p>
                      <p className="text-gray-600 text-sm">เน้นพื้นฐานวิชาการและทักษะชีวิต</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">มัธยมศึกษาตอนปลาย</h4>
                      <p className="text-gray-600">1,400 ชั่วโมง/ปี</p>
                      <p className="text-gray-600 text-sm">เน้นการเตรียมความพร้อมสู่ระดับอุดมศึกษา</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Academic Achievements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-amber-500"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <IoMedal className="text-amber-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-amber-800">ผลงานทางวิชาการ</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <motion.img
                    src={schoolRewards}
                    alt="รางวัลโรงเรียนท่าบ่อพิทยาคม"
                    className="w-full h-auto rounded-lg shadow-md mb-4"
                    whileHover={{ scale: 1.02 }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">งานศิลปหัตถกรรมนักเรียน ครั้งที่ 72</h3>
                  <p className="text-gray-700 mb-3">ปีการศึกษา 2567 ระดับเขตพื้นที่การศึกษา</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-amber-100 p-2 rounded">
                      <div className="text-amber-800 font-bold text-xl">29</div>
                      <div className="text-xs text-gray-600">เหรียญทอง</div>
                    </div>
                    <div className="bg-gray-200 p-2 rounded">
                      <div className="text-gray-800 font-bold text-xl">3</div>
                      <div className="text-xs text-gray-600">เหรียญเงิน</div>
                    </div>
                    <div className="bg-amber-700 p-2 rounded">
                      <div className="text-white font-bold text-xl">1</div>
                      <div className="text-xs text-white">เหรียญทองแดง</div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded">
                      <div className="text-blue-800 font-bold text-xl">33</div>
                      <div className="text-xs text-blue-600">รางวัลทั้งหมด</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">ผลสัมฤทธิ์ทางการเรียน</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700">ผลการสอบ O-NET ปีการศึกษา 2566</h4>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>ภาษาไทย: 57.35% </li>
                        <li>คณิตศาสตร์: 45.28% </li>
                        <li>วิทยาศาสตร์: 43.72% </li>
                        <li>ภาษาอังกฤษ: 44.25% </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">อัตราการศึกษาต่อ</h4>
                      <p className="text-gray-700">85% ของนักเรียนชั้น ม.6 สามารถศึกษาต่อในระดับอุดมศึกษา</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Resources */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-amber-500"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <IoLibrary className="text-amber-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-amber-800">แหล่งเรียนรู้และสิ่งอำนวยความสะดวก</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: "ห้องสมุด", desc: "หนังสือกว่า 1,200 เล่ม" },
                  { name: "ห้องปฏิบัติการวิทยาศาสตร์", desc: "2 ห้อง" },
                  { name: "ห้องคอมพิวเตอร์", desc: "คอมพิวเตอร์ 35 เครื่อง" },
                  { name: "ห้องสมุดดิจิทัล", desc: "เรียนรู้ออนไลน์" },
                  { name: "ศูนย์การเรียนรู้มวยไทย", desc: "การสอนนอกบทเรียน" },
                  { name: "ศูนย์การเรียนรู้การเกษตรและวัฒนธรรม", desc: "การสอนนอกบทเรียน" }
                ].map((resource, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    className="bg-amber-50 p-4 rounded-lg border border-amber-200"
                  >
                    <h3 className="font-semibold text-amber-800">{resource.name}</h3>
                    <p className="text-gray-600 text-sm">{resource.desc}</p>
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