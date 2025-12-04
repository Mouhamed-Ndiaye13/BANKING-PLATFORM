const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

router.put("/update-profile", auth, settingsController.updateProfile);
router.put("/change-password", auth, settingsController.changePassword);
router.put("/update-avatar", auth, upload.single("avatar"), settingsController.updateAvatar);

module.exports = router;
