var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Landing page.
router.get('/', function(req, res) {
  res.render('index/home');
});

// REGISTER ROUTE: Show register account form.
router.get('/register', function(req, res) {
  res.render('index/register');
});

// REGISTER ROUTE: Handle sign up logic.
router.post('/register', function(req, res) {
  var newUser = new User({
    // Takes the username and email from the form.
    username: req.body.username,
    email: req.body.email
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('index/register', {error: err.message});
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to YelpCamp! Enjoy your experience, ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

// LOGIN ROUTE: Show login form.
router.get('/login', function(req, res) {
  res.render('index/login');
});

// LOGIN ROUTE: Handle login logic.
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

// LOGOUT ROUTE.
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You successfully logged out!');
  res.redirect('/campgrounds');
});

module.exports = router;
