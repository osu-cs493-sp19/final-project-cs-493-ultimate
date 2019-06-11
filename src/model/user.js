const dbPool = require('../lib/database');
const bcrypt = require('bcrypt');

const { validateAgainstSchema, 
        extractValidFields } = require('../lib/validate');

const saltRounds = 10;

const schema = {
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    role: {
        type: 'string',
        required: false
    }
}

function checkRole(user) {
    return [ 'admin', 'instructor', 'student' ].includes(user.role);
}

exports.validateUser = function(user) {
    return validateAgainstSchema(user, schema) && checkRole(user);
}

exports.insertUser = function(user) {
    return new Promise(async (resolve, reject) => {
        const sanitizedUser = extractValidFields(user, schema);
        sanitizedUser.password = await bcrypt.hash(sanitizedUser.password, saltRounds);

        dbPool.query(
            'INSERT INTO users SET ?',
            sanitizedUser,
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            }
        );
    });
}

exports.getUserById = function(id) {
    return new Promise((resolve, reject) => {
        dbPool.query(
            `SELECT * FROM users WHERE id = ?`,
            parseInt(id),
            (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    if(result.length == 0) {
                        resolve(null);
                    } else {
                        delete result[0]['password'];
                        resolve(result[0]);
                    } 
                }
            }  
        );
    }); 
}

exports.getUserCourses = function(id, role) {
    let query;
    if(role === 'instructor') {
        query = 'SELECT id FROM courses WHERE instructorId = ?';
    } else {
        query = 'SELECT courseId AS id FROM enrollment WHERE userId = ?';
    }

    return new Promise((resolve, reject) => {
        dbPool.query(
            query,
            parseInt(id),
            (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    if(result.length == 0) {
                        resolve(null);
                    } else {
                        resolve(result);
                    } 
                }
            }  
        );
    }); 
}