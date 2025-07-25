/* Mongoose */
//const mongoose = require("mongoose");
const { nounsConn, usersConn } = require("../conns.js"); // DB connections
const Schema = nounsConn.Schema; // Mongoose Schema constructor

/* Define the noun schema */
const NounSchema = new Schema(
	{
		singular: {
			type: String,
			required: [true, "The singular field is required"]
		},
		human: {
			type: Boolean,
			required: [true, "The human field is required"]
		},
		animate: {
			type: Boolean,
			required: [true, "The animate field is required"]
		},
		gender: {
			type: String,
			enum: ["masculine", "feminine", "neuter"],
			required: true
		},
		plural: {
			type: String,
			required: [false, "Only some nouns have irreqular plurals"]
		},
		meanings: [
			{
				type: String,
				required: [true, ""]
			}
		],
		createdAt: {
			type: Date,
			default: new Date()
		},
		updatedAt: {
			type: Date,
			default: new Date()
		}
	}
);

// Create model for nouns
module.exports = nounsConn.model("noun", NounSchema);
