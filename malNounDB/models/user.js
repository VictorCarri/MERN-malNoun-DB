const { nounsConn, usersConn } = require("../conns.js");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, "Your email address is required"],
			unique: true
		},
	
		username: {
			type: String,
			required: [true, "Your username is required"]
		},

		password: {
			type: String,
			required: [true, "Your password is required"]
		},

		createdAt: {
			type: Date,
			default: new Date()
		}
	}
);

userSchema.pre("save", async function()
	{
		this.password = await bcrypt.hash(this.password, 12); // Hash the password before storage
	}
);

module.exports = usersConn.model("User", userSchema);
