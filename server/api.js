const mysql = require('mysql');
const express = require('express');
const expressValidator = require('express-validator');
require('dotenv').config();
const bodyParser = require('body-parser');

const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

const app = express();

app.use(bodyParser.json());
app.use(expressValidator()); // This line must be immediately after any of the bodyParser middlewares

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");

	// RESOURCE CREATION
	// Create database if it doesn't exist 
	con.query("CREATE DATABASE IF NOT EXISTS macrodb", function (err, result) {
		if (err) throw err;
		console.log('Database created');
	});
	con.query("USE macrodb", (err, result) => {
		if (err) throw err;
		console.log('Using database');
	});
	
	// Create tables for user data, ingredient data, and consumption records
	var sql = "CREATE TABLE IF NOT EXISTS users (id int, username varchar(255) NOT NULL UNIQUE, password binary(60) UNIQUE)";
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log('User table created');
	});
	var sql = "CREATE TABLE IF NOT EXISTS food_info (id int, name varchar(255))";
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log('Food information table created');
	});
	var sql = "CREATE TABLE IF NOT EXISTS food_record (id int, food varchar(255), volume int, weight int)";
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log('Food record table created');
	});
});

app.get('/', function(req, res) {
	res.send('Hello World!')
});

app.get('/meals', function(req, res) {
	con.query('SELECT * FROM food_record', function (err, result, fields){
		if (err) throw err;
		res.send(result);
	});
});

app.post('/register', function(req, res, next) {
	req.checkBody('username', 'Username field cannot be empty').notEmpty();
	req.checkBody('password', 'Password field cannot be empty').notEmpty();
	const errors = req.validationErrors();
	
	if (errors) {
		console.log(`errors: ${JSON.stringify(errors)}`);
		res.send({error: JSON.stringify(errors[0].msg)});
	} else {
		const user = req.body.username;
		const pass = req.body.password;
		con.query( "INSERT INTO users (username, password) VALUES (?, ?)", [user, pass], function(err, result, fields) {
			if (err) throw err;
			res.send({message:'Succesfully registered!'});
		});
	}
});

app.listen(5000, () => {
	console.log('App is listening on port 5000!');
});
