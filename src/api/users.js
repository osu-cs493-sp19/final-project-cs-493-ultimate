const router = require('express').Router();
const {
    insertUser,
    validateUser } = require('../model/user');

const { validateAuth,
        authenticate,
        generateJwt,
        validateJwt,
        getRole,
        validateJwtManual,
        getRoleManual } = require('../lib/auth');

router.post('/', async (req, res) => {
    try {
        const user = req.body;
        if(validateUser(user)) {
            if(user.role === 'admin' || user.role === 'instructor') {              
                const [jwtStatus, requestId] = validateJwtManual(req);
                if(jwtStatus) {
                    try {
                        const role = await getRoleManual(requestId);
                        if(role === 'admin') {
                            const id = await insertUser(user);
                            res.status(201).send({
                                id: id
                            });
                        } else {
                            res.status(403).send({
                                error: "Unauthorized to create new admin or instructor."
                            });
                        }
                    } catch (err) {
                        res.status(500).send({
                            error: "Error authenticating. Please try again later."
                        });
                    }
                } else {
                    res.status(403).send({
                        error: "Invalid authentication token provided."
                    });
                }
            } else {
                const id = await insertUser(user);
                res.status(201).send({
                    id: id
                });
            }
        } else {
            res.status(400).send({
                error: "Bad Request, invalid user object."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Error creating new user. Please try again later."
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        if(validateAuth(user)) {
            const [status, id] = await authenticate(user);
            if(status) {
                res.status(200).send({
                    jwt: generateJwt(id)
                  });
            } else {
                res.status(401).send({
                    error: "Invalid credentials."
                });
            }
        } else {
            res.status(400).send({
                error: "Bad Request, invalid user object."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Error creating new user. Please try again later."
        });
    }
});

router.get('/:id', validateJwt, getRole, (req, res, next) => {
    try {
        if(req.user === parseInt(req.params.id)) {
            res.send('TODO');
        } else {
            res.status(403).send({
                error: "Unauthorized to access this resource."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: "Error getting user details. Please try again later."
        });
    }
});

module.exports = router;