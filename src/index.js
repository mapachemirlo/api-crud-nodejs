const express = require('express');
const mongose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const routesV1 = require('./routes/v1');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

routesV1(app);

const PORT = process.env.PORT || 5000;

mongose.connect( process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to mongodb');
    app.listen(PORT, () => {
        console.log(`Running on ${PORT}`);
    });
}).catch(error => {
    console.log('mongodb error', error);
});
