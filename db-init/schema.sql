CREATE DATABASE IF NOT EXISTS tarpaulin;
USE tarpaulin;

CREATE TABLE users (
    `id`        INT                                     NOT NULL,
    `name`      TEXT                                    NOT NULL,   
    `email`     TEXT                                    NOT NULL,
    `password`  TEXT                                    NOT NULL,
    `role`      ENUM('admin', 'instructor', 'student')  NOT NULL

    PRIMARY KEY (id)
);
