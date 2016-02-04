var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var app = express();


// ConnectionString is for connection -> username : postgres, password -> root123, database -> happiness
// You have to change it according to your password and username
var connectionString =  'postgres://postgres:root123@localhost:5433/happiness';

var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
	//
  res.sendFile(path.join(__dirname, '../views', 'index.html'));

});

// to redirect to next page after user click on share button
router.get('/ad', function(req, res, next) {

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
  	res.render('index', {title: req.query.name, orderId: req.query.orderId, orderAmount: req.query.orderAmount});

});

// When the user clicks Ok button after entering 
router.post('/generate', function(req, res) {

	var couponCode = Math.floor((Math.random()* (9999- 1000) + 1000));

  	var data = {name: req.body.name, email: req.body.email, couponCode: couponCode};
    if(req){
    	console.log('fds');
    	return res.status(200).json(data);
    }
    

    console.log(data);
    return res.json(data);


});


// ---------- When the user clicks on order button

router.get('/placeorder', function(req, res) {

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var data = {name: req.query.username, orderId: req.query.orderId, amount: req.query.amount};
	var results = []; 

	pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

		var quesry = client.query("SELECT * FROM Customer where name='"+data.name+"'");

		quesry.on('row', function(row) {

        	client.query("INSERT INTO orders(order_id, order_amount, customerid) values($1, $2, $3);", [data.orderId, data.amount, parseInt(row.id)]);
        	client.query("UPDATE Coupon SET status = 'redeemed' where customerid ="+parseInt(row.id) );

       });

        var query = client.query("SELECT * FROM orders");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(data);
        });
    });



});


// --------- When the user clicks on share button -------------


router.post('/share', function(req, res) {

	var results = [];

  	var data = {name: req.body.name, email: req.body.email, couponCode: req.body.couponCode};
   
     pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query("INSERT INTO Customer(name, email_id) values($1, $2);", [data.name, data.email]);

        var query = client.query("SELECT * FROM Customer where name='"+data.name+"'");

		query.on('row', function(row) {
        	client.query("INSERT INTO Coupon(code_id, status, CustomerId) values($1, $2, $3);", [data.couponCode, 'NEW', parseInt(row.id)]);
        });

        var query = client.query("SELECT * FROM Coupon ORDER BY code_id ASC");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });
    });


});
module.exports = router;
