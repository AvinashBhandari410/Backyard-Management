var app= require('./app');
var port=process.env.port||8000;

var server=app.listen(port,function(){
console.log('Express server listening on port '+port)
});

// followed this tutorial
// https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09