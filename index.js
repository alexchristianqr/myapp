const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the API'});
})

app.get('/users', (req, res) => {
    res.json([{
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
    }, {
        id: 2,
        name: 'Jane Doe',
        email: 'janedow@gmail.com',
    }]);
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})