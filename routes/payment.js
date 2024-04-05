const router = require("express").Router();

const paymentController = require("../controllers/payment");

router.post(
  "/make-payment/:customer_id/:loan_id",
  paymentController.makePayment
);

router.get(
  "/view-statement/:customer_id/:loan_id",
  paymentController.viewStatement
);

module.exports = router;
