var express = require('express');
var db = require('../database');
var app = express();
var sessionStorage = require('sessionstorage');
var logged_user;
global.logged_user;
module.exports = app;

app.get('/', function (request, response) {
   // render the views/index.ejs template file
   response.render('login', {title: 'WordFinder - Login',
          username: '',
          password: ''})
});

app.post('/', function (request, response) {
  var testId = request.body.id;
  var testUs = request.body.username;
  var testPa = request.body.password;
  console.log(testUs.length);
  console.log(testPa.length);
  console.log(testUs);
  console.log(testPa);
  if(testUs.length==0 || testPa.length==0){
    request.flash('error', 'neither field may be empty');
    response.render('login', {
        title: 'Log In',
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
          sessionStorage.setItem("logged_in_user", item.username)

	  	  //global.hscore_user = item.hscore;
          var query = "select user_id from users where username='"+ item.username +"' and password='"+ item.password +"';";

          db.one(query)
              .then(function (row) {
                  // if item not found
                  if (row.length == 0) {
                      request.flash('error', 'username or password incorrect');
                      response.redirect('login')
                  }
                  else {
                      logged_user = query;
                      request.flash('success', 'Player found');
                      response.redirect('/game')
                  }
              })
              .catch(function (err) {
                  request.flash('error', 'username or password incorrect');
                  response.render('login', {
                      title: 'Log In',
                      username: request.body.username,
                      password: request.body.password
                  })
              })
          // Running SQL query to insert data into the store table
      } else {
          var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
          request.flash('error', 'Player not found');
          response.render('login', {
              title: 'Log In',
              username: request.body.username,
              password: request.body.password
          })
        }
      }
});
