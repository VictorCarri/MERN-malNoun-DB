// Importing dependencies
const express = require('express'); // Express
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/api");
const path = require("path");
const fs = require("fs");
const Mongoose = mongoose.Mongoose;
const { nounsConn, usersConn } = require("./conns.js");
require('dotenv').config(); // dotEnv

// Creates the express app
const app = express();

// Setting the port
const port = process.env.PORT || 5000;

/* Connect to the DB */
/*mongoose.connect(process.env.DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		tls: true,
		tlsCAFile: "./global-bundle.pem"
	}
)
.then(() => console.log("DB connected successfully"))
.catch(err => console.log(err));*/

// Override Mongoose's Promise with Node's Promise
mongoose.Promise = global.Promise;

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

/* Routes handling */

// API routes
const nounRoutes = require("./routes/api");
app.use("/api", nounRoutes);

// Default GET route
app.use((err, req, res, next) => {
	console.log(err);
	next();
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
