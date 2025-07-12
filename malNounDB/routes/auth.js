const { Signup, Login, Logout, Refresh, IsLoggedIn } = require("../controllers/AuthController");
const router = require("express").Router();
const { body } = require("express-validator");

router.post("/signup", Signup);
router.post("/login", body("email").isEmail(), body("password").isLength({min: 1}), Login);
router.post("/logout", Logout);
router.post("/refresh", Refresh);
router.get("/isLoggedIn", IsLoggedIn);
module.exports = router;
