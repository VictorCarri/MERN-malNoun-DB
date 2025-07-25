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
		},
		pluralOptional: {
			type: Boolean,
			required: [false, "Not all nouns have optional plurals"],
			default: false
		},
		multiplePlurals: [
			{
				type: String,
				required: [false, "Not all nouns have multiple plurals"]
			}
		],
		hasPlural: {
			type: Boolean,
			default: true,
			required: [false, "Most nouns have plurals"]
		},
		denotesYoungChild: {
			type: Boolean,
			default: false,
			required: [false, "Not every noun denotes a young child"]
		},
		hasMultiplePlurals: {
			type: Boolean,
			default: false,
			required: [true, "We need to know whether every noun has multiple plurals or not"]
		},
		hasIrregularPlural: {
			type: Boolean,
			default: false,
			required: [true, "We need to know whether every noun has an irregular plural or not"]
		}
	}
);

// Create model for nouns
module.exports = nounsConn.model("noun", NounSchema);
