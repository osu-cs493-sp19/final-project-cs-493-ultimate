const bcrypt = require('bcrypt');
const mysqlPool = require('../lib/database');
const jwt = require('jsonwebtoken');

const { validateAgainstSchema,
        extractValidFields } = require('../lib/validate');

const jwtSecret = 'SuperSecretJwtString';

const schema = {
    email: {
        type: "string",
        required: true
    },
    password: {
        type: "string",
        required: true
    }
}

exports.validateAuth = function(user) {
    return validateAgainstSchema(user, schema);
}

exports.authenticate = function(user) {
    return new Promise((resolve, reject) => {
        santizedUser = extractValidFields(user, schema);
        mysqlPool.query(
            `SELECT id, password FROM users WHERE email = ?`,
            santizedUser.email,
            async (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    if(result.length == 0) {
                        console.log('here');
                        resolve([false, null]);
                    } else {
                        const status = await bcrypt.compare(santizedUser.password, result[0].password);
                        resolve([status, result[0].id]);
                    } 
                }
            }
        );
    });
}

exports.generateJwt = function(id) {
    return jwt.sign({ id: id }, jwtSecret, { expiresIn: '24h' });
}

exports.validateJwt = function(req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload.id;
        next();
    } catch (err) {
        console.error(err);
        res.status(403).send({
            error: "Invalid authentication token provided."
        });
    }
}

exports.getRole = function(req, res, next) {
    mysqlPool.query(
        'SELECT role FROM users WHERE id = ?',
        req.user,
        (err, result) => {
            if(err) {
                console.error(err);
                res.status(401).send({
                    error: "Error authenticating. Try again later."
                });
            } else {
                req.role = result[0].role;
                next();
            }
        }    
    );
}