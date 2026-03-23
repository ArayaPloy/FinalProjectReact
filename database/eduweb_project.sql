-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2026 at 05:06 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduweb_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `academicclubs`
--

CREATE TABLE `academicclubs` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `maxMembers` int(11) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `icon` varchar(50) NOT NULL,
  `registrationDeadline` date DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `meetingDay` varchar(20) DEFAULT NULL,
  `meetingTime` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `requirements` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academicclubs`
--

INSERT INTO `academicclubs` (`id`, `name`, `description`, `maxMembers`, `teacherId`, `createdAt`, `updatedAt`, `deletedAt`, `updatedBy`, `category`, `categoryId`, `icon`, `registrationDeadline`, `isActive`, `meetingDay`, `meetingTime`, `location`, `requirements`) VALUES
(1, 'ชุมนุมวิทยาศาสตร์', 'ชุมนุมส่งเสริมการเรียนรู้ด้านวิทยาศาสตร์และการทดลอง', 20, 8, '2026-01-16 09:30:03', '2026-03-17 17:49:40', NULL, 1, 'วิทยาศาสตร์และเทคโนโลยี', 2, 'IoFitness', '2025-06-01', 1, 'พุธ', '15:30-17:00', 'ห้องปฏิบัติการวิทยาศาสตร์', 'สนใจด้านวิทยาศาสตร์'),
(2, 'ชุมนุมดนตรีไทย', 'ชุมนุมอนุรักษ์และส่งเสริมดนตรีไทย', 12, 12, '2026-01-16 09:30:03', '2026-03-17 17:48:04', NULL, 1, 'ศิลปะและดนตรี', 1, 'IoMusicalNotes', '2026-03-18', 1, 'พฤหัสบดี', '15:30-17:00', 'ห้องดนตรี', 'รักดนตรีไทย'),
(3, 'ชุมนุมภาษาอังกฤษ', 'พัฒนาทักษะภาษาอังกฤษผ่านกิจกรรมสนุกสนาน', 15, 15, '2026-01-16 09:30:03', '2026-03-17 17:49:45', NULL, 1, 'ภาษาและวัฒนธรรม', 4, 'IoBook', '2026-01-20', 1, 'อังคาร', '15:30-17:00', 'ห้อง English Club', 'สนใจภาษาอังกฤษ'),
(4, 'ชุมนุมสร้างสรรค์ปัญญาประดิษฐ์', 'สอนใช้งาน AI ตัวอย่าง \n\n💚 Prompt : ช่วยเปลี่ยนภาพเป็นการ์ตูนน่ารักๆ แนว Ghibi น่ารักยิ้มแย้มแจ่มใส เปลี่ยนพื้นหลังเป็นภาพโรงเรียน\n\n🧡 Prompt : ช่วยวาดตัวการ์ตูนนักเรียนจากภาพต้นฉบับที่แนบ โดยให้ดูน่ารัก อบอุ่น ขอให้มีหลากหลายท่าทาง เช่น ตอนที่เล่นกีฬา ทำหน้าสงสัย หรือทำท่าทางตั้งใจเรียน สำหรับเอาไปใช้ส่งความรู้สึกดีๆ ในห้องเรียน ', 15, 7, '2026-03-17 17:42:10', '2026-03-17 17:42:10', NULL, 1, 'เทคโนโลยี', NULL, 'IoChatbubbles', '2026-03-19', 1, NULL, NULL, NULL, NULL),
(5, 'โรงเรียนท่าบ่อพิทยาคม', 'กิจกรรม', 20, 15, '2026-03-17 18:07:16', '2026-03-17 18:07:16', '2026-03-17 18:08:02', 1, 'ศิลปะและงานฝีมือ', NULL, 'IoColorPalette', '2026-03-18', 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `academic_years`
--

CREATE TABLE `academic_years` (
  `id` int(11) NOT NULL,
  `year` varchar(20) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `isCurrent` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_years`
--

