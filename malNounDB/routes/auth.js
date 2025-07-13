const { Signup, Login, Logout, Refresh, IsLoggedIn } = require("../controllers/AuthController");
const router = require("express").Router();
const { body } = require("express-validator");
const { bodyParser, jsonValidator } = require("../middleware/FormMiddleware"); // Common form middleware

const emailValidator = body("email").exists().isEmail();
const passwordValidator = body("password").exists().isString().isLength({min: 1});
const userNameValidator = body("userName").exists().isString().isLength({min: 1});

/*
* General order of middleware:
* 
* 1) Body validation middleware, to ensure that the request body is valid JSON.
* 2) Body parser, to convert the JSON body to properties on the request object.
* 3) Any form input validation middleware.
* 4) Finally, the main route middleware.
*/
router.post("/signup", jsonValidator, bodyParser, emailValidator, passwordValidator, userNameValidator, Signup);
router.post("/login", jsonValidator, bodyParser, emailValidator, passwordValidator, Login);
router.post("/logout", Logout); // Don't need to validate or parse the body because this route doesn't use a body
router.post("/refresh", Refresh); // Don't need to validate or parse the body because this route doesn't use a body
router.get("/isLoggedIn", IsLoggedIn); // Don't need to validate or parse the body because this route doesn't use a body
module.exports = router;
