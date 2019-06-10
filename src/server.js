const express = require('express');
const morgan = require('morgan');
const { rateLimit } = require('./lib/limits');
const app = express();

const PORT = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit);
app.use('/', require('./api'));

app.use('*', (req, res) => {
    res.status(404).json({
        error: `Requested resource ${req.originalUrl} does not exist`
    });
});

app.listen(PORT, () => {
    console.log('== Server is running on port', PORT);
});
