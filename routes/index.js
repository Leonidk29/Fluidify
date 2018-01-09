const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authConroller');
const dashboard_controller = require('../controllers/dashboardController');
const moment = require('moment');
const Reading = require('../models/reading');
const config = require('../config');

router.get('/', function (req, res) {
    res.render('index', {account: req.user, title: "Main"});
});


router.get('/register', auth_controller.register_get);

router.post('/register', auth_controller.register_post);

router.get('/login', auth_controller.login_get);

router.post('/login', auth_controller.login_post);

router.get('/logout', auth_controller.logout);


router.get('/dashboard',auth_controller.validate(), dashboard_controller.dashboard_get_total);

router.get('/dashboard/:id', auth_controller.validate(), dashboard_controller.dashboard_get_point);





// Setting the mock data createdAt randomly
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


// Route for saving mock data
router.post('/getConsumption', function (req, res, next) {
    req.body.readings.forEach(item => {
            let date = moment();
            date = date.subtract(config.random_days, "days");
            let reading = new Reading(
                {
                    consumption: item.consumption,
                    meteringpoint: item.point,
                    createdAt: randomDate(date.toDate(), new Date())
                });
            reading.save(function (err) {
                if (err) {
                    console.log("Error while obtaining consumptions!");
                    return next(err);
                }
            });
        }
    );
    res.status(200).send("Success");
});


module.exports = router;
