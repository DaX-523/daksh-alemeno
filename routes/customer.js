const router = require("express").Router();

const customerController = require("../controllers/user");

router.post("/register", customerController.register);

module.exports = router;
