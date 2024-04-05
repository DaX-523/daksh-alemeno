const router = require("express").Router();

const loanController = require("../controllers/loan");

router.post("/check-eligibility", loanController.checkEligibilityAPI);

router.post("/create-loan", loanController.createLoan);

router.get("/view-loan/:loan_id", loanController.viewLoan);

module.exports = router;
