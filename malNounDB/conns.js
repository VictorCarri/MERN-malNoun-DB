/* Imports */
const mongoose = require("mongoose");
const Mongoose = mongoose.Mongoose;
require("dotenv").config(); // .env config vars

let DBOpts = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	tls: true,
	tlsCAFile: "./global-bundle.pem"
};

let nounsConn = new Mongoose();
let usersConn = new Mongoose();

console.log("Process environment: %o", process.env);

nounsConn.connect(process.env.DB, DBOpts)
.then(() => console.log("Successfully connected to the nouns DB"))
.catch(err => console.log("Error while connecting to nouns DB: %o", err));

usersConn.connect(process.env.USERDB, DBOpts)
.then(() => console.log("Successfully connected to the users DB"))
.catch(err => console.log("Error while connecting to users DB: %o", err));

module.exports = {nounsConn, usersConn};
