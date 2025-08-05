import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoChevronBack, IoDocumentText, IoLockOpen, IoAnalytics, IoCheckmarkCircle } from "react-icons/io5";
import ITA1 from "../../assets/images/ITA1.jpg";
import ITA2 from "../../assets/images/ITA2.jpg";
import ITA3 from "../../assets/images/ITA3.jpg";

const ITAPage = () => {
    return (
        <section className="bg-gray-50 text-gray-800">
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90 z-10" />
                <div className="w-full h-[400px] bg-blue-800 object-cover" />
                <div className="container relative z-20 mx-auto px-4 py-20 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        การเปิดเผยข้อมูลสาธารณะ (ITA ปี 2567)
                    </h1>
                    <h2 className="mb-6 text-3xl font-semibold tracking-tight text-blue-200">
                        Integrity & Transparency Assessment
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-white/90">
                        การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link to="/" className="flex items-center text-blue-700 hover:text-blue-900 transition-colors">
                            <IoChevronBack className="mr-1" />
                            กลับหน้าหลัก
                        </Link>
                    </div>

                    {/* ITA Introduction */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-blue-500"
                    >
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <IoDocumentText className="text-blue-600 text-2xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-blue-800">การประเมินคุณธรรมและความโปร่งใส (ITA)</h2>
                            </div>

                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    คณะกรรมการ ป.ป.ช. ได้เล็งเห็นถึงจุดแข็งของเครื่องมือการประเมินผลในการต่อต้านการทุจริตทั้งของสำนักงาน ป.ป.ช. และของสำนักงานคณะกรรมการต่อต้านการทุจริตและสิทธิพลเมือง สาธารณรัฐเกาหลี จึงได้มีมติบูรณาการเครื่องมือการประเมิน โดยในการประชุมคณะกรรมการ ป.ป.ช. ครั้งที่ 304-51/2554 เมื่อวันที่ 14 กรกฎาคม 2554 ที่ประชุมมีมติเห็นชอบ 'ให้สำนัก/สถาบัน/ศูนย์ในสังกัดสำนักงาน ป.ป.ช. ศึกษาและเตรียมความพร้อมตามดัชนีวัดความโปร่งใสของหน่วยงานภาครัฐ พ.ศ. 2554 สำหรับการประเมินผลต่อไป และอนุมัติการปรับแผนปฏิบัติการตามโครงการพัฒนาดัชนีวัดความโปร่งใสของหน่วยงานภาครัฐ พ.ศ.2554 ตามที่เสนอ
                                </p>
                                <p>
                                    ทั้งนี้ โครงการพัฒนาดัชนีวัดความโปร่งใสของหน่วยงานภาครัฐ (Transparency Index of the Public Agencies) มีลักษณะใกล้เคียงกับโครงการประเมินคุณธรรมการดำเนินงาน (Integrity Assessment) ดังนั้น เมื่อดำเนินการตามโครงการทั้งสองเสร็จเรียบร้อยแล้ว ควรที่จะนำผลการดำเนินการมาบูรณาการร่วมกัน
                                </p>
                                <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    การประเมินผลตามดัชนีวัดความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ เป็นเครื่องมือต่อต้านการทุจริตที่ใช้ในการประเมินความพยายามของหน่วยงานภาครัฐ ในการต่อต้านการทุจริต (measure anti-corruption efforts) จากข้อเท็จจริงในการดำเนินงานที่สามารถตรวจสอบได้จากเอกสารหลักฐานเชิงประจักษ์ ขณะที่การประเมินคุณธรรมการดำเนินงานเป็นเครื่องมือต่อต้านการทุจริตที่ใช้วัดระดับการทุจริตในการดำเนินงานของหน่วยงานภาครัฐ (measure corruption) โดยประเมินผลจากการรับรู้หรือประสบการณ์ตรงของประชาชนที่เคยรับบริการจากหน่วยงานภาครัฐ
                                </p>
                                <p>
                                    ดังนั้น เพื่อดึงจุดแข็งของทั้งสองระบบและเพื่อให้เกิดความสมดุลในการประเมิน คณะกรรมการ ป.ป.ช. จึงได้มีมติบูรณาการเครื่องมือการประเมินที่ใช้ในการต่อต้านการทุจริตทั้งสองระบบเข้าด้วยกัน แล้วเรียกเครื่องมือใหม่ว่า 'การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ (Integrity & Transparency Assessment: ITA)'
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* OIT Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-blue-500"
                    >
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <IoLockOpen className="text-blue-600 text-2xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-blue-800">แบบตรวจการเปิดเผยข้อมูลสาธารณะ (OIT)</h2>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed">
                                    การเปิดเผยข้อมูลสาธารณะ (Open Data Integrity and Transparency Assessment: OIT) มีวัตถุประสงค์เพื่อเป็นการประเมินระดับการเปิดเผยข้อมูลต่อสาธารณะของหน่วยงาน เพื่อให้ประชาชนทั่วไปสามารถเข้าถึงได้ ในตัวชี้วัดการเปิดเผยข้อมูล และการป้องกันการทุจริต สำหรับการประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ (ITA)
                                </p>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="overflow-hidden rounded-lg shadow-md"
                                    >
                                        <img src={ITA1} alt="ITA Document 1" className="w-full object-cover" />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="overflow-hidden rounded-lg shadow-md"
                                    >
                                        <img src={ITA2} alt="ITA Document 2" className="w-full object-cover" />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="overflow-hidden rounded-lg shadow-md"
                                    >
                                        <img src={ITA3} alt="ITA Document 3" className="w-full object-cover" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Features */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border-t-4 border-blue-500"
                    >
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">ลักษณะสำคัญของ ITA</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-blue-50 p-6 rounded-lg border border-blue-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                            <IoAnalytics className="text-blue-600 text-xl" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-blue-800">การประเมินสองมิติ</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        ผสมผสานการประเมินจากเอกสารหลักฐานและการรับรู้ของประชาชน เพื่อความสมดุลและครอบคลุม
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-blue-50 p-6 rounded-lg border border-blue-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                            <IoCheckmarkCircle className="text-blue-600 text-xl" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-blue-800">มาตรฐานความโปร่งใส</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        ใช้ดัชนีชี้วัดที่ได้รับการยอมรับในระดับสากล เพื่อประเมินความพยายามในการต่อต้านการทุจริต
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-blue-50 p-6 rounded-lg border border-blue-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                            <IoLockOpen className="text-blue-600 text-xl" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-blue-800">การเปิดเผยข้อมูล</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        ส่งเสริมการเปิดเผยข้อมูลสาธารณะเพื่อให้ประชาชนสามารถเข้าถึงและตรวจสอบได้
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Resources */}
                    <div className="bg-blue-50 rounded-xl shadow-lg overflow-hidden border-t-4 border-blue-500">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">ข้อมูลเพิ่มเติม</h2>
                            <div className="text-center">
                                <p className="text-gray-700 mb-4">
                                    สำหรับข้อมูลเพิ่มเติมเกี่ยวกับการประเมิน ITA และ OIT สามารถติดต่อได้ที่
                                </p>
                                <p className="text-blue-700 font-medium">
                                    สำนักงานคณะกรรมการป้องกันและปราบปรามการทุจริตแห่งชาติ (ป.ป.ช.)
                                </p>
                                <p className="text-gray-700">โทรศัพท์: 0-2217-3000</p>
                                <p className="text-gray-700">เว็บไซต์: www.nacc.go.th</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ITAPage;