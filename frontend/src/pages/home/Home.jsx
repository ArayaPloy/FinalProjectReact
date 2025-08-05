import React from 'react';
import Hero from './Hero';
import Blogs from '../blogs/Blogs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UserAddIcon,
  AcademicCapIcon,
  ClipboardListIcon,
  LightBulbIcon,
  BookOpenIcon,
  ScaleIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline';

// Move LinkItem component definition outside of Home component
const LinkItem = ({ href, title, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
  >
    <span className="mr-3 bg-gray-100 p-2 rounded-full">{icon}</span>
    <span className="text-gray-700 hover:text-gray-900">{title}</span>
    <span className="ml-auto text-gray-400">
      <ExternalLinkIcon className="w-4 h-4" />
    </span>
  </a>
);

const Home = () => {
  return (
    <div className='bg-white text-primary container mx-auto mt-6'>
      <Hero />
      <Blogs limit={6} />

      {/* About Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-8">
            {/* Text Section with Animation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold text-amber-950 mb-6">เกี่ยวกับโรงเรียนท่าบ่อพิทยาคม</h2>
                <i className="text-amber-800 mb-4">
                  โรงเรียนท่าบ่อพิทยาคม เป็นโรงเรียนมัธยมศึกษาประจำตำบลกองนาง สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21
                  เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ เริ่มเปิดเรียนเมื่อวันที่ 14 พฤษภาคม 2534
                  โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล
                </i> <br /><br />
                <p className="text-amber-950 mb-6 text-semibold">
                  ในช่วงเริ่มต้น โรงเรียนได้ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว
                  โดยมีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน ต่อมาโรงเรียนได้ย้ายมาอยู่ ณ บริเวณที่สาธารณประโยชน์
                  หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย โดยได้รับที่ดินบริจาคจากคุณยายแก่นคำ มั่งมูล
                  คุณแม่สุบิน น้อยโสภา และคุณพ่อสุพล น้อยโสภา จำนวน 4.5 ไร่ รวมพื้นที่ทั้งหมดประมาณ 65 ไร่
                </p>
                <Link to="/about-us">
                  <button className="bg-amber-700 hover:bg-amber-800 text-white my-6 px-6 py-2 rounded-lg transition duration-300">
                    เรียนรู้เพิ่มเติม
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Image Section with Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/src/assets/images/thabo_school.jpg"
                  alt="โรงเรียนท่าบ่อพิทยาคม"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* เว็บลิงค์ที่น่าสนใจ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">เว็บลิงค์ที่น่าสนใจ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category 1: Student Services */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-600 px-4 py-3">
              <h3 className="text-lg font-semibold text-white">บริการนักเรียน</h3>
            </div>
            <div className="p-4 space-y-3">
              <LinkItem
                href="/admissions"
                title="รับสมัครนักเรียนออนไลน์"
                icon={<UserAddIcon className="w-5 h-5 text-blue-500" />}
              />
              <LinkItem
                href="https://sgs6.bopp-obec.info/sgss/security/signin.aspx"
                title="ตรวจสอบผลการเรียน SGS"
                icon={<AcademicCapIcon className="w-5 h-5 text-blue-500" />}
              />
              <LinkItem
                href="https://sgs8.bopp-obec.info/sgs/Security/SignIn.aspx"
                title="งานทะเบียน-วัดผล SGS"
                icon={<ClipboardListIcon className="w-5 h-5 text-blue-500" />}
              />
            </div>
          </div>

          {/* Category 2: Educational Resources */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-green-600 px-4 py-3">
              <h3 className="text-lg font-semibold text-white">แหล่งเรียนรู้</h3>
            </div>
            <div className="p-4 space-y-3">
              <LinkItem
                href="https://qinfo.co/index.html"
                title="Q-Info เครื่องมือพัฒนาด้านการศึกษา"
                icon={<LightBulbIcon className="w-5 h-5 text-green-500" />}
              />
              <LinkItem
                href="https://contentcenter.obec.go.th/"
                title="OBEC Content Center"
                icon={<BookOpenIcon className="w-5 h-5 text-green-500" />}
              />
            </div>
          </div>

          {/* Category 3: School Information */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-amber-600 px-4 py-3">
              <h3 className="text-lg font-semibold text-white">ข้อมูลโรงเรียน</h3>
            </div>
            <div className="p-4 space-y-3">
              <LinkItem
                href="/ita"
                title="ITA ประเมินคุณธรรมและความโปร่งใส"
                icon={<ScaleIcon className="w-5 h-5 text-amber-500" />}
              />
              <LinkItem
                href="/student-council"
                title="คณะกรรมการนักเรียน"
                icon={<UserGroupIcon className="w-5 h-5 text-amber-500" />}
              />
              <LinkItem
                href="/all-students"
                title="ข้อมูลจำนวนนักเรียน"
                icon={<ChartBarIcon className="w-5 h-5 text-amber-500" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* วิดีโอแนะนำโรงเรียนและข่าวการศึกษา */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* วิดีโอแนะนำโรงเรียน */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-center py-3 mb-4 text-white bg-amber-900 rounded-lg">
              วิดีโอแนะนำโรงเรียน
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.youtube.com/embed/nRGP4uE5Cjs?si=fzqlC4-A4TiUl9yl"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96 rounded-lg shadow-md"
              ></iframe>
            </div>
          </div>

          {/* ข่าวการศึกษา */}
          <div>
            <h3 className="text-xl font-bold text-center py-3 mb-4 text-white bg-amber-900 rounded-lg">
              ข่าวการศึกษา
            </h3>
            <iframe
              src="https://www.kroobannok.com/edunews.php"
              frameBorder="0"
              className="w-full h-[800px] rounded-lg shadow-md"
              title="ข่าวการศึกษา"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;