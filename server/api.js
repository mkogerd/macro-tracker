const mysql = require('mysql'),
	express = require('express'),
	expressValidator = require('express-validator'),
	bodyParser = require('body-parser'),
	bcrypt = require('bcrypt'),
	saltRounds = 10,
	jwt = require('jsonwebtoken'),
	app = express();

require('dotenv').config();

// configure lbraries and add express headers
app.use(bodyParser.json());
app.use(expressValidator()); // This line must be immediately after any of the bodyParser middlewares
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Establish connection
const con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");

	// RESOURCE CREATION
	// Create database if it doesn't exist 
	con.query("CREATE DATABASE IF NOT EXISTS macrodb", function (err, result) { if (err) throw err; });
	con.query("USE macrodb", (err, result) => { if (err) throw err; });
	
	// Create tables for user data, ingredient data, and consumption records
	var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password BINARY(60) NOT NULL)";
	con.query(sql, (err, result) => { if (err) throw err; });
	var sql = "CREATE TABLE IF NOT EXISTS foods (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), protein DECIMAL(6,2), carb DECIMAL(6,2), fat DECIMAL(6,2), serving_grams DECIMAL(7,2))";
	con.query(sql, (err, result) => { if (err) throw err; });
	var sql = "CREATE TABLE IF NOT EXISTS records (id INT AUTO_INCREMENT PRIMARY KEY, userID INT, foodID INT, date DATE NOT NULL, grams DECIMAL(7,2))";
	con.query(sql, (err, result) => { if (err) throw err; });

	console.log('Database has been set up.');
});

app.get('/', function(req, res) {
	res.send('Hello World!')
});

app.get('/records', verifyToken, function(req, res) {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) console.log('Invalid token');
		else {
			let sql = `SELECT name, records.id,  grams,
				(protein*grams/serving_grams) AS protein, (carb*grams/serving_grams) AS carb,
				(fat*grams/serving_grams) AS fat
				FROM records JOIN foods ON records.foodID = foods.ID 
				WHERE userID=? AND date=?`;

			con.query(sql, [authData.id, req.query.date], function (err, result, fields){
				if (err) throw err;
				res.send(result);
			});
		}
	});
});

app.post('/records', verifyToken, function(req, res) {
	// Store user input into meal entry
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) console.log('Invalid token');
		else {
			con.query('INSERT INTO records (userID, foodID, date, grams) VALUES (?, ?, ?, ?)', [authData.id, req.body.foodID, req.body.date, req.body.weight], function (err, result, fields){
				if (err) throw err;
				else res.sendStatus(200); // Send success status
			});
		}
	});
});

app.get('/foods', function(req, res) {
	console.log(req.query.food);
	con.query("SELECT * FROM foods WHERE name LIKE ?", req.query.food, function (err, result, fields){
		if (err) throw err;
		res.send(result);
	});
});

app.post('/foods', verifyToken, function(req, res) {
	// Store user input into meal entry
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) console.log('Invalid token');
		else {
			con.query('INSERT INTO foods (name, protein, carb, fat, serving_grams) VALUES (?, ?, ?, ?, ?)', [req.body.name, req.body.protein, req.body.carb, req.body.fat, req.body.serving_grams], function (err, result, fields){
				if (err) throw err;
				else res.sendStatus(200); // Send success status
			});
		}
	});
});

// Find total proteins, carbs, and fats cosumed on a given day for a verified user
app.get('/totals', verifyToken, function(req, res) {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) console.log('Invalid token');
		else {
			let sql = 
				`SELECT IFNULL(ROUND(SUM(protein*grams/serving_grams),2),0) AS 'protein', 
				IFNULL(ROUND(SUM(carb*grams/serving_grams),2),0) AS 'carb', 
				IFNULL(ROUND(SUM(fat*grams/serving_grams),2),0) AS 'fat', 
				IFNULL(ROUND(SUM((protein*4+carb*4+fat*9)*grams/serving_grams),2),0) AS 'cal'
				FROM records 
				JOIN foods ON records.foodID = foods.id 
				WHERE userID=? AND date=?`;

			con.query(sql, [authData.id, req.query.date], function (err, result, fields){
				if (err) throw err;
				res.send(result[0]);
			});
		}
	});
});

app.post('/login', function(req, res) {
	req.checkBody('username', 'Username field cannot be empty').notEmpty();
	req.checkBody('password', 'Password field cannot be empty').notEmpty();
	const errors = req.validationErrors();
	
	if (errors) { // Check for input errors
		res.send({error: JSON.stringify(errors[0].msg)});
		return;
	}
	
	const user = req.body.username.toLowerCase();;
	const pass = req.body.password;
	// Search for user in database
	con.query("SELECT password, id FROM users WHERE username=? LIMIT 1", user, (err, result, fields) => {
		if (err) throw err;
		if(result.length === 0) {
			res.send({error: 'Username not found'});
			return;
		}
		// Compare password input to hashed password from database
		bcrypt.compare(pass, result[0].password.toString('utf8'), function(err, _result) {
			if (err) throw err;
			else if (_result) {
				jwt.sign({id: result[0].id}, 'secretkey', (err, token) => {
					res.json({ token: token });
				});
			}
			else res.send({error: 'Incorrect credentials'});
		});
	});
});

app.post('/register', function(req, res, next) {
	req.checkBody('username', 'Username field cannot be empty').notEmpty();
	req.checkBody('password', 'Password field cannot be empty').notEmpty();
	const errors = req.validationErrors();
	
	if (errors) { // Check for input errors
		res.send({error: JSON.stringify(errors[0].msg)});
		return;
	}

	const user = req.body.username.toLowerCase();;
	const pass = req.body.password;
	
	bcrypt.hash(pass, saltRounds, (err, hash) => {
		con.query( "INSERT INTO users (username, password) VALUES (?, ?)", [user, hash], function(err, result, fields) {
			try {
				if (err) throw err;
				res.send({message:'Succesfully registered!'});
			} catch (err) {
				res.send({error: err.sqlMessage}); // Most likely duplicate entry
			}
		});
	});
});

function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	// Check if bearer is undefined
	if(typeof bearerHeader !== 'undefined') {
		// Split at space
		const bearer = bearerHeader.split(' ');
		// Get token from array
		const bearerToken = bearer[1];
		// Set the token
		req.token = bearerToken;
		// Next middleware
		next();
		
	} else {
		// forbidden
		res.sendStatus(403);
	}
}

app.listen(5000, () => {
	console.log('App is listening on port 5000!');
});
