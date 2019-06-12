CREATE DATABASE IF NOT EXISTS `tarpaulin`;

USE `tarpaulin`;


CREATE TABLE IF NOT EXISTS users (
    `id`        mediumint(9)                            NOT NULL    AUTO_INCREMENT,
    `name`      VARCHAR(255)                            NOT NULL,   
    `email`     VARCHAR(255)                            NOT NULL,
    `password`  VARCHAR(255)                            NOT NULL,
    `role`      ENUM('admin', 'instructor', 'student')  NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY (`email`)
);
ALTER TABLE users AUTO_INCREMENT=0;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
	(1, 'Admin', 'admin@admin.com', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'admin'),
	(2, 'Professor Hess', 'hessro@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'instructor'),
	(3, 'Number 2', '2num@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(4, 'Jane Student', 'doej@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(5, 'Student 2', '2@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(6, 'Student 3', '3@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(7, 'Student 4', '4@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(8, 'Student 5', '5@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(9, 'Student 6', '6@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(10, 'Student 7', '7@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(11, 'Student 8', '8@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(12, 'Student 9', '9@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(13, 'Student 10', '10@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student'),
	(14, 'Other Prof', 'prof@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'instructor');

CREATE TABLE IF NOT EXISTS assignments (
    `id`        mediumint(9)                            NOT NULL    AUTO_INCREMENT,
    `courseId`        mediumint(9)                            NOT NULL,
    `title`      VARCHAR(255)                            NOT NULL,   
    `description`     VARCHAR(255)                            NOT NULL,
    `points`  mediumint(9)                           NOT NULL,
    `due`      VARCHAR(255)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS submissions (
    `id`        mediumint(9)                            NOT NULL    AUTO_INCREMENT,
    `assignmentId`        mediumint(9)                            NOT NULL,
    `studentId`        mediumint(9)                            NOT NULL,
    `description`      VARCHAR(255)                            NOT NULL,   
    `timestamp`     VARCHAR(255)                            NOT NULL,
    `file`      VARCHAR(255)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `courses` (
  `id` mediumint(9)  NOT NULL AUTO_INCREMENT,
  `subject` varchar(10) NOT NULL ,
  `number` smallint(3)  NOT NULL ,
  `title` varchar(255) NOT NULL ,
  `term` varchar(10) NOT NULL ,
  `instructorId` mediumint(9) ,
  PRIMARY KEY (`id`),
  UNIQUE KEY `NO DUPS` (`number`,`subject`, `title`),
  KEY `FK_courses_users` (`instructorId`),
  CONSTRAINT `FK_courses_users` FOREIGN KEY (`instructorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `enrollment` (
	`courseId` MEDIUMINT(9) NOT NULL,
	`userId` MEDIUMINT(9) NOT NULL,
	`isInstructor` BINARY(1) NULL DEFAULT '0',
	INDEX `FK_enrollment_courses` (`courseId`),
	INDEX `FK_enrollment_users` (`userId`),
	CONSTRAINT `FK_enrollment_courses` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK_enrollment_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

/* Assignment + Submission Initialization */
INSERT INTO `assignments` VALUES
  (1,1,'Homework 1','Do math.', 100,"2019-06-14T17:00:00-11:59"),
  (2,1,'Homework 2','Do english.', 100,"2019-11-14T17:00:00-11:00"),
  (3,1,'Homework 3','Do science.', 100,"2020-14-14T17:00:00-07:00"),
  (4,2,'HW1','Go fishing.', 150,"2019-06-14T17:00:00-09:00");

INSERT INTO `submissions` VALUES
  (1,1,3,'Math baked.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (2,1,3,'No more math.', "2019-06-15T17:00:00-09:00", "example2.pdf"),
  (3,1,4,'EZ.', "2019-06-14T17:00:00-09:00", "example22.pdf"),
  (4,1,5,'Done.', "2019-06-14T17:00:00-09:00", "exampleA.pdf"),
  (5,1,6,'Finished.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (6,1,7,'Help me.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (7,1,8,'No comment.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (8,1,9,'Skittles.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (9,1,10,'Does math.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (10,1,11,'I need a doctor.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (11,1,12,'I need a calculator.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (12,1,13,'Doctor needs a calculator.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (13,2,3,'Party Time.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (14,2,4,'Sunkist.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (15,2,5,'Cutting edge chef.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (16,2,6,'Tagged.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (17,3,7,'Favorites.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (18,3,8,'Storytime.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (19,3,9,'Need more pylons.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (20,3,10,'Energy Drinks.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (21,3,11,'Cake burned.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (22,4,3,'Cheers.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (23,4,4,'Need that ad revenue.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (24,4,7,'Ducktales.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (25,1,8,'Shrek.', "2019-06-14T17:00:00-09:00", "example.pdf");

INSERT INTO `courses` (`id`, `subject`, `number`, `title`, `term`, `instructorId`) VALUES
	(1, 'GEN', 101, 'General Studies', 'SP19', 2),
	(2, 'PAC', 179, 'Fly Fishing II', 'SP19', 2),
	(3, 'CS', 493, 'Cloud App Dev', 'SP19', 2),
	(4, 'CS', 463, 'Capstone', 'SP19', 14),
	(5, 'CS', 444, 'OS2', 'F19', 14),
	(6, 'CS', 419, 'Cool Stuff', 'F19', 14),
	(7, 'CS', 419, 'Cooler Stuff', 'F19', 14),
	(9, 'PAC', 160, 'Bowling I', 'F19', 14),
	(10, 'PAC', 101, 'How to Walk', 'F19', 14),
	(11, 'PAC', 102, 'How to Run', 'W20', 14);

INSERT INTO `enrollment` (`courseId`, `userId`) VALUES
	(1, 3),
	(1, 4),
	(1, 5),
	(1, 6),
	(1, 7),
	(1, 8),
	(1, 9),
	(1, 10),
	(1, 11),
	(1, 12),
	(1, 13),
	(2, 3),
	(2, 4),
	(2, 7);
