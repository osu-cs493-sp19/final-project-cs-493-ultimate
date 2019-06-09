CREATE DATABASE IF NOT EXISTS `tarpaulin`;
USE `tarpaulin`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','instructor','student') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) 

CREATE TABLE IF NOT EXISTS `courses` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(10) NOT NULL DEFAULT '0',
  `number` smallint(3) unsigned NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL DEFAULT '0',
  `term` varchar(10) NOT NULL DEFAULT '0',
  `instructorId` mediumint(9) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `NO DUPS` (`number`,`subject`),
  KEY `FK_courses_users` (`instructorId`),
  CONSTRAINT `FK_courses_users` FOREIGN KEY (`instructorId`) REFERENCES `users` (`id`)

INSERT INTO `courses` (`id`, `subject`, `number`, `title`, `term`, `instructorId`) VALUES
	(2, 'CS', 493, 'Cloud Application Development', 'SP19', 1);

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
	(1, 'Rob Hess', 'hessro@oregonstate.edu', 'hunter2', 'instructor');