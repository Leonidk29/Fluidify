const config = {};


config.plotly={};


config.mongo_url = 'secreturl';
config.plotly.name = 'letoll';
config.plotly.token = 'token';
config.secret = 'Secretly Secret';
config.graph_days = 60; // Consumption query where createdAt>Date.now-graph_days
config.worker_interval = 1000*60; //Delay between worker requests ms
config.random_days= 20; // For testing purpose generating consumption between Date.now() and Date.now()-20days


module.exports = config;
