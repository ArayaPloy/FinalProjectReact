-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2025 at 12:46 PM
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
-- Table structure for table `academicclubattendance`
--

CREATE TABLE `academicclubattendance` (
  `id` int(11) NOT NULL,
  `clubId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `studentId` int(11) DEFAULT NULL,
  `statusId` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `recorderId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  `icon` varchar(50) NOT NULL,
  `registrationDeadline` date NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `meetingDay` varchar(20) DEFAULT NULL,
  `meetingTime` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `requirements` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `academicclubs`
--

INSERT INTO `academicclubs` (`id`, `name`, `description`, `maxMembers`, `teacherId`, `createdAt`, `updatedAt`, `deletedAt`, `updatedBy`, `category`, `icon`, `registrationDeadline`, `isActive`, `meetingDay`, `meetingTime`, `location`, `requirements`) VALUES
(1, 'ชุมนุมศิลปะและงานฝีมือ', 'เรียนรู้การทำงานศิลปะและฝึกฝนทักษะงานฝีมือ', 20, 32, '2025-08-15 15:21:52', '2025-08-27 21:19:53', NULL, 13, 'ศิลปะและงานฝีมือ', 'IoColorPalette', '2025-08-28', 1, '', '', '', ''),
(2, 'ชุมนุมวิทยาศาสตร์', 'ทดลองและศึกษาทางวิทยาศาสตร์', 25, 23, '2025-08-15 15:21:52', '2025-08-27 21:19:09', '2025-08-28 08:20:52', 13, 'วิทยาศาสตร์', 'IoFlask', '2025-08-31', 1, '', '', '', ''),
(3, 'ชุมนุมเทคโนโลยี', 'เรียนรู้การเขียนโปรแกรมและเทคโนโลยี', 30, 24, '2025-08-15 15:21:52', '2025-08-27 21:20:22', NULL, 13, 'เทคโนโลยี', 'IoCodeSlash', '2025-08-26', 1, '', '', '', ''),
(6, 'DIY สิ่งประดิษฐ์สร้างสรรค์', 'ประดิษฐ์สิ่งของจากพลาสติกหรือของเก่าที่ไม่ใช้แล้ว', 20, 19, '2025-08-28 02:39:54', '2025-08-28 08:20:35', NULL, 13, 'ศิลปะและงานฝีมือ', 'IoColorPalette', '2025-08-29', 1, '', '', '', ''),
(7, 'เทส', 'สวัสดีนักเรียน', 40, 34, '2025-08-28 08:21:24', '2025-09-23 12:37:30', NULL, 13, 'ภาษาและวรรณกรรม', 'IoChatbubbles', '2025-10-31', 1, '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `attendancestatuses`
--

INSERT INTO `attendancestatuses` (`id`, `name`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'present', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(2, 'absent', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(3, 'late', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(4, 'sick leave', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL),
(5, 'personal leave', '2025-08-04 19:40:49', '2025-08-04 19:40:49', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `coverImg` varchar(255) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'เก็บ blocks, time, version จาก editor.js' CHECK (json_valid(`content`)),
  `category` varchar(100) DEFAULT NULL,
  `author` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `description`, `coverImg`, `content`, `category`, `author`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(13, 'เรียนเชิญร่วมสมทบทุนผ้าป่าเพื่อการศึกษา สมทบทุนจัดซื้อรถยนต์ รับ-ส่งนักเรียน ปี 2568', 'โรงเรียนท่าบ่อพิทยาคม ขอเชิญทุกท่านร่วมสมทบทุนผ้าป่าเพื่อการศึกษา เพื่อสมทบทุนจัดซื้อรถยนต์ รับ-ส่งนักเรียน ปี 2568', 'https://unsplash.com/photos/a-wooden-table.png', '\"โรงเรียนท่าบ่อพิทยาคม ขอเชิญทุกท่านร่วมสมทบทุนผ้าป่าเพื่อการศึกษา เพื่อสมทบทุนจัดซื้อรถยนต์ รับ-ส่งนักเรียน ปี 2568 ----\"', 'สมทบทุนการศึกษา', NULL, '2025-08-04 19:51:50', '2025-09-18 03:44:01', 0, NULL, 13),
(15, 'helloworld', 'helloworld', 'https://plus.unsplash.com/premium_photo-1754759085407-370a467be18c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '\"helloworld helloworld\\n\"', 'helloworld', 13, '2025-09-18 00:58:33', '2025-09-18 03:44:24', 0, NULL, 13),
(16, 'test', 'testtest', 'https://images.unsplash.com/photo-1756460886124-fca30da074c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '{\"time\":1758191467439,\"blocks\":[],\"version\":\"2.31.0-rc.7\"}', 'test', 13, '2025-09-18 03:16:16', '2025-09-18 03:31:07', 0, NULL, 13);

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
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `comment`, `userId`, `postId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(5, 'thtnhnt', 13, 15, '2025-09-18 01:45:40', '2025-09-18 01:45:40', NULL),
(6, 'ncdgug\n', 13, 15, '2025-09-18 03:14:48', '2025-09-18 03:14:48', NULL),
(7, 'hi', 13, 16, '2025-09-23 06:30:29', '2025-09-23 06:30:29', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `daysofweek`
--

INSERT INTO `daysofweek` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Monday', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(2, 'Tuesday', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(3, 'Wednesday', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(4, 'Thursday', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL),
(5, 'Friday', '2025-08-04 19:41:08', '2025-08-04 19:41:08', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `headTeacherId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ฝ่ายบริหาร', NULL, '2025-08-15 12:14:18', '2025-08-15 12:14:18', NULL),
(2, 'กลุ่มสาระการเรียนรู้ภาษาไทย', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(3, 'กลุ่มสาระการเรียนรู้คณิตศาสตร์', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(4, 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(5, 'กลุ่มสาระการเรียนรู้สังคมศึกษาฯ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(6, 'กลุ่มสาระการเรียนรู้สุขศึกษาฯ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(7, 'กลุ่มสาระการเรียนรู้ศิลปะ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(8, 'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(9, 'ธุระการโรงเรียน', NULL, '2025-08-15 13:03:40', '2025-08-15 13:03:40', NULL),
(10, 'นักการภารโรง', NULL, '2025-08-27 18:46:00', '2025-08-27 18:46:00', NULL);

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
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`id`, `genderName`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'male', '2025-08-04 19:41:25', '2025-08-04 19:41:25', NULL),
(2, 'female', '2025-08-04 19:41:25', '2025-08-04 19:41:25', NULL),
(3, 'other', '2025-08-04 19:41:25', '2025-08-04 19:41:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `homeroomattendance`
--

CREATE TABLE `homeroomattendance` (
  `id` int(11) NOT NULL,
  `homeroomTeacherId` int(11) DEFAULT NULL,
  `studentId` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `statusId` int(11) NOT NULL,
  `topic` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `recorderId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `homeroomteacherstudent`
--

CREATE TABLE `homeroomteacherstudent` (
  `homeroomTeacherId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `homevisits`
--

CREATE TABLE `homevisits` (
  `id` int(11) NOT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `studentId` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `visitDate` date DEFAULT NULL,
  `teacherName` varchar(255) DEFAULT NULL COMMENT 'Name of visiting teacher',
  `studentIdNumber` varchar(50) DEFAULT NULL COMMENT 'Student ID from form input',
  `studentName` varchar(255) DEFAULT NULL COMMENT 'Full name of student',
  `studentBirthDate` date DEFAULT NULL,
  `className` varchar(100) DEFAULT NULL COMMENT 'Student class/grade',
  `parentName` varchar(255) DEFAULT NULL COMMENT 'Parent/Guardian name',
  `relationship` varchar(100) DEFAULT NULL COMMENT 'Relationship to student (บิดา, มารดา, etc.)',
  `occupation` varchar(255) DEFAULT NULL COMMENT 'Parent occupation',
  `monthlyIncome` varchar(100) DEFAULT NULL COMMENT 'Monthly income range',
  `familyStatus` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of family status checkboxes' CHECK (json_valid(`familyStatus`)),
  `mainAddress` text DEFAULT NULL COMMENT 'Full address of student home',
  `phoneNumber` varchar(20) DEFAULT NULL COMMENT 'Primary phone number',
  `emergencyContact` varchar(20) DEFAULT NULL COMMENT 'Emergency contact number',
  `houseType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of house types (บ้านตัวเอง, บ้านเช่า, etc.)' CHECK (json_valid(`houseType`)),
  `houseMaterial` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of building materials (คอนกรีต, ไม้, etc.)' CHECK (json_valid(`houseMaterial`)),
  `utilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of available utilities (ไฟฟ้า, ประปา, etc.)' CHECK (json_valid(`utilities`)),
  `environmentCondition` text DEFAULT NULL COMMENT 'Description of environment around house',
  `studyArea` varchar(255) DEFAULT NULL COMMENT 'Study area description',
  `visitPurpose` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of visit purposes' CHECK (json_valid(`visitPurpose`)),
  `studentBehaviorAtHome` text DEFAULT NULL COMMENT 'Student behavior at home',
  `parentCooperation` text DEFAULT NULL COMMENT 'Parent cooperation level',
  `problems` text DEFAULT NULL COMMENT 'Problems identified during visit',
  `recommendations` text DEFAULT NULL COMMENT 'Recommendations given',
  `followUpPlan` text DEFAULT NULL COMMENT 'Follow-up plan',
  `summary` text DEFAULT NULL COMMENT 'Overall summary of visit',
  `notes` text DEFAULT NULL COMMENT 'Additional notes',
  `imagePath` varchar(500) DEFAULT NULL COMMENT 'Main image file path',
  `imageGallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of additional image file paths' CHECK (json_valid(`imageGallery`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homevisits`
--

INSERT INTO `homevisits` (`id`, `teacherId`, `studentId`, `updatedBy`, `visitDate`, `teacherName`, `studentIdNumber`, `studentName`, `studentBirthDate`, `className`, `parentName`, `relationship`, `occupation`, `monthlyIncome`, `familyStatus`, `mainAddress`, `phoneNumber`, `emergencyContact`, `houseType`, `houseMaterial`, `utilities`, `environmentCondition`, `studyArea`, `visitPurpose`, `studentBehaviorAtHome`, `parentCooperation`, `problems`, `recommendations`, `followUpPlan`, `summary`, `notes`, `imagePath`, `imageGallery`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`) VALUES
(3, NULL, NULL, 13, '2025-08-28', 'นาง อามร คำเสมอ', '1234', 'อารยา หงษาวงษ์', '2007-06-18', 'มัธยม 6', 'พิชญา สุวงศ์', 'มารดา', 'ครู', NULL, NULL, '277 ม.3 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม, สร้างความสัมพันธ์, ให้คำแนะนำ\"', 'มีความรับผิดชอบ', 'ดูแลนักเรียนดี', 'นักเรียนเรียนไกลบ้าน ทำให้ไปรร.สาย', 'ปรับเวลาการตื่นนอนและเดินทางไปเรียน', 'ติดตามการไปโรงเรียนของนักเรียนว่าเปลี่ยนแปลงไปทางไหน', 'นักเรียนอยู่ดีกินดี ครอบครัวสงบสุบ ', NULL, '/uploads/homevisits/homevisit-1756330776843-489589649-1jpg.jpg', '[\"/uploads/homevisits/homevisit-1756330776843-489589649-1jpg.jpg\"]', '2025-08-27 14:39:36', '2025-08-27 14:39:36', 0, NULL),
(4, NULL, NULL, 13, '2025-08-28', 'นาย ชำนาญวิทย์ ประเสริฐ', '12222', 'ใจดี มี', '2025-08-15', 'มัธยม 1/2', 'วาาืว', 'ยาย', 'น่ทส', NULL, NULL, '122สนน', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม\"', 'วาื', 'ดี', 'ก่อท่ว', 'ทาสร', 'ทสวา', 'ทวส', NULL, '/uploads/homevisits/homevisit-1756369574097-26842669-47640666510797485939167493744208584157710387npng.png', '[\"/uploads/homevisits/homevisit-1756369574097-26842669-47640666510797485939167493744208584157710387npng.png\",\"/uploads/homevisits/homevisit-1756369574109-585063979-48362498518327162009083295147124407526567985npng.png\"]', '2025-08-28 01:26:14', '2025-08-28 01:26:14', 0, NULL),
(5, NULL, NULL, 13, '2025-09-18', 'นาง อามร คำเสมอ', '12345', 'สุนี มาดี', '2020-05-21', 'มัธยม 1/1', 'รดา มาดี', 'มารดา', 'แม่บ้าน', NULL, NULL, '123 ม.3 ต.นนนี จ.ตาก', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม, ติดตามผลการเรียน\"', 'ดี', 'ไม่มีเวลา', 'เทสเทส', 'เมวสยบรเ่', 'ติดตามต่อไป', 'ดีมากกก', NULL, '/uploads/homevisits/homevisit-1758192624711-380034841-2jpg.jpg', '[\"/uploads/homevisits/homevisit-1758192624711-380034841-2jpg.jpg\"]', '2025-09-18 03:50:24', '2025-09-18 03:50:24', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `homevisit_files`
--

CREATE TABLE `homevisit_files` (
  `id` int(11) NOT NULL,
  `homeVisitId` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL COMMENT 'Original filename',
  `filePath` varchar(500) NOT NULL COMMENT 'Server file path',
  `fileUrl` varchar(500) NOT NULL COMMENT 'Public URL to access file',
  `fileSize` int(11) NOT NULL COMMENT 'File size in bytes',
  `mimeType` varchar(100) NOT NULL COMMENT 'File MIME type',
  `fileType` enum('main_image','gallery_image','document') DEFAULT 'gallery_image',
  `uploadedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `uploadedBy` int(11) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `school_info`
--

INSERT INTO `school_info` (`id`, `name`, `location`, `foundedDate`, `currentDirector`, `education_level`, `department`, `description`, `heroImage`, `director_image`, `director_quote`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`) VALUES
(1, 'โรงเรียนท่าบ่อพิทยาคม', 'บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย', '14 พฤษภาคม 2534', 'นายชำนาญวิทย์ ประเสริฐ', 'มัธยมศึกษาปีที่ 1-3', 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21', 'โรงเรียนท่าบ่อพิทยาคม เป็นโรงเรียนมัธยมศึกษาประจำตำบลกองนาง สังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ เริ่มเปิดเรียนเมื่อวันที่ 14 พฤษภาคม 2534  โดยมีนายประพันธ์  พรหมกูล  เป็นผู้ดูแล  โดยขอใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขา เป็นสถานที่เรียนชั่วคราว และมีนักเรียน ทั้งหมด 86 คน จำนวน  2  ห้องเรียน\nต่อมาได้ย้ายมาอยู่  ณ บริเวณที่สาธารณประโยชน์ หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย และที่ดินบริจาค จากคุณยายแก่นคำ  มั่งมูล, คุณแม่สุบิน น้อยโสภา  และคุณพ่อสุพล  น้อยโสภา  จำนวน 4.5  ไร่ รวมจำนวนที่ดินทั้งสิ้นประมาณ 65 ไร่ โดยได้รับงบประมาณในการสร้างอาคารจากกรมสามัญศึกษา  กระทรวงศึกษาธิการ  \nเมื่อวันที่ 26 กุมภาพันธ์ 2535 ได้รับประกาศจัดตั้งเป็นเอกเทศ  โดยใช้ชื่อว่า “โรงเรียนท่าบ่อพิทยาคม” กรมสามัญศึกษาได้แต่งตั้งให้ นายศิริ  เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ  อ.ท่าบ่อ  จ.หนองคาย มารักษาการในตำแหน่งครูใหญ่ ในปีงบประมาณ 2545  ได้รับจัดสรรงบประมาณจากกรมสามัญศึกษา ให้จัดสร้างอาคารเรียนแบบกึ่งถาวร  1  หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง  1  หลัง ในวันที่ 7 กรกฎาคม 2546 โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1  สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน กระทรวงศึกษาธิการ ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ.2546 และในวันที่ 23  กรกฎาคม  2553  \nโรงเรียนท่าบ่อพิทยาคม  เปลี่ยนมาสังกัด สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21  ตาม พ.ร.บ.การศึกษาแห่งชาติ (ฉบับที่ 3) พ.ร.บ.ระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3) และ พ.ร.บ.ระเบียบข้าราชการครูและบุคลากรทางการศึกษา (ฉบับที่ 3) ซึ่งได้มีการประกาศในราชกิจจานุเบกษา เมื่อวันที่  22 กรกฎาคม 2553 และมีผลบังคับใช้ ตั้งแต่วันที่ 23 กรกฎาคม 2553  ปัจจุบันมี นายชำนาญวิทย์ ประเสริฐ เป็นผู้อำนวยการโรงเรียน', 'frontend\\src\\assets\\images\\10.jpg', 'http://www.thabopit.com/_files_school/43100510/person/43100510_0_20241104-160235.jpg', 'โรงเรียนท่าบ่อพิทยาคมมุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม มีทักษะที่จำเป็นในศตวรรษที่ 21 และเป็นพลเมืองที่ดีของสังคม', '2025-08-07 09:05:18', '2025-09-18 02:10:28', 0, 13);

-- --------------------------------------------------------

--
-- Table structure for table `school_timeline`
--

CREATE TABLE `school_timeline` (
  `id` int(11) NOT NULL,
  `year` varchar(20) NOT NULL,
  `date` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sortOrder` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL,
  `deletedBy` int(11) NOT NULL,
  `deletedAt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `school_timeline`
--

INSERT INTO `school_timeline` (`id`, `year`, `date`, `title`, `description`, `sortOrder`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `deletedBy`, `deletedAt`) VALUES
(1, '2534', '1991-05-14', 'เปิดทำการเรียนการสอนเป็นครั้งแรก', 'เปิดทำการเรียนการสอนครั้งแรกเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ โดยมีนายประพันธ์ พรหมกูล เป็นผู้ดูแล ใช้อาคารเรียนของโรงเรียนบ้านหงส์ทองสามขาเป็นสถานที่เรียนชั่วคราว มีนักเรียนทั้งหมด 86 คน แบ่งเป็น 2 ห้องเรียน', 1, '2025-08-07 09:05:18', '2025-09-18 03:07:57', 0, 13, 0, 0),
(2, '2535', '2025-09-17', 'จัดตั้งเป็นเอกเทศ', 'โรงเรียนได้รับประกาศจัดตั้งเป็นเอกเทศ โดยใช้ชื่อว่า โรงเรียนท่าบ่อพิทยาคม และกรมสามัญศึกษาได้แต่งตั้งให้นายศิริ เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ มารักษาการในตำแหน่งครูใหญ่', 2, '2025-08-07 09:05:18', '2025-09-18 03:05:11', 0, 13, 0, 0),
(3, '2545', 'ปีงบประมาณ 2545', 'ก่อสร้างอาคารเรียน', 'โรงเรียนได้รับจัดสรรงบประมาณจากกรมสามัญศึกษาเพื่อสร้างอาคารเรียนแบบกึ่งถาวร 1 หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง 1 หลัง', 3, '2025-08-07 09:05:18', '2025-08-07 09:05:18', 0, 0, 0, 0),
(4, '2546', '7 กรกฎาคม 2546', 'เปลี่ยนสังกัด', 'โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1 ตามพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546', 4, '2025-08-07 09:05:18', '2025-08-27 10:49:56', 0, 13, 0, 0),
(5, '2553', '23 กรกฎาคม 2553', 'สังกัดเขตพื้นที่การศึกษามัธยมศึกษา', 'โรงเรียนท่าบ่อพิทยาคมเปลี่ยนมาสังกัดสำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21 ตามพระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ 3) และพระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3)', 5, '2025-08-07 09:05:18', '2025-08-07 09:05:18', 0, 0, 0, 0),
(6, 'ปัจจุบัน', 'ปัจจุบัน', 'การพัฒนาอย่างต่อเนื่อง', 'ปัจจุบัน โรงเรียนท่าบ่อพิทยาคมมีนายชำนาญวิทย์ ประเสริฐ ดำรงตำแหน่งผู้อำนวยการโรงเรียน และมีการพัฒนาอย่างต่อเนื่องเพื่อมุ่งสู่ความเป็นเลิศทางวิชาการ', 6, '2025-08-07 09:05:18', '2025-08-07 09:05:18', 0, 0, 0, 0),
(9, '2024', '14 semtember 2024', 'helloworld', 'abce', 0, '2025-08-07 11:46:16', '2025-08-07 12:00:22', 12, 12, 12, 2147483647),
(10, '2035', '14  MAY 2035', 'MARS', 'OEUAO', 0, '2025-08-07 12:07:07', '2025-08-07 12:07:25', 12, 0, 12, 2147483647),
(11, '2035', '14 semtember 2024', 'mar', 'oa', 0, '2025-08-07 12:09:53', '2025-08-07 12:10:59', 12, 0, 12, 2147483647),
(12, '2564', '12 มีนาคม', 'ข่าวสาร', 'เทส', 0, '2025-08-08 01:45:16', '2025-08-08 01:46:58', 12, 0, 12, 2147483647),
(13, '2568', '12 มกราคม 2568', 'hello', 'hngs', 0, '2025-09-18 02:05:40', '2025-09-18 02:08:00', 13, 13, 13, 1),
(14, '2568', '12 มกราคม 2568', 'helloworld', 'oauntoh', 0, '2025-09-18 02:08:43', '2025-09-18 02:08:54', 13, 13, 13, 1),
(15, '2658', '14 semtember 2024', 'hello', 'hellobnt', 0, '2025-09-18 02:09:17', '2025-09-18 02:33:19', 13, 13, 13, 1),
(16, '', '', 'hello', 'hello', 0, '2025-09-18 02:32:51', '2025-09-18 02:33:16', 13, 13, 13, 1),
(17, '2020', '2025-09-18', 'hello', 'hello', 0, '2025-09-18 02:59:23', '2025-09-18 02:59:23', 13, 13, 0, 0);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `namePrefix` varchar(10) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `genderId` int(11) NOT NULL,
  `classRoom` varchar(50) NOT NULL COMMENT 'เช่น ม.3/2',
  `studentNumber` int(11) NOT NULL,
  `homeroomTeacherId` int(11) DEFAULT NULL,
  `guardianName` varchar(255) DEFAULT NULL COMMENT 'ชื่อผู้ปกครอง',
  `guardianRelation` varchar(50) DEFAULT NULL COMMENT 'ความสัมพันธ์ เช่น พ่อ, แม่',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `dob` date NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `weight` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `disease` varchar(50) NOT NULL,
  `phoneNumber` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `superadmin`
--

CREATE TABLE `superadmin` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `namePrefix` varchar(10) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `genderId` int(11) NOT NULL,
  `phoneNumber` varchar(10) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `superadmin`
--

INSERT INTO `superadmin` (`id`, `userId`, `namePrefix`, `fullName`, `genderId`, `phoneNumber`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`) VALUES
(1, 1, 'นางสาว', 'อารยา หงษาวงษ์', 2, '0123456789', '2025-08-04 19:47:41', '2025-08-04 19:47:41', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `namePrefix` varchar(10) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
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
  `imagePath` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `education` varchar(100) NOT NULL,
  `major` varchar(100) NOT NULL,
  `biography` text NOT NULL,
  `specializations` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `teacherId`, `userId`, `departmentId`, `namePrefix`, `fullName`, `genderId`, `dob`, `nationality`, `position`, `level`, `phoneNumber`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `imagePath`, `email`, `address`, `education`, `major`, `biography`, `specializations`) VALUES
(13, 14, 14, 1, 'นาย', 'ชำนาญวิทย์ ประเสริฐ', 1, NULL, 'ไทย', 'ผู้อำนวยการ', 'คศ. 3', '0642466644', '2025-08-27 18:29:44', '2025-08-27 18:29:44', 0, NULL, NULL, '/src/assets/images/teachers/admin1.jpg', 'Chumnanwit1@gmail.com', '', 'ปริญญาโท', '', '', ''),
(18, 15, 15, 1, 'นาง', 'พิชญา สุวงศ์', 2, '1972-01-13', 'ไทย', 'รองผู้อำนวยการ', 'คศ. 3', '0872153025', '2025-08-27 18:39:13', '2025-08-27 18:39:13', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\admin2.jpg', 'pitchaya2@gmail.com', '277 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย มหาวิทยาลัยพิษณุโลก', '', ''),
(19, 16, 16, 2, 'นาง', 'อามร คำเสมอ', 2, '1976-04-19', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0882653492', '2025-08-27 18:48:51', '2025-08-27 18:48:51', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\thai1.jpg', 'amon3@gmail.com', '', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', ''),
(20, 17, 17, 2, 'นาง', 'พรศิริ พิมพ์พา', 2, '1985-06-14', 'ไทย', 'ครูชำนาญการพิเศษ', 'คศ. 3', '0645385853', '2025-08-27 19:00:00', '2025-08-27 19:00:00', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\thai2.jpg', 'pornsiri4@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', ''),
(21, 18, 18, 3, 'นาง', 'เกษร ผาสุข', 2, '1987-07-24', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0665432587', '2025-08-27 19:02:31', '2025-08-27 19:02:31', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\math1.jpg', 'kesorn5@gmail.com', '', 'ปริญญาโท', 'เอกวิทยาศาสตร์', '', ''),
(22, 19, 19, 3, 'นาย', 'ณัฐวุฒิ เจริญกุล', 1, '1978-10-22', 'ไทย', 'ครู', 'คศ. 3', '0982653456', '2025-08-27 19:06:12', '2025-08-27 19:06:12', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\math2.jpg', 'Nutthawut6@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(23, 20, 20, 4, 'นางสาว', 'วิไลลักษณ์ อ่างแก้ว', 2, '1987-02-27', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0923685489', '2025-08-27 19:09:17', '2025-08-27 19:09:17', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\science1.jpg', 'wilailak7@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', '', '', ''),
(24, 21, 21, 4, 'นางสาว', 'สุรางคณา เหลืองกิจไพบูลย์', 2, NULL, 'ไทย', 'ครู', 'คศ. 1', '0654657895', '2025-08-27 19:11:32', '2025-08-27 19:11:32', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\science2.jpg', 'surangkana8@gmail.com', '', 'ปริญญาโท', 'คณะวิทยาศาสตร์ สาขาเทคโนโลยีสารสนเทศ มหาวิทยาลัยขอนแก่น', '', ''),
(25, 22, 22, 4, 'นางสาว', 'ศรัณยา ดลรัศมี', 2, NULL, 'ไทย', 'ครูผู้ช่วย', NULL, '0889684532', '2025-08-27 19:14:28', '2025-08-27 19:14:28', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\science3.jpg', 'sarunya9@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(26, 23, 23, 4, 'นางสาว', 'จีรนันท์ พรหมพิภักดิ์', 2, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0975264855', '2025-08-27 19:18:10', '2025-08-27 19:18:10', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\science4.jpg', 'jeeranan10@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(27, 24, 24, 5, 'นางสาว', 'ศิริกัญญา กาอุปมุง', 2, NULL, 'ไทย', 'หัวหน้ากลุ่มสาระ', 'ครูผู้ช่วย', '0932458765', '2025-08-27 19:27:40', '2025-08-27 19:27:40', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\social1.jpg', 'silikanya11@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(28, 25, 25, 5, 'นางสาว', 'กมลชนก รีวงษา', 2, NULL, 'ไทย', 'ครูอัตราจ้าง', '', '0654678475', '2025-08-27 19:32:37', '2025-08-27 19:32:37', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\social2.jpg', 'kamonchanok12@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', 'คณะมนุษยศาตร์ สาขาวิชาสังคมศาสตร์', '', ''),
(29, 31, 31, 6, 'นาย', 'ทวีศักดิ์ มณีรัตน์\r\n', 1, '1984-05-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0852468592', '2025-08-27 19:39:05', '2025-08-27 19:39:05', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\health1.jpg', 'taweesak18@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(32, 26, 26, 7, 'นาย', 'ศุภชัย โคตรชมภู', 1, '1988-04-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0875364854', '2025-08-27 19:41:59', '2025-08-27 19:41:59', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\art1.jpg', 'suphachai13@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(33, 27, 27, 8, 'นาง', 'อุบล แสงโสดา', 2, '1979-08-25', 'ไทย', 'ครู', 'คศ. 3', '0653425859', '2025-08-27 19:44:40', '2025-08-27 19:44:40', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\foreign1.jpg', 'ubon14@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษศาสตร์ สาขาวิชาภาษาอังกฤษ', '', ''),
(34, 28, 28, 8, 'นาง', 'วราภรณ์ แสงแก้ว', 2, NULL, 'ไทย', 'พนักงานราชการ', 'คศ. 3', '0854325869', '2025-08-27 19:47:01', '2025-08-27 19:47:01', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\foreign2.jpg', 'waraporn15@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกวิชาภาษาอังกฤษ', '', ''),
(35, 29, 29, 9, 'นาย', 'ธีรพงษ์ หมอยาเก่า', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0963568745', '2025-08-27 19:50:12', '2025-08-27 19:50:12', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\support1.jpg', 'theeraphong16@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(36, 30, 30, 10, 'นาย', 'ลาญู น้อยโสภา', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, NULL, '2025-08-27 19:50:12', '2025-08-27 19:50:12', 0, NULL, NULL, '\\src\\assets\\images\\teachers\\support2.jpg', 'larn17@gmail.com', '', '', '', '', '');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`id`, `roleName`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'super_admin', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(2, 'admin', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(3, 'teacher', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(4, 'student', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL),
(5, 'user', '2025-08-04 19:41:46', '2025-08-04 19:41:46', NULL);

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
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `roleId`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'Test1', 'superadmin@example.com', '$2b$10$HIsdhsUiSp7ZllDw5Gy73.a58yeWQjur1yUFYGmHmlvYtB9q3Sv0e', 1, '2025-08-04 19:45:24', '2025-08-04 19:45:24', 0, NULL, NULL),
(13, 'SuperAdmin', 'super_admin2@gmail.com', '$2b$10$HIsdhsUiSp7ZllDw5Gy73.a58yeWQjur1yUFYGmHmlvYtB9q3Sv0e', 2, '2025-08-15 04:06:02', '2025-08-15 04:06:02', 0, NULL, NULL),
(14, 'Director_1', 'chumnanwit1@gmail.com', '$2b$10$K5axc2r76iFIHdJ0hpUufOI6/eastHcScrzws1w1/4AwOCjV.uqT6', 2, '2025-08-27 11:01:42', '2025-08-27 11:01:42', 0, NULL, NULL),
(15, 'Deputy_Director2', 'pitchaya2@gmail.com', '$2b$10$fn4lwGBMPo5frDHenuNze.9bFxOTysR.mJj8rN4pbwKEetSHbyCwS', 2, '2025-08-27 11:03:03', '2025-08-27 11:03:03', 0, NULL, NULL),
(16, 'Amon_Teacher', 'amon3@gmail.com', '$2b$10$FDYxK/XVSTZBfgsgND7LmOfyBxeLXB1FCudLbRPA/xlN2yArjYZSq', 2, '2025-08-27 11:06:22', '2025-08-27 11:06:22', 0, NULL, NULL),
(17, 'Pornsiri_Teacher', 'pornsiri4@gmail.com', '$2b$10$FzuNykeSg5ww8x5Q/s1aOeKrVmcujFs3U4odauPGbdV.dNSAF/cPy', 2, '2025-08-27 11:08:29', '2025-08-27 11:08:29', 0, NULL, NULL),
(18, 'Kesorn_Teacher', 'kesorn5@gmail.com', '$2b$10$lw/emURrZCxcIJHFacTrLOXWwXPnPXnYzwYV7KHgeAl3ZZMufYRtm', 2, '2025-08-27 11:09:13', '2025-08-27 11:09:13', 0, NULL, NULL),
(19, 'Nutthawut_Teacher', 'nutthawut6@gmail.com', '$2b$10$9txdElTBJfxySDIpK9RWeu4UmMWxRAG6EoXE9K48Bf1QZ2mR1NRi6', 2, '2025-08-27 11:10:49', '2025-08-27 11:10:49', 0, NULL, NULL),
(20, 'Wilailak_Teacher', 'wilailak7@gmail.com', '$2b$10$or1DFtHrIs.3IOV/x6UZPuA/CUfUurGWGibTludgcnbRubiCZZPsC', 2, '2025-08-27 11:12:19', '2025-08-27 11:12:19', 0, NULL, NULL),
(21, 'Surangkana_Teacher', 'surangkana8@gmail.com', '$2b$10$LDe4126fahxt4kisHWdTx.XKyKTeIgAphpmaoKjYJQRUOEK.DFywa', 2, '2025-08-27 11:12:53', '2025-08-27 11:12:53', 0, NULL, NULL),
(22, 'Saranya_Teacher', 'sarunya9@gmail.com', '$2b$10$cxzAN6.azCXECHdbaUkVyO5ptHxpWhqG20/vxpC4PBXxrGV9VhRy6', 2, '2025-08-27 11:14:15', '2025-08-27 11:14:15', 0, NULL, NULL),
(23, 'Jeeranan_Teacher', 'jeeranan10@gmail.com', '$2b$10$jTZ1Ka.gyWM9cfcYZdaxjOgr8QzUBpcYbw.KFP3baF9POXPvK9qjO', 2, '2025-08-27 11:14:57', '2025-08-27 11:14:57', 0, NULL, NULL),
(24, 'Silikanya_Teacher', 'silikanya11@gmail.com', '$2b$10$rK6XCE5z3aFVtqAPj44Q9.by.A4wbARHXC09ovObME5XDE8LVYmx.', 2, '2025-08-27 11:16:12', '2025-08-27 11:16:12', 0, NULL, NULL),
(25, 'Kamonchanok_Teacher', 'kamonchanok12@gmail.com', '$2b$10$UbbNBvcsntjABnW5nwI/.eE4r5SgMpIN.TQzGPH8DLnuV6h6XONyO', 2, '2025-08-27 11:17:41', '2025-08-27 11:17:41', 0, NULL, NULL),
(26, 'Suphachai_Teacher', 'suphachai13@gmail.com', '$2b$10$ZP9QYr.VgEuv9Smb/YFaqO9zCP/OyZ4OsPPqTLhjcBYonZKhiIXda', 2, '2025-08-27 11:18:37', '2025-08-27 11:18:37', 0, NULL, NULL),
(27, 'Ubon_Teacher', 'ubon14@gmail.com', '$2b$10$2Cy9KYMytdCO77WGn2gbMOUGsxt.tga9AMoaSdkAzsYOtCfUOEGg6', 2, '2025-08-27 11:19:26', '2025-08-27 11:19:26', 0, NULL, NULL),
(28, 'Waraporn_Teacher', 'waraporn15@gmail.com', '$2b$10$lStv1AJLUtc7ZQ2IzT.oR.36UhHS7r/KQvMtGDKUl6qG2jAwpY82K', 2, '2025-08-27 11:20:16', '2025-08-27 11:20:16', 0, NULL, NULL),
(29, 'Theeraphong_Staff', 'theeraphong16@gmail.com', '$2b$10$61tO/EKVpESTpzFmZNMDR.Q/OVU5ig6vQcE9FNarWeT9pWwjJ7AJO', 2, '2025-08-27 11:21:48', '2025-08-27 11:21:48', 0, NULL, NULL),
(30, 'Larn_Staff', 'larn17@gmail.com', '$2b$10$cRhFj8wMx8PoF7FjY05vB.YM2B8s88G2TdVpyYjQJfeI.l6oy3t6S', 2, '2025-08-27 11:22:31', '2025-08-27 11:22:31', 0, NULL, NULL),
(31, 'Taweesak_Teacher', 'taweesak18@gmail.com', '$2b$10$ZjcSzNT/OlDtQz1m1mVyvOIM99aglNeL5iroRXbNPEBEX.4KMyK4y', 2, '2025-08-27 12:35:55', '2025-08-27 12:35:55', 0, NULL, NULL),
(32, 'aa1', 'aa@gmail.com', '$2b$10$ULEBqy9uXjOyH75ATpI0YudgYfL4gfOvDnst94BgqAFz88TUl2Vlu', 5, '2025-10-10 03:01:48', '2025-10-10 03:01:48', 0, NULL, NULL),
(33, 'Test111', 'test111@example.com', '$2b$10$Izz76Bf5bvOuJyf9afb1w.EttQBIg7biMm27nYSxc0Bs58GVq9cc6', 5, '2025-10-15 03:35:17', '2025-10-15 03:35:17', 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academicclubattendance`
--
ALTER TABLE `academicclubattendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clubId` (`clubId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `academicclubs`
--
ALTER TABLE `academicclubs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teacherId` (`teacherId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `attendancestatuses`
--
ALTER TABLE `attendancestatuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author` (`author`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `classschedules`
--
ALTER TABLE `classschedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subjectId` (`subjectId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `dayOfWeekId` (`dayOfWeekId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `postId` (`postId`);

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
  ADD KEY `studentId` (`studentId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `genderName` (`genderName`);

--
-- Indexes for table `homeroomattendance`
--
ALTER TABLE `homeroomattendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `HomeroomAttendance_index_0` (`homeroomTeacherId`,`studentId`,`date`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `homeroomteacherstudent`
--
ALTER TABLE `homeroomteacherstudent`
  ADD PRIMARY KEY (`homeroomTeacherId`,`studentId`),
  ADD KEY `studentId` (`studentId`);

--
-- Indexes for table `homevisits`
--
ALTER TABLE `homevisits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_homevisits_teacher` (`teacherId`),
  ADD KEY `idx_homevisits_student` (`studentId`),
  ADD KEY `idx_homevisits_visit_date` (`visitDate`),
  ADD KEY `idx_homevisits_updated_by` (`updatedBy`),
  ADD KEY `idx_homevisits_deleted` (`isDeleted`,`deletedAt`),
  ADD KEY `idx_homevisits_student_name` (`studentName`),
  ADD KEY `idx_homevisits_student_id_number` (`studentIdNumber`);

--
-- Indexes for table `homevisit_files`
--
ALTER TABLE `homevisit_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_homevisit_files_uploader` (`uploadedBy`),
  ADD KEY `idx_homevisit_files_visit` (`homeVisitId`),
  ADD KEY `idx_homevisit_files_type` (`fileType`),
  ADD KEY `idx_homevisit_files_deleted` (`isDeleted`);

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
-- Indexes for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD KEY `genderId` (`genderId`),
  ADD KEY `homeroomTeacherId` (`homeroomTeacherId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codeSubject` (`codeSubject`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `superadmin`
--
ALTER TABLE `superadmin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD KEY `genderId` (`genderId`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`teacherId`),
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
  ADD KEY `roleId` (`roleId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academicclubattendance`
--
ALTER TABLE `academicclubattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `academicclubs`
--
ALTER TABLE `academicclubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendancestatuses`
--
ALTER TABLE `attendancestatuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `classschedules`
--
ALTER TABLE `classschedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `homeroomattendance`
--
ALTER TABLE `homeroomattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `homevisits`
--
ALTER TABLE `homevisits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `homevisit_files`
--
ALTER TABLE `homevisit_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `school_info`
--
ALTER TABLE `school_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `school_timeline`
--
ALTER TABLE `school_timeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `superadmin`
--
ALTER TABLE `superadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `userroles`
--
ALTER TABLE `userroles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academicclubattendance`
--
ALTER TABLE `academicclubattendance`
  ADD CONSTRAINT `academicclubattendance_ibfk_1` FOREIGN KEY (`clubId`) REFERENCES `academicclubs` (`id`),
  ADD CONSTRAINT `academicclubattendance_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `academicclubattendance_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `attendancestatuses` (`id`),
  ADD CONSTRAINT `academicclubattendance_ibfk_4` FOREIGN KEY (`recorderId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `academicclubattendance_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `academicclubs`
--
ALTER TABLE `academicclubs`
  ADD CONSTRAINT `academicclubs_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `academicclubs_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `admins_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `attendancestatuses`
--
ALTER TABLE `attendancestatuses`
  ADD CONSTRAINT `attendancestatuses_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `classschedules`
--
ALTER TABLE `classschedules`
  ADD CONSTRAINT `classschedules_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_3` FOREIGN KEY (`dayOfWeekId`) REFERENCES `daysofweek` (`id`),
  ADD CONSTRAINT `classschedules_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

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
  ADD CONSTRAINT `flagpoleattendance_ibfk_3` FOREIGN KEY (`recorderId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `flagpoleattendance_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `homeroomattendance`
--
ALTER TABLE `homeroomattendance`
  ADD CONSTRAINT `homeroomattendance_ibfk_1` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `homeroomattendance_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `homeroomattendance_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `attendancestatuses` (`id`),
  ADD CONSTRAINT `homeroomattendance_ibfk_4` FOREIGN KEY (`recorderId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `homeroomattendance_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `homeroomteacherstudent`
--
ALTER TABLE `homeroomteacherstudent`
  ADD CONSTRAINT `homeroomteacherstudent_ibfk_1` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `homeroomteacherstudent_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`);

--
-- Constraints for table `homevisits`
--
ALTER TABLE `homevisits`
  ADD CONSTRAINT `fk_homevisits_student` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_homevisits_teacher` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `fk_homevisits_updatedby` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `homevisit_files`
--
ALTER TABLE `homevisit_files`
  ADD CONSTRAINT `fk_homevisit_files_uploader` FOREIGN KEY (`uploadedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_homevisit_files_visit` FOREIGN KEY (`homeVisitId`) REFERENCES `homevisits` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  ADD CONSTRAINT `studentbehaviorscores_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `studentbehaviorscores_ibfk_2` FOREIGN KEY (`recorderId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `studentbehaviorscores_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`genderId`) REFERENCES `genders` (`id`),
  ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers` (`id`),
  ADD CONSTRAINT `students_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);

--
-- Constraints for table `superadmin`
--
ALTER TABLE `superadmin`
  ADD CONSTRAINT `superadmin_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `superadmin_ibfk_2` FOREIGN KEY (`genderId`) REFERENCES `genders` (`id`);

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `users` (`id`),
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
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
