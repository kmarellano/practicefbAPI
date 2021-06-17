const { response } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;

app.get('/api/auth', (req, res) => {
    res.json({
        message: 'hehe',
    });
});

app.post('/api/register', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, data) => {
        localStorage.setItem('token', JSON.stringify(data));
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Welcome to registration',
                data,
            });
        }
    });

});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'testing',
        email: 'test@gmail.com',
    }

    jwt.sign({ user: user }, 'secret', (err, token) => {
        res.json({
            token: 'Bearer ' + token,
        });
    });
});

function verifyToken(req, res, next) {

    fetch('http://localhost:5000/api/login', {
            method: 'post'
        }).then(res => res.json())
        .then(error => console.log(error));

    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ');
        req.token = bearerToken[1];

        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
        }

        next();
    } else {
        res.sendStatus(403);
    }
}


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});