INSERT INTO `academic_years` (`id`, `year`, `startDate`, `endDate`, `isCurrent`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
(1, '2566', '2023-05-16', '2024-05-15', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, NULL),
(2, '2567', '2024-05-16', '2025-05-15', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, NULL),
(3, '2568', '2025-05-16', '2026-04-04', 1, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, 1),
(4, '2569', '2026-05-11', '2027-04-02', 0, 1, '2026-03-17 09:50:57', '2026-03-17 09:50:57', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `admissions_info`
--

CREATE TABLE `admissions_info` (
  `id` int(11) NOT NULL,
  `bannerImage` varchar(500) DEFAULT NULL,
  `dateRange` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `timeRange` varchar(255) DEFAULT NULL,
  `lunchBreak` varchar(255) DEFAULT NULL,
  `location` varchar(500) DEFAULT NULL,
  `mapUrl` varchar(500) DEFAULT NULL,
  `grade1Info` varchar(500) DEFAULT NULL,
  `grade4Info` varchar(500) DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `conditions` text DEFAULT NULL,
  `contactName` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(50) DEFAULT NULL,
  `facebookUrl` varchar(500) DEFAULT NULL,
  `facebookName` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdBy` int(11) NOT NULL DEFAULT 1,
  `updatedBy` int(11) NOT NULL DEFAULT 1,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admissions_info`
--

INSERT INTO `admissions_info` (`id`, `bannerImage`, `dateRange`, `duration`, `timeRange`, `lunchBreak`, `location`, `mapUrl`, `grade1Info`, `grade4Info`, `documents`, `conditions`, `contactName`, `contactPhone`, `facebookUrl`, `facebookName`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`) VALUES
(1, '', '20 - 24 มีนาคม 2568', '5 วัน', '08.30 - 16.30 น.', '12.00 - 13.00 น.', 'หอประชุมโรงเรียนท่าบ่อพิทยาคม', 'https://maps.app.goo.gl/JjyLSd5zevNbi7W69', 'มัธยมศึกษาปีที่ 1 (จำนวน 2 ห้องเรียน 80 คน)', 'มัธยมศึกษาปีที่ 4 (จำนวน 2 ห้องเรียน 80 คน)', 'สำเนาทะเบียนบ้าน (นักเรียนและผู้ปกครอง)\nรูปถ่ายขนาด 1.5 นิ้ว (แต่งเครื่องแบบนักเรียน)\nเอกสารแสดงผลการเรียน (ปพ.1)\nสำเนาบัตรประชาชน (นักเรียนและผู้ปกครอง) จำนวน 2 ชุด\nสำเนาสูติบัตรนักเรียน (ใบเกิด)\nสำเนาทะเบียนฉบับสมบูรณ์ (กรณีเปลี่ยนชื่อ-นามสกุล)', 'นักเรียนชั้น ม.1 ต้องสำเร็จการศึกษาชั้น ป.6 หรือเทียบเท่า\nนักเรียนชั้น ม.4 ต้องสำเร็จการศึกษาชั้น ม.3 หรือเทียบเท่า\nกรณีมีผู้สมัครเกินจำนวนรับ จะพิจารณาตามเกณฑ์ของโรงเรียน\nรายงานตัว/มอบตัว วันที่ 04 เมษายน 2568', 'ครูวิไลลักษณ์ อ่างแก้ว', '084-548-0055', 'https://share.google/ybsmrh4I26Bp5ytUK', 'โรงเรียนท่าบ่อพิทยาคม', '2026-03-10 08:34:56', '2026-03-10 08:34:56', 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `attendancestatuses`
--

CREATE TABLE `attendancestatuses` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendancestatuses`
--

INSERT INTO `attendancestatuses` (`id`, `name`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'มา', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(2, 'ขาด', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(3, 'สาย', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(4, 'ลาป่วย', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(5, 'ลากิจ', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `tableName` varchar(100) NOT NULL,
  `recordId` int(11) NOT NULL,
  `action` varchar(20) NOT NULL,
  `oldValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`oldValues`)),
  `newValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newValues`)),
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `userId`, `tableName`, `recordId`, `action`, `oldValues`, `newValues`, `ipAddress`, `userAgent`, `createdAt`) VALUES
(1, 1, 'studentbehaviorscores', 23, 'UPDATE', '{\"score\":5,\"comments\":\"ทำความดี\"}', '{\"score\":10,\"comments\":\"ทำความดี\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-09 01:21:40'),
(2, 1, 'studentbehaviorscores', 26, 'UPDATE', '{\"score\":5,\"comments\":\"ทำความดี\"}', '{\"score\":5,\"comments\":\"ทำความดี\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-10 13:38:17'),
(3, 9, 'flagpoleattendance', 200, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(4, 9, 'flagpoleattendance', 201, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(5, 9, 'flagpoleattendance', 202, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(6, 9, 'flagpoleattendance', 203, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(7, 9, 'flagpoleattendance', 204, 'CREATE', NULL, '{\"statusId\":2,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(8, 9, 'flagpoleattendance', 205, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(9, 9, 'flagpoleattendance', 206, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(10, 9, 'flagpoleattendance', 207, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(11, 9, 'flagpoleattendance', 208, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(12, 9, 'flagpoleattendance', 209, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(13, 9, 'flagpoleattendance', 210, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(14, 9, 'flagpoleattendance', 211, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(15, 9, 'flagpoleattendance', 212, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(16, 9, 'flagpoleattendance', 213, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(17, 9, 'flagpoleattendance', 214, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(18, 9, 'flagpoleattendance', 215, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(19, 9, 'flagpoleattendance', 216, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:52:20'),
(20, 9, 'flagpoleattendance', 217, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(21, 9, 'flagpoleattendance', 218, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(22, 9, 'flagpoleattendance', 219, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(23, 9, 'flagpoleattendance', 220, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(24, 9, 'flagpoleattendance', 221, 'UPDATE', '{\"statusId\":2}', '{\"statusId\":2,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(25, 9, 'flagpoleattendance', 222, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(26, 9, 'flagpoleattendance', 223, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(27, 9, 'flagpoleattendance', 224, 'UPDATE', '{\"statusId\":3}', '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(28, 9, 'flagpoleattendance', 225, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(29, 9, 'flagpoleattendance', 226, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(30, 9, 'flagpoleattendance', 227, 'UPDATE', '{\"statusId\":3}', '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(31, 9, 'flagpoleattendance', 228, 'UPDATE', '{\"statusId\":3}', '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(32, 9, 'flagpoleattendance', 229, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(33, 9, 'flagpoleattendance', 230, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(34, 9, 'flagpoleattendance', 231, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(35, 9, 'flagpoleattendance', 232, 'UPDATE', '{\"statusId\":1}', '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(36, 9, 'flagpoleattendance', 233, 'UPDATE', '{\"statusId\":3}', '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 18:55:13'),
(37, 7, 'flagpoleattendance', 234, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(38, 7, 'flagpoleattendance', 235, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(39, 7, 'flagpoleattendance', 236, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(40, 7, 'flagpoleattendance', 237, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(41, 7, 'flagpoleattendance', 238, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(42, 7, 'flagpoleattendance', 239, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(43, 7, 'flagpoleattendance', 240, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(44, 7, 'flagpoleattendance', 241, 'CREATE', NULL, '{\"statusId\":4,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(45, 7, 'flagpoleattendance', 242, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(46, 7, 'flagpoleattendance', 243, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(47, 7, 'flagpoleattendance', 244, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(48, 7, 'flagpoleattendance', 245, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(49, 7, 'flagpoleattendance', 246, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(50, 7, 'flagpoleattendance', 247, 'CREATE', NULL, '{\"statusId\":5,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(51, 7, 'flagpoleattendance', 248, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(52, 7, 'flagpoleattendance', 249, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(53, 7, 'flagpoleattendance', 250, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(54, 7, 'flagpoleattendance', 251, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(55, 7, 'flagpoleattendance', 252, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(56, 7, 'flagpoleattendance', 253, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"1/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:03:34'),
(57, 8, 'flagpoleattendance', 254, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(58, 8, 'flagpoleattendance', 255, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(59, 8, 'flagpoleattendance', 256, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(60, 8, 'flagpoleattendance', 257, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(61, 8, 'flagpoleattendance', 258, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(62, 8, 'flagpoleattendance', 259, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(63, 8, 'flagpoleattendance', 260, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(64, 8, 'flagpoleattendance', 261, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(65, 8, 'flagpoleattendance', 262, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(66, 8, 'flagpoleattendance', 263, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(67, 8, 'flagpoleattendance', 264, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(68, 8, 'flagpoleattendance', 265, 'CREATE', NULL, '{\"statusId\":2,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(69, 8, 'flagpoleattendance', 266, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(70, 8, 'flagpoleattendance', 267, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(71, 8, 'flagpoleattendance', 268, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(72, 8, 'flagpoleattendance', 269, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(73, 8, 'flagpoleattendance', 270, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(74, 8, 'flagpoleattendance', 271, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(75, 8, 'flagpoleattendance', 272, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(76, 8, 'flagpoleattendance', 273, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(77, 8, 'flagpoleattendance', 274, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(78, 8, 'flagpoleattendance', 275, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(79, 8, 'flagpoleattendance', 276, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(80, 8, 'flagpoleattendance', 277, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(81, 8, 'flagpoleattendance', 278, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(82, 8, 'flagpoleattendance', 279, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"2/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:04:59'),
(83, 8, 'flagpoleattendance', 280, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(84, 8, 'flagpoleattendance', 281, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(85, 8, 'flagpoleattendance', 282, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(86, 8, 'flagpoleattendance', 283, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(87, 8, 'flagpoleattendance', 284, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(88, 8, 'flagpoleattendance', 285, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(89, 8, 'flagpoleattendance', 286, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(90, 8, 'flagpoleattendance', 287, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(91, 8, 'flagpoleattendance', 288, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(92, 8, 'flagpoleattendance', 289, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(93, 8, 'flagpoleattendance', 290, 'CREATE', NULL, '{\"statusId\":4,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(94, 8, 'flagpoleattendance', 291, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(95, 8, 'flagpoleattendance', 292, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(96, 8, 'flagpoleattendance', 293, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(97, 8, 'flagpoleattendance', 294, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(98, 8, 'flagpoleattendance', 295, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(99, 8, 'flagpoleattendance', 296, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(100, 8, 'flagpoleattendance', 297, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(101, 8, 'flagpoleattendance', 298, 'CREATE', NULL, '{\"statusId\":4,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(102, 8, 'flagpoleattendance', 299, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:05:25'),
(103, 11, 'flagpoleattendance', 300, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(104, 11, 'flagpoleattendance', 301, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(105, 11, 'flagpoleattendance', 302, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(106, 11, 'flagpoleattendance', 303, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(107, 11, 'flagpoleattendance', 304, 'CREATE', NULL, '{\"statusId\":2,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(108, 11, 'flagpoleattendance', 305, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(109, 11, 'flagpoleattendance', 306, 'CREATE', NULL, '{\"statusId\":2,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(110, 11, 'flagpoleattendance', 307, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(111, 11, 'flagpoleattendance', 308, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(112, 11, 'flagpoleattendance', 309, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(113, 11, 'flagpoleattendance', 310, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(114, 11, 'flagpoleattendance', 311, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(115, 11, 'flagpoleattendance', 312, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(116, 11, 'flagpoleattendance', 313, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(117, 11, 'flagpoleattendance', 314, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(118, 11, 'flagpoleattendance', 315, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"3/2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:07:35'),
(119, 12, 'flagpoleattendance', 316, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(120, 12, 'flagpoleattendance', 317, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(121, 12, 'flagpoleattendance', 318, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(122, 12, 'flagpoleattendance', 319, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(123, 12, 'flagpoleattendance', 320, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(124, 12, 'flagpoleattendance', 321, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(125, 12, 'flagpoleattendance', 322, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(126, 12, 'flagpoleattendance', 323, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(127, 12, 'flagpoleattendance', 324, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(128, 12, 'flagpoleattendance', 325, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(129, 12, 'flagpoleattendance', 326, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(130, 12, 'flagpoleattendance', 327, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(131, 12, 'flagpoleattendance', 328, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(132, 12, 'flagpoleattendance', 329, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(133, 12, 'flagpoleattendance', 330, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(134, 12, 'flagpoleattendance', 331, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(135, 12, 'flagpoleattendance', 332, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(136, 12, 'flagpoleattendance', 333, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(137, 12, 'flagpoleattendance', 334, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(138, 12, 'flagpoleattendance', 335, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(139, 12, 'flagpoleattendance', 336, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"4/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:25'),
(140, 12, 'flagpoleattendance', 337, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(141, 12, 'flagpoleattendance', 338, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(142, 12, 'flagpoleattendance', 339, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(143, 12, 'flagpoleattendance', 340, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(144, 12, 'flagpoleattendance', 341, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(145, 12, 'flagpoleattendance', 342, 'CREATE', NULL, '{\"statusId\":4,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(146, 12, 'flagpoleattendance', 343, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(147, 12, 'flagpoleattendance', 344, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(148, 12, 'flagpoleattendance', 345, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(149, 12, 'flagpoleattendance', 346, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(150, 12, 'flagpoleattendance', 347, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(151, 12, 'flagpoleattendance', 348, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(152, 12, 'flagpoleattendance', 349, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(153, 12, 'flagpoleattendance', 350, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(154, 12, 'flagpoleattendance', 351, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(155, 12, 'flagpoleattendance', 352, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(156, 12, 'flagpoleattendance', 353, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(157, 12, 'flagpoleattendance', 354, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(158, 12, 'flagpoleattendance', 355, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(159, 12, 'flagpoleattendance', 356, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(160, 12, 'flagpoleattendance', 357, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(161, 12, 'flagpoleattendance', 358, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"5/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:41'),
(162, 12, 'flagpoleattendance', 359, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(163, 12, 'flagpoleattendance', 360, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(164, 12, 'flagpoleattendance', 361, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(165, 12, 'flagpoleattendance', 362, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(166, 12, 'flagpoleattendance', 363, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(167, 12, 'flagpoleattendance', 364, 'CREATE', NULL, '{\"statusId\":3,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(168, 12, 'flagpoleattendance', 365, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(169, 12, 'flagpoleattendance', 366, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(170, 12, 'flagpoleattendance', 367, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(171, 12, 'flagpoleattendance', 368, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(172, 12, 'flagpoleattendance', 369, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-12\",\"classRoom\":\"6/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-11 19:09:53'),
(173, 8, 'students', 351, 'UPDATE', '{\"address\":null,\"phoneNumber\":null,\"emergencyContact\":null,\"houseType\":null,\"houseMaterial\":null,\"utilities\":null,\"studyArea\":null,\"guardianFirstName\":null,\"guardianLastName\":null,\"guardianRelation\":null,\"guardianOccupation\":null,\"guardianMonthlyIncome\":null,\"guardianNamePrefix\":null}', '{\"address\":\"สส\",\"phoneNumber\":null,\"emergencyContact\":null,\"houseType\":\"อาศัยกับญาติ\",\"houseMaterial\":\"สังกะสี/วัสดุชั่วคราว\",\"utilities\":\"อินเทอร์เน็ต\",\"studyArea\":\"มีแสงสว่างเพียงพอ\",\"guardianFirstName\":null,\"guardianLastName\":null,\"guardianRelation\":\"ลุง\",\"guardianOccupation\":null,\"guardianMonthlyIncome\":null,\"guardianNamePrefix\":null}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-15 15:12:02'),
(174, 8, 'homevisits', 21, 'CREATE', NULL, '{\"studentId\":351,\"visitDate\":\"2026-03-15T00:00:00.000Z\",\"teacherId\":4}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-15 15:12:02'),
(175, 1, 'blogs', 14, 'UPDATE', '{\"status\":\"pending\"}', '{\"status\":\"rejected\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-15 15:41:17'),
(176, 1, 'password_reset_requests', 4, 'UPDATE', '{\"status\":\"pending\"}', '{\"status\":\"rejected\",\"resolvedBy\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-15 15:42:07'),
(177, 1, 'password_reset_requests', 5, 'UPDATE', '{\"status\":\"pending\"}', '{\"status\":\"rejected\",\"resolvedBy\":1}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:04:20'),
(178, 9, 'users', 9, 'UPDATE', '{\"event\":\"password_changed\"}', '{\"event\":\"password_changed\",\"mustChangePassword\":false}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:09:45'),
(179, 1, 'password_reset_requests', 6, 'UPDATE', '{\"status\":\"pending\"}', '{\"status\":\"approved\",\"resolvedBy\":1,\"targetUserId\":9}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:12:28'),
(180, 9, 'flagpoleattendance', 370, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(181, 9, 'flagpoleattendance', 371, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(182, 9, 'flagpoleattendance', 372, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12');
INSERT INTO `audit_logs` (`id`, `userId`, `tableName`, `recordId`, `action`, `oldValues`, `newValues`, `ipAddress`, `userAgent`, `createdAt`) VALUES
(183, 9, 'flagpoleattendance', 373, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(184, 9, 'flagpoleattendance', 374, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(185, 9, 'flagpoleattendance', 375, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(186, 9, 'flagpoleattendance', 376, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(187, 9, 'flagpoleattendance', 377, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(188, 9, 'flagpoleattendance', 378, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(189, 9, 'flagpoleattendance', 379, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(190, 9, 'flagpoleattendance', 380, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(191, 9, 'flagpoleattendance', 381, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(192, 9, 'flagpoleattendance', 382, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(193, 9, 'flagpoleattendance', 383, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(194, 9, 'flagpoleattendance', 384, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(195, 9, 'flagpoleattendance', 385, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(196, 9, 'flagpoleattendance', 386, 'CREATE', NULL, '{\"statusId\":1,\"date\":\"2026-03-17\",\"classRoom\":\"1/1\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:28:12'),
(197, 9, 'students', 307, 'UPDATE', '{\"address\":\"211/6 ซ.3 ม.3 ต.พานพร้าว อ.หนองแวง จ.หนองคาย\",\"phoneNumber\":\"0886893452\",\"emergencyContact\":\"0886893452\",\"houseType\":\"บ้านเดี่ยว\",\"houseMaterial\":\"ไม้ผสมคอนกรีต\",\"utilities\":\"ไฟฟ้า, ประปา, ห้องน้ำในบ้าน, อินเทอร์เน็ต\",\"studyArea\":\"ไม่มีพื้นที่เฉพาะ, มีสิ่งรบกวนเยอะ\",\"guardianFirstName\":null,\"guardianLastName\":null,\"guardianRelation\":null,\"guardianOccupation\":\"ขายของ\",\"guardianMonthlyIncome\":\"10000-19999\",\"guardianNamePrefix\":null}', '{\"address\":\"211/6 ซ.3 ม.3 ต.พานพร้าว อ.หนองแวง จ.หนองคาย\",\"phoneNumber\":\"0886893452\",\"emergencyContact\":\"0886893452\",\"houseType\":\"บ้านเดี่ยว\",\"houseMaterial\":\"ไม้ผสมคอนกรีต\",\"utilities\":\"ไฟฟ้า, ประปา, ห้องน้ำในบ้าน, อินเทอร์เน็ต\",\"studyArea\":\"ไม่มีพื้นที่เฉพาะ, มีสิ่งรบกวนเยอะ\",\"guardianFirstName\":null,\"guardianLastName\":null,\"guardianRelation\":\"ยาย\",\"guardianOccupation\":\"ค้าขาย\",\"guardianMonthlyIncome\":\"10000-20000\",\"guardianNamePrefix\":null}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:38:05'),
(198, 9, 'homevisits', 22, 'CREATE', NULL, '{\"studentId\":307,\"visitDate\":\"2026-03-17T00:00:00.000Z\",\"teacherId\":5}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:38:05'),
(199, 1, 'users', 4, 'UPDATE', '{\"username\":\"admin3\",\"roleId\":2}', '{\"username\":\"admin3\",\"roleId\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:57:02'),
(200, 1, 'users', 4, 'UPDATE', '{\"username\":\"admin3\",\"roleId\":2}', '{\"username\":\"admin3\",\"roleId\":2}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 08:59:59'),
(201, 1, 'users', 2, 'DELETE', '{\"username\":\"admin2\",\"email\":\"admin2@admin.com\"}', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:17:21'),
(202, 1, 'teachers', 23, 'CREATE', NULL, '{\"firstName\":\"สนิท\",\"lastName\":\"ครองผา\",\"departmentId\":9,\"position\":\"ธุรการ\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:26:58'),
(203, 1, 'teachers', 6, 'UPDATE', '{\"firstName\":\"ณัฐวุฒิ\",\"lastName\":\"เจริญกุล\",\"departmentId\":3,\"position\":\"ครู\"}', '{\"firstName\":\"นายณัฐวุฒิ\",\"lastName\":\"เจริญกุล\",\"departmentId\":3,\"position\":\"ครู\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:29:19'),
(204, 1, 'teachers', 23, 'DELETE', '{\"firstName\":\"สนิท\",\"lastName\":\"ครองผา\"}', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:30:49'),
(205, 1, 'academic_years', 4, 'CREATE', NULL, '{\"year\":\"2569\",\"isCurrent\":false}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:50:57'),
(206, 1, 'semesters', 8, 'UPDATE', '{\"isCurrent\":false,\"isActive\":true}', '{\"isCurrent\":false,\"isActive\":true}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:52:09'),
(207, 1, 'semesters', 8, 'UPDATE', '{\"isCurrent\":false,\"isActive\":true}', '{\"isCurrent\":false,\"isActive\":true}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:53:03'),
(208, 1, 'semesters', 5, 'UPDATE', '{\"isCurrent\":false}', '{\"isCurrent\":true}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:54:01'),
(209, 1, 'semesters', 6, 'UPDATE', '{\"isCurrent\":false}', '{\"isCurrent\":true}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 09:54:36'),
(210, 1, 'blogs', 16, 'UPDATE', '{\"status\":\"pending\"}', '{\"status\":\"rejected\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 10:21:00'),
(211, 1, 'school_info', 1, 'UPDATE', '{}', '{}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 11:10:33'),
(212, 1, 'school_info', 1, 'UPDATE', '{}', '{}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 11:13:06'),
(213, 1, 'studentbehaviorscores', 64, 'UPDATE', '{\"score\":-5,\"comments\":\"มาโรงเรียนสาย\"}', '{\"score\":-5,\"comments\":\"มาโรงเรียนสาย\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 11:25:11'),
(214, 1, 'studentbehaviorscores', 64, 'DELETE', '{\"score\":-5,\"comments\":\"มาโรงเรียนสาย\"}', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '2026-03-17 11:27:35');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `coverImg` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `author` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `pendingUpdateForId` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `description`, `coverImg`, `content`, `category`, `categoryId`, `author`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `pendingUpdateForId`, `status`) VALUES
(1, 'ทดสอบ123', 'กิจกรรมโรงเรียน', 'http://localhost:5000/uploads/blogs/573043385_1271159521483963_5733269281060961722_n-1768559744358-205008192.jpg', '{\"time\":1768593284307,\"blocks\":[{\"id\":\"wLds9cH-UP\",\"type\":\"paragraph\",\"data\":{\"text\":\"เนื้อหาทดสอบ\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 2, 1, '2026-01-16 03:35:46', '2026-01-16 03:35:46', 0, NULL, 1, NULL, 'published'),
(2, 'ประชาสัมพันธ์การสอบธรรมศึกษา ประจำปีการศึกษา 2568', 'ประชาสัมพันธ์การสอบธรรมศึกษา ระดับชั้นตรีและชั้นโท ประจำปีการศึกษา 2568 ณ โรงเรียนท่าบ่อพิทยาคม พร้อมรายละเอียดรายวิชาและวันสอบ', 'http://localhost:5000/uploads/blogs/589597983_1292355066031075_1772969008715805891_n-1768945205759-717921792.jpg', '{\"time\":1768945225528,\"blocks\":[{\"id\":\"lKPyGCOx5Q\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคม ขอประชาสัมพันธ์ถึงนักเรียนทุกคนที่สมัครสอบ ธรรมศึกษา ระดับชั้นตรี และชั้นโท\\nขอให้นักเรียนตรวจสอบรายชื่อผู้มีสิทธิ์สอบ พร้อมเตรียมความพร้อมก่อนเข้าสอบตามกำหนดการ\"}},{\"id\":\"6xAe8EPLNc\",\"type\":\"paragraph\",\"data\":{\"text\":\"การสอบธรรมศึกษาประกอบด้วย 3 รายวิชา ดังนี้\"}},{\"id\":\"Xpr6fiMWNj\",\"type\":\"list\",\"data\":{\"style\":\"unordered\",\"items\":[\"วิชาเรียงความแก้กระทู้ธรรม\\n\",\"วิชาธรรม\\n\",\"วิชาวินัย\\n\"]}},{\"id\":\"2-dN3acMJa\",\"type\":\"paragraph\",\"data\":{\"text\":\"การสอบจะจัดขึ้นใน วันพฤหัสบดีที่ 27 พฤศจิกายน พ.ศ. 2568\\nณ สนามสอบโรงเรียนท่าบ่อพิทยาคม\"}},{\"id\":\"jUWGdSIibH\",\"type\":\"paragraph\",\"data\":{\"text\":\"นักเรียนที่มีรายชื่อเข้าสอบควรเตรียมตัวให้พร้อม และปฏิบัติตามระเบียบการสอบอย่างเคร่งครัด&nbsp;\"}},{\"id\":\"0cvEWmh-C0\",\"type\":\"paragraph\",\"data\":{\"text\":\"ติดตามรายละเอียดและรายชื่อเพิ่มเติมได้ที่ลิงก์นี้:\"}},{\"id\":\"C_TGLkqdP6\",\"type\":\"paragraph\",\"data\":{\"text\":\"https://www.facebook.com/share/p/1BrWgmHvJo/\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 6, 1, '2026-01-20 14:40:25', '2026-01-20 14:40:25', 0, NULL, NULL, NULL, 'published'),
(3, 'วันเกียรติยศ ประจำปีการศึกษา 2568 มอบถ้วยรางวัลแก่นักกีฬาฟุตซอลเยาวชน', 'กิจกรรมวันเกียรติยศ ประจำปีการศึกษา 2568 ผู้อำนวยการโรงเรียนมอบถ้วยรางวัลชนะเลิศแก่นักกีฬาฟุตซอล แชมป์รายการตรวจก่อนเตะ รุ่นอายุไม่เกิน 16 ปี ณ จังหวัดหนองคาย', 'http://localhost:5000/uploads/blogs/592124578_1295820222351226_5186037647874819381_n-1768945436568-135968806.jpg', '{\"time\":1768945438933,\"blocks\":[{\"id\":\"ebVLQapdv5\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนจัดกิจกรรม <b>วันเกียรติยศ ประจำปีการศึกษา 2568</b> เพื่อเชิดชูเกียรติและแสดงความยินดีกับนักเรียนที่สร้างชื่อเสียงให้กับโรงเรียนในด้านกีฬา\"}},{\"id\":\"PcC_zHVneo\",\"type\":\"paragraph\",\"data\":{\"text\":\"ในโอกาสนี้ <b>ผู้อำนวยการโรงเรียน</b> ได้เป็นประธานมอบเกียรติบัตรและถ้วยรางวัลชนะเลิศ ให้แก่นักกีฬาฟุตซอลของโรงเรียน ที่สามารถคว้าแชมป์การแข่งขัน <b>รายการตรวจก่อนเตะ รุ่นอายุไม่เกิน 16 ปี</b> มาครองได้อย่างน่าภาคภูมิใจ\"}},{\"id\":\"oPyBHhRHDf\",\"type\":\"paragraph\",\"data\":{\"text\":\"การแข่งขันดังกล่าวจัดขึ้น ณ <b>สนามกีฬากลางจังหวัดหนองคา</b>ย โดยนักกีฬาได้แสดงถึงความสามารถ ความสามัคคี และน้ำใจนักกีฬา อันเป็นแบบอย่างที่ดีให้แก่นักเรียนคนอื่น ๆ และสะท้อนถึงการส่งเสริมกิจกรรมด้านกีฬาอย่างต่อเนื่องของโรงเรียน\"}},{\"id\":\"7L40uWXwuc\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนขอแสดงความชื่นชมและยินดีกับนักกีฬาทุกคน รวมถึงครูผู้ฝึกสอนที่มีส่วนร่วมในการสร้างความสำเร็จในครั้งนี้\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 5, 1, '2026-01-20 14:43:58', '2026-01-20 14:43:58', 0, NULL, NULL, NULL, 'published'),
(4, 'ขอแสดงความยินดี ภาพยนตร์สั้นเรื่อง “กลับบ้าน (Unforgettable)” คว้ารางวัลชนะเลิศระดับเขต', 'โรงเรียนท่าบ่อพิทยาคมขอแสดงความยินดี ภาพยนตร์สั้นเรื่อง “กลับบ้าน (Unforgettable)” คว้ารางวัลเหรียญทอง ชนะเลิศอันดับ 1 จากการประกวดภาพยนตร์สั้น งานศิลปหัตถกรรมนักเรียน ครั้งที่ 73 ปีการศึกษา 2568', 'http://localhost:5000/uploads/blogs/Screenshot_2026_01_21_044722-1768945694609-80465735.png', '{\"time\":1768945711395,\"blocks\":[{\"id\":\"ZCAZ3rVcRw\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคม ขอแสดงความยินดีกับนักเรียนผู้สร้างสรรค์ <b>ภาพยนตร์สั้นเรื่อง “กลับบ้าน (Unforgettable)”</b>\\nซึ่งได้รับ <b>รางวัลเหรียญทอง ชนะเลิศอันดับ 1</b> จากการประกวดภาพยนตร์สั้น ระดับชั้นมัธยมศึกษาปีที่ 4–6\"}},{\"id\":\"mtb2GcI9an\",\"type\":\"paragraph\",\"data\":{\"text\":\"การประกวดดังกล่าวจัดขึ้นภายใน <b>งานศิลปหัตถกรรมนักเรียน ครั้งที่ 73 ประจำปีการศึกษา 2568</b>\\nโดยสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาหนองคาย ภายใต้หัวข้อ\\n<b>“ของกินบ้านฉัน ในจานบ้านเธอ”</b>\"}},{\"id\":\"F0cAa_Q-aA\",\"type\":\"paragraph\",\"data\":{\"text\":\"ผลงานภาพยนตร์สั้นเรื่องนี้สะท้อนความคิดสร้างสรรค์ การเล่าเรื่องอย่างมีคุณค่า และการทำงานเป็นทีมของนักเรียนได้อย่างโดดเด่น จนสามารถสร้างความประทับใจให้กับคณะกรรมการและคว้ารางวัลชนะเลิศมาครองได้สำเร็จ\"}},{\"id\":\"8ljXeYrO3m\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคมรู้สึกภาคภูมิใจในความสามารถของนักเรียน และขอชื่นชมครูที่ปรึกษาและผู้มีส่วนเกี่ยวข้องทุกฝ่ายที่ร่วมสนับสนุนผลงานในครั้งนี้\"}},{\"id\":\"NGU1u7dJJ_\",\"type\":\"paragraph\",\"data\":{\"text\":\"📽️ สามารถรับชมผลงานภาพยนตร์สั้นได้ที่ลิงก์ด้านล่าง\\n👉 <i>https://www.facebook.com/share/v/185GaD3QJN/</i>\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 5, 1, '2026-01-20 14:48:31', '2026-01-20 14:48:31', 0, NULL, NULL, NULL, 'published'),
(5, 'ประกาศปิดโรงเรียนกรณีพิเศษ วันที่ 4 ธันวาคม 2568', 'โรงเรียนท่าบ่อพิทยาคมประกาศปิดโรงเรียนกรณีพิเศษ วันที่ 4 ธันวาคม 2568 เนื่องจากเข้าร่วมกิจกรรมมหกรรมวิชาการ ครั้งที่ 2 ณ โรงเรียนชุมพลโพนพิสัย', 'http://localhost:5000/uploads/blogs/594075250_1297579862175262_1506828839658696786_n-1768945853830-628643344.jpg', '{\"time\":1768945875872,\"blocks\":[{\"id\":\"9e5sRm7T0U\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคม ขอประกาศแจ้งให้นักเรียน ผู้ปกครอง และบุคลากรทางการศึกษาทุกท่านทราบว่า\\nโรงเรียนจะ <b>ปิดทำการเรียนการสอนเป็นกรณีพิเศษ</b> ใน<b>วันพุธที่ 4 ธันวาคม พ.ศ. 2568</b>\"}},{\"id\":\"6zDKHhfND8\",\"type\":\"paragraph\",\"data\":{\"text\":\"ทั้งนี้ เนื่องจากทางโรงเรียนเข้าร่วมการแข่งขันและกิจกรรม <b>มหกรรมวิชาการ ครั้งที่ 2 “เก่ง ดี วิถีเปี่ยมสุข”</b>\\nซึ่งจัดขึ้น ณ <b>โรงเรียนชุมพลโพนพิสัย</b>\"}},{\"id\":\"eaeI63hiSX\",\"type\":\"paragraph\",\"data\":{\"text\":\"การปิดเรียนในครั้งนี้มีวัตถุประสงค์เพื่ออำนวยความสะดวกแก่ครูและนักเรียนที่เข้าร่วมกิจกรรมดังกล่าว\\nโรงเรียนขออภัยในความไม่สะดวกมา ณ โอกาสนี้ และขอความร่วมมือจากทุกท่านติดตามข่าวสารและประกาศจากทางโรงเรียนอย่างต่อเนื่อง\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 1, 1, '2026-01-20 14:51:15', '2026-01-20 14:51:15', 0, NULL, NULL, NULL, 'published'),
(6, 'สรุปผลการแข่งขันศิลปหัตถกรรมนักเรียน มหกรรมวิชาการ ครั้งที่ 2 ประจำปีการศึกษา 2568', 'สรุปผลการแข่งขันศิลปหัตถกรรมนักเรียน มหกรรมวิชาการ ครั้งที่ 2 “เก่ง ดี วิถีเปี่ยมสุข” ปีการศึกษา 2568 โรงเรียนท่าบ่อพิทยาคมคว้ารางวัลรวม 33 เหรียญ จากสังกัด สพม.หนองคาย', 'http://localhost:5000/uploads/blogs/594078426_1298870748712840_5973947567847974920_n-1768946064886-445091459.jpg', '{\"time\":1768946067819,\"blocks\":[{\"id\":\"38PK5MzMxZ\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคม ขอแสดงความยินดีกับทีมนักเรียนและครูผู้ฝึกสอนทุกท่าน\\nที่เข้าร่วมการแข่งขัน <b>งานศิลปหัตถกรรมนักเรียน ภายใต้มหกรรมวิชาการ ครั้งที่ 2 “เก่ง ดี วิถีเปี่ยมสุข”</b>\\nสังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษาหนองคาย ประจำปีการศึกษา 2568\"}},{\"id\":\"rPQF-HyVNt\",\"type\":\"paragraph\",\"data\":{\"text\":\"ผลการแข่งขันในครั้งนี้ โรงเรียนท่าบ่อพิทยาคมสามารถสร้างผลงานได้อย่างน่าภาคภูมิใจ โดยได้รับรางวัลรวมทั้งสิ้น <b>33 เหรียญ</b> ประกอบด้วย\"}},{\"id\":\"lxrOlHg-jT\",\"type\":\"list\",\"data\":{\"style\":\"unordered\",\"items\":[\"<b>🥇 เหรียญทอง จำนวน 24 เหรียญ\\n</b>\",\"<b>🥈 เหรียญเงิน จำนวน 5 เหรียญ\\n</b>\",\"<b>🥉 เหรียญทองแดง จำนวน 4 เหรียญ\\n</b>\"]}},{\"id\":\"LMpEV-6E3W\",\"type\":\"paragraph\",\"data\":{\"text\":\"นอกจากนี้ ยังได้รับรางวัลในระดับชนะเลิศและรองชนะเลิศ ได้แก่\"}},{\"id\":\"VZ7HpQhjda\",\"type\":\"list\",\"data\":{\"style\":\"unordered\",\"items\":[\"<b>🥇 ชนะเลิศ จำนวน 5 เหรียญ\\n</b>\",\"<b>🥈 รองชนะเลิศอันดับ 1 จำนวน 3 เหรียญ\\n</b>\",\"<b>🥉 รองชนะเลิศอันดับ 2 จำนวน 6 เหรียญ\\n</b>\"]}},{\"id\":\"uwNF-7MNYX\",\"type\":\"paragraph\",\"data\":{\"text\":\"ความสำเร็จดังกล่าวสะท้อนถึงความสามารถ ความตั้งใจ และความร่วมมือของนักเรียนและครูผู้ฝึกสอนทุกคน\\nโรงเรียนท่าบ่อพิทยาคมขอชื่นชมและขอแสดงความยินดีกับทุกความสำเร็จในครั้งนี้ ซึ่งนับเป็นอีกหนึ่งความภาคภูมิใจของโรงเรียน\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 5, 1, '2026-01-20 14:54:27', '2026-01-20 14:54:27', 0, NULL, NULL, NULL, 'published'),
(7, 'ผู้อำนวยการโรงเรียนมอบเกียรติบัตรการแข่งขันศิลปหัตถกรรม ประจำปีการศึกษา 2568', 'ผู้อำนวยการโรงเรียนท่าบ่อพิทยาคม มอบเกียรติบัตรการแข่งขันศิลปหัตถกรรม มหกรรมวิชาการ “เก่ง ดี วิถีเปี่ยมสุข” ครั้งที่ 2 ปีการศึกษา 2568 คว้ารางวัลรวม 33 เหรียญ', 'http://localhost:5000/uploads/blogs/598056268_1303691361564112_6736772718908935572_n-1768946166406-95097278.jpg', '{\"time\":1768946224748,\"blocks\":[{\"id\":\"GDwKN6rojB\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคม จัดพิธีมอบเกียรติบัตรเพื่อเชิดชูเกียรติและแสดงความยินดีกับนักเรียนและคณะครูผู้ควบคุม\\nที่เข้าร่วมการแข่งขัน <b>ศิลปหัตถกรรม ภายใต้งานมหกรรมวิชาการ “เก่ง ดี วิถีเปี่ยมสุข” ครั้งที่ 2\\nประจำปีการศึกษา 2568</b>\"}},{\"id\":\"_OZinJwn7Y\",\"type\":\"paragraph\",\"data\":{\"text\":\"ในโอกาสนี้ น<b>ายชำนาญวิทย์ ประเสริฐ ผู้อำนวยการโรงเรียนท่าบ่อพิทยาคม</b> ได้เป็นประธานมอบเกียรติบัตรให้แก่นักเรียนและคณะครูผู้ควบคุมการแข่งขัน\\nเพื่อเป็นขวัญและกำลังใจในการสร้างสรรค์ผลงานและพัฒนาศักยภาพของผู้เรียนอย่างต่อเนื่อง\"}},{\"id\":\"d6cIHUlLzD\",\"type\":\"paragraph\",\"data\":{\"text\":\"ผลการแข่งขันในครั้งนี้ โรงเรียนท่าบ่อพิทยาคมสามารถคว้ารางวัลรวมทั้งสิ้น <b>33 เหรียญ</b> ได้แก่\"}},{\"id\":\"Szde7DDJYl\",\"type\":\"list\",\"data\":{\"style\":\"unordered\",\"items\":[\"<b>🥇 เหรียญทอง จำนวน 24 เหรียญ\\n</b>\",\"<b>🥈 เหรียญเงิน จำนวน 5 เหรียญ\\n</b>\",\"<b>🥉 เหรียญทองแดง จำนวน 4 เหรียญ\\n</b>\"]}},{\"id\":\"Obxhw69JlC\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนขอชื่นชมและขอแสดงความยินดีกับนักเรียนและครูทุกท่านที่สร้างชื่อเสียงและความภาคภูมิใจให้กับโรงเรียนในครั้งนี้\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 5, 1, '2026-01-20 14:57:04', '2026-01-20 14:57:04', 0, NULL, NULL, NULL, 'published'),
(8, 'สรุปผลการแข่งขันกีฬาหนองคายปาริชาติเกมส์ ครั้งที่ 4', 'สรุปผลการแข่งขันกีฬาหนองคายปาริชาติเกมส์ ครั้งที่ 4 นักเรียนคว้ารางวัลชนะเลิศและรองชนะเลิศจากหลายประเภทกีฬา', 'http://localhost:5000/uploads/blogs/600145236_1308940814372500_668551638775263340_n-1768946339229-815217581.jpg', '{\"time\":1768946353387,\"blocks\":[{\"id\":\"eavDhaf7zM\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนขอแสดงความยินดีกับนักกีฬานักเรียนที่เข้าร่วมการแข่งขัน <b>กีฬาหนองคายปาริชาติเกมส์ ครั้งที่ 4</b>\\nซึ่งสามารถสร้างผลงานและคว้ารางวัลมาครองได้อย่างน่าภาคภูมิใจ แสดงให้เห็นถึงความสามารถ ความมุ่งมั่น และความสามัคคีของนักกีฬาในแต่ละประเภทกีฬา\"}},{\"id\":\"sD4SYwvGLD\",\"type\":\"paragraph\",\"data\":{\"text\":\"ผลการแข่งขันที่นักเรียนสามารถทำได้ มีดังต่อไปนี้\"}},{\"id\":\"RjuWWxudtp\",\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"<b>🥇 รางวัลชนะเลิศ วอลเลย์บอลชายหาดหญิง ระดับมัธยมศึกษาตอนปลาย\\nได้รับ เหรียญทอง\\n</b>\",\"<b>🥉 รางวัลรองชนะเลิศอันดับ 2 วอลเลย์บอลชายหาดหญิง ระดับมัธยมศึกษาตอนปลาย\\nได้รับ เหรียญทองแดง\\n</b>\",\"<b>🥉 รางวัลรองชนะเลิศอันดับ 2 วอลเลย์บอลในร่มหญิง ระดับมัธยมศึกษาตอนปลาย\\nได้รับ เหรียญทองแดง\\n</b>\",\"<b>🥉 รางวัลรองชนะเลิศอันดับ 2 ฟุตซอลชาย ระดับมัธยมศึกษาตอนปลาย\\nได้รับ เหรียญทองแดง\\n</b>\",\"<b>🥉 รางวัลรองชนะเลิศอันดับ 2 ทุ่มน้ำหนักชาย ระดับมัธยมศึกษาตอนปลาย\\nได้รับ เหรียญทองแดง\\n</b>\"]}},{\"id\":\"zCKBLi10U1\",\"type\":\"paragraph\",\"data\":{\"text\":\"ความสำเร็จในครั้งนี้ถือเป็นอีกหนึ่งความภาคภูมิใจของโรงเรียน และเป็นกำลังใจสำคัญให้กับนักกีฬาในการพัฒนาศักยภาพด้านกีฬาอย่างต่อเนื่องต่อไป\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 5, 1, '2026-01-20 14:59:13', '2026-01-20 14:59:13', 0, NULL, NULL, NULL, 'published'),
(9, 'สวัสดีปีใหม่ พุทธศักราช 2569', 'สวัสดีปีใหม่ 2569 คณะผู้บริหารและบุคลากรโรงเรียนท่าบ่อพิทยาคมขออวยพรให้ทุกท่านและครอบครัวพบแต่ความสุข ความเจริญรุ่งเรืองตลอดปีใหม่', 'http://localhost:5000/uploads/blogs/608555206_1318444076755507_5669821250615336002_n-1768946430487-195188400.jpg', '{\"time\":1768946502186,\"blocks\":[{\"id\":\"41-R5u1QQC\",\"type\":\"paragraph\",\"data\":{\"text\":\"เนื่องในวารดิถีขึ้น<b>ปีใหม่ พุทธศักราช 2569</b>\\nคณะผู้บริหาร คณะครู และบุคลากรโรงเรียนท่าบ่อพิทยาคม <b>ขอส่งความปรารถนาดีและคำอวยพรไปยังทุกท่านและครอบครัว</b>\"}},{\"id\":\"x-AfqHWCLj\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขออำนาจคุณพระศรีรัตนตรัยและสิ่งศักดิ์สิทธิ์ทั้งหลาย ดลบันดาลให้ท่านประสบแต่ความสุข ความเจริญรุ่งเรือง\\nมีสุขภาพร่างกายแข็งแรง ประสบความสำเร็จในหน้าที่การงาน\\nมีความโชคดี มั่งคั่ง ร่ำรวย มีกินมีใช้ ตลอดปีและตลอดไป\"}},{\"id\":\"lzpIwPhYkC\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขอให้ปีใหม่นี้เป็นปีแห่งโอกาส ความสมหวัง และความสุขสมบูรณ์ในทุกด้าน\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 1, 1, '2026-01-20 15:01:42', '2026-01-20 15:01:42', 0, NULL, NULL, NULL, 'published'),
(10, 'สุขสันต์วันเกิด รองผู้อำนวยการโรงเรียนท่าบ่อพิทยาคม', 'สุขสันต์วันเกิด นางพิชญา สุวงศ์ รองผู้อำนวยการโรงเรียนท่าบ่อพิทยาคม เนื่องในวันที่ 13 มกราคม ขออวยพรให้มีสุขภาพแข็งแรงและความสุขตลอดไป', 'http://localhost:5000/uploads/blogs/615205222_1326481395951775_2016939917880750673_n-1768946602162-536011387.jpg', '{\"time\":1773175316039,\"blocks\":[{\"id\":\"wzqpjmE3Xq\",\"type\":\"paragraph\",\"data\":{\"text\":\"เนื่องในโอกาสวันคล้ายวันเกิด <b>นางพิชญา สุวงศ์\\nรองผู้อำนวยการโรงเรียนท่าบ่อพิทยาคม</b>\\nซึ่งตรงกับวันที่ <b><i>13 มกราคม</i></b>\"}},{\"id\":\"8Rpt3560WP\",\"type\":\"paragraph\",\"data\":{\"text\":\"คณะผู้บริหาร คณะครู และบุคลากรโรงเรียนท่าบ่อพิทยาคม\\nขอร่วมแสดงความยินดีและส่งความปรารถนาดีมายังท่านในโอกาสอันเป็นมงคลนี้\"}},{\"id\":\"6GrDsd42UW\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขออำนาจคุณพระศรีรัตนตรัยและสิ่งศักดิ์สิทธิ์ทั้งหลาย\\nโปรดดลบันดาลให้ท่านมีสุขภาพร่างกายแข็งแรง\\nปราศจากทุกข์ โศก โรคภัย ประสบแต่ความสุข ความเจริญ\\nมีความสุขกาย สุขใจ และประสบความสำเร็จในหน้าที่การงานตลอดไป\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 1, 1, '2026-01-20 15:03:28', '2026-01-20 15:03:28', 0, NULL, 1, NULL, 'published'),
(11, 'กิจกรรมทดลอง', 'ทดลอง', 'http://localhost:5000/uploads/blogs/math1-1773041585566-864249935.jpg', '{\"time\":1773041997217,\"blocks\":[{\"id\":\"Pwb-RVxV2o\",\"type\":\"paragraph\",\"data\":{\"text\":\"ทดลองเขียนบทความใหม่\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 4, 9, '2026-03-09 00:33:08', '2026-03-09 00:39:38', 1, '2026-03-09 00:40:15', 1, NULL, 'published'),
(12, 'สวัสดีปีใหม่ พุทธศักราช 2569', 'สวัสดีปีใหม่ 2569 คณะผู้บริหารและบุคลากรโรงเรียนท่าบ่อพิทยาคมขออวยพรให้ทุกท่านและครอบครัวพบแต่ความสุข ความเจริญรุ่งเรืองตลอดปีใหม่', 'http://localhost:5000/uploads/blogs/608555206_1318444076755507_5669821250615336002_n-1768946430487-195188400.jpg', '{\"time\":1773041626556,\"blocks\":[{\"id\":\"41-R5u1QQC\",\"type\":\"paragraph\",\"data\":{\"text\":\"เนื่องในวารดิถีขึ้น<b>ปีใหม่ พุทธศักราช 2569</b>\\nคณะผู้บริหาร คณะครู และบุคลากรโรงเรียนท่าบ่อพิทยาคม <b>ขอส่งความปรารถนาดีและคำอวยพรไปยังทุกท่านและครอบครัว</b>\"}},{\"id\":\"x-AfqHWCLj\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขออำนาจคุณพระศรีรัตนตรัยและสิ่งศักดิ์สิทธิ์ทั้งหลาย ดลบันดาลให้ท่านประสบแต่ความสุข ความเจริญรุ่งเรือง\\nมีสุขภาพร่างกายแข็งแรง ประสบความสำเร็จในหน้าที่การงาน\\nมีความโชคดี มั่งคั่ง ร่ำรวย มีกินมีใช้ ตลอดปีและตลอดไป\"}},{\"id\":\"lzpIwPhYkC\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขอให้ปีใหม่นี้เป็นปีแห่งโอกาส ความสมหวัง และความสุขสมบูรณ์ในทุกด้านเทอญ\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 1, 9, '2026-03-09 00:33:46', '2026-03-09 00:33:46', 1, '2026-03-09 00:39:29', NULL, 9, 'rejected'),
(13, 'กิจกรรมทดลอง', 'ทดลอง', 'http://localhost:5000/uploads/blogs/math1-1773056071265-845420089.jpg', '{\"time\":1773056898507,\"blocks\":[{\"id\":\"DRyoURIyiz\",\"type\":\"paragraph\",\"data\":{\"text\":\"เนื้อหากิจกรรมทดลองทดสอบ\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 4, 9, '2026-03-09 04:48:19', '2026-03-09 04:51:20', 1, '2026-03-09 10:49:18', 1, NULL, 'published'),
(14, 'กิจกรรมสร้างสรรค์', 'กิจกรรมดีๆ', 'http://localhost:5000/uploads/blogs/005-1773613744474-772461453.jpg', '{\"time\":1773613753281,\"blocks\":[{\"id\":\"IvLrrV1H9X\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนเตรียมจัดทำกิจกรรมต้อยรับนักเรียนเนื่องในวัน...\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 2, 8, '2026-03-15 15:29:13', '2026-03-15 15:29:13', 1, '2026-03-15 15:41:17', NULL, NULL, 'rejected'),
(15, 'กิจกรรมเข้าค่ายลูกเสือ', 'โครงการกิจกรรมเข้าค่ายลูกเสือ', 'http://localhost:5000/uploads/blogs/001_45-1773762292052-472035044.jpg', '{\"time\":1773762341236,\"blocks\":[{\"id\":\"5_wkClbnBZ\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>โครงการกิจกรรมเข้าค่ายลูกเสือ</b> เป็นกิจกรรมพัฒนาผู้เรียนที่ฝึกฝนวินัย ความสามัคคี ความอดทน และทักษะชีวิตผ่านการอยู่ร่วมกัน การเดินทางไกล ฐานผจญภัย <i>(เช่น ลอดอุโมงค์, สะพานเชือก)</i> และกิจกรรมรอบกองไฟ เพื่อปลูกฝังความรับผิดชอบและการช่วยเหลือผู้อื่น\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 3, 9, '2026-03-17 08:45:41', '2026-03-17 08:45:41', 0, NULL, NULL, NULL, 'pending'),
(16, 'สวัสดีปีใหม่ พุทธศักราช 2569', 'สวัสดีปีใหม่ 2569 คณะผู้บริหารและบุคลากรโรงเรียนท่าบ่อพิทยาคมขออวยพรให้ทุกท่านและครอบครัวพบแต่ความสุข ความเจริญรุ่งเรืองตลอดปีใหม่', 'http://localhost:5000/uploads/blogs/608555206_1318444076755507_5669821250615336002_n-1768946430487-195188400.jpg', '{\"time\":1773762618329,\"blocks\":[{\"id\":\"41-R5u1QQC\",\"type\":\"paragraph\",\"data\":{\"text\":\"เนื่องในวารดิถีขึ้น<b>ปีใหม่ พุทธศักราช 2569</b>\\nคณะผู้บริหาร คณะครู และบุคลากรโรงเรียนท่าบ่อพิทยาคม <b>ขอส่งความปรารถนาดีและคำอวยพรไปยังทุกท่านและครอบครัว</b>\"}},{\"id\":\"x-AfqHWCLj\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขออำนาจคุณพระศรีรัตนตรัยและสิ่งศักดิ์สิทธิ์ทั้งหลาย ดลบันดาลให้ท่านประสบแต่ความสุข ความเจริญรุ่งเรือง\\nมีสุขภาพร่างกายแข็งแรง ประสบความสำเร็จในหน้าที่การงาน\\nมีความโชคดี มั่งคั่ง ร่ำรวย มีกินมีใช้ ตลอดปีและตลอดไป\"}},{\"id\":\"lzpIwPhYkC\",\"type\":\"paragraph\",\"data\":{\"text\":\"ขอให้ปีใหม่นี้เป็นปีแห่งโอกาส ความสมหวัง และความสุขสมบูรณ์ในทุกด้าน\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 1, 9, '2026-03-17 08:50:18', '2026-03-17 08:50:18', 1, '2026-03-17 10:21:00', NULL, 9, 'rejected'),
(17, 'พิธีมอบประกาศนียบัตรและปัจฉิมนิเทศ ', 'พิธีมอบประกาศนียบัตรและปัจฉิมนิเทศ ', 'http://localhost:5000/uploads/blogs/651354847_1374528624480385_5597561537450902751_n-1773768213551-31826933.jpg', '{\"time\":1773768480196,\"blocks\":[{\"id\":\"fHoAT6ja__\",\"type\":\"header\",\"data\":{\"text\":\"🎊Congratulations 🎊&nbsp;\",\"level\":2}},{\"id\":\"le5qW7znBL\",\"type\":\"paragraph\",\"data\":{\"text\":\"🔰พิธีมอบประกาศนียบัตรและปัจฉิมนิเทศ \"}},{\"id\":\"_IHaOQF9EB\",\"type\":\"paragraph\",\"data\":{\"text\":\"🔰ชั้น ม.3 และ ม.6 ประจำปีการศึกษา ๒๕๖๘\"}},{\"id\":\"7xgvDvQiNU\",\"type\":\"paragraph\",\"data\":{\"text\":\"โรงเรียนท่าบ่อพิทยาคม อ.ท่าบ่อ จ.หนองคาย\"}},{\"id\":\"3WHMyk0Rov\",\"type\":\"paragraph\",\"data\":{\"text\":\"<b>๑๓ มีนาคม ๒๕๖๙</b>\"}}],\"version\":\"2.31.0-rc.7\"}', NULL, 2, 1, '2026-03-17 10:24:08', '2026-03-17 10:24:08', 0, NULL, 1, NULL, 'published');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`, `icon`, `sortOrder`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'ข่าวประชาสัมพันธ์', 'news-announcement', 'ข่าวประกาศและประชาสัมพันธ์ทั่วไป', '📢', 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(2, 'กิจกรรมโรงเรียน', 'school-activities', 'กิจกรรมต่างๆ ภายในโรงเรียน', '🎉', 2, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(3, 'กิจกรรมเข้าค่ายลูกเสือ', 'scout-camp', 'กิจกรรมค่ายลูกเสือและเนตรนารี', '⛺', 3, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(4, 'กิจกรรมอาสาพัฒนา', 'volunteer-work', 'กิจกรรมอาสาสมัครและพัฒนาชุมชน', '🤝', 4, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(5, 'ผลงานนักเรียน', 'student-achievements', 'ผลงานและรางวัลของนักเรียน', '🏆', 5, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(6, 'ข่าวการศึกษา', 'education-news', 'ข่าวสารด้านการศึกษา', '📚', 6, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(7, 'สมทบทุนการศึกษา', 'education-fund', 'การระดมทุนและบริจาคเพื่อการศึกษา', '💰', 7, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `classschedules`
--

CREATE TABLE `classschedules` (
  `id` int(11) NOT NULL,
  `class` varchar(50) NOT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `dayOfWeekId` int(11) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `periodNumber` int(11) DEFAULT NULL,
  `semesterId` int(11) DEFAULT NULL,
  `building` varchar(100) DEFAULT NULL,
  `guestTeacherName` varchar(255) DEFAULT NULL,
  `subjectCodeRaw` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classschedules`
--

INSERT INTO `classschedules` (`id`, `class`, `subjectId`, `teacherId`, `dayOfWeekId`, `room`, `createdAt`, `updatedAt`, `deletedAt`, `updatedBy`, `periodNumber`, `semesterId`, `building`, `guestTeacherName`, `subjectCodeRaw`) VALUES
(2150, '6/1', 27, 13, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 1, 5, NULL, NULL, NULL),
(2151, '6/1', 4, 4, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 2, 5, NULL, NULL, NULL),
(2152, '6/1', 1, NULL, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 3, 5, NULL, NULL, NULL),
(2153, '6/1', 1, NULL, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 4, 5, NULL, NULL, NULL),
(2154, '6/1', 20, NULL, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 5, 5, NULL, NULL, NULL),
(2155, '6/1', 6, 5, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 6, 5, NULL, NULL, NULL),
(2156, '6/1', 11, 15, 1, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 7, 5, NULL, NULL, NULL),
(2157, '6/1', 15, NULL, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 1, 5, NULL, NULL, NULL),
(2158, '6/1', 26, 13, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 2, 5, NULL, NULL, NULL),
(2159, '6/1', 23, 14, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 3, 5, NULL, NULL, NULL),
(2160, '6/1', 11, 15, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 4, 5, NULL, NULL, NULL),
(2161, '6/1', 4, 4, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 5, 5, NULL, NULL, NULL),
(2162, '6/1', 8, 10, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 6, 5, NULL, NULL, NULL),
(2163, '6/1', 33, 10, 2, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 7, 5, NULL, NULL, NULL),
(2164, '6/1', 2, 5, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 1, 5, NULL, NULL, NULL),
(2165, '6/1', 4, 4, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 2, 5, NULL, NULL, NULL),
(2166, '6/1', 11, 15, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 3, 5, NULL, NULL, NULL),
(2167, '6/1', 10, 8, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 4, 5, NULL, NULL, NULL),
(2168, '6/1', 11, 15, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 5, 5, NULL, NULL, NULL),
(2169, '6/1', 23, 14, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 6, 5, NULL, NULL, NULL),
(2170, '6/1', 31, NULL, 3, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 7, 5, NULL, NULL, NULL),
(2171, '6/1', 2, 5, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 1, 5, NULL, NULL, NULL),
(2172, '6/1', 15, NULL, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 2, 5, NULL, NULL, NULL),
(2173, '6/1', 14, 11, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 3, 5, NULL, NULL, NULL),
(2174, '6/1', 11, 15, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 4, 5, NULL, NULL, NULL),
(2175, '6/1', 14, 4, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 5, 5, NULL, NULL, NULL),
(2176, '6/1', 16, 11, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 6, 5, NULL, NULL, NULL),
(2177, '6/1', 34, NULL, 4, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 7, 5, NULL, NULL, NULL),
(2178, '6/1', 11, 15, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 1, 5, NULL, NULL, NULL),
(2179, '6/1', 2, 5, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 2, 5, NULL, NULL, NULL),
(2180, '6/1', 8, 10, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 3, 5, NULL, NULL, NULL),
(2181, '6/1', 32, 14, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 4, 5, NULL, NULL, NULL),
(2182, '6/1', 32, 14, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 5, 5, NULL, NULL, NULL),
(2183, '6/1', 12, 16, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 6, 5, NULL, NULL, NULL),
(2184, '6/1', 35, NULL, 5, NULL, '2026-03-11 04:41:49', '2026-03-11 04:41:49', NULL, 1, 7, 5, NULL, NULL, NULL),
(3103, '1/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3104, '1/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 2, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3105, '1/1', 8, 10, 1, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3106, '1/1', 8, 10, 1, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว21102'),
(3107, '1/1', 12, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ22102'),
(3108, '1/1', 3, 4, 1, 'ห้อง 111', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ส22102'),
(3109, '1/1', 20, NULL, 1, 'ห้อง 111', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 7, 6, 'ตึก 1', NULL, 'ส20232'),
(3110, '1/1', 6, 5, 2, 'ห้อง 111', '2026-03-11 08:36:36', '2026-03-11 08:36:36', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21202'),
(3111, '1/1', 15, NULL, 2, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ส21103'),
(3112, '1/1', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3113, '1/1', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ศ21102'),
(3114, '1/1', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3115, '1/1', 4, 4, 2, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ท21102'),
(3116, '1/1', 33, 7, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3117, '1/1', 15, NULL, 3, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ส21103'),
(3118, '1/1', 2, 5, 3, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค21102'),
(3119, '1/1', 4, 4, 3, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ท21102'),
(3120, '1/1', 24, 13, 3, 'ห้องดนตรี', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ศ21103'),
(3121, '1/1', 22, 11, 3, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส20236'),
(3122, '1/1', 8, 10, 3, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3123, '1/1', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3124, '1/1', 15, NULL, 4, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ส21103'),
(3125, '1/1', 2, 5, 4, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค21102'),
(3126, '1/1', 27, 13, 4, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 4', NULL, 'พ21104'),
(3127, '1/1', 10, 8, 4, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3128, '1/1', 16, 11, 4, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส21104'),
(3129, '1/1', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'อ21102'),
(3130, '1/1', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3131, '1/1', 2, 5, 5, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3132, '1/1', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 3', NULL, 'อ21102'),
(3133, '1/1', 4, 4, 5, 'ห้อง 111', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ท21102'),
(3134, '1/1', 23, 14, 5, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ศ21102'),
(3135, '1/1', 32, 4, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3136, '1/1', 32, 4, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 4', NULL, 'PBL'),
(3137, '1/1', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3138, '1/2', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3139, '1/2', 4, 4, 1, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3140, '1/2', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3141, '1/2', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3142, '1/2', 20, NULL, 1, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส20232'),
(3143, '1/2', 6, 5, 1, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ค21202'),
(3144, '1/2', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3145, '1/2', 15, NULL, 2, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ส21103'),
(3146, '1/2', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3147, '1/2', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3148, '1/2', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3149, '1/2', 4, 4, 2, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ท21102'),
(3150, '1/2', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3151, '1/2', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3152, '1/2', 2, 5, 3, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3153, '1/2', 4, 4, 3, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3154, '1/2', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3155, '1/2', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3156, '1/2', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3157, '1/2', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3158, '1/2', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3159, '1/2', 2, 5, 4, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3160, '1/2', 15, NULL, 4, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ส21103'),
(3161, '1/2', 15, NULL, 4, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ส21103'),
(3162, '1/2', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3163, '1/2', 14, 4, 4, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส21102'),
(3164, '1/2', 16, 11, 4, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ส21104'),
(3165, '1/2', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3166, '1/2', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3167, '1/2', 2, 5, 5, 'ห้อง 112', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค21102'),
(3168, '1/2', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3169, '1/2', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3170, '1/2', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3171, '1/2', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3172, '2/1', 8, 10, 1, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ว21102'),
(3173, '2/1', 8, 10, 1, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ว21102'),
(3174, '2/1', 7, 6, 1, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ค22102'),
(3175, '2/1', 29, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'พ22104'),
(3176, '2/1', 12, 16, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ22102'),
(3177, '2/1', 17, NULL, 1, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ส22103'),
(3178, '2/1', 19, 14, 1, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 1', NULL, 'ส22204'),
(3179, '2/1', 5, 4, 2, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ท22102'),
(3180, '2/1', 7, 6, 2, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค22102'),
(3181, '2/1', 1, NULL, 2, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3182, '2/1', 1, NULL, 2, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3183, '2/1', 21, NULL, 2, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส20234'),
(3184, '2/1', 12, 16, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'อ22102'),
(3185, '2/1', 33, 15, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3186, '2/1', 12, 16, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ22102'),
(3187, '2/1', 18, 11, 3, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ส22104'),
(3188, '2/1', 17, NULL, 3, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ส22103'),
(3189, '2/1', 7, 6, 3, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 1', NULL, 'ค22102'),
(3190, '2/1', 5, 4, 3, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ท22102'),
(3191, '2/1', 30, NULL, 3, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ธรรมะ'),
(3192, '2/1', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3193, '2/1', 10, 8, 4, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ว22104'),
(3194, '2/1', 25, 14, 4, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 3', NULL, 'ศ22102'),
(3195, '2/1', 13, 16, 4, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ22202'),
(3196, '2/1', 28, 13, 4, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'พ22102'),
(3197, '2/1', 30, NULL, 4, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ธรรมะ'),
(3198, '2/1', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3199, '2/1', 9, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ว22102'),
(3200, '2/1', 25, 14, 5, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 3', NULL, 'ศ22102'),
(3201, '2/1', 17, NULL, 5, 'ห้อง 121', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ส22103'),
(3202, '2/1', 32, 10, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3203, '2/1', 32, 5, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3204, '2/1', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3205, '2/2', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3206, '2/2', 4, 4, 1, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3207, '2/2', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3208, '2/2', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3209, '2/2', 20, NULL, 1, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส20232'),
(3210, '2/2', 6, 5, 1, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ค21202'),
(3211, '2/2', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3212, '2/2', 15, NULL, 2, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ส21103'),
(3213, '2/2', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3214, '2/2', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3215, '2/2', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3216, '2/2', 4, 4, 2, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ท21102'),
(3217, '2/2', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3218, '2/2', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3219, '2/2', 2, 5, 3, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3220, '2/2', 4, 4, 3, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3221, '2/2', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3222, '2/2', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3223, '2/2', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3224, '2/2', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3225, '2/2', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3226, '2/2', 2, 5, 4, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3227, '2/2', 15, NULL, 4, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ส21103'),
(3228, '2/2', 15, NULL, 4, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ส21103'),
(3229, '2/2', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3230, '2/2', 14, 4, 4, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส21102'),
(3231, '2/2', 16, 11, 4, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ส21104'),
(3232, '2/2', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3233, '2/2', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3234, '2/2', 2, 5, 5, 'ห้อง 122', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค21102'),
(3235, '2/2', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3236, '2/2', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3237, '2/2', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3238, '2/2', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3239, '3/1', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3240, '3/1', 4, 4, 1, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3241, '3/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3242, '3/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3243, '3/1', 20, NULL, 1, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส20232'),
(3244, '3/1', 6, 5, 1, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ค21202'),
(3245, '3/1', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3246, '3/1', 15, NULL, 2, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ส21103'),
(3247, '3/1', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3248, '3/1', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3249, '3/1', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3250, '3/1', 4, 4, 2, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ท21102'),
(3251, '3/1', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3252, '3/1', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3253, '3/1', 2, 5, 3, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3254, '3/1', 4, 4, 3, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3255, '3/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3256, '3/1', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3257, '3/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3258, '3/1', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3259, '3/1', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3260, '3/1', 2, 5, 4, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3261, '3/1', 15, NULL, 4, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ส21103'),
(3262, '3/1', 15, NULL, 4, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ส21103'),
(3263, '3/1', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3264, '3/1', 14, 4, 4, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส21102'),
(3265, '3/1', 16, 11, 4, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ส21104'),
(3266, '3/1', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3267, '3/1', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3268, '3/1', 2, 5, 5, 'ห้อง 211', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค21102'),
(3269, '3/1', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3270, '3/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3271, '3/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3272, '3/1', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3273, '3/2', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3274, '3/2', 4, 4, 1, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3275, '3/2', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3276, '3/2', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3277, '3/2', 20, NULL, 1, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส20232'),
(3278, '3/2', 6, 5, 1, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ค21202'),
(3279, '3/2', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3280, '3/2', 15, NULL, 2, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ส21103'),
(3281, '3/2', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3282, '3/2', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3283, '3/2', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3284, '3/2', 4, 4, 2, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ท21102'),
(3285, '3/2', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3286, '3/2', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3287, '3/2', 2, 5, 3, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3288, '3/2', 4, 4, 3, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ท21102'),
(3289, '3/2', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3290, '3/2', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3291, '3/2', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3292, '3/2', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3293, '3/2', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3294, '3/2', 2, 5, 4, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 1', NULL, 'ค21102'),
(3295, '3/2', 15, NULL, 4, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ส21103'),
(3296, '3/2', 15, NULL, 4, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 1', NULL, 'ส21103'),
(3297, '3/2', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3298, '3/2', 14, 4, 4, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 1', NULL, 'ส21102'),
(3299, '3/2', 16, 11, 4, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 1', NULL, 'ส21104'),
(3300, '3/2', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3301, '3/2', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3302, '3/2', 2, 5, 5, 'ห้อง 212', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 1', NULL, 'ค21102'),
(3303, '3/2', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3304, '3/2', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3305, '3/2', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3306, '3/2', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3307, '4/1', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3308, '4/1', 4, 4, 1, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ท21102'),
(3309, '4/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3310, '4/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3311, '4/1', 20, NULL, 1, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ส20232'),
(3312, '4/1', 6, 5, 1, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ค21202'),
(3313, '4/1', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3314, '4/1', 15, NULL, 2, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ส21103'),
(3315, '4/1', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3316, '4/1', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3317, '4/1', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3318, '4/1', 4, 4, 2, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ท21102'),
(3319, '4/1', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3320, '4/1', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3321, '4/1', 2, 5, 3, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ค21102'),
(3322, '4/1', 4, 4, 3, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ท21102'),
(3323, '4/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3324, '4/1', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3325, '4/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3326, '4/1', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3327, '4/1', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3328, '4/1', 2, 5, 4, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ค21102'),
(3329, '4/1', 15, NULL, 4, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ส21103'),
(3330, '4/1', 15, NULL, 4, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ส21103'),
(3331, '4/1', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3332, '4/1', 14, 4, 4, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ส21102'),
(3333, '4/1', 16, 11, 4, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ส21104'),
(3334, '4/1', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3335, '4/1', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3336, '4/1', 2, 5, 5, 'ห้อง 221', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ค21102'),
(3337, '4/1', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3338, '4/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3339, '4/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3340, '4/1', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3341, '5/1', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3342, '5/1', 4, 4, 1, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ท21102'),
(3343, '5/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3344, '5/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3345, '5/1', 20, NULL, 1, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ส20232'),
(3346, '5/1', 6, 5, 1, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ค21202'),
(3347, '5/1', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3348, '5/1', 15, NULL, 2, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ส21103'),
(3349, '5/1', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3350, '5/1', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3351, '5/1', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3352, '5/1', 4, 4, 2, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ท21102'),
(3353, '5/1', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3354, '5/1', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3355, '5/1', 2, 5, 3, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ค21102'),
(3356, '5/1', 4, 4, 3, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ท21102'),
(3357, '5/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3358, '5/1', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3359, '5/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3360, '5/1', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3361, '5/1', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3362, '5/1', 2, 5, 4, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ค21102'),
(3363, '5/1', 15, NULL, 4, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ส21103'),
(3364, '5/1', 15, NULL, 4, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ส21103'),
(3365, '5/1', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3366, '5/1', 14, 4, 4, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ส21102'),
(3367, '5/1', 16, 11, 4, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ส21104'),
(3368, '5/1', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3369, '5/1', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3370, '5/1', 2, 5, 5, 'ห้อง 311', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ค21102'),
(3371, '5/1', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3372, '5/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3373, '5/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3374, '5/1', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3375, '6/1', 27, 13, 1, 'สนามกีฬา', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 4', NULL, 'พ21104'),
(3376, '6/1', 4, 4, 1, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ท21102'),
(3377, '6/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3378, '6/1', 1, NULL, 1, 'ห้องภาษา 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'ภาษาจีน'),
(3379, '6/1', 20, NULL, 1, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ส20232'),
(3380, '6/1', 6, 5, 1, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ค21202'),
(3381, '6/1', 11, 15, 1, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 3', NULL, 'อ21102'),
(3382, '6/1', 15, NULL, 2, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ส21103'),
(3383, '6/1', 26, 13, 2, 'โรงยิม', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 4', NULL, 'พ21103'),
(3384, '6/1', 23, 14, 2, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'ศ21102'),
(3385, '6/1', 11, 15, 2, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3386, '6/1', 4, 4, 2, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ท21102'),
(3387, '6/1', 8, 10, 2, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ว21102'),
(3388, '6/1', 33, 10, 2, 'ห้องแนะแนว', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, 'ตึก 4', NULL, 'แนะแนว'),
(3389, '6/1', 2, 5, 3, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ค21102'),
(3390, '6/1', 4, 4, 3, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ท21102'),
(3391, '6/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 3', NULL, 'อ21102'),
(3392, '6/1', 10, 8, 3, 'ห้องวิทยาศาสตร์ 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 2', NULL, 'ว22104'),
(3393, '6/1', 11, 15, 3, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 3', NULL, 'อ21102'),
(3394, '6/1', 23, 14, 3, 'ห้องศิลปะ', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 3', NULL, 'ศ21102'),
(3395, '6/1', 31, NULL, 3, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'สส/นน'),
(3396, '6/1', 2, 5, 4, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 2', NULL, 'ค21102'),
(3397, '6/1', 15, NULL, 4, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ส21103'),
(3398, '6/1', 15, NULL, 4, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ส21103'),
(3399, '6/1', 11, 15, 4, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 3', NULL, 'อ21102'),
(3400, '6/1', 14, 4, 4, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 2', NULL, 'ส21102'),
(3401, '6/1', 16, 11, 4, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 6, 6, 'ตึก 2', NULL, 'ส21104'),
(3402, '6/1', 34, NULL, 4, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'ชุมนุม'),
(3403, '6/1', 11, 15, 5, 'ห้องภาษา 2', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 1, 6, 'ตึก 3', NULL, 'อ21102'),
(3404, '6/1', 2, 5, 5, 'ห้อง 312', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 2, 6, 'ตึก 2', NULL, 'ค21102'),
(3405, '6/1', 8, 10, 5, 'ห้องวิทยาศาสตร์ 1', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 3, 6, 'ตึก 2', NULL, 'ว21102'),
(3406, '6/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 4, 6, 'ตึก 4', NULL, 'PBL'),
(3407, '6/1', 32, 14, 5, 'ห้องปฏิบัติการ STEM', '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 5, 6, 'ตึก 4', NULL, 'PBL'),
(3408, '6/1', 35, NULL, 5, NULL, '2026-03-11 08:36:37', '2026-03-11 08:36:37', NULL, NULL, 7, 6, NULL, NULL, 'เพื่อสังคม'),
(3409, '1/1', 27, 13, 1, 'สนามกีฬา', '2026-03-17 10:02:46', '2026-03-17 10:02:46', '2026-03-17 10:18:21', 1, 8, 6, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `club_categories`
--

CREATE TABLE `club_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `relatedDepartmentId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `club_categories`
--

INSERT INTO `club_categories` (`id`, `name`, `slug`, `description`, `icon`, `sortOrder`, `relatedDepartmentId`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'ศิลปะและดนตรี', 'arts-music', 'ชุมนุมด้านศิลปะ ดนตรี และการแสดง', '🎨', 1, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(2, 'วิทยาศาสตร์และเทคโนโลยี', 'science-tech', 'ชุมนุมด้านวิทยาศาสตร์ คณิตศาสตร์ และเทคโนโลยี', '🔬', 2, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(3, 'กีฬาและนันทนาการ', 'sports-recreation', 'ชุมนุมด้านกีฬาและกิจกรรมนันทนาการ', '⚽', 3, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(4, 'ภาษาและวัฒนธรรม', 'language-culture', 'ชุมนุมด้านภาษาต่างประเทศและวัฒนธรรม', '🌏', 4, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(5, 'การงานและอาชีพ', 'vocational', 'ชุมนุมด้านการงานอาชีพและทักษะชีวิต', '🔨', 5, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(6, 'รักษาดินแดนและลูกเสือ', 'military-scout', 'ชุมนุมรด. ลูกเสือ เนตรนารี และกิจกรรมพิเศษ', '🎖️', 6, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL),
(7, 'ชุมนุมพิเศษ', 'special-clubs', 'ชุมนุมกิจกรรมพิเศษอื่นๆ', '⭐', 7, NULL, '2026-01-16 09:30:03', '2026-01-16 09:30:03', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `comment`, `userId`, `postId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(6, 'เยี่ยมค่ะ', 5, 1, '2026-01-19 16:51:32', '2026-01-19 16:51:32', '2026-01-20 21:11:06'),
(7, '6 โมง', 5, 1, '2026-01-19 16:57:15', '2026-01-19 16:57:15', '2026-01-20 14:22:58'),
(9, 'ทดสอบแสดงความคิดเห็น1', 1, 1, '2026-01-19 17:06:36', '2026-01-20 21:11:12', NULL),
(11, 'ทดสอบ', 1, 1, '2026-01-19 17:11:07', '2026-01-20 14:16:12', '2026-01-20 14:16:29'),
(13, 'ขอแสดงความยินดีด้วยครับ', 1, 10, '2026-01-20 15:04:22', '2026-01-20 15:04:22', NULL),
(14, 'ขออวยพรให้นักเรียนมีแต่ความสุข สุขภาพแข็งแรงนะคะ', 8, 9, '2026-01-20 19:25:16', '2026-01-20 19:25:38', NULL),
(15, 'ขอให้ท่ารองฯ มีสุขภาพร่างกายแข็งแรงนะคะ', 11, 10, '2026-01-20 21:40:29', '2026-01-20 21:40:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `daysofweek`
--

CREATE TABLE `daysofweek` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `daysofweek`
--

INSERT INTO `daysofweek` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'จันทร์', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(2, 'อังคาร', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(3, 'พุธ', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(4, 'พฤหัสบดี', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(5, 'ศุกร์', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `headTeacherId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `headTeacherId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ฝ่ายบริหาร', NULL, '2025-08-15 05:14:18', '2025-08-15 05:14:18', NULL),
(2, 'กลุ่มสาระการเรียนรู้ภาษาไทย', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(3, 'กลุ่มสาระการเรียนรู้คณิตศาสตร์', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(4, 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(5, 'กลุ่มสาระการเรียนรู้สังคมศึกษาฯ', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(6, 'กลุ่มสาระการเรียนรู้สุขศึกษาฯ', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(7, 'กลุ่มสาระการเรียนรู้ศิลปะ', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(8, 'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(9, 'ธุรการโรงเรียน', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
(10, 'นักการภารโรง', NULL, '2025-08-27 11:46:00', '2025-08-27 11:46:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `flagpoleattendance`
--

CREATE TABLE `flagpoleattendance` (
  `id` int(11) NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `statusId` int(11) NOT NULL,
  `recorderId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `semesterId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flagpoleattendance`
--

INSERT INTO `flagpoleattendance` (`id`, `studentId`, `date`, `statusId`, `recorderId`, `createdAt`, `updatedAt`, `deletedAt`, `updatedBy`, `semesterId`) VALUES
(18, 1, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(19, 2, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(20, 3, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(21, 4, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(22, 5, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(23, 6, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(24, 7, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(25, 8, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(26, 9, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(27, 10, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(28, 11, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(29, 12, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(30, 13, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(31, 14, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(32, 15, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(33, 16, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(34, 17, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(35, 154, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(36, 155, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(37, 156, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(38, 157, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(39, 158, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(40, 159, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(41, 160, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(42, 161, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(43, 162, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(44, 163, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(45, 164, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(46, 165, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(47, 166, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(48, 167, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(49, 168, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(50, 169, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(51, 170, '2026-01-16', 1, 1, '2026-01-16 12:15:16', '2026-01-16 12:15:16', NULL, NULL, 6),
(52, 307, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(53, 308, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(54, 309, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(55, 310, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(56, 311, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(57, 312, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(58, 313, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(59, 314, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(60, 315, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(61, 316, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(62, 317, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(63, 318, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(64, 319, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(65, 320, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(66, 321, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(67, 322, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(68, 323, '2026-01-19', 1, 1, '2026-01-19 14:25:29', '2026-01-19 14:25:29', NULL, NULL, 6),
(69, 307, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(70, 308, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(71, 309, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(72, 310, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(73, 311, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(74, 312, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(75, 313, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(76, 314, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(77, 315, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(78, 316, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(79, 317, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(80, 318, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(81, 319, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(82, 320, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(83, 321, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(84, 322, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(85, 323, '2026-03-04', 1, 9, '2026-03-04 00:46:44', '2026-03-04 00:46:44', NULL, NULL, 6),
(86, 324, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(87, 325, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(88, 326, '2026-03-04', 3, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(89, 327, '2026-03-04', 3, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(90, 328, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(91, 329, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(92, 330, '2026-03-04', 2, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(93, 331, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(94, 332, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(95, 333, '2026-03-04', 3, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(96, 334, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(97, 335, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(98, 336, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(99, 337, '2026-03-04', 3, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(100, 338, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(101, 339, '2026-03-04', 3, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(102, 340, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(103, 341, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(104, 342, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(105, 343, '2026-03-04', 1, 9, '2026-03-04 00:47:08', '2026-03-04 00:47:08', NULL, NULL, 6),
(158, 344, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(159, 345, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(160, 346, '2026-03-10', 2, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(161, 347, '2026-03-10', 3, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(162, 348, '2026-03-10', 3, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(163, 349, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(164, 350, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(165, 351, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(166, 352, '2026-03-10', 4, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(167, 353, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(168, 354, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(169, 355, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(170, 356, '2026-03-10', 3, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(171, 357, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(172, 358, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(173, 359, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(174, 360, '2026-03-10', 3, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(175, 361, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(176, 362, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(177, 363, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(178, 364, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(179, 365, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(180, 366, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(181, 367, '2026-03-10', 1, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(182, 368, '2026-03-10', 3, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(183, 369, '2026-03-10', 3, 8, '2026-03-10 16:46:23', '2026-03-10 16:46:23', NULL, NULL, 6),
(184, 390, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(185, 391, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(186, 392, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(187, 393, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(188, 394, '2026-03-11', 2, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(189, 395, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(190, 396, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(191, 397, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(192, 398, '2026-03-11', 3, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(193, 399, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(194, 400, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(195, 401, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(196, 402, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(197, 403, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(198, 404, '2026-03-11', 1, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(199, 405, '2026-03-11', 3, 8, '2026-03-10 18:02:01', '2026-03-10 18:02:01', NULL, NULL, 6),
(217, 307, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(218, 308, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(219, 309, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(220, 310, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(221, 311, '2026-03-12', 2, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(222, 312, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(223, 313, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(224, 314, '2026-03-12', 3, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(225, 315, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(226, 316, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(227, 317, '2026-03-12', 3, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(228, 318, '2026-03-12', 3, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(229, 319, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(230, 320, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(231, 321, '2026-03-12', 3, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(232, 322, '2026-03-12', 1, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(233, 323, '2026-03-12', 3, 9, '2026-03-11 18:55:13', '2026-03-11 18:55:13', NULL, NULL, 6),
(234, 324, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(235, 325, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(236, 326, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(237, 327, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(238, 328, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(239, 329, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(240, 330, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(241, 331, '2026-03-12', 4, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(242, 332, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(243, 333, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(244, 334, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(245, 335, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(246, 336, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(247, 337, '2026-03-12', 5, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(248, 338, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(249, 339, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(250, 340, '2026-03-12', 3, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(251, 341, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(252, 342, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(253, 343, '2026-03-12', 1, 7, '2026-03-11 19:03:33', '2026-03-11 19:03:33', NULL, NULL, 6),
(254, 344, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(255, 345, '2026-03-12', 3, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(256, 346, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(257, 347, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(258, 348, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(259, 349, '2026-03-12', 3, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(260, 350, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(261, 351, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(262, 352, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(263, 353, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(264, 354, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(265, 355, '2026-03-12', 2, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(266, 356, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(267, 357, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(268, 358, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(269, 359, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(270, 360, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(271, 361, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(272, 362, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(273, 363, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(274, 364, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(275, 365, '2026-03-12', 3, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(276, 366, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(277, 367, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(278, 368, '2026-03-12', 1, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(279, 369, '2026-03-12', 3, 8, '2026-03-11 19:04:59', '2026-03-11 19:04:59', NULL, NULL, 6),
(280, 370, '2026-03-12', 3, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(281, 371, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(282, 372, '2026-03-12', 3, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(283, 373, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(284, 374, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(285, 375, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(286, 376, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(287, 377, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(288, 378, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(289, 379, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(290, 380, '2026-03-12', 4, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(291, 381, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(292, 382, '2026-03-12', 3, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(293, 383, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(294, 384, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(295, 385, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(296, 386, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(297, 387, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(298, 388, '2026-03-12', 4, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(299, 389, '2026-03-12', 1, 8, '2026-03-11 19:05:25', '2026-03-11 19:05:25', NULL, NULL, 6),
(300, 390, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(301, 391, '2026-03-12', 3, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(302, 392, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(303, 393, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(304, 394, '2026-03-12', 2, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(305, 395, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(306, 396, '2026-03-12', 2, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(307, 397, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(308, 398, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(309, 399, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(310, 400, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(311, 401, '2026-03-12', 3, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(312, 402, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(313, 403, '2026-03-12', 1, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(314, 404, '2026-03-12', 3, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(315, 405, '2026-03-12', 3, 11, '2026-03-11 19:07:35', '2026-03-11 19:07:35', NULL, NULL, 6),
(316, 406, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(317, 407, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(318, 408, '2026-03-12', 3, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(319, 409, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(320, 410, '2026-03-12', 3, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(321, 411, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(322, 412, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(323, 413, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(324, 414, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(325, 415, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(326, 416, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(327, 417, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(328, 418, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(329, 419, '2026-03-12', 3, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(330, 420, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(331, 421, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(332, 422, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(333, 423, '2026-03-12', 3, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(334, 424, '2026-03-12', 3, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(335, 425, '2026-03-12', 3, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(336, 426, '2026-03-12', 1, 12, '2026-03-11 19:09:25', '2026-03-11 19:09:25', NULL, NULL, 6),
(337, 427, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(338, 428, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(339, 429, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(340, 430, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(341, 431, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(342, 432, '2026-03-12', 4, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(343, 433, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(344, 434, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(345, 435, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(346, 436, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(347, 437, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(348, 438, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(349, 439, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(350, 440, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(351, 441, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(352, 442, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(353, 443, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(354, 444, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(355, 445, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(356, 446, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(357, 447, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(358, 448, '2026-03-12', 1, 12, '2026-03-11 19:09:41', '2026-03-11 19:09:41', NULL, NULL, 6),
(359, 449, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(360, 450, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(361, 451, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(362, 452, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(363, 453, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(364, 454, '2026-03-12', 3, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(365, 455, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(366, 456, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(367, 457, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(368, 458, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(369, 459, '2026-03-12', 1, 12, '2026-03-11 19:09:53', '2026-03-11 19:09:53', NULL, NULL, 6),
(370, 307, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(371, 308, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(372, 309, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(373, 310, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(374, 311, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(375, 312, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(376, 313, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(377, 314, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(378, 315, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(379, 316, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(380, 317, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(381, 318, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(382, 319, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(383, 320, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(384, 321, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(385, 322, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6),
(386, 323, '2026-03-17', 1, 9, '2026-03-17 08:28:12', '2026-03-17 08:28:12', NULL, NULL, 6);

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `id` int(11) NOT NULL,
  `genderName` varchar(20) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`id`, `genderName`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'male', '2025-08-04 12:41:25', '2025-08-04 12:41:25', NULL),
(2, 'female', '2025-08-04 12:41:25', '2025-08-04 12:41:25', NULL),
(3, 'other', '2025-08-04 12:41:25', '2025-08-04 12:41:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `homeroom_classes`
--

CREATE TABLE `homeroom_classes` (
  `id` int(11) NOT NULL,
  `className` varchar(50) NOT NULL,
  `homeroomTeacherId` int(11) NOT NULL,
  `academicYearId` int(11) DEFAULT NULL,
  `maxStudents` int(11) DEFAULT 40,
  `room` varchar(50) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `building` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homeroom_classes`
--

INSERT INTO `homeroom_classes` (`id`, `className`, `homeroomTeacherId`, `academicYearId`, `maxStudents`, `room`, `floor`, `building`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, '1/1', 5, 3, 17, '101', 1, '2', 1, '2026-02-26 11:04:22', '2026-03-15 16:04:31', NULL),
(2, '1/2', 3, 3, 20, '102', 1, '2', 1, '2026-02-26 11:05:34', '2026-02-26 09:40:17', NULL),
(3, '2/1', 4, 3, 26, '201', 2, '2', 1, '2026-02-26 11:06:42', '2026-02-26 09:40:28', NULL),
(4, '3/1', 6, 3, 20, '301', 2, '2', 1, '2026-02-26 11:08:01', '2026-02-26 09:40:33', NULL),
(5, '3/2', 7, 3, 16, '302', 2, '2', 1, '2026-02-26 11:09:02', '2026-02-26 09:40:38', NULL),
(6, '4/1', 8, 3, 21, '401', 1, '4', 1, '2026-02-26 11:10:16', '2026-02-26 09:40:45', NULL),
(9, '5/1', 9, 3, 22, '402', 1, '4', 1, '2026-02-26 09:23:42', '2026-02-26 09:40:49', NULL),
(10, '6/1', 10, 3, 11, '403', 1, '4', 1, '2026-02-26 09:24:45', '2026-02-26 09:24:45', NULL),
(11, '6/2', 2, 3, 15, '103', NULL, NULL, 0, '2026-03-17 09:56:33', '2026-03-17 09:58:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `homevisits`
--

CREATE TABLE `homevisits` (
  `id` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `visitDate` date NOT NULL,
  `familyStatus` text DEFAULT NULL,
  `visitPurpose` text NOT NULL,
  `studentBehaviorAtHome` text DEFAULT NULL,
  `parentCooperation` text DEFAULT NULL,
  `problems` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `followUpPlan` text DEFAULT NULL,
  `summary` text NOT NULL,
  `notes` text DEFAULT NULL,
  `imagePath` varchar(500) DEFAULT NULL,
  `imageGallery` longtext DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `parentNamePrefix` varchar(20) DEFAULT NULL,
  `parentFirstName` varchar(100) DEFAULT NULL,
  `parentLastName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homevisits`
--

INSERT INTO `homevisits` (`id`, `teacherId`, `studentId`, `updatedBy`, `visitDate`, `familyStatus`, `visitPurpose`, `studentBehaviorAtHome`, `parentCooperation`, `problems`, `recommendations`, `followUpPlan`, `summary`, `notes`, `imagePath`, `imageGallery`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `parentNamePrefix`, `parentFirstName`, `parentLastName`) VALUES
(17, 5, 307, 1, '2026-02-16', 'บิดามารดาแยกกันอยู่', 'ติดตามพฤติกรรมนักเรียน', 'เชื่อฟังผู้ปกครอง', 'ดูแลนักเรียนดี ', 'สภาพแวดล้อม', 'การดูแลสุขภาพยาย', 'ประชุมผู้ปกครองครั้งหน้า', 'นักเรียนอยู่กับยาย 2 คน ครอบครัวมาเยี่ยมบ่อยๆ', NULL, '/uploads/homevisits/homevisit-1771239170420-655617260-57304338512711595214839635733269281060961722njpg.jpg', '[\"/uploads/homevisits/homevisit-1771239170429-693154165-54551263912278663658132793123133161611918521njpg.jpg\"]', '2026-02-16 02:52:50', '2026-02-16 02:52:50', 0, NULL, 'นาง', 'มาลี', 'รักธรรม'),
(18, 5, 307, 1, '2026-02-16', 'บิดามารดาแยกกันอยู่', 'ติดตามพฤติกรรมนักเรียน', NULL, NULL, NULL, NULL, 'โทรศัพท์สอบถาม', 'ดี', NULL, '/uploads/homevisits/homevisit-1771243314351-810589115-jpg.jpg', NULL, '2026-02-16 04:01:54', '2026-02-16 04:01:54', 0, NULL, 'นาง', 'มาลี', 'รักธรรม'),
(19, 5, 307, 1, '2026-02-24', 'บิดามารดาแยกกันอยู่', 'ติดตามพฤติกรรมนักเรียน, สร้างความสัมพันธ์กับผู้ปกครอง, ให้คำแนะนำ', 'เชื่อฟังผู้ปกครอง', 'ช่วยเหลือนักเรียนดี', 'นักเรียนติดเล่นโทรศัพท์', 'ให้นักเรียนแบ่งเบาภาระยาย', 'ประชุมผู้ปกครองครั้งถัดไป', 'ความสัมพันธ์ในครอบครัวดี', NULL, '/uploads/homevisits/homevisit-1771921480569-261978053-jpg.jpg', NULL, '2026-02-24 01:24:40', '2026-02-24 01:24:40', 0, NULL, 'นาง', 'พิสมัย', 'อารมณ์ดี'),
(20, 5, 311, 9, '2026-02-24', 'บิดามารดาอยู่ด้วยกัน', 'ติดตามพฤติกรรมนักเรียน, สร้างความสัมพันธ์กับผู้ปกครอง', 'ช่วยงานบ้านอย่างดี', 'พร้อมช่วยเหลือลูก', 'การเดินทางไม่สะดวก', 'ให้นักเรียนช่วยแบ่งเบาภาระพ่อแม่มากขึ้น', 'ประชุมผู้ปกครองครั้งหน้า', 'ครอบครัวมีความสัมพันธ์ที่ดี', NULL, '/uploads/homevisits/homevisit-1771934280946-243110943-cocjpg.jpg', NULL, '2026-02-24 04:58:00', '2026-02-24 04:58:00', 0, NULL, 'นาง', 'มะลิวัลย์', 'รักดี'),
(21, 4, 351, 8, '2026-03-15', NULL, 'ติดตามพฤติกรรมนักเรียน', NULL, NULL, NULL, NULL, NULL, 'ส', NULL, '/uploads/homevisits/homevisit-1773612722469-956223944-aespajpg.jpg', NULL, '2026-03-15 15:12:02', '2026-03-15 15:12:02', 0, NULL, 'นาย', 'ชัย', 'นี'),
(22, 5, 307, 9, '2026-03-17', 'บิดามารดาแยกกันอยู่', 'ติดตามพฤติกรรมนักเรียน, สร้างความสัมพันธ์กับผู้ปกครอง', NULL, NULL, NULL, '-', NULL, 'ดี', NULL, '/uploads/homevisits/homevisit-1773761885651-953754805-b78f3c90253a11ea96b9fb57831f8879originaljpg.jpg', NULL, '2026-03-17 08:38:05', '2026-03-17 08:38:05', 0, NULL, 'นาง', 'สนิท', 'ยะสุนทร');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_requests`
--

CREATE TABLE `password_reset_requests` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `requestedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `resolvedAt` timestamp NULL DEFAULT NULL,
  `resolvedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_requests`
--

INSERT INTO `password_reset_requests` (`id`, `userId`, `status`, `requestedAt`, `resolvedAt`, `resolvedBy`) VALUES
(1, 16, 'approved', '2026-02-27 08:18:41', '2026-02-27 08:19:44', NULL),
(2, 16, 'approved', '2026-02-27 08:21:22', '2026-02-27 08:21:45', NULL),
(3, 9, 'approved', '2026-02-28 04:00:42', '2026-02-28 04:01:17', NULL),
(4, 8, 'rejected', '2026-03-15 15:36:19', '2026-03-15 15:42:07', 1),
(5, 9, 'rejected', '2026-03-17 07:56:59', '2026-03-17 08:04:20', 1),
(6, 9, 'approved', '2026-03-17 08:10:24', '2026-03-17 08:12:28', 1);

-- --------------------------------------------------------

--
-- Table structure for table `school_info`
--

CREATE TABLE `school_info` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'โรงเรียนท่าบ่อพิทยาคม',
  `location` text DEFAULT NULL,
  `foundedDate` varchar(50) DEFAULT NULL,
  `currentDirector` varchar(255) DEFAULT NULL,
  `education_level` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `heroImage` varchar(500) DEFAULT NULL,
  `director_image` varchar(500) DEFAULT NULL,
  `director_quote` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `deletedBy` int(11) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `facebookUrl` varchar(500) DEFAULT NULL,
  `facebookName` varchar(255) DEFAULT NULL,
  `officeHoursClose` varchar(10) DEFAULT NULL,
  `officeHoursOpen` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `school_info`
--

INSERT INTO `school_info` (`id`, `name`, `location`, `foundedDate`, `currentDirector`, `education_level`, `department`, `description`, `heroImage`, `director_image`, `director_quote`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`, `deletedAt`, `deletedBy`, `phone`, `email`, `facebookUrl`, `facebookName`, `officeHoursClose`, `officeHoursOpen`) VALUES
(1, 'โรงเรียนท่าบ่อพิทยาคม', '270 หมู่ 9 ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย 43110', '1991-05-14', 'นายชำนาญวิทย์ ประเสริฐ', 'มัธยมศึกษาปีที่ 1-6', 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21', 'โรงเรียนท่าบ่อพิทยาคม เป็นโรงเรียนมัธยมศึกษาประจำตำบลกองนาง สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ เริ่มเปิดเรียนเมื่อวันที่ 14 พฤษภาคม 2534  โดยมีนายประพันธ์  พรหมกูล  เป็นผู้ดูแล  โดยขอใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขา เป็นสถานที่เรียนชั่วคราว และมีนักเรียน ทั้งหมด 86 คน จำนวน  2  ห้องเรียน\nต่อมาได้ย้ายมาอยู่  ณ บริเวณที่สาธารณประโยชน์ หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย และที่ดินบริจาค จากคุณยายแก่นคำ  มั่งมูล, คุณแม่สุบิน น้อยโสภา  และคุณพ่อสุพล  น้อยโสภา  จำนวน 4.5  ไร่ รวมจำนวนที่ดินทั้งสิ้นประมาณ 65 ไร่ โดยได้รับงบประมาณในการสร้างอาคารจากกรมสามัญศึกษา  กระทรวงศึกษาธิการ  \nเมื่อวันที่ 26 กุมภาพันธ์ 2535 ได้รับประกาศจัดตั้งเป็นเอกเทศ  โดยใช้ชื่อว่า “โรงเรียนท่าบ่อพิทยาคม” กรมสามัญศึกษาได้แต่งตั้งให้ นายศิริ  เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ  อ.ท่าบ่อ  จ.หนองคาย มารักษาการในตำแหน่งครูใหญ่ ในปีงบประมาณ 2545  ได้รับจัดสรรงบประมาณจากกรมสามัญศึกษา ให้จัดสร้างอาคารเรียนแบบกึ่งถาวร  1  หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง  1  หลัง ในวันที่ 7 กรกฎาคม 2546 โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1  สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน กระทรวงศึกษาธิการ ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ.2546 และในวันที่ 23  กรกฎาคม  2553  \nโรงเรียนท่าบ่อพิทยาคม  เปลี่ยนมาสังกัด สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21  ตาม พ.ร.บ.การศึกษาแห่งชาติ (ฉบับที่ 3) พ.ร.บ.ระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3) และ พ.ร.บ.ระเบียบข้าราชการครูและบุคลากรทางการศึกษา (ฉบับที่ 3) ซึ่งได้มีการประกาศในราชกิจจานุเบกษา เมื่อวันที่  22 กรกฎาคม 2553 และมีผลบังคับใช้ ตั้งแต่วันที่ 23 กรกฎาคม 2553  ปัจจุบันมี นายชำนาญวิทย์ ประเสริฐ เป็นผู้อำนวยการโรงเรียน', 'http://localhost:5000/uploads/blogs/thabo_school-1773148162972-119902335.jpg', 'http://www.thabopit.com/_files_school/43100510/person/43100510_0_20241104-160235.jpg', 'โรงเรียนท่าบ่อพิทยาคมมุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม มีทักษะที่จำเป็นในศตวรรษที่ 21 และเป็นพลเมืองที่ดีของสังคม', '2025-08-07 02:05:18', '2025-09-17 19:10:28', 0, 1, 0, NULL, NULL, '081 975 5413', 'thabopittayakom@gmail.com', 'https://share.google/tQKd27N8IIYcNqQT1', 'ประชาสัมพันธ์โรงเรียนท่าบ่อพิทยาคม', '16:30', '08:00');

-- --------------------------------------------------------

--
-- Table structure for table `school_timeline`
--

CREATE TABLE `school_timeline` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `date` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `deletedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `school_timeline`
--

INSERT INTO `school_timeline` (`id`, `year`, `date`, `title`, `description`, `sortOrder`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`, `deletedAt`, `deletedBy`) VALUES
(1, 1991, '1991-05-14', 'เปิดทำการเรียนการสอนเป็นครั้งแรก', 'เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว มีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน', 1, '2025-08-07 02:05:18', '2025-09-17 20:07:57', 0, 1, 0, NULL, 0),
(2, 2001, '2001-12-31', 'จัดตั้งเป็นเอกเทศ', 'โรงเรียนได้รับประกาศจัดตั้งเป็นเอกเทศ โดยใช้ชื่อว่า โรงเรียนท่าบ่อพิทยาคม และกรมสามัญศึกษาได้แต่งตั้งให้นายศิริ เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ มารักษาการในตำแหน่งครูใหญ่', 2, '2025-08-07 02:05:18', '2025-09-17 20:05:11', 0, 1, 0, NULL, 0),
(3, 2002, '2002-01-01', 'ก่อสร้างอาคารเรียน', 'โรงเรียนได้รับจัดสรรงบประมาณจากกรมสามัญศึกษาเพื่อสร้างอาคารเรียนแบบกึ่งถาวร 1 หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง 1 หลัง', 3, '2025-08-07 02:05:18', '2025-08-07 02:05:18', 0, 1, 0, NULL, 0),
(4, 2003, '2003-04-04', 'เปลี่ยนสังกัด', 'โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1 ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546', 4, '2025-08-07 02:05:18', '2025-08-27 03:49:56', 0, 1, 0, NULL, 0),
(5, 2010, '2010-05-15', 'สังกัดเขตพื้นที่การศึกษามัธยมศึกษา', 'โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 ตามพระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ 3) และพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3)', 5, '2025-08-07 02:05:18', '2025-08-07 02:05:18', 0, 1, 0, NULL, 0),
(6, 2025, '2025-04-17', 'การพัฒนาอย่างต่อเนื่อง', 'ปัจจุบัน โรงเรียนท่าบ่อพิทยาคมมีนายชำนาญวิทย์ ประเสริฐ ดำรงตำแหน่งผู้อำนวยการโรงเรียน และมีการพัฒนาอย่างต่อเนื่องเพื่อมุ่งสู่ความเป็นเลิศทางวิชาการ', 6, '2025-08-07 02:05:18', '2025-08-07 02:05:18', 0, 1, 0, NULL, 0),
(7, 2026, '2026-01-17', 'ทดสอบ', 'เทสสสส', 0, '2026-01-16 12:38:50', '2026-01-16 12:38:50', 1, 1, 1, '2026-01-16 12:40:30', 1),
(8, 2027, '2027-01-24', '455', '555', 0, '2026-01-16 12:49:27', '2026-01-16 12:49:27', 1, 1, 1, '2026-01-16 12:49:52', 1);

-- --------------------------------------------------------

--
-- Table structure for table `semesters`
--

CREATE TABLE `semesters` (
  `id` int(11) NOT NULL,
  `academicYearId` int(11) NOT NULL,
  `semesterNumber` tinyint(4) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `isCurrent` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `semesters`
--

INSERT INTO `semesters` (`id`, `academicYearId`, `semesterNumber`, `startDate`, `endDate`, `isCurrent`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
(1, 1, 1, '2023-05-16', '2023-10-15', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, NULL),
(2, 1, 2, '2023-10-16', '2024-05-15', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, NULL),
(3, 2, 1, '2024-05-16', '2024-10-15', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, NULL),
(4, 2, 2, '2024-10-16', '2025-05-15', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, NULL),
(5, 3, 1, '2025-05-16', '2025-10-24', 0, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, 1),
(6, 3, 2, '2025-10-24', '2026-04-04', 1, 1, '2026-01-16 09:30:03', '2026-01-16 09:30:03', NULL, 1),
(7, 4, 1, '2026-05-11', '2026-11-05', 0, 1, '2026-03-17 09:50:57', '2026-03-17 09:50:57', 1, 1),
(8, 4, 2, '2026-10-21', '2027-04-02', 0, 1, '2026-03-17 09:50:57', '2026-03-17 09:50:57', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `studentbehaviorscores`
--

CREATE TABLE `studentbehaviorscores` (
  `id` int(11) NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `comments` text DEFAULT NULL,
  `recorderId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studentbehaviorscores`
--

INSERT INTO `studentbehaviorscores` (`id`, `studentId`, `score`, `comments`, `recorderId`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 307, 10, 'ทำความดี', 1, '2026-03-04 00:43:29', '2026-03-04 00:43:29', 0, NULL, NULL),
(2, 308, 10, 'ทำความดี', 1, '2026-03-04 00:43:29', '2026-03-04 00:43:29', 0, NULL, NULL),
(3, 373, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(4, 376, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(5, 378, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(6, 377, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(7, 381, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(8, 382, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(9, 371, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(10, 379, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(11, 380, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(12, 374, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(13, 372, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(14, 383, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(15, 370, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(16, 375, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(17, 385, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(18, 384, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(19, 386, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(20, 388, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(21, 387, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(22, 389, 5, 'นักเรียนช่วยเหลืองานกิจกรรมโรงเรียน', 1, '2026-03-04 00:47:53', '2026-03-04 00:47:53', 0, NULL, NULL),
(23, 319, 10, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-09 01:21:40', 0, NULL, 1),
(24, 308, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(25, 307, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(26, 316, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-10 13:38:17', 0, NULL, 1),
(27, 314, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(28, 320, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(29, 313, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(30, 315, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(31, 318, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(32, 321, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(33, 317, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(34, 310, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(35, 309, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(36, 322, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(37, 311, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(38, 323, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(39, 312, 5, 'ทำความดี', 1, '2026-03-04 03:31:30', '2026-03-04 03:31:30', 0, NULL, NULL),
(40, 453, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(41, 449, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(42, 458, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(43, 450, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(44, 455, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(45, 459, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(46, 457, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(47, 451, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(48, 456, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(49, 454, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(50, 452, 5, 'ดูแลห้องเรียนสะอาดเรียบร้อยทั้งสัปดาห์', 1, '2026-03-10 15:50:45', '2026-03-10 15:50:45', 0, NULL, NULL),
(51, 348, -5, 'มาโรงเรียนสาย แต่งกายผิดระเบียบ', 1, '2026-03-10 18:12:08', '2026-03-10 18:12:08', 1, '2026-03-10 18:22:10', NULL),
(52, 372, -5, 'มาโรงเรียนสาย แต่งกายผิดระเบียบ', 1, '2026-03-10 18:12:50', '2026-03-10 18:12:50', 0, NULL, NULL),
(53, 348, -5, 'มาสาย/แต่งกายผิดระเบียบ/เสียงดัง/ห้องสกปรก/พูดจาหยาบคาย/ทานอาหารในเวลาเรียน', 1, '2026-03-10 18:22:10', '2026-03-10 18:22:10', 1, '2026-03-10 18:22:26', NULL),
(54, 348, 5, 'รักษาความสะอาด/เก็บของที่มีราคาไม่เกิน 50 บาท/ช่วยเหลือครูหรือคนอื่นเสมอ/เป็นตัวแทนเข้าร่วมแข่งขันระดับ ร.ร.', 1, '2026-03-10 18:22:26', '2026-03-10 18:22:26', 0, NULL, NULL),
(55, 348, -5, 'มาสาย/แต่งกายผิดระเบียบ', 1, '2026-03-10 19:36:43', '2026-03-10 19:36:43', 0, NULL, NULL),
(56, 348, 5, 'ช่วยเหลือครูยกของ เก็บขยะ', 1, '2026-03-10 19:48:27', '2026-03-10 19:48:27', 0, NULL, NULL),
(57, 402, 10, 'ช่วยเหลือกิจกรรมโรงเรียน', 1, '2026-03-10 19:58:26', '2026-03-10 19:58:26', 0, NULL, NULL),
(58, 307, 5, 'รักษาความสะอาด เก็บขยะหน้าชั้นเรียน', 9, '2026-03-11 18:52:59', '2026-03-11 18:52:59', 0, NULL, NULL),
(59, 307, 5, 'รักษาความสะอาด เก็บขยะหน้าชั้นเรียน', 9, '2026-03-11 19:01:30', '2026-03-11 19:01:30', 0, NULL, NULL),
(60, 307, -5, 'แต่งกายผิดระเบียบไม่เรียบร้อย', 9, '2026-03-11 19:02:18', '2026-03-11 19:02:18', 0, NULL, NULL),
(61, 343, 5, 'รักษาความสะอาด เก็บขยะ', 7, '2026-03-11 19:04:03', '2026-03-11 19:04:03', 0, NULL, NULL),
(62, 391, -10, 'ขาดเรียนเกิน 3 วัน', 11, '2026-03-11 19:08:24', '2026-03-11 19:08:24', 0, NULL, NULL),
(63, 449, 10, 'ช่วยเหลือกิจกรรม ร.ร.', 12, '2026-03-11 19:10:23', '2026-03-11 19:10:23', 0, NULL, NULL),
(64, 307, -5, 'มาโรงเรียนสาย', 9, '2026-03-17 08:32:12', '2026-03-17 11:25:11', 1, '2026-03-17 11:27:35', 1);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `namePrefix` varchar(10) DEFAULT NULL,
  `genderId` int(11) NOT NULL,
  `studentNumber` int(11) DEFAULT NULL,
  `guardianRelation` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `disease` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `guardianFirstName` varchar(100) DEFAULT NULL,
  `guardianLastName` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emergencyContact` varchar(20) DEFAULT NULL,
  `guardianMonthlyIncome` varchar(50) DEFAULT NULL,
  `guardianOccupation` varchar(100) DEFAULT NULL,
  `homeroomClassId` int(11) DEFAULT NULL,
  `houseMaterial` varchar(200) DEFAULT NULL,
  `houseType` varchar(100) DEFAULT NULL,
  `studyArea` varchar(100) DEFAULT NULL,
  `utilities` text DEFAULT NULL,
  `guardianNamePrefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `namePrefix`, `genderId`, `studentNumber`, `guardianRelation`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `dob`, `nationality`, `weight`, `height`, `disease`, `phoneNumber`, `firstName`, `lastName`, `guardianFirstName`, `guardianLastName`, `address`, `emergencyContact`, `guardianMonthlyIncome`, `guardianOccupation`, `homeroomClassId`, `houseMaterial`, `houseType`, `studyArea`, `utilities`, `guardianNamePrefix`) VALUES
(1, 'เด็กชาย', 1, NULL, 'มารดา', '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, '2013-02-27', NULL, NULL, NULL, NULL, NULL, 'เกรียงศักดิ์', 'ยะสุนทร', 'วิลัย', 'มณีวรรณ', '211/6 ซ.3 ต.พานพร้าว อ.หนองแวง จ.หนองคาย', '0886893452', '', 'ข้าราชการครู', NULL, NULL, NULL, NULL, NULL, 'นาง'),
(2, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จิรายุทธ', 'เวทไธสง', 'สมชาติ', 'รักธรรม', '142 หมู่4 ต.พานพร้าว อ.หนองแวง จ.หนองคาย', '0876358725', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จีรภัทร', 'วงษ์บุญจันทร์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชูศักดิ์', 'ศรีพุทธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐยศ', 'หาสอดส่อง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทวีทรัพย์', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทองขัน', 'พรมภักดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นราธิป', 'ปากมงคล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มังกร', 'ราชวงศ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ยอดศักดิ์', 'แก้วอาษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เรืองทรัพย์', 'ชัยปัญญา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วีระกร', 'เข็มเพชร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กุลวรินทร์', 'ดวงแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชลธิชา', 'แก้วทะชาติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธัญญรัศม์', 'ถิ่นพลวัว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธัญพิชชา', 'ฤทธิมาร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ลลิตา', 'แสงราม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุเชาว์', 'สัพโส', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชญานิน', 'เอมวงษ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธนวัฒน์', 'จริงวาจา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นตพล', 'โคตรสุโน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปติกรณ์', 'มูลวงศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปิยะพงษ์', 'ศรีอ้วน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พุฒิพงษ์', 'ยี่รัมย์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วรวุฒิ', 'เหล่าชัย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศราวุธ', 'สีอ่อน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สันติราษฏร์', 'พิทักษ์ไตรรัตน์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อดิเทพ', 'กุลชรน้อย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อธิป', 'แก่นท้าว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อนุพงษ์', 'ไชยจันพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อิทธิพัทธ์', 'ถิ่นทัพไทย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปวีณ์ธิดา', 'เข็มพรมมา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฟ้ารุ่ง', 'เพียปัญญา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มัทนาพร', 'วงค์บุตรศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศศิวิมล', 'บุตรพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'งามพิศศรี', 'ไชยสวาสดิ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นันทิตา', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ไกรวิทย์', 'สานชุม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทัศนพงษ์', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปกป้อง', 'มายัง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปฏิภัทร', 'บุญตาฤทธิ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภาณุมาศ', 'เข็มเพชร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วิษณุ', 'ชัยวรรณ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชุติกาญจน์', 'วงษ์โยธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐณิชา', 'บันดิษฐ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'บัณฑิตา', 'แก้วมุงคุณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เบญญาภา', 'วิเศษจินดาคุณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วิลาสินี', 'ถาราช', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'คณิศร', 'ทองนิโรจน์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชวนกร', 'ประพุทธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธนาวัฒน์', 'ดีขยัน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พงศธร', 'สร้างสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศรัณย์ภัทร', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อโณทัย', 'สิงห์ทุย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จิรนันท์', 'ทูลฉลอง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชนาธิป', 'แฟนพิมาย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรนภา', 'ศิริแก้วเลิศ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรภิมล', 'ปากมงคล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พัชราภา', 'คำทวี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศรัณย์พร', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(61, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิรินาฎ', 'สีดาเดช', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภูวนารถ', 'คำตุ้ย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ครสวรรค์', 'พรมภักดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐวัฒน์', 'บ่าพิมาย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กฤษณพงษ์', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชวกร', 'ลุนรักษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐพงศ์', 'สระแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นิธิ', 'ศิลาโล่ห์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พงษ์ณุกร', 'จันสมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:03', '2026-01-16 02:30:03', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภาณุวัฒน์', 'ปุระศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภูวดล', 'ปลัดพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศุภวิชย์', 'ศรีษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุเมธ', 'ปานิคม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อิสระภาพ', 'นามวิชัย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เกศรา', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(76, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชุติมา', 'วงศ์อ่อน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธนัชชา', 'นามภักดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรมนัส', 'โสมนัส', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พัสนันท์', 'บ้านกลาง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พิมพ์พา', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(81, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รัตนาพร', 'ภูธร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุทธิดา', 'โอกาสวิไล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุภัสสร', 'สุดจิตร์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฉัตรพร', 'กำแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธีรนัย', 'แก้วมุงคุณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธีรศักดิ์', 'จันทร์ดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(87, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภานุวัฒน์', 'คณิกา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(88, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วิษณุ', 'สายสุนา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(89, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วีรพงษ์', 'กองสุวรรณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(90, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อติเทพ', 'พุทธะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(91, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อนุพงษ์', 'บุญเหลือ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(92, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จันทร์จิรา', 'บทมาตย์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(93, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธารทอง', 'สุดแสง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(94, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มัทธนา', 'มุลวงศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(95, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เมษา', 'วงษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(96, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิรดา', 'พรมสมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(97, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธราเทพ', 'คุณความดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(98, 'เด็กชาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รัฐพล', 'อุสสิทธิ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(99, 'เด็กหญิง', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรทิวา', 'คำภูมี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(100, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชนกานต์', 'นามมัน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(101, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นฤชัย', 'ชื่นจะโปะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(102, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปรัชญา', 'งามสง่า', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(103, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อโณทัย', 'หาญวงค์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(104, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อดิศรา', 'โคตรโสภา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(105, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อธิวรา', 'ทิพย์สมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(106, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อนุวัต', 'นารีจันทร์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(107, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กมลทิพย์', 'ชัยปัญหา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(108, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดรุณี', 'ทัดสบง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(109, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปนัดดา', 'โสนันทะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(110, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปาริตา', 'ฆ้องเกิด', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(111, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุพัตรา', 'วรวิเวศ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(112, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กรวิญช์', 'หงส์เอก', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(113, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อำนาจ', 'แก้วศรีขาว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(114, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พิชามญชุ์', 'นามพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(115, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วสุธิดา', 'วงษาเทพ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(116, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิริลักษณ์', 'ศรีวิลัย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(117, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศุภธิดา', 'คุณกะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(118, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปาณิศา', 'ฝ้ายสีงาม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(119, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปิยรัตน์', 'เพชรพันธ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(120, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ร่มเกล้า', 'ธรรมรังศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(121, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐวัฒน์', 'ภาษี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เอกภาพ', 'มงคล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(123, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฐิติภัทร', 'ศรีภา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(124, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จีรยุทธ', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(125, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปฏิมา', 'ภูธร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(126, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กิตติยา', 'คิดเล็ก', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(127, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'น้ำฟ้า', 'เดชศร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(128, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดวงเดือน', 'ทะศิริ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กัญญาพร', 'จันทร์ตระกูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กันยารัตน์', 'มิ่งขุนทด', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(131, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จิตรวิไล', 'ผิวเงิน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(132, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิรินภา', 'เทวงศา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(133, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดาราวดี', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(134, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ถิรวัฒน์', 'ดวงดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(135, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จักรกฤษณ์', 'แก้วตา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(136, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดวงกมล', 'นรสาร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(137, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิราธร', 'คุณความดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(138, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มนัสนันท์', 'แสงโชติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(139, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'น้ำฝน', 'สีหาวงค์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(140, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กัณธิมา', 'เข็มสีดา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(141, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มาฆวัณ', 'แก้วสอนดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(142, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รักษมันท์', 'มหาวัน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชิตพล', 'บุตรโยธี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปิยะวัฒน์', 'นวลคำสิงห์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, 'นาย', 1, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รัฐภูมิ', 'สีงาม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณิชา', 'โคตรโสภา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทับทิมทอง', 'สุดแสง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปานไพรินทร์', 'ชัยวรรรณ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เพชรรัตน์', 'บันดิษฐ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฟ้ารุ่ง', 'นวลคำสิงห์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(151, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศรัณยา', 'พันพิลา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อภิญญา', 'โยธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, 'นางสาว', 2, NULL, NULL, '2026-01-16 02:30:04', '2026-01-16 02:30:04', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศศิกานต์', 'ศิลปกิจวงษ์กุล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(154, 'เด็กชาย', 1, 10001, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เกรียงศักดิ์', 'ยะสุนทร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(155, 'เด็กชาย', 1, 10002, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จิรายุทธ', 'เวทไธสง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(156, 'เด็กชาย', 1, 10003, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จีรภัทร', 'วงษ์บุญจันทร์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(157, 'เด็กชาย', 1, 10004, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชูศักดิ์', 'ศรีพุทธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(158, 'เด็กชาย', 1, 10005, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐยศ', 'หาสอดส่อง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(159, 'เด็กชาย', 1, 10006, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทวีทรัพย์', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(160, 'เด็กชาย', 1, 10007, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทองขัน', 'พรมภักดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(161, 'เด็กชาย', 1, 10008, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นราธิป', 'ปากมงคล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(162, 'เด็กชาย', 1, 10009, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มังกร', 'ราชวงศ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(163, 'เด็กชาย', 1, 10010, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ยอดศักดิ์', 'แก้วอาษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(164, 'เด็กชาย', 1, 10011, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เรืองทรัพย์', 'ชัยปัญญา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(165, 'เด็กชาย', 1, 10012, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วีระกร', 'เข็มเพชร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(166, 'เด็กหญิง', 2, 10013, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กุลวรินทร์', 'ดวงแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(167, 'เด็กหญิง', 2, 10014, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชลธิชา', 'แก้วทะชาติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(168, 'เด็กหญิง', 2, 10015, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธัญญรัศม์', 'ถิ่นพลวัว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(169, 'เด็กหญิง', 2, 10016, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธัญพิชชา', 'ฤทธิมาร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(170, 'เด็กหญิง', 2, 10017, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ลลิตา', 'แสงราม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(171, 'เด็กชาย', 1, 10018, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุเชาว์', 'สัพโส', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(172, 'เด็กชาย', 1, 10019, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชญานิน', 'เอมวงษ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(173, 'เด็กชาย', 1, 10020, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธนวัฒน์', 'จริงวาจา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(174, 'เด็กชาย', 1, 10021, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นตพล', 'โคตรสุโน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(175, 'เด็กชาย', 1, 10022, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปติกรณ์', 'มูลวงศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(176, 'เด็กชาย', 1, 10023, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปิยะพงษ์', 'ศรีอ้วน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(177, 'เด็กชาย', 1, 10024, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พุฒิพงษ์', 'ยี่รัมย์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(178, 'เด็กชาย', 1, 10025, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วรวุฒิ', 'เหล่าชัย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(179, 'เด็กชาย', 1, 10026, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศราวุธ', 'สีอ่อน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(180, 'เด็กชาย', 1, 10027, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สันติราษฏร์', 'พิทักษ์ไตรรัตน์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(181, 'เด็กชาย', 1, 10028, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อดิเทพ', 'กุลชรน้อย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(182, 'เด็กชาย', 1, 10029, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อธิป', 'แก่นท้าว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(183, 'เด็กชาย', 1, 10030, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อนุพงษ์', 'ไชยจันพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(184, 'เด็กชาย', 1, 10031, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อิทธิพัทธ์', 'ถิ่นทัพไทย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(185, 'เด็กหญิง', 2, 10032, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปวีณ์ธิดา', 'เข็มพรมมา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(186, 'เด็กหญิง', 2, 10033, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฟ้ารุ่ง', 'เพียปัญญา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(187, 'เด็กหญิง', 2, 10034, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มัทนาพร', 'วงค์บุตรศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(188, 'เด็กหญิง', 2, 10035, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศศิวิมล', 'บุตรพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(189, 'เด็กหญิง', 2, 10036, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'งามพิศศรี', 'ไชยสวาสดิ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(190, 'เด็กหญิง', 2, 10037, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นันทิตา', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(191, 'เด็กชาย', 1, 10038, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ไกรวิทย์', 'สานชุม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(192, 'เด็กชาย', 1, 10039, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทัศนพงษ์', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(193, 'เด็กชาย', 1, 10040, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปกป้อง', 'มายัง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(194, 'เด็กชาย', 1, 10041, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปฏิภัทร', 'บุญตาฤทธิ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(195, 'เด็กชาย', 1, 10042, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภาณุมาศ', 'เข็มเพชร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(196, 'เด็กชาย', 1, 10043, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วิษณุ', 'ชัยวรรณ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(197, 'เด็กหญิง', 2, 10044, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชุติกาญจน์', 'วงษ์โยธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(198, 'เด็กหญิง', 2, 10045, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐณิชา', 'บันดิษฐ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(199, 'เด็กหญิง', 2, 10046, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'บัณฑิตา', 'แก้วมุงคุณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(200, 'เด็กหญิง', 2, 10047, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เบญญาภา', 'วิเศษจินดาคุณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(201, 'เด็กหญิง', 2, 10048, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วิลาสินี', 'ถาราช', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(202, 'เด็กชาย', 1, 10049, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'คณิศร', 'ทองนิโรจน์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(203, 'เด็กชาย', 1, 10050, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชวนกร', 'ประพุทธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(204, 'เด็กชาย', 1, 10051, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธนาวัฒน์', 'ดีขยัน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(205, 'เด็กชาย', 1, 10052, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พงศธร', 'สร้างสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(206, 'เด็กชาย', 1, 10053, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศรัณย์ภัทร', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(207, 'เด็กชาย', 1, 10054, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อโณทัย', 'สิงห์ทุย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(208, 'เด็กหญิง', 2, 10055, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จิรนันท์', 'ทูลฉลอง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(209, 'เด็กหญิง', 2, 10056, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชนาธิป', 'แฟนพิมาย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(210, 'เด็กหญิง', 2, 10057, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรนภา', 'ศิริแก้วเลิศ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(211, 'เด็กหญิง', 2, 10058, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรภิมล', 'ปากมงคล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(212, 'เด็กหญิง', 2, 10059, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พัชราภา', 'คำทวี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(213, 'เด็กหญิง', 2, 10060, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศรัณย์พร', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(214, 'เด็กหญิง', 2, 10061, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิรินาฎ', 'สีดาเดช', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(215, 'เด็กชาย', 1, 10062, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภูวนารถ', 'คำตุ้ย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(216, 'เด็กหญิง', 2, 10063, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ครสวรรค์', 'พรมภักดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(217, 'เด็กชาย', 1, 10064, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐวัฒน์', 'บ่าพิมาย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(218, 'เด็กชาย', 1, 10065, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กฤษณพงษ์', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(219, 'เด็กชาย', 1, 10066, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชวกร', 'ลุนรักษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(220, 'เด็กชาย', 1, 10067, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐพงศ์', 'สระแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(221, 'เด็กชาย', 1, 10068, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นิธิ', 'ศิลาโล่ห์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(222, 'เด็กชาย', 1, 10069, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พงษ์ณุกร', 'จันสมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `namePrefix`, `genderId`, `studentNumber`, `guardianRelation`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `dob`, `nationality`, `weight`, `height`, `disease`, `phoneNumber`, `firstName`, `lastName`, `guardianFirstName`, `guardianLastName`, `address`, `emergencyContact`, `guardianMonthlyIncome`, `guardianOccupation`, `homeroomClassId`, `houseMaterial`, `houseType`, `studyArea`, `utilities`, `guardianNamePrefix`) VALUES
(223, 'เด็กชาย', 1, 10070, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภาณุวัฒน์', 'ปุระศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(224, 'เด็กชาย', 1, 10071, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภูวดล', 'ปลัดพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(225, 'เด็กชาย', 1, 10072, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศุภวิชย์', 'ศรีษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(226, 'เด็กชาย', 1, 10073, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุเมธ', 'ปานิคม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(227, 'เด็กชาย', 1, 10074, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อิสระภาพ', 'นามวิชัย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(228, 'เด็กหญิง', 2, 10075, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เกศรา', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(229, 'เด็กหญิง', 2, 10076, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชุติมา', 'วงศ์อ่อน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(230, 'เด็กหญิง', 2, 10077, NULL, '2026-01-16 12:13:35', '2026-01-16 12:13:35', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธนัชชา', 'นามภักดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(231, 'เด็กหญิง', 2, 10078, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรมนัส', 'โสมนัส', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(232, 'เด็กหญิง', 2, 10079, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พัสนันท์', 'บ้านกลาง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(233, 'เด็กหญิง', 2, 10080, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พิมพ์พา', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(234, 'เด็กหญิง', 2, 10081, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รัตนาพร', 'ภูธร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(235, 'เด็กหญิง', 2, 10082, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุทธิดา', 'โอกาสวิไล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(236, 'เด็กหญิง', 2, 10083, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุภัสสร', 'สุดจิตร์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(237, 'เด็กชาย', 1, 10084, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฉัตรพร', 'กำแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(238, 'เด็กชาย', 1, 10085, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธีรนัย', 'แก้วมุงคุณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(239, 'เด็กชาย', 1, 10086, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธีรศักดิ์', 'จันทร์ดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(240, 'เด็กชาย', 1, 10087, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ภานุวัฒน์', 'คณิกา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(241, 'เด็กชาย', 1, 10088, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วิษณุ', 'สายสุนา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(242, 'เด็กชาย', 1, 10089, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วีรพงษ์', 'กองสุวรรณ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(243, 'เด็กชาย', 1, 10090, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อติเทพ', 'พุทธะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(244, 'เด็กชาย', 1, 10091, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อนุพงษ์', 'บุญเหลือ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(245, 'เด็กหญิง', 2, 10092, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จันทร์จิรา', 'บทมาตย์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(246, 'เด็กหญิง', 2, 10093, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธารทอง', 'สุดแสง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(247, 'เด็กหญิง', 2, 10094, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มัทธนา', 'มุลวงศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(248, 'เด็กหญิง', 2, 10095, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เมษา', 'วงษา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(249, 'เด็กหญิง', 2, 10096, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิรดา', 'พรมสมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(250, 'เด็กชาย', 1, 10097, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ธราเทพ', 'คุณความดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(251, 'เด็กชาย', 1, 10098, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รัฐพล', 'อุสสิทธิ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(252, 'เด็กหญิง', 2, 10099, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พรทิวา', 'คำภูมี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(253, 'นาย', 1, 10100, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชนกานต์', 'นามมัน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(254, 'นาย', 1, 10101, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'นฤชัย', 'ชื่นจะโปะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(255, 'นาย', 1, 10102, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปรัชญา', 'งามสง่า', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(256, 'นาย', 1, 10103, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อโณทัย', 'หาญวงค์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(257, 'นาย', 1, 10104, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อดิศรา', 'โคตรโสภา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(258, 'นาย', 1, 10105, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อธิวรา', 'ทิพย์สมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(259, 'นาย', 1, 10106, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อนุวัต', 'นารีจันทร์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(260, 'นางสาว', 2, 10107, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กมลทิพย์', 'ชัยปัญหา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(261, 'นางสาว', 2, 10108, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดรุณี', 'ทัดสบง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(262, 'นางสาว', 2, 10109, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปนัดดา', 'โสนันทะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(263, 'นางสาว', 2, 10110, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปาริตา', 'ฆ้องเกิด', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(264, 'นางสาว', 2, 10111, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'สุพัตรา', 'วรวิเวศ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(265, 'นาย', 1, 10112, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กรวิญช์', 'หงส์เอก', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(266, 'นาย', 1, 10113, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อำนาจ', 'แก้วศรีขาว', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(267, 'นางสาว', 2, 10114, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'พิชามญชุ์', 'นามพรม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(268, 'นางสาว', 2, 10115, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'วสุธิดา', 'วงษาเทพ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(269, 'นางสาว', 2, 10116, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิริลักษณ์', 'ศรีวิลัย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(270, 'นางสาว', 2, 10117, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศุภธิดา', 'คุณกะ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(271, 'นางสาว', 2, 10118, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปาณิศา', 'ฝ้ายสีงาม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(272, 'นางสาว', 2, 10119, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปิยรัตน์', 'เพชรพันธ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(273, 'นาย', 1, 10120, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ร่มเกล้า', 'ธรรมรังศรี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(274, 'นาย', 1, 10121, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณัฐวัฒน์', 'ภาษี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(275, 'นาย', 1, 10122, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เอกภาพ', 'มงคล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(276, 'นาย', 1, 10123, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฐิติภัทร', 'ศรีภา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(277, 'นาย', 1, 10124, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จีรยุทธ', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(278, 'นางสาว', 2, 10125, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปฏิมา', 'ภูธร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(279, 'นางสาว', 2, 10126, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กิตติยา', 'คิดเล็ก', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(280, 'นางสาว', 2, 10127, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'น้ำฟ้า', 'เดชศร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(281, 'นางสาว', 2, 10128, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดวงเดือน', 'ทะศิริ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(282, 'นางสาว', 2, 10129, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กัญญาพร', 'จันทร์ตระกูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(283, 'นางสาว', 2, 10130, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กันยารัตน์', 'มิ่งขุนทด', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(284, 'นางสาว', 2, 10131, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จิตรวิไล', 'ผิวเงิน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(285, 'นางสาว', 2, 10132, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิรินภา', 'เทวงศา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(286, 'นางสาว', 2, 10133, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดาราวดี', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(287, 'นาย', 1, 10134, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ถิรวัฒน์', 'ดวงดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(288, 'นาย', 1, 10135, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'จักรกฤษณ์', 'แก้วตา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(289, 'นางสาว', 2, 10136, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ดวงกมล', 'นรสาร', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(290, 'นางสาว', 2, 10137, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศิราธร', 'คุณความดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(291, 'นางสาว', 2, 10138, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มนัสนันท์', 'แสงโชติ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(292, 'นางสาว', 2, 10139, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'น้ำฝน', 'สีหาวงค์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(293, 'นางสาว', 2, 10140, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'กัณธิมา', 'เข็มสีดา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(294, 'นาย', 1, 10141, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'มาฆวัณ', 'แก้วสอนดี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(295, 'นางสาว', 2, 10142, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รักษมันท์', 'มหาวัน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(296, 'นาย', 1, 10143, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ชิตพล', 'บุตรโยธี', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(297, 'นาย', 1, 10144, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปิยะวัฒน์', 'นวลคำสิงห์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(298, 'นาย', 1, 10145, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'รัฐภูมิ', 'สีงาม', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(299, 'นางสาว', 2, 10146, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ณิชา', 'โคตรโสภา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(300, 'นางสาว', 2, 10147, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ทับทิมทอง', 'สุดแสง', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(301, 'นางสาว', 2, 10148, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ปานไพรินทร์', 'ชัยวรรรณ์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(302, 'นางสาว', 2, 10149, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'เพชรรัตน์', 'บันดิษฐ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(303, 'นางสาว', 2, 10150, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ฟ้ารุ่ง', 'นวลคำสิงห์', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(304, 'นางสาว', 2, 10151, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศรัณยา', 'พันพิลา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(305, 'นางสาว', 2, 10152, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'อภิญญา', 'โยธา', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(306, 'นางสาว', 2, 10153, NULL, '2026-01-16 12:13:36', '2026-01-16 12:13:36', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ศศิกานต์', 'ศิลปกิจวงษ์กุล', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(307, 'เด็กชาย', 1, 10001, 'ยาย', '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, 1, NULL, 'ไทย', NULL, NULL, NULL, '0886893452', 'เกรียงศักดิ์', 'ยะสุนทร', NULL, NULL, '211/6 ซ.3 ม.3 ต.พานพร้าว อ.หนองแวง จ.หนองคาย', '0886893452', '10000-20000', 'ค้าขาย', 1, 'ไม้ผสมคอนกรีต', 'บ้านเดี่ยว', 'ไม่มีพื้นที่เฉพาะ, มีสิ่งรบกวนเยอะ', 'ไฟฟ้า, ประปา, ห้องน้ำในบ้าน, อินเทอร์เน็ต', NULL),
(308, 'เด็กชาย', 1, 10002, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จิรายุทธ', 'เวทไธสง', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(309, 'เด็กชาย', 1, 10003, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จีรภัทร', 'วงษ์บุญจันทร์', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(310, 'เด็กชาย', 1, 10004, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชูศักดิ์', 'ศรีพุทธา', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(311, 'เด็กชาย', 1, 10005, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, '0889618592', 'ณัฐยศ', 'หาสอดส่อง', NULL, NULL, '122 ซอย6 หมู่4 ต.พานพร้าว อ.หนองแวง จ.หนองคาย', '0889618592', '10000-20000', 'ธุรกิจส่วนตัว', 1, 'คอนกรีต/อิฐ', 'บ้านเดี่ยว', 'ไม่มีพื้นที่เฉพาะ', 'ไฟฟ้า, ประปา, ห้องน้ำในบ้าน, อินเทอร์เน็ต', NULL),
(312, 'เด็กชาย', 1, 10006, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ทวีทรัพย์', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(313, 'เด็กชาย', 1, 10007, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ทองขัน', 'พรมภักดี', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(314, 'เด็กชาย', 1, 10008, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'นราธิป', 'ปากมงคล', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(315, 'เด็กชาย', 1, 10009, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'มังกร', 'ราชวงศ์', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(316, 'เด็กชาย', 1, 10010, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ยอดศักดิ์', 'แก้วอาษา', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(317, 'เด็กชาย', 1, 10011, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'เรืองทรัพย์', 'ชัยปัญญา', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(318, 'เด็กชาย', 1, 10012, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วีระกร', 'เข็มเพชร', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(319, 'เด็กหญิง', 2, 10013, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กุลวรินทร์', 'ดวงแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(320, 'เด็กหญิง', 2, 10014, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชลธิชา', 'แก้วทะชาติ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(321, 'เด็กหญิง', 2, 10015, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธัญญรัศม์', 'ถิ่นพลวัว', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(322, 'เด็กหญิง', 2, 10016, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธัญพิชชา', 'ฤทธิมาร', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(323, 'เด็กหญิง', 2, 10017, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ลลิตา', 'แสงราม', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL),
(324, 'เด็กชาย', 1, 10018, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'สุเชาว์', 'สัพโส', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(325, 'เด็กชาย', 1, 10019, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชญานิน', 'เอมวงษ์', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(326, 'เด็กชาย', 1, 10020, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธนวัฒน์', 'จริงวาจา', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(327, 'เด็กชาย', 1, 10021, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'นตพล', 'โคตรสุโน', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(328, 'เด็กชาย', 1, 10022, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปติกรณ์', 'มูลวงศรี', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(329, 'เด็กชาย', 1, 10023, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปิยะพงษ์', 'ศรีอ้วน', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(330, 'เด็กชาย', 1, 10024, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พุฒิพงษ์', 'ยี่รัมย์', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(331, 'เด็กชาย', 1, 10025, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วรวุฒิ', 'เหล่าชัย', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(332, 'เด็กชาย', 1, 10026, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศราวุธ', 'สีอ่อน', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(333, 'เด็กชาย', 1, 10027, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'สันติราษฏร์', 'พิทักษ์ไตรรัตน์', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(334, 'เด็กชาย', 1, 10028, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อดิเทพ', 'กุลชรน้อย', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(335, 'เด็กชาย', 1, 10029, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อธิป', 'แก่นท้าว', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(336, 'เด็กชาย', 1, 10030, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อนุพงษ์', 'ไชยจันพรม', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(337, 'เด็กชาย', 1, 10031, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อิทธิพัทธ์', 'ถิ่นทัพไทย', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(338, 'เด็กหญิง', 2, 10032, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปวีณ์ธิดา', 'เข็มพรมมา', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(339, 'เด็กหญิง', 2, 10033, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ฟ้ารุ่ง', 'เพียปัญญา', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(340, 'เด็กหญิง', 2, 10034, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'มัทนาพร', 'วงค์บุตรศรี', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(341, 'เด็กหญิง', 2, 10035, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศศิวิมล', 'บุตรพรม', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(342, 'เด็กหญิง', 2, 10036, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'งามพิศศรี', 'ไชยสวาสดิ์', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(343, 'เด็กหญิง', 2, 10037, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'นันทิตา', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL),
(344, 'เด็กชาย', 1, 10038, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ไกรวิทย์', 'สานชุม', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(345, 'เด็กชาย', 1, 10039, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ทัศนพงษ์', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(346, 'เด็กชาย', 1, 10040, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปกป้อง', 'มายัง', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(347, 'เด็กชาย', 1, 10041, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปฏิภัทร', 'บุญตาฤทธิ์', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(348, 'เด็กชาย', 1, 10042, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ภาณุมาศ', 'เข็มเพชร', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(349, 'เด็กชาย', 1, 10043, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วิษณุ', 'ชัยวรรณ์', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(350, 'เด็กหญิง', 2, 10044, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชุติกาญจน์', 'วงษ์โยธา', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(351, 'เด็กหญิง', 2, 10045, 'ลุง', '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ณัฐณิชา', 'บันดิษฐ', NULL, NULL, 'สส', NULL, NULL, NULL, 3, 'สังกะสี/วัสดุชั่วคราว', 'อาศัยกับญาติ', 'มีแสงสว่างเพียงพอ', 'อินเทอร์เน็ต', NULL),
(352, 'เด็กหญิง', 2, 10046, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'บัณฑิตา', 'แก้วมุงคุณ', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(353, 'เด็กหญิง', 2, 10047, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'เบญญาภา', 'วิเศษจินดาคุณ', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(354, 'เด็กหญิง', 2, 10048, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วิลาสินี', 'ถาราช', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(355, 'เด็กชาย', 1, 10049, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'คณิศร', 'ทองนิโรจน์', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(356, 'เด็กชาย', 1, 10050, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชวนกร', 'ประพุทธา', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(357, 'เด็กชาย', 1, 10051, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธนาวัฒน์', 'ดีขยัน', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(358, 'เด็กชาย', 1, 10052, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พงศธร', 'สร้างสอบ', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(359, 'เด็กชาย', 1, 10053, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศรัณย์ภัทร', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(360, 'เด็กชาย', 1, 10054, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อโณทัย', 'สิงห์ทุย', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(361, 'เด็กหญิง', 2, 10055, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จิรนันท์', 'ทูลฉลอง', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(362, 'เด็กหญิง', 2, 10056, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชนาธิป', 'แฟนพิมาย', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(363, 'เด็กหญิง', 2, 10057, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พรนภา', 'ศิริแก้วเลิศ', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(364, 'เด็กหญิง', 2, 10058, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พรภิมล', 'ปากมงคล', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(365, 'เด็กหญิง', 2, 10059, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พัชราภา', 'คำทวี', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(366, 'เด็กหญิง', 2, 10060, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศรัณย์พร', 'บัวแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(367, 'เด็กหญิง', 2, 10061, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศิรินาฎ', 'สีดาเดช', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(368, 'เด็กชาย', 1, 10062, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ภูวนารถ', 'คำตุ้ย', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(369, 'เด็กหญิง', 2, 10063, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ครสวรรค์', 'พรมภักดี', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(370, 'เด็กชาย', 1, 10064, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ณัฐวัฒน์', 'บ่าพิมาย', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(371, 'เด็กชาย', 1, 10065, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กฤษณพงษ์', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(372, 'เด็กชาย', 1, 10066, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชวกร', 'ลุนรักษา', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(373, 'เด็กชาย', 1, 10067, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ณัฐพงศ์', 'สระแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(374, 'เด็กชาย', 1, 10068, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'นิธิ', 'ศิลาโล่ห์', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(375, 'เด็กชาย', 1, 10069, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พงษ์ณุกร', 'จันสมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(376, 'เด็กชาย', 1, 10070, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ภาณุวัฒน์', 'ปุระศรี', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(377, 'เด็กชาย', 1, 10071, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ภูวดล', 'ปลัดพรม', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(378, 'เด็กชาย', 1, 10072, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศุภวิชย์', 'ศรีษา', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(379, 'เด็กชาย', 1, 10073, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'สุเมธ', 'ปานิคม', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(380, 'เด็กชาย', 1, 10074, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อิสระภาพ', 'นามวิชัย', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(381, 'เด็กหญิง', 2, 10075, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'เกศรา', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(382, 'เด็กหญิง', 2, 10076, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชุติมา', 'วงศ์อ่อน', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(383, 'เด็กหญิง', 2, 10077, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธนัชชา', 'นามภักดี', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(384, 'เด็กหญิง', 2, 10078, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พรมนัส', 'โสมนัส', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(385, 'เด็กหญิง', 2, 10079, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พัสนันท์', 'บ้านกลาง', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(386, 'เด็กหญิง', 2, 10080, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พิมพ์พา', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(387, 'เด็กหญิง', 2, 10081, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'รัตนาพร', 'ภูธร', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(388, 'เด็กหญิง', 2, 10082, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'สุทธิดา', 'โอกาสวิไล', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(389, 'เด็กหญิง', 2, 10083, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'สุภัสสร', 'สุดจิตร์', NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL),
(390, 'เด็กชาย', 1, 10084, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ฉัตรพร', 'กำแก้ว', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(391, 'เด็กชาย', 1, 10085, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธีรนัย', 'แก้วมุงคุณ', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(392, 'เด็กชาย', 1, 10086, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธีรศักดิ์', 'จันทร์ดี', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(393, 'เด็กชาย', 1, 10087, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ภานุวัฒน์', 'คณิกา', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(394, 'เด็กชาย', 1, 10088, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วิษณุ', 'สายสุนา', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(395, 'เด็กชาย', 1, 10089, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วีรพงษ์', 'กองสุวรรณ', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(396, 'เด็กชาย', 1, 10090, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อติเทพ', 'พุทธะ', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(397, 'เด็กชาย', 1, 10091, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อนุพงษ์', 'บุญเหลือ', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(398, 'เด็กหญิง', 2, 10092, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จันทร์จิรา', 'บทมาตย์', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(399, 'เด็กหญิง', 2, 10093, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธารทอง', 'สุดแสง', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(400, 'เด็กหญิง', 2, 10094, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'มัทธนา', 'มุลวงศรี', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(401, 'เด็กหญิง', 2, 10095, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'เมษา', 'วงษา', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(402, 'เด็กหญิง', 2, 10096, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศิรดา', 'พรมสมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(403, 'เด็กชาย', 1, 10097, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ธราเทพ', 'คุณความดี', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(404, 'เด็กชาย', 1, 10098, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'รัฐพล', 'อุสสิทธิ์', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(405, 'เด็กหญิง', 2, 10099, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พรทิวา', 'คำภูมี', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL),
(406, 'นาย', 1, 10100, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชนกานต์', 'นามมัน', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(407, 'นาย', 1, 10101, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'นฤชัย', 'ชื่นจะโปะ', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(408, 'นาย', 1, 10102, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปรัชญา', 'งามสง่า', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(409, 'นาย', 1, 10103, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อโณทัย', 'หาญวงค์', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(410, 'นาย', 1, 10104, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อดิศรา', 'โคตรโสภา', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(411, 'นาย', 1, 10105, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อธิวรา', 'ทิพย์สมบัติ', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(412, 'นาย', 1, 10106, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อนุวัต', 'นารีจันทร์', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(413, 'นางสาว', 2, 10107, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กมลทิพย์', 'ชัยปัญหา', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(414, 'นางสาว', 2, 10108, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ดรุณี', 'ทัดสบง', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(415, 'นางสาว', 2, 10109, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปนัดดา', 'โสนันทะ', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(416, 'นางสาว', 2, 10110, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปาริตา', 'ฆ้องเกิด', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(417, 'นางสาว', 2, 10111, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'สุพัตรา', 'วรวิเวศ', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(418, 'นาย', 1, 10112, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กรวิญช์', 'หงส์เอก', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(419, 'นาย', 1, 10113, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อำนาจ', 'แก้วศรีขาว', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(420, 'นางสาว', 2, 10114, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'พิชามญชุ์', 'นามพรม', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(421, 'นางสาว', 2, 10115, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'วสุธิดา', 'วงษาเทพ', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(422, 'นางสาว', 2, 10116, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศิริลักษณ์', 'ศรีวิลัย', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(423, 'นางสาว', 2, 10117, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศุภธิดา', 'คุณกะ', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(424, 'นางสาว', 2, 10118, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปาณิศา', 'ฝ้ายสีงาม', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(425, 'นางสาว', 2, 10119, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปิยรัตน์', 'เพชรพันธ์', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(426, 'นาย', 1, 10120, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ร่มเกล้า', 'ธรรมรังศรี', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL),
(427, 'นาย', 1, 10121, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ณัฐวัฒน์', 'ภาษี', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(428, 'นาย', 1, 10122, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'เอกภาพ', 'มงคล', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(429, 'นาย', 1, 10123, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ฐิติภัทร', 'ศรีภา', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(430, 'นาย', 1, 10124, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จีรยุทธ', 'ชาวชายโขง', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(431, 'นางสาว', 2, 10125, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปฏิมา', 'ภูธร', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(432, 'นางสาว', 2, 10126, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กิตติยา', 'คิดเล็ก', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(433, 'นางสาว', 2, 10127, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'น้ำฟ้า', 'เดชศร', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(434, 'นางสาว', 2, 10128, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ดวงเดือน', 'ทะศิริ', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(435, 'นางสาว', 2, 10129, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กัญญาพร', 'จันทร์ตระกูล', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(436, 'นางสาว', 2, 10130, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กันยารัตน์', 'มิ่งขุนทด', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(437, 'นางสาว', 2, 10131, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จิตรวิไล', 'ผิวเงิน', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(438, 'นางสาว', 2, 10132, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศิรินภา', 'เทวงศา', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(439, 'นางสาว', 2, 10133, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ดาราวดี', 'มั่งมูล', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(440, 'นาย', 1, 10134, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ถิรวัฒน์', 'ดวงดี', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(441, 'นาย', 1, 10135, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'จักรกฤษณ์', 'แก้วตา', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(442, 'นางสาว', 2, 10136, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ดวงกมล', 'นรสาร', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(443, 'นางสาว', 2, 10137, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศิราธร', 'คุณความดี', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `students` (`id`, `namePrefix`, `genderId`, `studentNumber`, `guardianRelation`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `dob`, `nationality`, `weight`, `height`, `disease`, `phoneNumber`, `firstName`, `lastName`, `guardianFirstName`, `guardianLastName`, `address`, `emergencyContact`, `guardianMonthlyIncome`, `guardianOccupation`, `homeroomClassId`, `houseMaterial`, `houseType`, `studyArea`, `utilities`, `guardianNamePrefix`) VALUES
(444, 'นางสาว', 2, 10138, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'มนัสนันท์', 'แสงโชติ', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(445, 'นางสาว', 2, 10139, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'น้ำฝน', 'สีหาวงค์', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(446, 'นางสาว', 2, 10140, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'กัณธิมา', 'เข็มสีดา', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(447, 'นาย', 1, 10141, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'มาฆวัณ', 'แก้วสอนดี', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(448, 'นางสาว', 2, 10142, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'รักษมันท์', 'มหาวัน', NULL, NULL, NULL, NULL, NULL, NULL, 9, NULL, NULL, NULL, NULL, NULL),
(449, 'นาย', 1, 10143, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ชิตพล', 'บุตรโยธี', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(450, 'นาย', 1, 10144, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปิยะวัฒน์', 'นวลคำสิงห์', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(451, 'นาย', 1, 10145, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'รัฐภูมิ', 'สีงาม', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(452, 'นางสาว', 2, 10146, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ณิชา', 'โคตรโสภา', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(453, 'นางสาว', 2, 10147, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ทับทิมทอง', 'สุดแสง', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(454, 'นางสาว', 2, 10148, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ปานไพรินทร์', 'ชัยวรรรณ์', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(455, 'นางสาว', 2, 10149, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'เพชรรัตน์', 'บันดิษฐ', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(456, 'นางสาว', 2, 10150, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ฟ้ารุ่ง', 'นวลคำสิงห์', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(457, 'นางสาว', 2, 10151, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศรัณยา', 'พันพิลา', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(458, 'นางสาว', 2, 10152, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'อภิญญา', 'โยธา', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(459, 'นางสาว', 2, 10153, NULL, '2026-01-19 13:01:45', '2026-03-10 14:03:57', 0, NULL, NULL, NULL, 'ไทย', NULL, NULL, NULL, NULL, 'ศศิกานต์', 'ศิลปกิจวงษ์กุล', NULL, NULL, NULL, NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL),
(460, 'เด็กชาย', 1, 11000, 'สมัคร', '2026-03-17 09:37:14', '2026-03-17 09:37:14', 1, '2026-03-17 09:42:28', 1, '2011-02-16', 'ไทย', 71, 170, NULL, '0896508722', 'สนิท', 'ครองผา', 'สมัคร', 'ครองผา', '255 ม.6', '0875986545', '15000', 'ค้าขาย', 4, NULL, NULL, NULL, NULL, 'นาย');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `codeSubject` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `codeSubject`, `name`, `description`, `departmentId`, `createdAt`, `updatedAt`, `deletedAt`, `updatedBy`) VALUES
(1, 'ภาษาจีน', 'ภาษาจีนเบื้องต้น', 'ศึกษาคำศัพท์ การออกเสียง และการสื่อสารภาษาจีนพื้นฐาน', 8, '2026-03-09 04:25:28', '2026-03-09 04:25:28', NULL, 1),
(2, 'ค21102', 'คณิตศาสตร์พื้นฐาน', 'ศึกษาหลักการคำนวณ การแก้ปัญหา และการประยุกต์ใช้คณิตศาสตร์ในชีวิตประจำวัน', 3, '2026-03-09 04:27:14', '2026-03-09 04:27:14', NULL, 1),
(3, 'ส22102', 'สังคมศึกษา 2', 'ศึกษาสังคม วัฒนธรรม เศรษฐกิจ และการเมืองในระดับที่สูงขึ้น', 5, '2026-03-10 12:25:22', '2026-03-10 12:25:22', NULL, 1),
(4, 'ท21102', 'ภาษาไทยพื้นฐาน', 'ศึกษาการอ่าน การเขียน การฟัง และการพูดภาษาไทยอย่างถูกต้อง พร้อมทั้งวิเคราะห์วรรณคดีและการใช้ภาษา', 2, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(5, 'ท22102', 'ภาษาไทยพื้นฐาน 2', 'ศึกษาการอ่าน การเขียน การฟัง และการพูดภาษาไทยอย่างถูกต้อง พร้อมทั้งวิเคราะห์วรรณคดีและการใช้ภาษาระดับสูง', 2, '2026-03-10 13:34:42', '2026-03-10 13:41:03', NULL, 1),
(6, 'ค21202', 'คณิตศาสตร์เพิ่มเติม', 'ศึกษาคณิตศาสตร์ขั้นสูงเพื่อพัฒนาการคิดวิเคราะห์และการแก้ปัญหา', 3, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(7, 'ค22102', 'คณิตศาสตร์พื้นฐาน 2', 'ศึกษาหลักการคณิตศาสตร์ขั้นพื้นฐานสำหรับชั้น ม.2 เน้นการแก้ปัญหาและตรรกศาสตร์', 3, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(8, 'ว21102', 'วิทยาศาสตร์พื้นฐาน', 'ศึกษาหลักการทางวิทยาศาสตร์เกี่ยวกับสิ่งมีชีวิต สาร พลังงาน และปรากฏการณ์ธรรมชาติ', 4, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(9, 'ว22102', 'วิทยาศาสตร์กายภาพ', 'ศึกษาหลักการทางฟิสิกส์และเคมีเกี่ยวกับแรง พลังงาน และสมบัติของสาร', 4, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(10, 'ว22104', 'วิทยาศาสตร์โลกและอวกาศ', 'ศึกษาโครงสร้างโลก ระบบสุริยะ และปรากฏการณ์ทางธรรมชาติ', 4, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(11, 'อ21102', 'ภาษาอังกฤษพื้นฐาน', 'ศึกษาทักษะการฟัง พูด อ่าน และเขียนภาษาอังกฤษเพื่อการสื่อสาร', 8, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(12, 'อ22102', 'ภาษาอังกฤษเพื่อการสื่อสาร', 'พัฒนาทักษะการสื่อสารภาษาอังกฤษในสถานการณ์ต่าง ๆ', 8, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(13, 'อ22202', 'ภาษาอังกฤษขั้นสูง', 'ฝึกการอ่าน วิเคราะห์ และการสื่อสารภาษาอังกฤษขั้นสูง', 8, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(14, 'ส21102', 'หน้าที่พลเมือง', 'ศึกษาหน้าที่ของพลเมืองและการอยู่ร่วมกันในสังคม', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(15, 'ส21103', 'สังคมศึกษา', 'ศึกษาสังคม วัฒนธรรม เศรษฐกิจ และการเมือง', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(16, 'ส21104', 'ประวัติศาสตร์', 'ศึกษาเหตุการณ์สำคัญทางประวัติศาสตร์ไทยและโลก', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(17, 'ส22103', 'ภูมิศาสตร์', 'ศึกษาภูมิประเทศ ทรัพยากรธรรมชาติ และสิ่งแวดล้อม', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(18, 'ส22104', 'เศรษฐศาสตร์เบื้องต้น', 'ศึกษาหลักเศรษฐศาสตร์พื้นฐานและการใช้ทรัพยากร', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(19, 'ส22204', 'ประวัติศาสตร์ 2', 'ศึกษาประวัติศาสตร์ไทยและโลกในเชิงลึก เน้นการวิเคราะห์เหตุและผล', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(20, 'ส20232', 'กิจกรรมสังคม ม.1', 'กิจกรรมพัฒนาผู้เรียนด้านสังคม คุณธรรม และจิตอาสา สำหรับชั้น ม.1', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(21, 'ส20234', 'กิจกรรมสังคม ม.2', 'กิจกรรมพัฒนาผู้เรียนด้านสังคม คุณธรรม และจิตอาสา สำหรับชั้น ม.2', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(22, 'ส20236', 'กิจกรรมสังคม ม.3', 'กิจกรรมพัฒนาผู้เรียนด้านสังคม คุณธรรม และจิตอาสา สำหรับชั้น ม.3', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(23, 'ศ21102', 'ศิลปะ', 'ศึกษาการวาดภาพ การออกแบบ และการสร้างสรรค์งานศิลป์', 7, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(24, 'ศ21103', 'ดนตรีและนาฏศิลป์', 'ศึกษาดนตรี การร้องเพลง และการแสดง', 7, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(25, 'ศ22102', 'ศิลปะ 2', 'ฝึกการสร้างสรรค์งานศิลป์ขั้นสูง ทฤษฎีสีและองค์ประกอบศิลป์', 7, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(26, 'พ21103', 'สุขศึกษา', 'ศึกษาการดูแลสุขภาพและการป้องกันโรค', 6, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(27, 'พ21104', 'พลศึกษา', 'ฝึกทักษะกีฬาและการออกกำลังกายเพื่อสุขภาพ', 6, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(28, 'พ22102', 'พลศึกษาขั้นพื้นฐาน', 'พัฒนาทักษะกีฬาและสมรรถภาพทางกาย', 6, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(29, 'พ22104', 'พลศึกษาและนันทนาการ', 'ฝึกกิจกรรมกีฬาและนันทนาการเพื่อสุขภาพ', 6, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(30, 'ธรรมะ', 'หลักธรรมในชีวิตประจำวัน', 'ศึกษาหลักธรรมทางพระพุทธศาสนาและการนำไปประยุกต์ใช้ในชีวิตประจำวัน', 5, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(31, 'สส/นน', 'สร้างเสริมลักษณะนิสัย/การงานพื้นฐานอาชีพ', 'สส. (สร้างเสริมลักษณะนิสัย): ปลูกฝังคุณธรรม จริยธรรม ระเบียบวินัย และบุคลิกภาพที่ดี | น.น. (การงานพื้นฐานอาชีพ): ฝึกทักษะการทำงานบ้าน งานฝีมือ และพื้นฐานอาชีพเพื่อการพึ่งพาตนเอง', NULL, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(32, 'PBL', 'การเรียนรู้แบบโครงงาน', 'การเรียนรู้ผ่านโครงงานเพื่อพัฒนาการคิดวิเคราะห์และการทำงานเป็นทีม', NULL, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(33, 'แนะแนว', 'แนะแนว', 'ให้คำแนะนำด้านการเรียน การใช้ชีวิต และการวางแผนอาชีพ', NULL, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(34, 'ชุมนุม', 'กิจกรรมชุมนุม', 'กิจกรรมเสริมหลักสูตรตามความสนใจของนักเรียน', NULL, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL),
(35, 'เพื่อสังคม', 'กิจกรรมเพื่อสังคม', 'ส่งเสริมกิจกรรมจิตอาสาและการพัฒนาสังคม', NULL, '2026-03-10 13:34:42', '2026-03-10 13:34:42', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `namePrefix` varchar(10) DEFAULT NULL,
  `genderId` int(11) NOT NULL,
  `dob` date DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(10) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `imagePath` varchar(500) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `education` varchar(100) NOT NULL,
  `major` varchar(100) NOT NULL,
  `biography` text NOT NULL,
  `specializations` text NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `departmentId`, `namePrefix`, `genderId`, `dob`, `nationality`, `position`, `level`, `phoneNumber`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `imagePath`, `email`, `address`, `education`, `major`, `biography`, `specializations`, `firstName`, `lastName`) VALUES
(1, 1, 'นาย', 1, NULL, 'ไทย', 'ผู้อำนวยการ', 'คศ. 3', '0642466644', '2025-08-27 11:29:44', '2025-08-27 11:29:44', 0, NULL, NULL, '/images/teachers/admin1.jpg', 'Chumnanwit1@gmail.com', '', 'ปริญญาโท', 'วิทยาศาสตร์', '', '', 'ชำนาญวิทย์', 'ประเสริฐ'),
(2, 1, 'นาง', 2, '1972-01-13', 'ไทย', 'รองผู้อำนวยการ', 'คศ. 3', '0872153025', '2025-08-27 11:39:13', '2025-08-27 11:39:13', 0, NULL, NULL, '/images/teachers/admin2.jpg', 'pitchaya2@gmail.com', '277 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย มหาวิทยาลัยพิษณุโลก', '', '', 'พิชญา', 'สุวงศ์'),
(3, 2, 'นาง', 2, '1976-04-19', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0869636458', '2025-08-27 11:48:51', '2025-08-27 11:48:51', 0, NULL, NULL, '/images/teachers/thai1.jpg', 'amon3@gmail.com', '', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย', 'จบการศึกษาปริญญาโท', '', 'อามร', 'คำเสมอ'),
(4, 2, 'นาง', 2, '1985-06-14', 'ไทย', 'ครูชำนาญการพิเศษ', 'คศ. 3', '0985698569', '2025-08-27 12:00:00', '2026-01-20 19:35:07', 0, NULL, NULL, '/images/teachers/thai2.jpg', 'pornsiri4@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', 'แต่งกลอน', 'พรศิริ', 'พิมพ์พา'),
(5, 3, 'นาง', 2, '1987-07-24', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0889693481', '2025-08-27 12:02:31', '2025-08-27 12:02:31', 0, NULL, NULL, '/images/teachers/math1.jpg', 'kesorn5@gmail.com', '', 'ปริญญาโท', 'เอกวิทยาศาสตร์', 'ย้ายมาจากโรงเรียนพระพุทธบาท อ.สังคม จ.หนองคาย', 'A-Math', 'เกษร', 'ผาสุข'),
(6, 3, 'นาย', 1, '1978-10-22', 'ไทย', 'ครู', 'คศ. 3', '0982653456', '2025-08-27 12:06:12', '2026-03-17 09:29:19', 0, NULL, 1, '/images/teachers/math2.jpg', 'Nutthawut6@gmail.com', '', 'ปริญญาตรี', '', '', '', 'นายณัฐวุฒิ', 'เจริญกุล'),
(7, 4, 'นางสาว', 2, '1987-02-27', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0978562552', '2025-08-27 12:09:17', '2026-01-20 21:37:51', 0, NULL, NULL, '/images/teachers/science1.jpg', 'wilailak7@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', '', '', '', 'วิไลลักษณ์', 'อ่างแก้ว'),
(8, 4, 'นางสาว', 2, NULL, 'ไทย', 'ครู', 'คศ. 1', '0654657895', '2025-08-27 12:11:32', '2025-08-27 12:11:32', 0, NULL, NULL, '/images/teachers/science2.jpg', 'surangkana8@gmail.com', '', 'ปริญญาโท', 'คณะวิทยาศาสตร์ สาขาเทคโนโลยีสารสนเทศ มหาวิทยาลัยขอนแก่น', '', '', 'สุรางคณา', 'เหลืองกิจไพบูลย์'),
(9, 4, 'นางสาว', 2, NULL, 'ไทย', 'ครูผู้ช่วย', NULL, '0889684532', '2025-08-27 12:14:28', '2025-08-27 12:14:28', 0, NULL, NULL, '/images/teachers/science3.jpg', 'sarunya9@gmail.com', '', 'ปริญญาตรี', '', '', '', 'ศรัณยา', 'ดลรัศมี'),
(10, 4, 'นางสาว', 2, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0975264855', '2025-08-27 12:18:10', '2025-08-27 12:18:10', 0, NULL, NULL, '/images/teachers/science4.jpg', 'jeeranan10@gmail.com', '', 'ปริญญาตรี', '', '', '', 'จีรนันท์', 'พรหมพิภักดิ์'),
(11, 5, 'นางสาว', 2, NULL, 'ไทย', 'หัวหน้ากลุ่มสาระ', 'ครูผู้ช่วย', '0932458765', '2025-08-27 12:27:40', '2025-08-27 12:27:40', 0, NULL, NULL, '/images/teachers/social1.jpg', 'silikanya11@gmail.com', '', 'ปริญญาตรี', '', '', '', 'ศิริกัญญา', 'กาอุปมุง'),
(12, 5, 'นางสาว', 2, NULL, 'ไทย', 'ครูอัตราจ้าง', '', '0654678475', '2025-08-27 12:32:37', '2025-08-27 12:32:37', 0, NULL, NULL, '/images/teachers/social2.jpg', 'kamonchanok12@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', 'คณะมนุษยศาตร์ สาขาวิชาสังคมศาสตร์', '', '', 'กมลชนก', 'รีวงษา'),
(13, 6, 'นาย', 1, '1984-05-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0852468592', '2025-08-27 12:39:05', '2025-08-27 12:39:05', 0, NULL, NULL, '/images/teachers/health1.jpg', 'taweesak18@gmail.com', '', 'ปริญญาตรี', '', '', '', 'ทวีศักดิ์', 'มณีรัตน์'),
(14, 7, 'นาย', 1, '1988-04-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0875364854', '2025-08-27 12:41:59', '2025-08-27 12:41:59', 0, NULL, NULL, '/images/teachers/art1.jpg', 'suphachai13@gmail.com', '', 'ปริญญาตรี', '', '', '', 'ศุภชัย', 'โคตรชมภู'),
(15, 8, 'นาง', 2, '1979-08-25', 'ไทย', 'ครู', 'คศ. 3', '0653425859', '2025-08-27 12:44:40', '2025-08-27 12:44:40', 0, NULL, NULL, '/images/teachers/foreign1.jpg', 'ubon14@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษศาสตร์ สาขาวิชาภาษาอังกฤษ', '', '', 'อุบล', 'แสงโสดา'),
(16, 8, 'นาง', 2, NULL, 'ไทย', 'พนักงานราชการ', 'คศ. 3', '0854325869', '2025-08-27 12:47:01', '2025-08-27 12:47:01', 0, NULL, NULL, '/images/teachers/foreign2.jpg', 'waraporn15@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกวิชาภาษาอังกฤษ', '', '', 'วราภรณ์', 'แสงแก้ว'),
(17, 9, 'นาย', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0963568745', '2025-08-27 12:50:12', '2025-08-27 12:50:12', 0, NULL, NULL, '/images/teachers/support1.jpg', 'theeraphong16@gmail.com', '', 'ปริญญาตรี', '', '', '', 'ธีรพงษ์', 'หมอยาเก่า'),
(18, 10, 'นาย', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, NULL, '2025-08-27 12:50:12', '2025-08-27 12:50:12', 0, NULL, NULL, '/images/teachers/support2.jpg', 'larn17@gmail.com', '', '', '', '', '', 'ลาญู', 'น้อยโสภา'),
(23, 9, 'นาย', 1, '1980-07-04', 'ไทย', 'ธุรการ', 'คศ. 3', '', '2026-03-17 09:26:58', '2026-03-17 09:26:58', 1, '2026-03-17 09:30:49', 1, 'http://localhost:5000/uploads/teachers/support2-1773764818308-184153354.jpg', '', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', '', 'สนิท', 'ครองผา');

-- --------------------------------------------------------

--
-- Table structure for table `teachersubjects`
--

CREATE TABLE `teachersubjects` (
  `teacherId` int(11) NOT NULL,
  `subjectId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachersubjects`
--

INSERT INTO `teachersubjects` (`teacherId`, `subjectId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(4, 2, '2026-03-11 02:30:20', '2026-03-11 02:30:20', NULL),
(4, 32, '2026-03-11 03:27:20', '2026-03-11 03:27:20', NULL),
(7, 32, '2026-03-11 03:27:30', '2026-03-11 03:27:30', NULL),
(10, 6, '2026-03-17 10:06:17', '2026-03-17 10:06:17', NULL),
(10, 32, '2026-03-11 03:07:04', '2026-03-11 03:07:04', NULL),
(12, 32, '2026-03-11 02:27:11', '2026-03-11 02:27:11', NULL),
(16, 20, '2026-03-11 03:50:42', '2026-03-11 03:50:42', NULL),
(17, 2, '2026-03-11 02:30:17', '2026-03-11 02:30:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `id` int(11) NOT NULL,
  `roleName` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`id`, `roleName`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'super_admin', '2025-08-04 12:41:46', '2025-08-04 12:41:46', NULL),
(2, 'admin', '2025-08-04 12:41:46', '2025-08-04 12:41:46', NULL),
(3, 'teacher', '2025-08-04 12:41:46', '2025-08-04 12:41:46', NULL),
(4, 'user', '2025-08-04 12:41:46', '2025-08-04 12:41:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `mustChangePassword` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `roleId`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `lastLogin`, `phone`, `profileImage`, `teacherId`, `mustChangePassword`) VALUES
(1, 'admin', 'admin@admin.com', '$2b$10$EX/5XRcUFSQ1RfAcz/eheeZQE006SqqYoQesjcGa/U1V7BYP6D5Bu', 1, '2025-10-28 05:22:13', '2025-10-28 05:22:13', 0, NULL, NULL, '2026-03-17 08:54:05', '0973099767', '/uploads/profiles/user-1-1772271809745.png', NULL, 0),
(2, 'admin2', 'admin2@admin.com', '$2b$10$UgEpibtV9td3fQ4nYR.db.IJdMWy69v4khxa1FUXsfF8CI.G9vHDO', 2, '2025-11-02 15:39:08', '2025-11-02 15:39:08', 1, '2026-03-17 09:17:21', NULL, NULL, NULL, NULL, NULL, 0),
(4, 'admin3', 'admin3@admin.com', '$2b$10$XDEJPJpT4LzNDO7ejxT.eeUGw5x2Cw1l6FjK0ntYuS4SvES3QWUUC', 2, '2025-11-02 15:41:42', '2026-03-17 08:59:59', 0, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(5, 'Chumnanwit1', 'Chumnanwit1@gmail.com', '$2b$10$Yn1L3gdHNJlM/pwZlrHVY.r4DXqj72uDWSsSPXzWkJTpxKDH7vp.y', 2, '2025-11-02 15:42:59', '2025-11-02 15:45:10', 0, NULL, NULL, '2026-02-26 11:05:04', '0642466644', '/uploads/profiles/user-5-1768866756296.jpg', 1, 0),
(6, 'pitchaya2', 'pitchaya2@gmail.com', '$2b$10$eiEPOk7x7vf32jiemcQGZuRtWXp1Br9U1DmTAn4LpLOgc3qVGthlC', 2, '2025-11-02 15:43:26', '2025-11-02 15:45:15', 0, NULL, NULL, '2026-02-28 05:54:31', NULL, '/uploads/profiles/user-6-1772283456111.jpg', 2, 0),
(7, 'kru_Amon3', 'amon3@gmail.com', '$2b$10$MNIAV0Iir5d7yrTEAcFKL.5aOcJvFulFVsSaJSiWJYIqBmkHswGUq', 3, '2025-11-02 15:43:51', '2026-01-20 21:07:27', 0, NULL, NULL, '2026-03-11 19:02:56', '0869636458', '/uploads/profiles/user-7-1768869355102.jpg', 3, 0),
(8, 'pornsiri4', 'pornsiri4@gmail.com', '$2b$10$0ScoeI86Q2g5yNGZFNKtiuRclcb0ErZWoGfgOMxW9WquSJGqVjmie', 3, '2025-11-02 15:44:09', '2025-11-02 15:45:22', 0, NULL, NULL, '2026-03-17 08:07:39', '0665849868', '/uploads/profiles/user-8-1768962265069.jpg', 4, 0),
(9, 'kesorn5', 'kesorn5@gmail.com', '$2b$10$.wN29oA.OIHjwOUGNFDTKeetYiiWO8GL1mPennbRgeNJNhDM4yw4S', 3, '2025-11-02 15:44:27', '2025-11-02 15:45:25', 0, NULL, NULL, '2026-03-17 08:15:16', '0889693481', '/uploads/profiles/user-9-1773760937590.jpg', 5, 0),
(10, 'Nutthawut6', 'Nutthawut6@gmail.com', '$2b$10$QgJ5USJQhliOX4kP1KbE/Oep3vd61WUXN/bFeSoulDEus3QuvfFRG', 3, '2025-11-02 15:45:57', '2025-11-03 01:32:33', 0, NULL, NULL, NULL, NULL, NULL, 6, 1),
(11, 'wilailak7', 'wilailak7@gmail.com', '$2b$10$KSrkS8nDYQWgU5HW5X8A/e27Sx3zqp9NCMcPlT35wFcrSZVp2v2Ke', 3, '2025-11-02 15:46:27', '2025-11-03 01:32:37', 0, NULL, NULL, '2026-03-11 19:06:57', '0777777788', '/uploads/profiles/user-11-1768969476514.jpg', 7, 0),
(12, 'surangkana8', 'surangkana8@gmail.com', '$2b$10$HzmqEBzJ6hJ.Vu85.cW/4ulvJ.M9Z3bw55jylKSwtihVITiK5vq0W', 3, '2025-11-02 15:46:46', '2025-11-03 01:32:40', 0, NULL, NULL, '2026-03-11 19:08:42', NULL, NULL, 8, 0),
(15, 'sarunya9', 'silikanya11@gmail.com', '$2b$10$15nGH0v0U8OdjH/iJKlR1./a4HLCYw/cJYPiW4h54Pq4lTwjSkveW', 3, '2026-02-26 04:30:57', '2026-02-26 04:31:47', 0, NULL, NULL, NULL, NULL, '/default-avatar.jpg', 11, 1),
(16, 'jeeranan10', 'kamonchanok12@gmail.com', '$2b$10$PXZXGKxPWioOjy/rT7wbDu1xzGPVLC0gohoorfMtJVEqE/f.olie6', 3, '2026-02-26 04:31:29', '2026-02-26 04:31:50', 0, NULL, NULL, '2026-02-27 13:27:50', NULL, '/default-avatar.jpg', 12, 1),
(17, 'taweesak18', 'taweesak18@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, '2026-03-10 20:54:41', '2026-03-10 20:54:41', 0, NULL, NULL, NULL, NULL, NULL, 13, 1),
(18, 'suphachai13', 'suphachai13@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, '2026-03-10 20:54:41', '2026-03-10 20:54:41', 0, NULL, NULL, NULL, NULL, NULL, 14, 1),
(19, 'ubon14', 'ubon14@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, '2026-03-10 20:54:41', '2026-03-10 20:54:41', 0, NULL, NULL, NULL, NULL, NULL, 15, 1),
(20, 'waraporn15', 'waraporn15@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, '2026-03-10 20:54:41', '2026-03-10 20:54:41', 0, NULL, NULL, NULL, NULL, NULL, 16, 1),
(21, 'theeraphong16', 'theeraphong16@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, '2026-03-10 20:54:41', '2026-03-10 20:54:41', 0, NULL, NULL, NULL, NULL, NULL, 17, 1),
(22, 'larn17', 'larn17@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, '2026-03-10 20:54:41', '2026-03-10 20:54:41', 0, NULL, NULL, NULL, NULL, NULL, 18, 1);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('121a4a3f-59bf-45b1-9637-3674afc211e2', '293213efffd40140e10bceded061da836e52446758f09dbfab090b78a98ebbaf', '2026-03-09 07:23:36.379', '20260309072336_add_blog_status_and_pending_update', NULL, NULL, '2026-03-09 07:23:36.366', 1),
('181dadd9-08ca-46d8-9977-5f44974c53d8', '4d179f032dd5720476b9370b40628409a8ef51a5714dae4fe1314929f350a634', '2026-01-26 20:54:30.364', '20260126205430_', NULL, NULL, '2026-01-26 20:54:30.356', 1),
('1e1f6ff9-dbed-4727-bddf-343aeab0ed13', '87ce97b9b21b6ee534fbd407c4c3ca09f544d4f8decd70f20f26835c703dd36c', '2026-01-19 22:16:18.371', '20260119221618_add_profile_fields', NULL, NULL, '2026-01-19 22:16:18.314', 1),
('45860b95-d2cc-4b31-8010-f135d67e2bb8', 'f45de894c8b6f9edee15604d69f71e01a0475b1b4395cb232c16d0b0c38e82c9', '2026-02-28 17:14:31.824', '20260228171431_add_period_number_and_semester_to_classschedules', NULL, NULL, '2026-02-28 17:14:31.773', 1),
('5025cdbd-457c-4d37-95d0-c21317b026dc', 'eb0350860e9b575d153925107c1d7c0b5c895b000cb369a19cfb3f5915d30d21', '2026-02-26 12:13:36.323', '20260301120000_normalize_students_remove_classRoom_homeroomTeacherId', NULL, NULL, '2026-02-26 12:13:36.306', 1),
('55b28050-cdca-4e23-b636-eee31d1fea9a', '46fc269b208e8d377e3fbc9836689d24e41d2b324fe04b0b55a975a03c378e36', '2026-01-26 18:54:21.256', '20260126185421_remove_unused_tables', NULL, NULL, '2026-01-26 18:54:21.203', 1),
('5d322d0a-dea3-44c0-a690-18a0f469a950', 'ef870ec3068825c0b730aa3b59542b1acbd86dabdbdda805302841b61b4b675e', '2026-02-16 10:44:22.772', '20260216104422_add_guardian_name_prefix', NULL, NULL, '2026-02-16 10:44:22.762', 1),
('7855707d-8864-4832-987a-db9dbe25af3c', '4d179f032dd5720476b9370b40628409a8ef51a5714dae4fe1314929f350a634', '2026-02-26 10:36:48.334', '20260226103648_remove_redundant_teacher_user_back_reference', NULL, NULL, '2026-02-26 10:36:48.326', 1),
('79d92b55-f020-4ea2-9085-837952dd9132', 'feb5118b8cd8d4e5af0e1e585be9d1f08b9fc02d54563bceb66b64e7e8ef04c4', '2026-01-26 20:47:05.427', '20260126204019_refactor_all_names_final', NULL, NULL, '2026-01-26 20:47:04.699', 1),
('86aae0ed-d50c-4e72-a9d2-136ed951fc5e', '0e5537876a88e8b5a34c1e9a7d746394a2da5c9c8c0e58de670a4adb5450d030', '2026-03-11 03:38:24.862', '20260311000001_drop_academicclubattendance', '', NULL, '2026-03-11 03:38:24.862', 0),
('8ccdbf51-37ea-4cb6-8d98-fe84ba66cc01', 'fd0ee68c57a0d1c184a16f219a0ef69e812b116fe81d1241dca0d4e543d6c1fa', '2026-03-10 13:17:36.741', '20260310000000_add_contact_fields_to_school_info', NULL, NULL, '2026-03-10 13:17:36.726', 1),
('904d5edb-f01e-4b4c-b718-5a744da0ee5f', '7cbc11b3c6b11672b936492307ccf9134174c59d68d49a912d2d984208584f8a', '2026-01-21 04:51:51.432', '20260121045151_increase_teacher_imagepath_length', NULL, NULL, '2026-01-21 04:51:51.421', 1),
('a1ffde5e-f2ee-44e2-8f89-c4bbf2c75f07', '9d0ee5c8105f7efe3f254e3bec873da3606f03d0955b2eaad647d7344079deb0', '2026-03-17 17:56:10.241', '20260318000001_make_registration_deadline_nullable', NULL, NULL, '2026-03-17 17:56:10.204', 1),
('a2236e47-9c8b-4705-a756-a5aec0088388', '40a953a14cbc1fa2f95bdc3f58b1291ee1a73b1008403e5fa3e52bf95c99aa8e', '2026-01-16 09:30:02.075', '20251030203017_update_database', NULL, NULL, '2026-01-16 09:30:01.743', 1),
('b86e8aec-c835-4203-a03c-56fac36f484a', '9067797268e9f66fa0bd6e0702b6720c354b2b23ad969767f4f5a7bf988d4f40', '2026-03-01 12:48:07.045', '20260301124807_add_subject_code_raw_to_classschedules', NULL, NULL, '2026-03-01 12:48:07.036', 1),
('c23fcea1-8afe-4b60-914a-1faa64438544', '71f23b8627df2dc7f2c0bbb4243af3b071e8cc50260fd0c8a251bdbc270c6cb8', '2026-03-11 03:19:57.038', '20260311000000_drop_user_login_logs', '', NULL, '2026-03-11 03:19:57.038', 0),
('c2b9c104-9412-4409-a17b-970733e54965', '1e13137b97eb7793f7ad4fe4da91228482b4354a895a0d14109c55c67e390b7d', '2026-02-28 18:43:35.403', '20260228184335_add_building_to_classschedules', NULL, NULL, '2026-02-28 18:43:35.383', 1),
('c8bea8ff-15ff-4ffc-9041-649079a7909e', 'cf6a82f3d54347e5e307f824f1f4235677147efd319b438bef0cf28baeaa250d', '2026-02-26 10:17:37.351', '20260226101737_remove_unused_teachers_teacher_id_user_id', NULL, NULL, '2026-02-26 10:17:37.334', 1),
('cccda38a-b99d-4ff5-8596-b9742dd9ad7f', '927f86e28617713b7b95214e72c4af76a9eac9b4807326e7d237ba233bec0c6b', '2026-02-27 14:55:35.739', '20260227145535_add_password_reset_requests', NULL, NULL, '2026-02-27 14:55:35.631', 1),
('e08634fc-a27a-49a4-afc5-1b82e776da96', 'bc97bb5297f8cf286c46ff27e20f8c570865100b58d780aa49247a3fbb670dc1', '2026-03-01 10:33:34.134', '20260301103334_add_guest_teacher_name_to_classschedules', NULL, NULL, '2026-03-01 10:33:34.122', 1),
('ef209450-14fb-42a1-b25e-2bc7f91fc568', '77142e4e691826a512fc644836fd3b34505e1e13f8e964ad2560e817fab29565', '2026-01-16 09:30:01.742', '20251030121056_init', NULL, NULL, '2026-01-16 09:29:59.296', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academicclubs`
--
ALTER TABLE `academicclubs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `academic_years_year_key` (`year`),
  ADD KEY `createdBy` (`createdBy`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `idx_academic_years_current` (`isCurrent`),
  ADD KEY `idx_academic_years_active` (`isActive`);

--
-- Indexes for table `admissions_info`
--
ALTER TABLE `admissions_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendancestatuses`
--
ALTER TABLE `attendancestatuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_table_record` (`tableName`,`recordId`),
  ADD KEY `idx_audit_action` (`action`),
  ADD KEY `idx_audit_created` (`createdAt`),
  ADD KEY `idx_audit_user` (`userId`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author` (`author`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `idx_blogs_status` (`status`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_categories_name_key` (`name`),
  ADD UNIQUE KEY `blog_categories_slug_key` (`slug`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `idx_blog_categories_deleted` (`isDeleted`);

--
-- Indexes for table `classschedules`
--
ALTER TABLE `classschedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dayOfWeekId` (`dayOfWeekId`),
  ADD KEY `subjectId` (`subjectId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `semesterId` (`semesterId`),
  ADD KEY `idx_classschedules_class_semester` (`class`,`semesterId`);

--
-- Indexes for table `club_categories`
--
ALTER TABLE `club_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `club_categories_name_key` (`name`),
  ADD UNIQUE KEY `club_categories_slug_key` (`slug`),
  ADD KEY `relatedDepartmentId` (`relatedDepartmentId`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `idx_club_categories_deleted` (`isDeleted`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postId` (`postId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `daysofweek`
--
ALTER TABLE `daysofweek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `headTeacherId` (`headTeacherId`);

--
-- Indexes for table `flagpoleattendance`
--
ALTER TABLE `flagpoleattendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `semesterId` (`semesterId`),
  ADD KEY `idx_flagpole_date_semester` (`date`,`semesterId`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `genderName` (`genderName`);

--
-- Indexes for table `homeroom_classes`
--
ALTER TABLE `homeroom_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `homeroom_classes_className_key` (`className`),
  ADD UNIQUE KEY `homeroom_classes_homeroomTeacherId_key` (`homeroomTeacherId`),
  ADD KEY `homeroomTeacherId` (`homeroomTeacherId`),
  ADD KEY `academicYearId` (`academicYearId`),
  ADD KEY `idx_homeroom_classes_active` (`isActive`);

--
-- Indexes for table `homevisits`
--
ALTER TABLE `homevisits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_homevisits_deleted` (`isDeleted`,`deletedAt`),
  ADD KEY `idx_homevisits_student` (`studentId`),
  ADD KEY `idx_homevisits_teacher` (`teacherId`),
  ADD KEY `idx_homevisits_updated_by` (`updatedBy`),
  ADD KEY `idx_homevisits_visit_date` (`visitDate`),
  ADD KEY `idx_homevisits_teacher_student` (`teacherId`,`studentId`);

--
-- Indexes for table `password_reset_requests`
--
ALTER TABLE `password_reset_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_reset_requests_userId_idx` (`userId`),
  ADD KEY `password_reset_requests_status_idx` (`status`),
  ADD KEY `password_reset_requests_resolvedBy_idx` (`resolvedBy`);

--
-- Indexes for table `school_info`
--
ALTER TABLE `school_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school_timeline`
--
ALTER TABLE `school_timeline`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_semester_per_year` (`academicYearId`,`semesterNumber`),
  ADD KEY `academicYearId` (`academicYearId`),
  ADD KEY `createdBy` (`createdBy`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `idx_semesters_current` (`isCurrent`),
  ADD KEY `idx_semesters_active` (`isActive`);

--
-- Indexes for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genderId` (`genderId`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `homeroomClassId` (`homeroomClassId`),
  ADD KEY `idx_student_number` (`studentNumber`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codeSubject` (`codeSubject`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `genderId` (`genderId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `teachersubjects`
--
ALTER TABLE `teachersubjects`
  ADD PRIMARY KEY (`teacherId`,`subjectId`),
  ADD KEY `subjectId` (`subjectId`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roleName` (`roleName`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `users_teacherId_unique` (`teacherId`),
  ADD KEY `roleId` (`roleId`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `users_teacherId_idx` (`teacherId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academicclubs`
--
ALTER TABLE `academicclubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `academic_years`
--
ALTER TABLE `academic_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admissions_info`
--
ALTER TABLE `admissions_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendancestatuses`
--
ALTER TABLE `attendancestatuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=215;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `classschedules`
--
ALTER TABLE `classschedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3410;

--
-- AUTO_INCREMENT for table `club_categories`
--
ALTER TABLE `club_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `daysofweek`
--
ALTER TABLE `daysofweek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `flagpoleattendance`
--
ALTER TABLE `flagpoleattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=387;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `homeroom_classes`
--
ALTER TABLE `homeroom_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `homevisits`
--
ALTER TABLE `homevisits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `password_reset_requests`
--
ALTER TABLE `password_reset_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `school_info`
--
ALTER TABLE `school_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `school_timeline`
--
ALTER TABLE `school_timeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `semesters`
--
ALTER TABLE `semesters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=461;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `userroles`
--
ALTER TABLE `userroles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academicclubs`
--
ALTER TABLE `academicclubs`
  ADD CONSTRAINT `academicclubs_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `academicclubs_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `academicclubs_ibfk_3` FOREIGN KEY (`categoryId`) REFERENCES `club_categories` (`id`);

--
-- Constraints for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD CONSTRAINT `academic_years_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `academic_years_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `attendancestatuses`
--
ALTER TABLE `attendancestatuses`
  ADD CONSTRAINT `attendancestatuses_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `blogs_ibfk_3` FOREIGN KEY (`categoryId`) REFERENCES `blog_categories` (`id`);

--
-- Constraints for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD CONSTRAINT `blog_categories_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `classschedules`
--
ALTER TABLE `classschedules`
  ADD CONSTRAINT `classschedules_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_3` FOREIGN KEY (`dayOfWeekId`) REFERENCES `daysofweek` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_5` FOREIGN KEY (`semesterId`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `club_categories`
--
ALTER TABLE `club_categories`
  ADD CONSTRAINT `club_categories_ibfk_1` FOREIGN KEY (`relatedDepartmentId`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `club_categories_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `blogs` (`id`);

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`headTeacherId`) REFERENCES `teachers` (`id`);

--
-- Constraints for table `flagpoleattendance`
--
ALTER TABLE `flagpoleattendance`
  ADD CONSTRAINT `flagpoleattendance_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `flagpoleattendance_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `attendancestatuses` (`id`),
  ADD CONSTRAINT `flagpoleattendance_ibfk_3` FOREIGN KEY (`recorderId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `flagpoleattendance_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `flagpoleattendance_ibfk_5` FOREIGN KEY (`semesterId`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `homeroom_classes`
--
ALTER TABLE `homeroom_classes`
  ADD CONSTRAINT `homeroom_classes_ibfk_1` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `homeroom_classes_ibfk_2` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years` (`id`);

--
-- Constraints for table `homevisits`
--
ALTER TABLE `homevisits`
  ADD CONSTRAINT `fk_homevisits_student` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_homevisits_teacher` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `fk_homevisits_updatedby` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `password_reset_requests`
--
ALTER TABLE `password_reset_requests`
  ADD CONSTRAINT `password_reset_requests_resolvedBy_fkey` FOREIGN KEY (`resolvedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `password_reset_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `semesters`
--
ALTER TABLE `semesters`
  ADD CONSTRAINT `semesters_ibfk_1` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `semesters_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `semesters_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  ADD CONSTRAINT `studentbehaviorscores_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `studentbehaviorscores_ibfk_2` FOREIGN KEY (`recorderId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `studentbehaviorscores_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`genderId`) REFERENCES `genders` (`id`),
  ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`homeroomClassId`) REFERENCES `homeroom_classes` (`id`),
  ADD CONSTRAINT `students_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `teachers_ibfk_3` FOREIGN KEY (`genderId`) REFERENCES `genders` (`id`),
  ADD CONSTRAINT `teachers_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `teachersubjects`
--
ALTER TABLE `teachersubjects`
  ADD CONSTRAINT `teachersubjects_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `teachersubjects_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `userroles` (`id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
