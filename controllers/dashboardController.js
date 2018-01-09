const Reading = require('../models/reading');
const MeteringPoint = require('../models/meteringpoint');
const async = require('async');
const moment = require('moment');
const config = require('../config');


// To get total cons for each metering point
function totalCons(items, callback) {
    async.map(items, async function (el) {
            const response = await Reading.find({'meteringpoint': el.id});
            return response.map(el => el.consumption).reduce((a, b) => a + b, 0);
        },
        (err, results) => {
            if (err) throw err;
            return callback(results);
        })

}


exports.dashboard_get_total = function (req, res) {
    MeteringPoint.find({}).exec()
        .then(
            function (points) {
                const xCords = points.map(el => el.address);
                const text = points.map(el => el.owner);
                totalCons(points, function (response) {
                    const total = response.reduce((a,b) => a+b,0);
                    console.log(total);
                    res.render('dashboard', {
                        current: 'All',
                        meteringpoints: points,
                        xCords: xCords,
                        yCords: response,
                        text: text,
                        name: '<b>Total water consumption: </b>'+'<b>'+total+'</b>',
                        xtitle: '<b>Address</b>',
                        account: req.user,
                        title: "Dashboard"
                    })
                });
            },
            function (err) {
                console.log(err);
            });
};


// Data formatting before passing to graph
function formatGraphInfo(cons) {
    const a = moment(cons[0].createdAt);
    let b = moment();
    b = b.subtract(1, "days");

    let dates = [];
    for (let m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
        dates.push(m.format('YYYY-MM-DD'))
    }

    const consumptions = dates.map(el => cons.filter(cons => {
        const created = moment(cons.createdAt);
        const date = moment(el);
        return (created.month() === date.month() && created.date() === date.date());
    })
        .reduce((a, b) => a + b.consumption, 0));

    dates = dates.map(el => moment(el).format('DD-MMM'));

    return {consumptions: consumptions, dates: dates}
}


exports.dashboard_get_point = function (req, res) {
    async.parallel({
            point: function (callback) {
                MeteringPoint.findById(req.params.id).exec(callback);
            },
            points: function (callback) {
                MeteringPoint.find(callback);
            },
            consumption: function (callback) {
                const date = moment();
                Reading.find().where('meteringpoint').equals(req.params.id)
                    .where('createdAt').gt(date.subtract(config.graph_days, 'days')).sort({createdAt: 1}).exec(callback); // where callback is the name of our callback function.
            }
        },

        function (err, results) {
            if (err) {
                return next(err);
            }

            let graphData = formatGraphInfo(results.consumption);
            const total = graphData.consumptions.reduce((a,b) => a+b,0);
            res.render('dashboard', {
                current: results.point.id,
                meteringpoints: results.points,
                xCords: graphData.dates,
                yCords: graphData.consumptions,
                text: [],
                xtitle: '<b>Date</b>',
                name: '<b>Total water consumption: </b>'+'<b>'+total+'</b>',
                account: req.user,
                title: "Dashboard"
            })

        }
    )
    ;

};