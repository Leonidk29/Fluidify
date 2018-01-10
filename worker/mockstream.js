const axios = require('axios');
const config = require('../config');
const Point = require('../models/meteringpoint');



// Send it to our route
function send(json) {
    axios.post('http://localhost:3000/getConsumption', json)
        .then(function (response) {
        })
        .catch(function (error) {
            //console.log(error);
        });
}


// Create Json with random, consumption data
function createJSON(items) {
    return {
        readings: items.map(element => {
            return {point: element, consumption: Math.floor(Math.random() * 5)}
        })
    }
}


// find all meteringpoints
function intervalFunc() {
    Point.find({}).exec()
        .then(function (points) {
            send(createJSON(points));
        }, function (err) {
            //console.log(err);
        });
}

// Start sending data every x time
exports.startMockStream = function () {
    setInterval(intervalFunc, config.worker_interval);
};


