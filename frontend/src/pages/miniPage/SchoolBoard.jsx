// โครงสร้างสายงาน
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import teacherStructure from "../../assets/images/teacher_structure.jpg";

const SchoolBoard = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* ปุ่มกลับ */}
                <Link
                    to="/"
                    className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
                >
                    <IoChevronBack className="mr-1" />
                    กลับสู่หน้าหลัก
                </Link>

                {/* หัวข้อหลัก */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">โครงสร้างสายงานโรงเรียน</h1>
                    <p className="text-gray-600 mb-4">ข้อมูลคณะกรรมการและโครงสร้างการบริหารงาน</p>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                </div>

                {/* คำอธิบาย */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-amber-800 mb-3">โครงสร้างการบริหารงานโรงเรียนท่าบ่อพิทยาคม</h2>
                    <p className="text-gray-700 leading-relaxed">
                        โรงเรียนท่าบ่อพิทยาคมมีการจัดโครงสร้างการบริหารงานตามนโยบายของสำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน
                        โดยมีผู้อำนวยการโรงเรียนเป็นผู้บังคับบัญชาสูงสุด และมีรองผู้อำนวยการช่วยบริหารงานในด้านต่างๆ
                    </p>
                </div>

                {/* รูปภาพโครงสร้าง */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">แผนผังโครงสร้างสายงาน</h3>
                    </div>
                    <div className="p-4">
                        <img
                            src={teacherStructure}
                            alt="โครงสร้างสายงานโรงเรียนท่าบ่อพิทยาคม"
                            className="w-full h-auto rounded-lg border border-gray-200"
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            อัปเดตล่าสุด: 1 เมษายน 2568
                        </p>
                    </div>
                </div>

                {/* ตารางข้อมูล */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">รายชื่อโครงสร้างสายงานโรงเรียนท่าบ่อพิทยาคม</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-amber-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">ลำดับ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">ชื่อ-สกุล</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">ตำแหน่ง</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">บทบาทหน้าที่</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                    { id: 1, name: "นายชำนาญวิทย์ ประเสริฐ", position: "ผู้อำนวยการโรงเรียน", role: "ผู้บริหารสูงสุดของโรงเรียน" },
                                    { id: 2, name: "นางพิชญา สุวงศ์", position: "รองผู้อำนวยการโรงเรียน", role: "รองผู้บริหารโรงเรียน" },

                                    { id: 3, name: "นายณัฐวุฒิ เจริญกุล", position: "หัวหน้างานบริหารวิชาการ", role: "บริหารงานวิชาการ" },
                                    { id: 4, name: "นางสาววิไลลักษณ์ อ่างแก้ว", position: "เจ้าหน้าที่งานวิชาการ", role: "ดูแลงานวิชาการ" },
                                    { id: 5, name: "นางสาวจีรนันท์ พรหมพิภักดิ์", position: "เจ้าหน้าที่งาน", role: "ดูแลกลุ่มสาระวิทยาศาสตร์" },
                                    { id: 6, name: "นางสาวสิริกัญญา กาอุปมุง", position: "เจ้าหน้าที่งาน", role: "ดูแลห้องเรียนพิเศษ" },

                                    { id: 7, name: "นางเกสร ผาสุข", position: "หัวหน้างานบริหารบุคคล", role: "บริหารงานบุคคล" },
                                    { id: 8, name: "นางวราภรณ์ แสงแก้ว", position: "เจ้าหน้าที่งานบุคคล", role: "ดูแลงานบุคคล" },
                                    { id: 9, name: "นายธีรพงษ์ หมอยาเก่า", position: "เจ้าหน้าที่งานธุรการ", role: "ดูแลงานธุรการ" },

                                    { id: 10, name: "นายทวีศักดิ์ มณีรัตน์", position: "หัวหน้างานทั่วไป", role: "บริหารงานทั่วไปในโรงเรียน" },
                                    { id: 11, name: "นางอุบล แสงโสดา", position: "เจ้าหน้าที่งานอนามัย", role: "ดูแลงานอนามัย" },
                                    { id: 12, name: "นางสาวกมลชนก รีวงษา", position: "เจ้าหน้าที่งานสารบรรณ", role: "ดูแลงานสารบรรณ" },
                                    { id: 13, name: "นายลาญ น้อยโสภา", position: "ยามรักษาการณ์", role: "รักษาความปลอดภัยภายในโรงเรียน" },

                                    { id: 14, name: "นางอามร คำเสมอ", position: "หัวหน้างานบริหารงบประมาณ", role: "บริหารด้านการเงินของโรงเรียน" },
                                    { id: 15, name: "นางพรสิริ พิมพ์พา", position: "เจ้าหน้าที่การเงิน", role: "ดูแลการเงิน" },
                                    { id: 16, name: "นายศุภชัย โคตรชมภู", position: "เจ้าหน้าที่พัสดุ", role: "ดูแลพัสดุโรงเรียน" },
                                    { id: 17, name: "นางสาวสุรางคนา เหลืองกิจไพบูลย์", position: "เจ้าหน้าที่พัสดุ", role: "ดูแลพัสดุโรงเรียน" },
                                ].map((person) => (
                                    <tr key={person.id} className="hover:bg-amber-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{person.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{person.position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{person.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* หมายเหตุ */}
                <div className="mt-6 text-sm text-gray-500">
                    <p>หมายเหตุ: ข้อมูลอาจมีการเปลี่ยนแปลงตามนโยบายของโรงเรียนและสำนักงานเขตพื้นที่การศึกษา</p>
                </div>
            </div>
        </motion.div>
    );
};

export default SchoolBoard;