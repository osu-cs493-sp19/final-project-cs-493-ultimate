const router = require('express').Router();

/* Add routes here */
router.use('/users', require('./users'));
router.use('/assignments', require('./assignment'));

module.exports = router;
