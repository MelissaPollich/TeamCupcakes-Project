var express = require('express');
var app = express();
var sessionStorage = require('sessionstorage');

app.use(express.static('public'));


app.set('view engine', 'ejs');

var expressValidator = require('express-validator');
app.use(expressValidator());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));

var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser('csci3308'));
app.use(session({
    secret: 'csci3308',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(flash());

var login = require('./routes/login');
var game = require('./routes/game');
app.use('/', login);
app.use('/game', game);

var port = 4000;
app.listen(port, function () {
    console.log('Server running on http://localhost:' + port)
});