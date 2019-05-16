const express = require('express');
const morgan = require('morgan');
const app = express();

const PORT = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/', require('./api'));

app.use('*', (req, res, next) => {
    res.status(404).json({
        error: `Requested resource ${req.originalUrl} does not exist`
    });
});

app.listen(PORT, () => {
    console.log('== Server is running on port', PORT);
});