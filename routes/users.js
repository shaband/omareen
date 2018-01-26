var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;
var passport=require('passport');
require('../models/Users');
const user = mongoose.model('Users');



router.get('/login', (req, res) => {

    res.render('users/login');

});

router.post('/login',(req,res,next)=>{
    console.log(req.body);
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true,
        successFlash: true,
    })(req,res,next);

});


router.get('/register', (req, res) => {

    res.render('users/register');

});
router.post('/register', (req, res) => {
    console.log(req.body);

    let errors = [];

    if (req.body.password != req.body.password_confirmation) {
        errors.push({
            text: 'Passwords do not match'
        });
    }

    if (req.body.password.length < 4) {
        errors.push({
            text: 'Password must be at least 4 characters'
        });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password_confirmation: req.body.password_confirmation
        });
    } else {
        const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                newUser.password = hash;
                newUser.save().then(data => {
                    req.flash('success_msg', 'success');
                    res.redirect('/users/login');
                }).catch(err => {
                    console.log(error);
                    return;
                });
            });
        });
    }
});
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg','You are loggout out');
    res.redirect('/');
});
module.exports = router;