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
