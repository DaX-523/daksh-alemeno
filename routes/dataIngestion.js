const router = require("express").Router();

const ingestController = require("../controllers/ingestData");

router.post("/ingest-data", ingestController.ingest);

module.exports = router;
