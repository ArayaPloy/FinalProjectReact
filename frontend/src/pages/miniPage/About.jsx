// ประวัติโรงเรียน
import React from 'react';

const About = () => {
  // ข้อมูลไทม์ไลน์ประวัติโรงเรียน
  const timelineEvents = [
    {
      year: "2534",
      date: "14 พฤษภาคม 2534",
      title: "เริ่มก่อตั้งโรงเรียน",
      description: "เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว มีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน"
    },
    {
      year: "2535",
      date: "26 กุมภาพันธ์ 2535",
      title: "จัดตั้งเป็นเอกเทศ",
      description: "โรงเรียนได้รับประกาศจัดตั้งเป็นเอกเทศ โดยใช้ชื่อว่า 'โรงเรียนท่าบ่อพิทยาคม' และกรมสามัญศึกษาได้แต่งตั้งให้นายศิริ เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ มารักษาการในตำแหน่งครูใหญ่"
    },
    {
      year: "2545",
      date: "ปีงบประมาณ 2545",
      title: "ก่อสร้างอาคารเรียน",
      description: "โรงเรียนได้รับจัดสรรงบประมาณจากกรมสามัญศึกษาเพื่อสร้างอาคารเรียนแบบกึ่งถาวร 1 หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง 1 หลัง"
    },
    {
      year: "2546",
      date: "7 กรกฎาคม 2546",
      title: "เปลี่ยนสังกัด",
      description: "โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1 ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546"
    },
    {
      year: "2553",
      date: "23 กรกฎาคม 2553",
      title: "สังกัดเขตพื้นที่การศึกษามัธยมศึกษา",
      description: "โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 ตามพระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ 3) และพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3)"
    },
    {
      year: "ปัจจุบัน",
      date: "ปัจจุบัน",
      title: "การพัฒนาอย่างต่อเนื่อง",
      description: "ปัจจุบัน โรงเรียนท่าบ่อพิทยาคมมีนายชำนาญวิทย์ ประเสริฐ ดำรงตำแหน่งผู้อำนวยการโรงเรียน และมีการพัฒนาอย่างต่อเนื่องเพื่อมุ่งสู่ความเป็นเลิศทางวิชาการ"
    },
  ];

  // ข้อมูลการ์ดแสดงข้อมูลโรงเรียน
  const schoolInfo = [
    {
      icon: "🏫",
      title: "ชื่อสถานศึกษา",
      description: "โรงเรียนท่าบ่อพิทยาคม",
    },
    {
      icon: "📍",
      title: "ที่ตั้ง",
      description: "บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย",
    },
    {
      icon: "📅",
      title: "ก่อตั้งเมื่อ",
      description: "14 พฤษภาคม 2534",
    },
    {
      icon: "👔",
      title: "ผู้อำนวยการคนปัจจุบัน",
      description: "นายชำนาญวิทย์ ประเสริฐ",
    },
    {
      icon: "🎓",
      title: "ระดับการศึกษา",
      description: "มัธยมศึกษาปีที่ 1-6",
    },
    {
      icon: "🏆",
      title: "สังกัด",
      description: "สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* ส่วนภาพปกและหัวข้อหลัก */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
        <img
          src="/src/assets/images/thabo_school.jpg"
          alt="ประวัติโรงเรียนท่าบ่อพิทยาคม"
          className="w-full h-[400px] object-cover"
        />
        <div className="container relative z-20 mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            ประวัติความเป็นมา
          </h1>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
            โรงเรียนท่าบ่อพิทยาคม
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            ก้าวเดินอย่างมั่นคงสู่ความเป็นเลิศทางการศึกษา
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* ข้อมูลโรงเรียนโดยย่อ */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-500">
            <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">
              โรงเรียนท่าบ่อพิทยาคม
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              โรงเรียนท่าบ่อพิทยาคม เป็นโรงเรียนมัธยมศึกษาประจำตำบลกองนาง สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ เริ่มเปิดเรียนเมื่อวันที่ 14 พฤษภาคม 2534 โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              ในช่วงเริ่มต้น โรงเรียนได้ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว โดยมีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              ต่อมาโรงเรียนได้ย้ายมาอยู่ ณ บริเวณที่สาธารณประโยชน์ หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย โดยได้รับที่ดินบริจาคจากคุณยายแก่นคำ มั่งมูล คุณแม่สุบิน น้อยโสภา และคุณพ่อสุพล น้อยโสภา จำนวน 4.5 ไร่ รวมพื้นที่ทั้งหมดประมาณ 65 ไร่
            </p>
          </div>
        </div>

        {/* ข้อมูลโรงเรียน */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-amber-800 mb-10 text-center">
            ข้อมูลโรงเรียน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolInfo.map((info, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <span className="text-4xl">{info.icon}</span>
                  <h3 className="text-xl font-semibold text-amber-800 ml-4">{info.title}</h3>
                </div>
                <p className="text-gray-700">{info.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ไทม์ไลน์ประวัติโรงเรียน */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-amber-800 mb-10 text-center">
            ประวัติความเป็นมาตามลำดับเวลา
          </h2>
          <div className="relative">
            {/* เส้นไทม์ไลน์ */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200"></div>
            
            {/* เหตุการณ์ในไทม์ไลน์ */}
            {timelineEvents.map((event, index) => (
              <div 
                key={index} 
                className={`relative mb-12 ${index % 2 === 0 ? 'md:ml-auto md:pl-16 md:pr-0' : 'md:mr-auto md:pr-16 md:pl-0'} md:w-1/2 pl-12`}
              >
                {/* จุดบนเส้นไทม์ไลน์ */}
                <div className="absolute left-1/2 md:left-auto md:right-0 transform -translate-x-1/2 md:translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500 border-4 border-white shadow-md flex items-center justify-center text-white font-bold z-10">
                  {index + 1}
                </div>
                
                {/* กล่องเนื้อหา */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-amber-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <span className="text-amber-500 mr-2">📅</span>
                    <span className="text-amber-700 font-semibold">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2">{event.title}</h3>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ส่วนผู้บริหาร */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-amber-800 mb-8 text-center">
            ผู้บริหารโรงเรียน
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <div className="relative w-48 h-46 mx-auto mb-4 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg">
                <img 
                  src="http://www.thabopit.com/_files_school/43100510/person/43100510_0_20241104-160235.jpg" 
                  alt="ผู้อำนวยการโรงเรียน" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-amber-800">นายชำนาญวิทย์ ประเสริฐ</h3>
              <p className="text-amber-600">ผู้อำนวยการโรงเรียนท่าบ่อพิทยาคม</p>
            </div>
            
            <div className="max-w-xl">
              <blockquote className="italic text-gray-700 border-l-4 border-amber-500 pl-4 py-2">
                "โรงเรียนท่าบ่อพิทยาคมมุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม มีทักษะที่จำเป็นในศตวรรษที่ 21 
                และเป็นพลเมืองที่ดีของสังคม เราเชื่อมั่นในศักยภาพของนักเรียนทุกคน และพร้อมสนับสนุนให้ทุกคน
                ประสบความสำเร็จตามเป้าหมายของตนเอง"
              </blockquote>
              <p className="my-5 text-gray-700">
                ภายใต้การนำของผู้อำนวยการชำนาญวิทย์ ประเสริฐ โรงเรียนท่าบ่อพิทยาคมได้พัฒนาอย่างต่อเนื่อง
                ทั้งด้านวิชาการ กิจกรรมพัฒนาผู้เรียน และสภาพแวดล้อมทางกายภาพ เพื่อให้นักเรียนได้เรียนรู้
                อย่างมีความสุขและเต็มตามศักยภาพ
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-500 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">สนใจสมัครเรียนหรือเยี่ยมชมโรงเรียน?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            หากท่านสนใจสมัครเรียนหรือต้องการข้อมูลเพิ่มเติมเกี่ยวกับโรงเรียนท่าบ่อพิทยาคม 
            สามารถติดต่อเราได้ที่ฝ่ายวิชาการหรือสำนักงานโรงเรียน
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/contact-us" 
              className="bg-white text-amber-700 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              ติดต่อเรา
            </a>
            <a 
              href="/admissions" 
              className="bg-transparent hover:bg-white/10 border-2 border-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              ข้อมูลการรับสมัคร
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;