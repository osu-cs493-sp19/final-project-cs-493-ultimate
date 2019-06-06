const router = require('express').Router();

/* Add routes here */
router.use('/users', require('./users'));

module.exports = router;
