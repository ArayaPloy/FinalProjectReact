import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaBook, FaUsers, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion"; // นำเข้า motion จาก framer-motion
import Img1 from "../../assets/images/3.jpg";
import Img2 from "../../assets/images/12.jpg";
import Img3 from "../../assets/images/11.jpg";

const Hero = () => {
  const quickLinks = [
    {
      icon: <FaGraduationCap className="w-6 h-6" />,
      title: "หลักสูตรการเรียน",
      description: "หลักสูตรที่เปิดสอนในโรงเรียน",
      link: "/privacy-policy",
    },
    {
      icon: <FaBook className="w-6 h-6" />,
      title: "การรับสมัครนักเรียน",
      description: "เปิดรับสมัครนักเรียนใหม่ทุกปี",
      link: "/admissions",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "บุคลากร",
      description: "ครูและบุคลากรทางการศึกษา",
      link: "/faculty-staff",
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative pb-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-12 pt-4 md:flex-row md:pt-8 lg:pt-16">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full text-center md:w-1/2 md:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block px-2 py-1 mb-4 text-sm font-medium text-amber-800 bg-secondary-light rounded-full"
              >
                โรงเรียนสังกัด สพฐ. ประเภทสามัญศึกษา
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="mb-6 px-1 text-3xl font-bold leading-tight text-amber-950 md:text-4xl lg:text-5xl"
              >
                ยินดีต้อนรับเข้าสู่
                <br />
                <span className="text-amber-400">โรงเรียนท่าบ่อพิทยาคม✨</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="mb-8 px-2 text-lg text-textSecondary"
              >
                เน้นการพัฒนาผู้เรียนอย่างรอบด้าน ภายใต้คติพจน์{" "}
                <span className="font-medium text-amber-900">"เรียนดี กีฬาเด่น เน้นคุณธรรม นำอาชีพ"</span>{" "}
                เพื่อให้นักเรียนได้พัฒนาทักษะและศักยภาพในทุกมิติ
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-4 md:justify-start"
              >
                <Link
                  to="/about-us"
                  className="mx-2 px-6 py-3 text-white font-semibold transition-colors rounded-md bg-amber-600 hover:bg-amber-800"
                >
                  เกี่ยวกับเรา
                </Link>
                <Link
                  to="/contact-us"
                  className="px-6 py-3 font-semibold transition-colors border rounded-md text-primary border-primary hover:bg-amber-800 hover:text-white"
                >
                  ติดต่อเรา
                </Link>
              </motion.div>
            </motion.div>

            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Swiper
                  effect="fade"
                  slidesPerView={1}
                  spaceBetween={0}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  modules={[Pagination, Autoplay, EffectFade]}
                  className="w-full rounded-lg"
                >
                  <SwiperSlide>
                    <div className="relative">
                      <img
                        src={Img1 || "/placeholder.svg"}
                        alt="กีฬาสี"
                        className="object-cover w-full h-[300px] md:h-[400px] lg:h-[450px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="relative">
                      <img
                        src={Img2 || "/placeholder.svg"}
                        alt="กิจกรรมโรงเรียน"
                        className="object-cover w-full h-[300px] md:h-[400px] lg:h-[450px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="relative">
                      <img
                        src={Img3 || "/placeholder.svg"}
                        alt="ปัจฉิมนิเทศ"
                        className="object-cover w-full h-[300px] md:h-[400px] lg:h-[450px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="relative">
                      <img
                        src="/thabo_school.jpg"
                        alt="โรงเรียนเรียนท่าบ่อพิทยาคม"
                        className="object-cover w-full h-[300px] md:h-[400px] lg:h-[450px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container relative px-4 mx-auto -mt-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                to={link.link}
                className="flex flex-col p-6 transition-all duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 text-white rounded-lg bg-amber-950 group-hover:bg-secondary">{link.icon}</div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-amber-950 group-hover:text-secondary-dark">{link.title}</h3>
                    <p className="mb-3 text-sm text-textSecondary">{link.description}</p>
                    <span className="flex items-center text-sm font-medium text-primary group-hover:text-secondary-dark">
                      ดูเพิ่มเติม <FaChevronRight className="ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* School Stats */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 mt-16 text-white bg-amber-950"
      >
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold md:text-5xl">140+</div>
              <div className="mt-2 text-lg">นักเรียน</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold md:text-5xl">14</div>
              <div className="mt-2 text-lg">บุคลากร</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold md:text-5xl">8</div>
              <div className="mt-2 text-lg">หลักสูตร</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold md:text-5xl">80+</div>
              <div className="mt-2 text-lg">รางวัล</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;