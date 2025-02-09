require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const chalk = require('chalk');
const routes = require('./routes');

const port = 3001;
const app = express();

app.use(express.static(path.resolve('..', 'frontend', 'build')));

app.use(cookieParser());
app.use(express.json());

app.use('/api', routes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve('..', 'frontend', 'build', 'index.html'));
});

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    app.listen(port, () => {
        console.log(chalk.green(`Server has been started on port ${port}...`));
    });
});
