// routes/dashboard.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const dashboardCtrl = require("../controllers/dashboardController");

router.get("/summary", auth, dashboardCtrl.getDashboardSummary);

module.exports = router;
