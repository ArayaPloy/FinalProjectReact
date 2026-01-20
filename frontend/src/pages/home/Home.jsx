import React, { useEffect } from 'react';
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

// Move LinkItem เว็บลิงค์ที่น่าสนใจ component definition outside of Home component
const LinkItem = ({ href, title, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
  >
    <span className="mr-2 sm:mr-3 bg-gray-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">{icon}</span>
    <span className="text-gray-700 hover:text-gray-900 text-sm sm:text-base min-w-0 flex-1">{title}</span>
    <span className="ml-2 sm:ml-auto text-gray-400 flex-shrink-0">
      <ExternalLinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
    </span>
  </a>
);

const Home = () => {
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

  return (
    <div className='bg-white text-primary container mx-auto mt-4 sm:mt-6' style={{ minWidth: '320px' }}>
      {/* Sticky CTA Button */}
      <Link
        to="/admissions"
        className="fixed bottom-6 right-6 z-50 px-6 py-3 text-white font-bold text-sm sm:text-base rounded-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 hover:from-amber-700 hover:via-orange-600 hover:to-amber-800 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 animate-bounce"
      >
        <span>📝</span>
        <span className="hidden sm:inline">ดูข้อมูลสมัครเรียน</span>
        <span className="sm:hidden">สมัครเรียน</span>
      </Link>

      <Hero />

      {/* เว็บลิงค์ที่น่าสนใจ - ย้ายมาด้านบน */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          บริการออนไลน์และแหล่งเรียนรู้
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Category 1: Student Services */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 sm:px-4 py-2 sm:py-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">บริการนักเรียน</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <LinkItem
                href="/admissions"
                title="รับสมัครนักเรียนออนไลน์"
                icon={<UserAddIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
              />
              <LinkItem
                href="https://sgs6.bopp-obec.info/sgss/security/signin.aspx"
                title="ตรวจสอบผลการเรียน SGS"
                icon={<AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
              />
              <LinkItem
                href="https://sgs.bopp-obec.info/sgss/Security/SignIn.aspx"
                title="งานทะเบียน-วัดผล SGS"
                icon={<ClipboardListIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
              />
            </div>
          </div>

          {/* Category 2: Educational Resources */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 sm:px-4 py-2 sm:py-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">แหล่งเรียนรู้</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <LinkItem
                href="https://qinfo.co/index.html"
                title="Q-Info เครื่องมือพัฒนาด้านการศึกษา"
                icon={<LightBulbIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
              />
              <LinkItem
                href="https://contentcenter.obec.go.th/"
                title="OBEC Content Center"
                icon={<BookOpenIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
              />
            </div>
          </div>

          {/* Category 3: School Information */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 sm:px-4 py-2 sm:py-3">
              <h3 className="text-base sm:text-lg font-semibold text-white">ข้อมูลโรงเรียน</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <LinkItem
                href="/ita"
                title="ITA ประเมินคุณธรรมและความโปร่งใส"
                icon={<ScaleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
              />
              <LinkItem
                href="/student-council"
                title="คณะกรรมการนักเรียน"
                icon={<UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
              />
              <LinkItem
                href="/all-students"
                title="ข้อมูลจำนวนนักเรียน"
                icon={<ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />}
              />
            </div>
          </div>
        </div>
      </section>

      <Blogs limit={6} />

      {/* About Section - ย้ายมาหลัง News/Blogs */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-50 to-amber-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center px-4 sm:px-8">
            {/* Text Section with Animation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 mb-4 sm:mb-6">
                  เกี่ยวกับโรงเรียนท่าบ่อพิทยาคม
                </h2>
                <i className="text-amber-800 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed block">
                  โรงเรียนท่าบ่อพิทยาคม เป็นโรงเรียนมัธยมศึกษาประจำตำบลกองนาง สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21
                  เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ เริ่มเปิดเรียนเมื่อวันที่ 14 พฤษภาคม 2534
                  โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล
                </i>
                <br className="hidden sm:block" /><br className="hidden sm:block" />
                <p className="text-amber-950 mb-4 sm:mb-6 text-semibold text-sm sm:text-base leading-relaxed">
                  ในช่วงเริ่มต้น โรงเรียนได้ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว
                  โดยมีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน ต่อมาโรงเรียนได้ย้ายมาอยู่ ณ บริเวณที่สาธารณประโยชน์
                  หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย โดยได้รับที่ดินบริจาคจากคุณยายแก่นคำ มั่งมูล
                  คุณแม่สุบิน น้อยโสภา และคุณพ่อสุพล น้อยโสภา จำนวน 4.5 ไร่ รวมพื้นที่ทั้งหมดประมาณ 65 ไร่
                </p>
                <Link to="/about-us">
                  <button className="bg-amber-700 hover:bg-amber-800 text-white my-4 sm:my-6 px-4 sm:px-6 py-2 rounded-lg transition duration-300 text-sm sm:text-base">
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
              <div className="relative h-[250px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/thabo_school.jpg"
                  alt="โรงเรียนท่าบ่อพิทยาคม"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* วิดีโอแนะนำโรงเรียนและข่าวการศึกษา */}
      <section className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* วิดีโอแนะนำโรงเรียน */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-center py-2 sm:py-3 mb-3 sm:mb-4 text-white bg-amber-900 rounded-lg">
              วิดีโอแนะนำโรงเรียน
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.youtube.com/embed/nRGP4uE5Cjs?si=fzqlC4-A4TiUl9yl"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px] rounded-lg shadow-md"
              ></iframe>
            </div>
          </div>

          {/* ข่าวการศึกษา */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-center py-2 sm:py-3 mb-3 sm:mb-4 text-white bg-amber-900 rounded-lg">
              ข่าวการศึกษา
            </h3>
            <iframe
              src="https://www.kroobannok.com/edunews.php"
              frameBorder="0"
              className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] rounded-lg shadow-md"
              title="ข่าวการศึกษา"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;