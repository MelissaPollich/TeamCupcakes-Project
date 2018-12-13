var express = require('express');
var app = express();
app.use(express.static('public'));
var db = require('../database');
module.exports = app;


// app.get('/', function (request, response) {
//    // render the views/index.ejs template file
   
// });

app.get('/', function (request, response) {
   // render the views/index.ejs template file
   response.render('game/menu', {title: 'WordFinder - Menu'})
});

app.get('/sign_up', function (request, response) {
   // render the views/index.ejs template file
   response.render('game/sign_up', {title: 'WordFinder - Sign Up',
          username: '',
          password: ''})
});

app.post('/sign_up', function (request, response) {
    // Validate user input - ensure non emptiness
    var testId = request.body.id;
    var testUs = request.body.username;
    var testPa = request.body.password;
    console.log(testUs.length);
    console.log(testPa.length);
    console.log(testUs);
    console.log(testPa);
    if(testUs.length==0 || testPa.length==0){
      request.flash('error', 'neither field may be empty');
      response.render('game/sign_up', {
          title: 'Sign Up',
          id: testId,
          username: testUs,
          password: testPa
      })
    }
    else{
    var errors = request.validationErrors();
        if (!errors) { // No validation errors
            var item = {
                username: request.sanitize('username').escape().trim(),
                password: request.sanitize('password').escape().trim()
            };
            global.logged_user = item.username;
	    	//global.hscore_user = 0;
            // ensures that person signing up doesn't use someone elses username
            var query = "SELECT user_id FROM users WHERE username='"+ item.username +"';";

            db.any(query)
                .then(function (row) {
                    // if item not found
                    if (row.length >= 1) {
                        request.flash('error', 'A player already has this username');
                        response.render('game/sign_up', {
                            title: 'Sign Up',
                            username: item.username,
                            password: item.password
                        })
                    }
                    else {
                      // Running SQL query to insert data into the store table
                      db.none('INSERT INTO users(user_id, username, password) VALUES(DEFAULT, $1, $2)', [item.username, item.password])
                          .then(function (result) {
                              request.flash('success', 'Player data added successfully!');
                              // render views/store/list.ejs
                              // after user makes new account send him
                              // to the profiles list
                              response.redirect('/')
                          }).catch(function (err) {
                            request.flash('error', err);
                            // render views/store/add.ejs
                            response.render('game/sign_up', {
                                title: 'Sign Up',
                                username: item.username,
                                password: item.password
                            })
                          })
                    }
                })
                .catch(function (err) {
                  db.none('INSERT INTO users(user_id, username, password) VALUES(DEFAULT, $1 $2)', [item.username, item.password])
                      .then(function (result) {
                          request.flash('success', 'Player data added successfully!');
                          // render views/store/list.ejs
                          // after user makes new account send him
                          // to the profiles list
                          response.redirect('/')
                      }).catch(function (err) {
                        request.flash('error', err);
                        // render views/store/add.ejs
                        response.render('game/sign_up', {
                            title: 'Sign Up',
                            username: item.username,
                            password: item.password
                        })
                      })
                })
        } else {
            var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
            request.flash('error', error_msg);
            response.render('game/sign_up', {
                title: 'Sign Up',
                username: request.body.username,
                password: request.body.password
            })
          }
        }
});

app.get('/level1', function (request, response) {
   // render the views/index.ejs template file
   response.render('game/level1', {title: 'WordFinder - Level 1',
          username: '',
          password: ''})
});

app.get('/level2', function (request, response) {
   // render the views/index.ejs template file
   response.render('game/level2', {title: 'WordFinder - Level 2',
          username: '',
          password: ''})
});

app.get('/level3', function (request, response) {
   // render the views/index.ejs template file
   response.render('game/level3', {title: 'WordFinder - Level 3',
          username: '',
          password: ''})
});