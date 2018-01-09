var mongoose = require('mongoose');
var mongoDB = 'mongodb://meteringuser:meters@ds135817.mlab.com:35817/metering-test-project';

mongoose.connect(mongoDB, function (err, db) {
    if (err) throw err;
    var myobj = [
        {owner: 'John', address: 'Highway 71'},
        {owner: 'Peter', address: 'Lowstreet 4'},
        {owner: 'Amy', address: 'Apple st 652'},
        {owner: 'Hannah', address: 'Mountain 21'},
        {owner: 'Michael', address: 'Valley 345'},
        {owner: 'Sandy', address: 'Ocean blvd 2'},
        {owner: 'Betty', address: 'Green Grass 1'},
        {owner: 'Richard', address: 'Sky st 331'},
        {owner: 'Susan', address: 'One way 98'},
        {owner: 'Vicky', address: 'Yellow Garden 2'},
        {owner: 'Ben', address: 'Park Lane 38'},
        {owner: 'William', address: 'Central st 954'},
        {owner: 'Chuck', address: 'Main Road 989'},
        {owner: 'Viola', address: 'Sideway 1633'}
    ];
    db.collection("MeteringPoint").insertMany(myobj, function (err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();
    });
});

