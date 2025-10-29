-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2025 at 09:29 AM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'present', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(2, 'absent', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(3, 'late', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(4, 'sick leave', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL),
(5, 'personal leave', '2025-08-04 12:40:49', '2025-08-04 12:40:49', 0, NULL, NULL);

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
  `author` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `description`, `coverImg`, `content`, `category`, `author`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'วิทยาลัยการคอมพิวเตอร์', 'ใหม่\n', 'http://localhost:5000/uploads/blogs/1664346335_6-1760657133940-664324329.png', '{\"time\":1760684764547,\"blocks\":[{\"id\":\"FllCgQ8zK6\",\"type\":\"paragraph\",\"data\":{\"text\":\"ใหม่แห่งอนาคต\"}}],\"version\":\"2.31.0-rc.7\"}', 'การศึกษา', 1, '2025-10-16 16:25:36', '2025-10-16 16:25:36', 0, NULL, 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'Monday', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(2, 'Tuesday', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(3, 'Wednesday', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(4, 'Thursday', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL),
(5, 'Friday', '2025-08-04 12:41:08', '2025-08-04 12:41:08', NULL);

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
(9, 'ธุระการโรงเรียน', NULL, '2025-08-15 06:03:40', '2025-08-15 06:03:40', NULL),
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
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flagpoleattendance`
--

INSERT INTO `flagpoleattendance` (`id`, `studentId`, `date`, `statusId`, `recorderId`, `createdAt`, `updatedAt`, `deletedAt`, `updatedBy`) VALUES
(1, 38, '2025-10-17', 1, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(2, 39, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(3, 40, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(4, 41, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(5, 42, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(6, 43, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(7, 44, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(8, 45, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(9, 46, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(10, 47, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(11, 48, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(12, 49, '2025-10-17', 1, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(13, 50, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(14, 51, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(15, 52, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(16, 53, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(17, 54, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(18, 55, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(19, 56, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(20, 57, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(21, 58, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(22, 59, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(23, 60, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(24, 61, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(25, 62, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL),
(26, 63, '2025-10-17', 4, 1, '2025-10-17 01:08:22', '2025-10-17 01:08:22', NULL, NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `teacherName` varchar(255) DEFAULT NULL,
  `studentIdNumber` varchar(50) DEFAULT NULL,
  `studentName` varchar(255) DEFAULT NULL,
  `studentBirthDate` date DEFAULT NULL,
  `className` varchar(100) DEFAULT NULL,
  `parentName` varchar(255) DEFAULT NULL,
  `relationship` varchar(100) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `monthlyIncome` varchar(100) DEFAULT NULL,
  `familyStatus` longtext DEFAULT NULL,
  `mainAddress` text DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `emergencyContact` varchar(20) DEFAULT NULL,
  `houseType` longtext DEFAULT NULL,
  `houseMaterial` longtext DEFAULT NULL,
  `utilities` longtext DEFAULT NULL,
  `environmentCondition` text DEFAULT NULL,
  `studyArea` varchar(255) DEFAULT NULL,
  `visitPurpose` longtext DEFAULT NULL,
  `studentBehaviorAtHome` text DEFAULT NULL,
  `parentCooperation` text DEFAULT NULL,
  `problems` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `followUpPlan` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `imagePath` varchar(500) DEFAULT NULL,
  `imageGallery` longtext DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homevisits`
--

INSERT INTO `homevisits` (`id`, `teacherId`, `studentId`, `updatedBy`, `visitDate`, `teacherName`, `studentIdNumber`, `studentName`, `studentBirthDate`, `className`, `parentName`, `relationship`, `occupation`, `monthlyIncome`, `familyStatus`, `mainAddress`, `phoneNumber`, `emergencyContact`, `houseType`, `houseMaterial`, `utilities`, `environmentCondition`, `studyArea`, `visitPurpose`, `studentBehaviorAtHome`, `parentCooperation`, `problems`, `recommendations`, `followUpPlan`, `summary`, `notes`, `imagePath`, `imageGallery`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`) VALUES
(1, NULL, NULL, 1, '2025-10-28', 'นาง อุบล แสงโสดา', '12345', 'อารยา หงษา', '2020-02-05', 'มัธยม 1/2', 'ทอง', 'มารดา', 'ขายของ', NULL, NULL, '123 ม.23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"สร้างความสัมพันธ์\"', '1', '2', '3', '4', '6', '5', NULL, '/uploads/homevisits/homevisit-1761654839598-52749323-48362498518327162009083295147124407526567985npng.png', '[\"/uploads/homevisits/homevisit-1761654839598-52749323-48362498518327162009083295147124407526567985npng.png\"]', '2025-10-28 05:33:59', '2025-10-28 05:33:59', 0, NULL),
(2, NULL, NULL, 1, '2025-10-20', 'นางสาว กมลชนก รีวงษา', '1111', 'อารยา ดีดี', '2010-08-25', 'มัธยม 1/2', 'นางดี นา', 'ย่า', 'แม่บ้าน', NULL, NULL, '124 ม.13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม\"', '1ด', '2ด', '3ด', '4ด', 'ดีมาก', '5ดี', NULL, '/uploads/homevisits/homevisit-1761655834666-88891239-ERDiagramnewpng.png', '[\"/uploads/homevisits/homevisit-1761655834666-88891239-ERDiagramnewpng.png\"]', '2025-10-28 05:50:34', '2025-10-28 05:50:34', 0, NULL),
(3, NULL, NULL, 1, '2025-10-15', 'นาง อามร คำเสมอ', '1122', 'ทอง ดี', '2009-11-29', 'มัธยม 1/1', 'นา ดี', 'ปู่', 'ขายของ', NULL, NULL, '123 ม.8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม\"', 'ดี', 'ดี', 'ดี2', 'ดีมาก', 'ดี4', 'ดีมาก3', NULL, '/uploads/homevisits/homevisit-1761656237593-968116358-3png.png', '[\"/uploads/homevisits/homevisit-1761656237593-968116358-3png.png\"]', '2025-10-28 05:57:17', '2025-10-28 05:57:17', 0, NULL),
(4, NULL, NULL, 1, '2025-10-28', 'นางสาว จีรนันท์ พรหมพิภักดิ์', 'thmnt', 'ntmntm', '2025-10-02', 'มัธยม 1/2', 'tnhhnt', 'บิดา', 'iud', NULL, NULL, '133\r\nchrn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"สร้างความสัมพันธ์, แก้ไขปัญหา\"', 'dhtn', 'pyfgcr', 'htns', 'crl', 'fgcrl/=', 'xb', NULL, '/uploads/homevisits/homevisit-1761656980519-137008800-48502428818351952273012037243296300434684290npng.png', '[\"/uploads/homevisits/homevisit-1761656980519-137008800-48502428818351952273012037243296300434684290npng.png\"]', '2025-10-28 06:09:40', '2025-10-28 06:09:40', 0, NULL),
(5, NULL, NULL, 1, '2025-10-08', 'นาง พรศิริ พิมพ์พา', 'thmnt', 'ntmntm', '2025-10-15', 'มัธยม 2/1', 'tnhhnt', 'ย่า', 'tmnmnm', NULL, NULL, 'htns', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม, ติดตามผลการเรียน\"', 'htns-\r\n', 'rl/=', 'jkxbmwv', ';qjkxbmw', 's-', 'euidhtn', NULL, '/uploads/homevisits/homevisit-1761658119107-688152843-ERDiagramnewpng.png', '[\"/uploads/homevisits/homevisit-1761658119107-688152843-ERDiagramnewpng.png\"]', '2025-10-28 06:28:39', '2025-10-28 06:28:39', 0, NULL),
(6, NULL, NULL, 1, '2025-10-28', 'นาง วราภรณ์ แสงแก้ว', 'thmnt', 'ntmntm', '2025-10-07', 'มัธยม 2/1', 'tnhhnt', 'ย่า', 'dhtns-', NULL, NULL, 'yfgcrl/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"ติดตามพฤติกรรม, ให้คำแนะนำ\"', 'htns', 'tns-', 'yfg', 'fgcrl/', 'iid-', 'kxbmwv', NULL, '/uploads/homevisits/homevisit-1761659207242-499387572-3png.png', '[\"/uploads/homevisits/homevisit-1761659207242-499387572-3png.png\"]', '2025-10-28 06:46:47', '2025-10-28 06:46:47', 0, NULL),
(7, NULL, NULL, 1, '2025-10-28', 'นาง พิชญา สุวงศ์', 'thmnt', 'ntmntm', '2025-10-08', 'มัธยม 3/1', 'tnhhnt', 'ตา', 'igcrl/', NULL, NULL, 'yfgcrl/=', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"สร้างความสัมพันธ์, ติดตามผลการเรียน\"', 'gcrl/', 'yfgl//', 'yfgcrl/', 'yfgcrl/', 'idhtns-', 'pyfgcrl/', NULL, '/uploads/homevisits/homevisit-1761659653401-680127917-2jpg.jpg', '[\"/uploads/homevisits/homevisit-1761659653401-680127917-2jpg.jpg\"]', '2025-10-28 06:54:13', '2025-10-28 06:54:13', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `homevisit_files`
--

CREATE TABLE `homevisit_files` (
  `id` int(11) NOT NULL,
  `homeVisitId` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(500) NOT NULL,
  `fileUrl` varchar(500) NOT NULL,
  `fileSize` int(11) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
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
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `deletedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `school_info`
--

INSERT INTO `school_info` (`id`, `name`, `location`, `foundedDate`, `currentDirector`, `education_level`, `department`, `description`, `heroImage`, `director_image`, `director_quote`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`, `deletedAt`, `deletedBy`) VALUES
(1, 'โรงเรียนท่าบ่อพิทยาคม', 'ตำบลท่าบ่อ อำเภอท่าบ่อ จังหวัดหนองคาย 43110', '2534', 'นายชำนาญวิทย์ ประเสริฐ', 'มัธยมศึกษาตอนต้น-มัธยมศึกษาตอนปลาย (ม.1 - ม.6)', 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21', 'โรงเรียนท่าบ่อพิทยาคม เป็นสถานศึกษาที่มุ่งเน้นพัฒนาคุณภาพการศึกษา ส่งเสริมคุณธรรม จริยธรรม และการเรียนรู้ในศตวรรษที่ 21', '/src/assets/images/thabo_school.jpg', 'http://www.thabopit.com/_files_school/43100510/person/43100510_0_20241104-160235.jpg', 'มุ่งมั่นพัฒนาคุณภาพการศึกษา เพื่อสร้างคนดี คนเก่ง และมีความสุข ', '2025-08-07 02:05:18', '2025-10-28 12:10:25', 0, 1, 0, NULL, NULL);

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
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL,
  `deletedBy` int(11) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `school_timeline`
--

INSERT INTO `school_timeline` (`id`, `year`, `date`, `title`, `description`, `sortOrder`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `deletedBy`, `isDeleted`, `deletedAt`) VALUES
(1, '1991', '1991-05-14', 'เปิดทำการเรียนการสอนเป็นครั้งแรก', 'โรงเรียนท่าบ่อพิทยาคมเริ่มเปิดทำการเรียนการสอนเมื่อวันที่ 14 พฤษภาคม 2534 โดยเป็นโรงเรียนสาขาของโรงเรียนท่าบ่อ มี นายประพันธ์ พรหมกูล เป็นผู้ดูแลการสอน โดยขอใช้อาคารเรียนของ โรงเรียนบ้านหงส์ทองสามขา เป็นสถานที่เรียนชั่วคราว มีนักเรียนทั้งหมด 86 คน จำนวน 2 ห้องเรียน', 1, '2025-08-07 02:05:18', '2025-09-17 20:07:57', 0, 1, 0, 0, NULL),
(2, '1992', '1992-02-26', 'จัดตั้งเป็นโรงเรียนเอกเทศ', 'โรงเรียนได้ย้ายมาอยู่ ณ บริเวณที่สาธารณประโยชน์ หมู่ 9 บ้านป่าสัก ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย บนที่ดินจำนวน ประมาณ 65 ไร่ ซึ่งได้รับบริจาคจาก 1.คุณยายแก่นคำ มั่งมูล 2.คุณแม่สุบิน น้อยโสภา 3.คุณพ่อสุพล น้อยโสภา โดยได้รับงบประมาณในการสร้างอาคารเรียนจาก กรมสามัญศึกษา กระทรวงศึกษาธิการ และเมื่อวันที่ 26 กุมภาพันธ์ 2535 ได้รับประกาศจัดตั้งเป็นเอกเทศอย่างเป็นทางการในชื่อว่า “โรงเรียนท่าบ่อพิทยาคม” กรมสามัญศึกษาได้แต่งตั้ง นายศิริ เพชรคีรี ผู้ช่วยผู้อำนวยการโรงเรียนท่าบ่อ เป็นผู้รักษาการในตำแหน่งครูใหญ่', 2, '2025-08-07 02:05:18', '2025-09-17 20:05:11', 0, 1, 0, 0, NULL),
(3, '2002', '2002-03-28', 'พัฒนาอาคารสถานที่', 'โรงอาหารมาตรฐานขนาด 300 ที่นั่ง จำนวน 1 หลังโรงเรียนได้รับจัดสรรงบประมาณจากกรมสามัญศึกษาเพื่อสร้างอาคารเรียนแบบกึ่งถาวร 1 หลัง และโรงอาหารมาตรฐาน 300 ที่นั่ง 1 หลัง', 3, '2025-08-07 02:05:18', '2025-08-07 02:05:18', 0, 1, 0, 0, NULL),
(4, '2003', '2003-05-08', 'เปลี่ยนสังกัดครั้งที่ 1', 'เมื่อวันที่ 7 กรกฎาคม 2546 โรงเรียนท่าบ่อพิทยาคมได้เปลี่ยนมาสังกัด สำนักงานเขตพื้นที่การศึกษาหนองคาย เขต 1\nภายใต้สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน กระทรวงศึกษาธิการ\nตาม พระราชบัญญัติระเบียบบริหารราชการกระทรวงศึกษาธิการ พ.ศ. 2546', 4, '2025-08-07 02:05:18', '2025-08-27 03:49:56', 0, 1, 0, 0, NULL),
(5, '2010', '2010-07-23', 'สังกัดเขตพื้นที่การศึกษามัธยมศึกษา', 'เมื่อวันที่ 23 กรกฎาคม 2553 โรงเรียนได้เปลี่ยนมาสังกัด สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 21\nตาม พ.ร.บ.การศึกษาแห่งชาติ (ฉบับที่ 3), พ.ร.บ.ระเบียบบริหารราชการกระทรวงศึกษาธิการ (ฉบับที่ 3), พ.ร.บ.ระเบียบข้าราชการครูและบุคลากรทางการศึกษา (ฉบับที่ 3) ซึ่งได้ประกาศในราชกิจจานุเบกษาเมื่อวันที่ 22 กรกฎาคม 2553 และมีผลบังคับใช้ตั้งแต่วันที่ 23 กรกฎาคม 2553', 5, '2025-08-07 02:05:18', '2025-08-07 02:05:18', 0, 1, 0, 0, NULL),
(6, '2025', '2025-04-27', 'การพัฒนาอย่างต่อเนื่อง', 'ปัจจุบัน โรงเรียนท่าบ่อพิทยาคมมีนายชำนาญวิทย์ ประเสริฐ ดำรงตำแหน่งผู้อำนวยการโรงเรียน และมีการพัฒนาอย่างต่อเนื่องเพื่อมุ่งสู่ความเป็นเลิศทางวิชาการ', 6, '2025-08-07 02:05:18', '2025-08-07 02:05:18', 0, 1, 0, 0, NULL),
(9, '2024', '2024-06-07', 'helloworld', 'abce', 0, '2025-08-07 04:46:16', '2025-08-07 05:00:22', 12, 1, 1, 1, '2025-10-28 08:18:34'),
(10, '2035', '14  MAY 2035', 'MARS', 'OEUAO', 0, '2025-08-07 05:07:07', '2025-08-07 05:07:25', 12, 0, 1, 1, '2025-10-28 04:03:44'),
(11, '2035', '14 semtember 2024', 'mar', 'oa', 0, '2025-08-07 05:09:53', '2025-08-07 05:10:59', 12, 0, 1, 1, '2025-10-28 04:03:48'),
(12, '2564', '12 มีนาคม', 'ข่าวสาร', 'เทส', 0, '2025-08-07 18:45:16', '2025-08-07 18:46:58', 12, 0, 0, 1, '2025-10-28 04:39:37'),
(13, '2568', '12 มกราคม 2568', 'hello', 'hngs', 0, '2025-09-17 19:05:40', '2025-09-17 19:08:00', 13, 13, 1, 1, '2025-10-28 04:24:46'),
(14, '2568', '12 มกราคม 2568', 'helloworld', 'oauntoh', 0, '2025-09-17 19:08:43', '2025-09-17 19:08:54', 13, 13, 1, 1, '2025-10-28 05:28:44'),
(15, '2025', '2025-10-10', 'hello', 'hellobnt', 0, '2025-09-17 19:09:17', '2025-09-17 19:33:19', 13, 1, 1, 1, '2025-10-28 05:29:36'),
(16, '2025', '', 'hello', 'hello', 0, '2025-09-17 19:32:51', '2025-09-17 19:33:16', 13, 13, 1, 1, '2025-10-28 05:29:40'),
(17, '2020', '2025-09-18', 'hello', 'hello', 0, '2025-09-17 19:59:23', '2025-09-17 19:59:23', 13, 13, 1, 1, '2025-10-28 08:18:30'),
(18, '2020', '2025-10-15', 't', '', 0, '2025-10-28 05:20:15', '2025-10-28 05:20:15', 1, 1, 1, 1, '2025-10-28 05:20:28'),
(19, '2022', '2025-10-08', 'สร้างงาน', 'เริ่มต้นสร้าง', 0, '2025-10-28 08:16:50', '2025-10-28 08:16:50', 1, 1, 1, 1, '2025-10-28 08:18:26');

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

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `namePrefix` varchar(10) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `genderId` int(11) NOT NULL,
  `classRoom` varchar(50) NOT NULL,
  `studentNumber` int(11) DEFAULT NULL,
  `homeroomTeacherId` int(11) DEFAULT NULL,
  `guardianName` varchar(255) DEFAULT NULL,
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
  `phoneNumber` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `namePrefix`, `fullName`, `genderId`, `classRoom`, `studentNumber`, `homeroomTeacherId`, `guardianName`, `guardianRelation`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `dob`, `nationality`, `weight`, `height`, `disease`, `phoneNumber`) VALUES
(1, 'เด็กชาย', 'เกรียงศักดิ์ ยะสุนทร', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'เด็กชาย', 'จิรายุทธ เวทไธสง', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'เด็กชาย', 'จีรภัทร วงษ์บุญจันทร์', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'เด็กชาย', 'ชูศักดิ์ ศรีพุทธา', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'เด็กชาย', 'ณัฐยศ หาสอดส่อง', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'เด็กชาย', 'ทวีทรัพย์ มั่งมูล', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'เด็กชาย', 'ทองขัน พรมภักดี', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'เด็กชาย', 'นราธิป ปากมงคล', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'เด็กชาย', 'มังกร ราชวงศ์', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'เด็กชาย', 'ยอดศักดิ์ แก้วอาษา', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'เด็กชาย', 'เรืองทรัพย์ ชัยปัญญา', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 'เด็กชาย', 'วีระกร เข็มเพชร', 1, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'เด็กหญิง', 'กุลวรินทร์ ดวงแก้ว', 2, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 'เด็กหญิง', 'ชลธิชา แก้วทะชาติ', 2, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'เด็กหญิง', 'ธัญญรัศม์ ถิ่นพลวัว', 2, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'เด็กหญิง', 'ธัญพิชชา ฤทธิมาร', 2, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'เด็กหญิง', 'ลลิตา แสงราม', 2, '1/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'เด็กชาย', 'สุเชาว์ สัพโส', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 'เด็กชาย', 'ชญานิน เอมวงษ์', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'เด็กชาย', 'ธนวัฒน์ จริงวาจา', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 'เด็กชาย', 'นตพล โคตรสุโน', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'เด็กชาย', 'ปติกรณ์ มูลวงศรี', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'เด็กชาย', 'ปิยะพงษ์ ศรีอ้วน', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 'เด็กชาย', 'พุฒิพงษ์ ยี่รัมย์', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 'เด็กชาย', 'วรวุฒิ เหล่าชัย', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 'เด็กชาย', 'ศราวุธ สีอ่อน', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 'เด็กชาย', 'สันติราษฏร์ พิทักษ์ไตรรัตน์', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 'เด็กชาย', 'อดิเทพ กุลชรน้อย', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'เด็กชาย', 'อธิป แก่นท้าว', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'เด็กชาย', 'อนุพงษ์ ไชยจันพรม', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 'เด็กชาย', 'อิทธิพัทธ์ ถิ่นทัพไทย', 1, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 'เด็กหญิง', 'ปวีณ์ธิดา เข็มพรมมา', 2, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 'เด็กหญิง', 'ฟ้ารุ่ง เพียปัญญา', 2, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 'เด็กหญิง', 'มัทนาพร วงค์บุตรศรี', 2, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 'เด็กหญิง', 'ศศิวิมล บุตรพรม', 2, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 'เด็กหญิง', 'งามพิศศรี ไชยสวาสดิ์', 2, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 'เด็กหญิง', 'นันทิตา บัวแก้ว', 2, '1/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 'เด็กชาย', 'ไกรวิทย์ สานชุม', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 'เด็กชาย', 'ทัศนพงษ์ ชาวชายโขง', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 'เด็กชาย', 'ปกป้อง มายัง', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 'เด็กชาย', 'ปฏิภัทร บุญตาฤทธิ์', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 'เด็กชาย', 'ภาณุมาศ เข็มเพชร', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 'เด็กชาย', 'วิษณุ ชัยวรรณ์', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 'เด็กหญิง', 'ชุติกาญจน์ วงษ์โยธา', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 'เด็กหญิง', 'ณัฐณิชา บันดิษฐ', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 'เด็กหญิง', 'บัณฑิตา แก้วมุงคุณ', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 'เด็กหญิง', 'เบญญาภา วิเศษจินดาคุณ', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 'เด็กหญิง', 'วิลาสินี ถาราช', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 'เด็กชาย', 'คณิศร ทองนิโรจน์', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 'เด็กชาย', 'ชวนกร ประพุทธา', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 'เด็กชาย', 'ธนาวัฒน์ ดีขยัน', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 'เด็กชาย', 'พงศธร สร้างสอบ', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 'เด็กชาย', 'ศรัณย์ภัทร บัวแก้ว', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 'เด็กชาย', 'อโณทัย สิงห์ทุย', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 'เด็กหญิง', 'จิรนันท์ ทูลฉลอง', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 'เด็กหญิง', 'ชนาธิป แฟนพิมาย', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 'เด็กหญิง', 'พรนภา ศิริแก้วเลิศ', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 'เด็กหญิง', 'พรภิมล ปากมงคล', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 'เด็กหญิง', 'พัชราภา คำทวี', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 'เด็กหญิง', 'ศรัณย์พร บัวแก้ว', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(61, 'เด็กหญิง', 'ศิรินาฎ สีดาเดช', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 'เด็กชาย', 'ภูวนารถ คำตุ้ย', 1, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, 'เด็กหญิง', 'ครสวรรค์ พรมภักดี', 2, '2/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 'เด็กชาย', 'ณัฐวัฒน์ บ่าพิมาย', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 'เด็กชาย', 'กฤษณพงษ์ มั่งมูล', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 'เด็กชาย', 'ชวกร ลุนรักษา', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 'เด็กชาย', 'ณัฐพงศ์ สระแก้ว', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 'เด็กชาย', 'นิธิ ศิลาโล่ห์', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 'เด็กชาย', 'พงษ์ณุกร จันสมบัติ', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 'เด็กชาย', 'ภาณุวัฒน์ ปุระศรี', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 'เด็กชาย', 'ภูวดล ปลัดพรม', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 'เด็กชาย', 'ศุภวิชย์ ศรีษา', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 'เด็กชาย', 'สุเมธ ปานิคม', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 'เด็กชาย', 'อิสระภาพ นามวิชัย', 1, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 'เด็กหญิง', 'เกศรา ชาวชายโขง', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(76, 'เด็กหญิง', 'ชุติมา วงศ์อ่อน', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 'เด็กหญิง', 'ธนัชชา นามภักดี', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 'เด็กหญิง', 'พรมนัส โสมนัส', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 'เด็กหญิง', 'พัสนันท์ บ้านกลาง', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 'เด็กหญิง', 'พิมพ์พา ชาวชายโขง', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(81, 'เด็กหญิง', 'รัตนาพร ภูธร', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 'เด็กหญิง', 'สุทธิดา โอกาสวิไล', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 'เด็กหญิง', 'สุภัสสร สุดจิตร์', 2, '3/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 'เด็กชาย', 'ฉัตรพร กำแก้ว', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 'เด็กชาย', 'ธีรนัย แก้วมุงคุณ', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 'เด็กชาย', 'ธีรศักดิ์ จันทร์ดี', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(87, 'เด็กชาย', 'ภานุวัฒน์ คณิกา', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(88, 'เด็กชาย', 'วิษณุ สายสุนา', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(89, 'เด็กชาย', 'วีรพงษ์ กองสุวรรณ', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(90, 'เด็กชาย', 'อติเทพ พุทธะ', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(91, 'เด็กชาย', 'อนุพงษ์ บุญเหลือ', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(92, 'เด็กหญิง', 'จันทร์จิรา บทมาตย์', 2, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(93, 'เด็กหญิง', 'ธารทอง สุดแสง', 2, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(94, 'เด็กหญิง', 'มัทธนา มุลวงศรี', 2, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(95, 'เด็กหญิง', 'เมษา วงษา', 2, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(96, 'เด็กหญิง', 'ศิรดา พรมสมบัติ', 2, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(97, 'เด็กชาย', 'ธราเทพ คุณความดี', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(98, 'เด็กชาย', 'รัฐพล อุสสิทธิ์', 1, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(99, 'เด็กหญิง', 'พรทิวา คำภูมี', 2, '3/2', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(100, 'นาย', 'ชนกานต์ นามมัน', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(101, 'นาย', 'นฤชัย ชื่นจะโปะ', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(102, 'นาย', 'ปรัชญา งามสง่า', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(103, 'นาย', 'อโณทัย หาญวงค์', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(104, 'นาย', 'อดิศรา โคตรโสภา', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(105, 'นาย', 'อธิวรา ทิพย์สมบัติ', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(106, 'นาย', 'อนุวัต นารีจันทร์', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(107, 'นางสาว', 'กมลทิพย์ ชัยปัญหา', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(108, 'นางสาว', 'ดรุณี ทัดสบง', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(109, 'นางสาว', 'ปนัดดา โสนันทะ', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(110, 'นางสาว', 'ปาริตา ฆ้องเกิด', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(111, 'นางสาว', 'สุพัตรา วรวิเวศ', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(112, 'นาย', 'กรวิญช์ หงส์เอก', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(113, 'นาย', 'อำนาจ แก้วศรีขาว', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(114, 'นางสาว', 'พิชามญชุ์ นามพรม', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(115, 'นางสาว', 'วสุธิดา วงษาเทพ', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(116, 'นางสาว', 'ศิริลักษณ์ ศรีวิลัย', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(117, 'นางสาว', 'ศุภธิดา คุณกะ', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(118, 'นางสาว', 'ปาณิศา ฝ้ายสีงาม', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(119, 'นางสาว', 'ปิยรัตน์ เพชรพันธ์', 2, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(120, 'นาย', 'ร่มเกล้า ธรรมรังศรี', 1, '4/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(121, 'นาย', 'ณัฐวัฒน์ ภาษี', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(122, 'นาย', 'เอกภาพ มงคล', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(123, 'นาย', 'ฐิติภัทร ศรีภา', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(124, 'นาย', 'จีรยุทธ ชาวชายโขง', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(125, 'นางสาว', 'ปฏิมา ภูธร', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(126, 'นางสาว', 'กิตติยา คิดเล็ก', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(127, 'นางสาว', 'น้ำฟ้า เดชศร', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(128, 'นางสาว', 'ดวงเดือน ทะศิริ', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, 'นางสาว', 'กัญญาพร จันทร์ตระกูล', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, 'นางสาว', 'กันยารัตน์ มิ่งขุนทด', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(131, 'นางสาว', 'จิตรวิไล ผิวเงิน', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(132, 'นางสาว', 'ศิรินภา เทวงศา', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(133, 'นางสาว', 'ดาราวดี มั่งมูล', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(134, 'นาย', 'ถิรวัฒน์ ดวงดี', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(135, 'นาย', 'จักรกฤษณ์ แก้วตา', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(136, 'นางสาว', 'ดวงกมล นรสาร', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(137, 'นางสาว', 'ศิราธร คุณความดี', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(138, 'นางสาว', 'มนัสนันท์ แสงโชติ', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(139, 'นางสาว', 'น้ำฝน สีหาวงค์', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(140, 'นางสาว', 'กัณธิมา เข็มสีดา', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(141, 'นาย', 'มาฆวัณ แก้วสอนดี', 1, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(142, 'นางสาว', 'รักษมันท์ มหาวัน', 2, '5/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(143, 'นาย', 'ชิตพล บุตรโยธี', 1, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(144, 'นาย', 'ปิยะวัฒน์ นวลคำสิงห์', 1, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(145, 'นาย', 'รัฐภูมิ สีงาม', 1, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(146, 'นางสาว', 'ณิชา โคตรโสภา', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(147, 'นางสาว', 'ทับทิมทอง สุดแสง', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(148, 'นางสาว', 'ปานไพรินทร์ ชัยวรรรณ์', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(149, 'นางสาว', 'เพชรรัตน์ บันดิษฐ', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(150, 'นางสาว', 'ฟ้ารุ่ง นวลคำสิงห์', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(151, 'นางสาว', 'ศรัณยา พันพิลา', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(152, 'นางสาว', 'อภิญญา โยธา', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(153, 'นางสาว', 'ศศิกานต์ ศิลปกิจวงษ์กุล', 2, '6/1', NULL, NULL, NULL, NULL, '2025-10-16 16:19:46', '2025-10-16 16:19:46', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `teacherId`, `userId`, `departmentId`, `namePrefix`, `fullName`, `genderId`, `dob`, `nationality`, `position`, `level`, `phoneNumber`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`, `imagePath`, `email`, `address`, `education`, `major`, `biography`, `specializations`) VALUES
(1, NULL, NULL, 1, 'นาย', 'ชำนาญวิทย์ ประเสริฐ', 1, NULL, 'ไทย', 'ผู้อำนวยการ', 'คศ. 3', '0642466644', '2025-08-27 11:29:44', '2025-08-27 11:29:44', 0, NULL, NULL, '/src/assets/images/teachers/admin1.jpg', 'Chumnanwit1@gmail.com', '', 'ปริญญาโท', '', '', ''),
(2, NULL, NULL, 1, 'นาง', 'พิชญา สุวงศ์', 2, '1972-01-13', 'ไทย', 'รองผู้อำนวยการ', 'คศ. 3', '0872153025', '2025-08-27 11:39:13', '2025-08-27 11:39:13', 0, NULL, NULL, '/src/assets/images/teachers/admin2.jpg', 'pitchaya2@gmail.com', '277 ต.พานพร้าว อ.ศรีเชียงใหม่ จ.หนองคาย', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย มหาวิทยาลัยพิษณุโลก', '', ''),
(3, NULL, NULL, 2, 'นาง', 'อามร คำเสมอ', 2, '1976-04-19', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0882653492', '2025-08-27 11:48:51', '2025-08-27 11:48:51', 0, NULL, NULL, '/src/assets/images/teachers/thai1.jpg', 'amon3@gmail.com', '', 'ปริญญาโท', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', ''),
(4, NULL, NULL, 2, 'นาง', 'พรศิริ พิมพ์พา', 2, '1985-06-14', 'ไทย', 'ครูชำนาญการพิเศษ', 'คศ. 3', '0645385853', '2025-08-27 12:00:00', '2025-08-27 12:00:00', 0, NULL, NULL, '/src/assets/images/teachers/thai2.jpg', 'pornsiri4@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกภาษาไทย', '', ''),
(5, NULL, NULL, 3, 'นาง', 'เกษร ผาสุข', 2, '1987-07-24', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0665432587', '2025-08-27 12:02:31', '2025-08-27 12:02:31', 0, NULL, NULL, '/src/assets/images/teachers/math1.jpg', 'kesorn5@gmail.com', '', 'ปริญญาโท', 'เอกวิทยาศาสตร์', '', ''),
(6, NULL, NULL, 3, 'นาย', 'ณัฐวุฒิ เจริญกุล', 1, '1978-10-22', 'ไทย', 'ครู', 'คศ. 3', '0982653456', '2025-08-27 12:06:12', '2025-08-27 12:06:12', 0, NULL, NULL, '/src/assets/images/teachers/math2.jpg', 'Nutthawut6@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(7, NULL, NULL, 4, 'นางสาว', 'วิไลลักษณ์ อ่างแก้ว', 2, '1987-02-27', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0923685489', '2025-08-27 12:09:17', '2025-08-27 12:09:17', 0, NULL, NULL, '/src/assets/images/teachers/science1.jpg', 'wilailak7@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', '', '', ''),
(8, NULL, NULL, 4, 'นางสาว', 'สุรางคณา เหลืองกิจไพบูลย์', 2, NULL, 'ไทย', 'ครู', 'คศ. 1', '0654657895', '2025-08-27 12:11:32', '2025-08-27 12:11:32', 0, NULL, NULL, '/src/assets/images/teachers/science2.jpg', 'surangkana8@gmail.com', '', 'ปริญญาโท', 'คณะวิทยาศาสตร์ สาขาเทคโนโลยีสารสนเทศ มหาวิทยาลัยขอนแก่น', '', ''),
(9, NULL, NULL, 4, 'นางสาว', 'ศรัณยา ดลรัศมี', 2, NULL, 'ไทย', 'ครูผู้ช่วย', NULL, '0889684532', '2025-08-27 12:14:28', '2025-08-27 12:14:28', 0, NULL, NULL, '/src/assets/images/teachers/science3.jpg', 'sarunya9@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(10, NULL, NULL, 4, 'นางสาว', 'จีรนันท์ พรหมพิภักดิ์', 2, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0975264855', '2025-08-27 12:18:10', '2025-08-27 12:18:10', 0, NULL, NULL, '/src/assets/images/teachers/science4.jpg', 'jeeranan10@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(11, NULL, NULL, 5, 'นางสาว', 'ศิริกัญญา กาอุปมุง', 2, NULL, 'ไทย', 'หัวหน้ากลุ่มสาระ', 'ครูผู้ช่วย', '0932458765', '2025-08-27 12:27:40', '2025-08-27 12:27:40', 0, NULL, NULL, '/src/assets/images/teachers/social1.jpg', 'silikanya11@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(12, NULL, NULL, 5, 'นางสาว', 'กมลชนก รีวงษา', 2, NULL, 'ไทย', 'ครูอัตราจ้าง', '', '0654678475', '2025-08-27 12:32:37', '2025-08-27 12:32:37', 0, NULL, NULL, '/src/assets/images/teachers/social2.jpg', 'kamonchanok12@gmail.com', 'ต.กองนาง อ.ท่าบ่อ จ.หนองคาย', 'ปริญญาตรี', 'คณะมนุษยศาตร์ สาขาวิชาสังคมศาสตร์', '', ''),
(13, NULL, NULL, 6, 'นาย', 'ทวีศักดิ์ มณีรัตน์\r\n', 1, '1984-05-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0852468592', '2025-08-27 12:39:05', '2025-08-27 12:39:05', 0, NULL, NULL, '/src/assets/images/teachers/health1.jpg', 'taweesak18@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(14, NULL, NULL, 7, 'นาย', 'ศุภชัย โคตรชมภู', 1, '1988-04-23', 'ไทย', 'หัวหน้ากลุ่มสาระ', 'คศ. 3', '0875364854', '2025-08-27 12:41:59', '2025-08-27 12:41:59', 0, NULL, NULL, '/src/assets/images/teachers/art1.jpg', 'suphachai13@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(15, NULL, NULL, 8, 'นาง', 'อุบล แสงโสดา', 2, '1979-08-25', 'ไทย', 'ครู', 'คศ. 3', '0653425859', '2025-08-27 12:44:40', '2025-08-27 12:44:40', 0, NULL, NULL, '/src/assets/images/teachers/foreign1.jpg', 'ubon14@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษศาสตร์ สาขาวิชาภาษาอังกฤษ', '', ''),
(16, NULL, NULL, 8, 'นาง', 'วราภรณ์ แสงแก้ว', 2, NULL, 'ไทย', 'พนักงานราชการ', 'คศ. 3', '0854325869', '2025-08-27 12:47:01', '2025-08-27 12:47:01', 0, NULL, NULL, '/src/assets/images/teachers/foreign2.jpg', 'waraporn15@gmail.com', '', 'ปริญญาตรี', 'คณะมนุษยศาสตร์ เอกวิชาภาษาอังกฤษ', '', ''),
(17, NULL, NULL, 9, 'นาย', 'ธีรพงษ์ หมอยาเก่า', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, '0963568745', '2025-08-27 12:50:12', '2025-08-27 12:50:12', 0, NULL, NULL, '/src/assets/images/teachers/support1.jpg', 'theeraphong16@gmail.com', '', 'ปริญญาตรี', '', '', ''),
(18, NULL, NULL, 10, 'นาย', 'ลาญู น้อยโสภา', 1, NULL, 'ไทย', 'พนักงานราชการ', NULL, NULL, '2025-08-27 12:50:12', '2025-08-27 12:50:12', 0, NULL, NULL, '/src/assets/images/teachers/support2.jpg', 'larn17@gmail.com', '', '', '', '', '');

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
(5, 'user', '2025-08-04 12:41:46', '2025-08-04 12:41:46', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `roleId`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`, `updatedBy`) VALUES
(1, 'admin', 'admin@admin.com', '$2b$10$wLgfGWvjj6D1WezFICM40uIUJGDJVayRxo1GbqCToqd4MuCxoY53O', 1, '2025-10-16 16:21:51', '2025-10-16 16:21:51', 0, NULL, NULL),
(2, 'Test', 'test@example.com', '$2b$10$olwQmZ4vq2l7BJF4ZQt/7O0yD8S.O7nQU2Cu4Xepemxn9.Z6K8B9q', 5, '2025-10-17 00:43:05', '2025-10-17 00:43:05', 0, NULL, NULL);

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
('c34bdb52-cabe-431a-b621-871677e262e2', 'ba25a8f99f9257ed0b3383354d539464ca2fbc6df698be91e7e944d340beb54f', '2025-10-16 23:19:44.296', '20251015181440_init2', NULL, NULL, '2025-10-16 23:19:42.198', 1),
('f535d1da-c5d2-4401-ad25-03a45dbf2e36', '7bd9688ab6922ac987c5adf41840e885e3e717140daffa34f76cd9ed3f792def', '2025-10-16 23:19:44.360', '20251016114222_update_techers_table', NULL, NULL, '2025-10-16 23:19:44.297', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academicclubattendance`
--
ALTER TABLE `academicclubattendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clubId` (`clubId`),
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `studentId` (`studentId`),
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
  ADD KEY `dayOfWeekId` (`dayOfWeekId`),
  ADD KEY `subjectId` (`subjectId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `updatedBy` (`updatedBy`);

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
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `studentId` (`studentId`),
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
  ADD KEY `idx_homevisits_deleted` (`isDeleted`,`deletedAt`),
  ADD KEY `idx_homevisits_student` (`studentId`),
  ADD KEY `idx_homevisits_student_id_number` (`studentIdNumber`),
  ADD KEY `idx_homevisits_student_name` (`studentName`),
  ADD KEY `idx_homevisits_teacher` (`teacherId`),
  ADD KEY `idx_homevisits_updated_by` (`updatedBy`),
  ADD KEY `idx_homevisits_visit_date` (`visitDate`);

--
-- Indexes for table `homevisit_files`
--
ALTER TABLE `homevisit_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_homevisit_files_uploader` (`uploadedBy`),
  ADD KEY `idx_homevisit_files_deleted` (`isDeleted`),
  ADD KEY `idx_homevisit_files_type` (`fileType`),
  ADD KEY `idx_homevisit_files_visit` (`homeVisitId`);

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
  ADD KEY `recorderId` (`recorderId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
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
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `classschedules`
--
ALTER TABLE `classschedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `studentbehaviorscores`
--
ALTER TABLE `studentbehaviorscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `superadmin`
--
ALTER TABLE `superadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `userroles`
--
ALTER TABLE `userroles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `flagpoleattendance_ibfk_3` FOREIGN KEY (`recorderId`) REFERENCES `users` (`id`),
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
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
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
