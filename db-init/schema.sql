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

INSERT INTO users VALUES 
    (0, 'Admin', 'admin@admin.com', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'admin'), /* id 1 taken already for some reason */
    (2, 'Professor Hess', 'hessro@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'instructor'),
    (3, 'Jane Student', 'doej@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student');

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
  UNIQUE KEY `NO DUPS` (`number`,`subject`),
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
  (1,1,2,'Math baked.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (2,1,2,'No more math.', "2019-06-15T17:00:00-09:00", "example2.pdf"),
  (3,1,3,'EZ.', "2019-06-14T17:00:00-09:00", "example22.pdf"),
  (4,1,4,'Done.', "2019-06-14T17:00:00-09:00", "exampleA.pdf"),
  (5,1,5,'Finished.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (6,1,6,'Help me.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (7,1,7,'No comment.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (8,1,8,'Skittles.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (9,1,9,'Does math.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (10,1,10,'I need a doctor.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (11,1,11,'I need a calculator.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (12,1,12,'Doctor needs a calculator.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (13,2,2,'Party Time.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (14,2,3,'Sunkist.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (15,2,4,'Cutting edge chef.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (16,2,5,'Tagged.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (17,3,6,'Favorites.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (18,3,7,'Storytime.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (19,3,8,'Need more pylons.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (20,3,9,'Energy Drinks.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (21,3,10,'Cake burned.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (22,4,2,'Cheers.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (23,4,3,'Need that ad revenue.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (24,4,6,'Ducktales.', "2019-06-14T17:00:00-09:00", "example.pdf"),
  (25,1,7,'Shrek.', "2019-06-14T17:00:00-09:00", "example.pdf");