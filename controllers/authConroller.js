const passport = require('passport');
const Account = require('../models/account');


//Validation fun
exports.validate = function () {
    return function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        else {
            next()
        }
    }
}


exports.login_get = function (req, res) {
    res.render('login', {title: "Login"});
};

exports.login_post = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('login', {error: "Wrong username or password", user: req.body.username})
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/dashboard');
        });
    })(req, res, next);
};


exports.register_get = function (req, res) {
    res.render('register', {title: "Register"});
};

exports.register_post = function (req, res, next) {
    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {error: err.message});
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/dashboard');
        });
    });
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
}


