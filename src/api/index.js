const router = require('express').Router();

/* Add routes here */
router.use('/users', require('./users'));
router.use('/courses', require('./courses'));

module.exports = router;
