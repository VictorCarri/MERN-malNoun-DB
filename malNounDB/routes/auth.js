const { Signup, Login, Logout, Refresh, IsLoggedIn } = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/refresh", Refresh);
router.get("/isLoggedIn", IsLoggedIn);
module.exports = router;
