const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', (req, res) => {
    db.all(`SELECT username, wallet, level FROM users ORDER BY (wallet + bank) DESC LIMIT 10`, [], (err, rows) => {
        if (err) rows = [];
        res.render('index', { leaders: rows });
    });
});

app.listen(5000, () => {
    console.log('🌐 Web Dashboard wuxuu ka shaqaynayaa: http://localhost:5000');
});
