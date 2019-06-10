CREATE DATABASE IF NOT EXISTS `tarpaulin`;

USE `tarpaulin`;

CREATE TABLE users (
    `id`        mediumint(9)                            NOT NULL    AUTO_INCREMENT,
    `name`      VARCHAR(255)                            NOT NULL,   
    `email`     VARCHAR(255)                            NOT NULL,
    `password`  VARCHAR(255)                            NOT NULL,
    `role`      ENUM('admin', 'instructor', 'student')  NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY (`email`)
);

INSERT INTO users VALUES 
    (0, 'Admin', 'admin@admin.com', '$2b$10$dnk0GlkSDCID4QLl/MdlTelbH6tLB84NNRjNmxugpmeRT7Rn.FWXK', 'admin');

CREATE TABLE assignments (
    `id`        mediumint(9)                            NOT NULL    AUTO_INCREMENT,
    `courseId`        mediumint(9)                            NOT NULL,
    `title`      VARCHAR(255)                            NOT NULL,   
    `description`     VARCHAR(255)                            NOT NULL,
    `points`  mediumint(9)                           NOT NULL,
    `due`      VARCHAR(255)  NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE submissions (
    `id`        mediumint(9)                            NOT NULL    AUTO_INCREMENT,
    `assignmentId`        mediumint(9)                            NOT NULL,
    `studentId`        mediumint(9)                            NOT NULL,
    `description`      VARCHAR(255)                            NOT NULL,   
    `timestamp`     VARCHAR(255)                            NOT NULL,
    `file`      VARCHAR(255)  NOT NULL,

    PRIMARY KEY (id)
);
