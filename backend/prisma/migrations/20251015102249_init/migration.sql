-- CreateTable
CREATE TABLE `userroles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `roleName`(`roleName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    INDEX `roleId`(`roleId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL DEFAULT 'โรงเรียนท่าบ่อพิทยาคม',
    `location` TEXT NULL,
    `foundedDate` VARCHAR(50) NULL,
    `currentDirector` VARCHAR(255) NULL,
    `education_level` VARCHAR(255) NULL,
    `department` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `heroImage` VARCHAR(500) NULL,
    `director_image` VARCHAR(500) NULL,
    `director_quote` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `createdBy` INTEGER NOT NULL,
    `updatedBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_timeline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` VARCHAR(20) NOT NULL,
    `date` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `sortOrder` INTEGER NULL DEFAULT 0,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `deletedBy` INTEGER NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genderName` VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `genderName`(`genderName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daysofweek` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendancestatuses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `name`(`name`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `superadmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `namePrefix` VARCHAR(10) NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `genderId` INTEGER NOT NULL,
    `phoneNumber` VARCHAR(10) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `userId`(`userId`),
    INDEX `genderId`(`genderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `headTeacherId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `headTeacherId`(`headTeacherId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `departmentId` INTEGER NULL,
    `namePrefix` VARCHAR(10) NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `genderId` INTEGER NOT NULL,
    `dob` DATE NULL,
    `nationality` VARCHAR(50) NULL,
    `position` VARCHAR(50) NULL,
    `level` VARCHAR(50) NULL,
    `phoneNumber` VARCHAR(10) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,
    `imagePath` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `education` VARCHAR(100) NOT NULL,
    `major` VARCHAR(100) NOT NULL,
    `biography` TEXT NOT NULL,
    `specializations` TEXT NOT NULL,

    UNIQUE INDEX `userId`(`teacherId`),
    INDEX `departmentId`(`departmentId`),
    INDEX `genderId`(`genderId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `teacherId`(`teacherId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `namePrefix` VARCHAR(10) NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `genderId` INTEGER NOT NULL,
    `classRoom` VARCHAR(50) NOT NULL,
    `studentNumber` INTEGER NOT NULL,
    `homeroomTeacherId` INTEGER NULL,
    `guardianName` VARCHAR(255) NULL,
    `guardianRelation` VARCHAR(50) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,
    `dob` DATE NOT NULL,
    `nationality` VARCHAR(50) NOT NULL,
    `weight` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `disease` VARCHAR(50) NOT NULL,
    `phoneNumber` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `userId`(`userId`),
    INDEX `genderId`(`genderId`),
    INDEX `homeroomTeacherId`(`homeroomTeacherId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codeSubject` VARCHAR(10) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `departmentId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `codeSubject`(`codeSubject`),
    INDEX `departmentId`(`departmentId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachersubjects` (
    `teacherId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `subjectId`(`subjectId`),
    PRIMARY KEY (`teacherId`, `subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classschedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class` VARCHAR(50) NOT NULL,
    `subjectId` INTEGER NULL,
    `teacherId` INTEGER NULL,
    `dayOfWeekId` INTEGER NULL,
    `room` VARCHAR(50) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    INDEX `dayOfWeekId`(`dayOfWeekId`),
    INDEX `subjectId`(`subjectId`),
    INDEX `teacherId`(`teacherId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academicclubs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `maxMembers` INTEGER NULL,
    `teacherId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,
    `category` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(50) NOT NULL,
    `registrationDeadline` DATE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `meetingDay` VARCHAR(20) NULL,
    `meetingTime` VARCHAR(20) NULL,
    `location` VARCHAR(100) NULL,
    `requirements` TEXT NULL,

    INDEX `teacherId`(`teacherId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academicclubattendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clubId` INTEGER NULL,
    `date` DATE NULL,
    `studentId` INTEGER NULL,
    `statusId` INTEGER NOT NULL,
    `summary` TEXT NULL,
    `imagePath` VARCHAR(255) NULL,
    `recorderId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    INDEX `clubId`(`clubId`),
    INDEX `recorderId`(`recorderId`),
    INDEX `statusId`(`statusId`),
    INDEX `studentId`(`studentId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flagpoleattendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NULL,
    `date` DATE NULL,
    `statusId` INTEGER NOT NULL,
    `recorderId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    INDEX `recorderId`(`recorderId`),
    INDEX `statusId`(`statusId`),
    INDEX `studentId`(`studentId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homeroomteacherstudent` (
    `homeroomTeacherId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `studentId`(`studentId`),
    PRIMARY KEY (`homeroomTeacherId`, `studentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homeroomattendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `homeroomTeacherId` INTEGER NULL,
    `studentId` INTEGER NULL,
    `date` DATE NOT NULL,
    `statusId` INTEGER NOT NULL,
    `topic` TEXT NULL,
    `summary` TEXT NULL,
    `recorderId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    INDEX `recorderId`(`recorderId`),
    INDEX `statusId`(`statusId`),
    INDEX `studentId`(`studentId`),
    INDEX `updatedBy`(`updatedBy`),
    UNIQUE INDEX `HomeroomAttendance_index_0`(`homeroomTeacherId`, `studentId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homevisits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacherId` INTEGER NULL,
    `studentId` INTEGER NULL,
    `updatedBy` INTEGER NULL,
    `visitDate` DATE NULL,
    `teacherName` VARCHAR(255) NULL,
    `studentIdNumber` VARCHAR(50) NULL,
    `studentName` VARCHAR(255) NULL,
    `studentBirthDate` DATE NULL,
    `className` VARCHAR(100) NULL,
    `parentName` VARCHAR(255) NULL,
    `relationship` VARCHAR(100) NULL,
    `occupation` VARCHAR(255) NULL,
    `monthlyIncome` VARCHAR(100) NULL,
    `familyStatus` LONGTEXT NULL,
    `mainAddress` TEXT NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `emergencyContact` VARCHAR(20) NULL,
    `houseType` LONGTEXT NULL,
    `houseMaterial` LONGTEXT NULL,
    `utilities` LONGTEXT NULL,
    `environmentCondition` TEXT NULL,
    `studyArea` VARCHAR(255) NULL,
    `visitPurpose` LONGTEXT NULL,
    `studentBehaviorAtHome` TEXT NULL,
    `parentCooperation` TEXT NULL,
    `problems` TEXT NULL,
    `recommendations` TEXT NULL,
    `followUpPlan` TEXT NULL,
    `summary` TEXT NULL,
    `notes` TEXT NULL,
    `imagePath` VARCHAR(500) NULL,
    `imageGallery` LONGTEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `idx_homevisits_deleted`(`isDeleted`, `deletedAt`),
    INDEX `idx_homevisits_student`(`studentId`),
    INDEX `idx_homevisits_student_id_number`(`studentIdNumber`),
    INDEX `idx_homevisits_student_name`(`studentName`),
    INDEX `idx_homevisits_teacher`(`teacherId`),
    INDEX `idx_homevisits_updated_by`(`updatedBy`),
    INDEX `idx_homevisits_visit_date`(`visitDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studentbehaviorscores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NULL,
    `score` INTEGER NOT NULL,
    `comments` TEXT NULL,
    `recorderId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    INDEX `recorderId`(`recorderId`),
    INDEX `studentId`(`studentId`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `coverImg` VARCHAR(255) NULL,
    `content` LONGTEXT NULL,
    `category` VARCHAR(100) NULL,
    `author` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,
    `updatedBy` INTEGER NULL,

    INDEX `author`(`author`),
    INDEX `updatedBy`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `postId`(`postId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homevisit_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `homeVisitId` INTEGER NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `filePath` VARCHAR(500) NOT NULL,
    `fileUrl` VARCHAR(500) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `fileType` ENUM('main_image', 'gallery_image', 'document') NULL DEFAULT 'gallery_image',
    `uploadedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `uploadedBy` INTEGER NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `fk_homevisit_files_uploader`(`uploadedBy`),
    INDEX `idx_homevisit_files_deleted`(`isDeleted`),
    INDEX `idx_homevisit_files_type`(`fileType`),
    INDEX `idx_homevisit_files_visit`(`homeVisitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `userroles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `attendancestatuses` ADD CONSTRAINT `attendancestatuses_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `superadmin` ADD CONSTRAINT `superadmin_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `superadmin` ADD CONSTRAINT `superadmin_ibfk_2` FOREIGN KEY (`genderId`) REFERENCES `genders`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`headTeacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_ibfk_3` FOREIGN KEY (`genderId`) REFERENCES `genders`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`genderId`) REFERENCES `genders`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `teachersubjects` ADD CONSTRAINT `teachersubjects_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `teachersubjects` ADD CONSTRAINT `teachersubjects_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `classschedules` ADD CONSTRAINT `classschedules_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `classschedules` ADD CONSTRAINT `classschedules_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `classschedules` ADD CONSTRAINT `classschedules_ibfk_3` FOREIGN KEY (`dayOfWeekId`) REFERENCES `daysofweek`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `classschedules` ADD CONSTRAINT `classschedules_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubs` ADD CONSTRAINT `academicclubs_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubs` ADD CONSTRAINT `academicclubs_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubattendance` ADD CONSTRAINT `academicclubattendance_ibfk_1` FOREIGN KEY (`clubId`) REFERENCES `academicclubs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubattendance` ADD CONSTRAINT `academicclubattendance_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubattendance` ADD CONSTRAINT `academicclubattendance_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `attendancestatuses`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubattendance` ADD CONSTRAINT `academicclubattendance_ibfk_4` FOREIGN KEY (`recorderId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `academicclubattendance` ADD CONSTRAINT `academicclubattendance_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `flagpoleattendance` ADD CONSTRAINT `flagpoleattendance_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `flagpoleattendance` ADD CONSTRAINT `flagpoleattendance_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `attendancestatuses`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `flagpoleattendance` ADD CONSTRAINT `flagpoleattendance_ibfk_3` FOREIGN KEY (`recorderId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `flagpoleattendance` ADD CONSTRAINT `flagpoleattendance_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomteacherstudent` ADD CONSTRAINT `homeroomteacherstudent_ibfk_1` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomteacherstudent` ADD CONSTRAINT `homeroomteacherstudent_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomattendance` ADD CONSTRAINT `homeroomattendance_ibfk_1` FOREIGN KEY (`homeroomTeacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomattendance` ADD CONSTRAINT `homeroomattendance_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomattendance` ADD CONSTRAINT `homeroomattendance_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `attendancestatuses`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomattendance` ADD CONSTRAINT `homeroomattendance_ibfk_4` FOREIGN KEY (`recorderId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homeroomattendance` ADD CONSTRAINT `homeroomattendance_ibfk_5` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homevisits` ADD CONSTRAINT `homevisits_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homevisits` ADD CONSTRAINT `homevisits_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homevisits` ADD CONSTRAINT `homevisits_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `studentbehaviorscores` ADD CONSTRAINT `studentbehaviorscores_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `studentbehaviorscores` ADD CONSTRAINT `studentbehaviorscores_ibfk_2` FOREIGN KEY (`recorderId`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `studentbehaviorscores` ADD CONSTRAINT `studentbehaviorscores_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `blogs`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homevisit_files` ADD CONSTRAINT `fk_homevisit_files_uploader` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `homevisit_files` ADD CONSTRAINT `fk_homevisit_files_visit` FOREIGN KEY (`homeVisitId`) REFERENCES `homevisits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
