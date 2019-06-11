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
    (0, 'Admin', 'admin@admin.com', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'admin'),
    (1, 'Professor Hess', 'hessro@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'instructor'),
    (2, 'Jane Student'. 'doej@oregonstate.edu', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'student');

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
)