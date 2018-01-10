const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const Account = require('../models/account');



passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


module.exports = passport;

